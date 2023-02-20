import Call from '.';
import Styled from '../../../styles/Callaway.module.css';

export const mediaType = {
    audio: 'audioType',
    video: 'videoType',
    screen: 'screenType',
};

class RoomClient {
    constructor(localMediaEl, remoteVideoEl, remoteAudioEl, socket, conversationId, successCallback) {
        this.localMediaEl = localMediaEl;
        this.remoteVideoEl = remoteVideoEl;
        this.remoteAudioEl = remoteAudioEl;

        this.socket = socket;
        this.producerTransport = null;
        this.consumerTransport = null;
        this.device = null;

        this.isVideoOnFullScreen = false;
        this.consumers = new Map(); // TODO: check usage
        this.producers = new Map(); // TODO: check usage
        this.metadata = {
            peers: [],
        }
        /**
         * map that contains a mediatype as key and producerId as value
        */
        this.producerLabel = new Map();

        this.isOpen = false;
        this.producerTypeCloseCallbackMap = new Map();
        this.joinCall(conversationId).then(async () => {
            this.initSockets();
            this.isOpen = true;
            successCallback();
        });
    }

    /**
     * to let server create a room if not exist and join room
     */
    async joinCall(conversationId) {
        try {
            const room = await this.socket.request('join', { conversationId });

            console.log('Joined to room', room);

            // load client device as the server capabilities
            const routerRtpCapabilities = await this.socket.request('getRouterRtpCapabilities');

            this.device = await this.loadDevice(routerRtpCapabilities);
            // Init transport from above device
            await this.initTransports(this.device);
            // to let server emit all current producers from another users to cur user
            this.metadata.peers = (await this.socket.request('getMetadata')).peers || [];
            this.socket.emit('getProducers');
        } catch (error) {
            // TODO: process when call 1 vs 1 but user is not available
            console.error('Join to room error:', error);
        }
    }

    async loadDevice(routerRtpCapabilities) {
        let device;
        try {
            device = new window.mediasoupClient.Device();
            // device = new mediasoupClient.Device();
            await device.load({ routerRtpCapabilities });
            return device;
        } catch (error) {
            if (error.name === 'UnsupportedError') alert('Browser not supported');
            console.error(error);
        }
    }

    async initTransports(device) {
        try {
            // init producerTransport: Creates a new WebRTC transport to send media
            {
                // let serve create transport first
                const data = await this.socket.request('createWebRtcTransport', {
                    forceTcp: false,
                    rtpCapabilities: device.rtpCapabilities,
                });

                // client transport
                this.producerTransport = device.createSendTransport(data);
                this.producerTransport.on('connect', async ({ dtlsParameters }, cb, errorCb) => {
                    // Emitted when the transport is about to establish the ICE+DTLS connection
                    // and needs to exchange information with the associated server side transport.
                    try {
                        this.socket.request('connectTransport', { dtlsParameters, transport_id: data.id })
                        .then(cb)
                        .catch(errorCb);
                    } catch (error) {
                        console.error(error);
                        errorCb(error);
                    }
                });

                this.producerTransport.on('produce', async ({ kind, rtpParameters }, cb, errorCb) => {
                    // Emitted when the transport needs to transmit information about a new producer
                    // to the associated server side transporterr
                    // This event occurs before the produce() method completes.
                    try {
                        const { producerId } = await this.socket.request(
                            'produce',
                            {
                                producerTransportId: this.producerTransport.id,
                                kind,
                                rtpParameters,
                            }
                        );
                        cb({ id: producerId });
                    } catch (error) {
                        errorCb(error);
                    }
                });

                this.producerTransport.on( 'connectionstatechange', state => {
                    switch (state) {
                    case 'connecting':
                        break

                    case 'connected':
                        //localVideo.srcObject = stream
                        break

                    case 'failed':
                        this.producerTransport.close()
                        break

                    default:
                        break
                    }
                })
            }

            // init consumerTransport: Creates a new WebRTC transport to receive media
            {
                // let serve create transport first
                const data = await this.socket.request('createWebRtcTransport', { forceTcp: false });

                // client transport
                this.consumerTransport = device.createRecvTransport(data);
                this.consumerTransport.on('connect', async ({ dtlsParameters }, cb, errorCb) => {
                    try {
                        this.socket.request('connectTransport', { transport_id: this.consumerTransport.id, dtlsParameters })
                        .then(cb)
                        .catch(errorCb)
                    } catch (error) {
                        errorCb(error);
                    }
                });

                this.consumerTransport.on( 'connectionstatechange', async (state) => {
                    switch (state) {
                    case 'connecting':
                        break

                    case 'connected':
                        break

                    case 'failed':
                        this.consumerTransport.close()
                        break

                    default:
                        break
                    }
                });
            }
        } catch (error) {
            console.error(error);
            return;
        }
    }

    initSockets() {
        /**
         * data: [ {
         *  producerId:
         *  socketId:
         * }]
         */
        // When has some new producers from another users
        this.socket.on('newProducers', async (data) => {
            console.log( 'new producers: ', data );
            for (let { producerId } of data) {
                await this.consume(producerId);
            }
        });

        this.socket.on('newMemberJoin', ({ name, userId, socketId }) => {
            this.metadata.peers.push({ name, userId, socketId });
        });

        // when a produce from another users is closed
        this.socket.on('consumerClosed', ({ consumerId }) => {
            this.removeConsumer(consumerId);
        });

        this.socket.on('disconnect', () => {
            this.exit(true);
        });
    }

    //////// MAIN FUNCTIONS /////////////

    /**
     * produce data from current user device and transport it to server
     * @param {*} type
     * @param {*} deviceId
     * @returns
     */
    async produce(type, deviceId = null, onCloseCallback) {
        if ( onCloseCallback ) this.registerProducerTypeCloseCallback(type, onCloseCallback);
        let mediaConstraints = {};
        let audio = false;
        let screen = false;
        switch (type) {
            case mediaType.audio:
                mediaConstraints = {
                    audio: {
                        deviceId: deviceId,
                    },
                    video: false,
                };
                audio = true;
                break;
            case mediaType.video:
                mediaConstraints = {
                    audio: false,
                    video: {
                        width: {
                            min: 640,
                            ideal: 1920,
                        },
                        height: {
                            min: 400,
                            ideal: 1080,
                        },
                        deviceId: deviceId,
                        /*aspectRatio: {
                              ideal: 1.7777777778
                          }*/
                    },
                };
                break;
            case mediaType.screen:
                mediaConstraints = false;
                screen = true;
                break;
            default:
                return;
        }
        // if (!this.device) {
        //     console.error('Device not found');
        //     return;
        // }
        if (!audio && !this.device.canProduce('video')) {
            console.error('Cannot produce video');
            return;
        }
        if (this.producerLabel.has(type)) {
            console.log('Producer already exists for this type ' + type);
            return;
        }

        let stream;

        try {
            stream = screen
                ? await navigator.mediaDevices.getDisplayMedia()
                : await navigator.mediaDevices.getUserMedia(mediaConstraints);

            const track = audio ? stream.getAudioTracks()[0] : stream.getVideoTracks()[0];
            const params = { track };

            if (!audio && !screen) {
                params.encodings = [
                    {
                        rid: 'r0',
                        maxBitrate: 100000,
                        //scaleResolutionDownBy: 10.0,
                        scalabilityMode: 'S1T3',
                    },
                    {
                        rid: 'r1',
                        maxBitrate: 300000,
                        scalabilityMode: 'S1T3',
                    },
                    {
                        rid: 'r2',
                        maxBitrate: 900000,
                        scalabilityMode: 'S1T3',
                    },
                ];
                params.codecOptions = {
                    videoGoogleStartBitrate: 1000,
                };
            }
            const producer = await this.producerTransport.produce(params);

            this.producers.set(producer.id, producer);

            let elem;

            if (!audio) {
                elem = document.createElement('video');
                elem.srcObject = stream;
                elem.id = producer.id;
                elem.playsinline = false;
                elem.autoplay = true;
                elem.className = Styled['call-vid'];
                this.localMediaEl.appendChild(elem);
            }

            producer.on('trackended', () => {
                this.closeProducer(type);
            });

            producer.on('transportclose', () => {
                console.log('Producer transport close');
                if (!audio) {
                    elem.srcObject.getTracks().forEach(function (track) {
                        track.stop();
                    });
                    elem.parentNode.removeChild(elem);
                }
                this.producers.delete(producer.id);
            });

            producer.on('close', () => {
                if (!audio) {
                    elem.srcObject.getTracks().forEach(function (track) {
                        track.stop();
                    });
                    elem.parentNode.removeChild(elem);
                }
                this.producers.delete(producer.id);
            });

            this.producerLabel.set(type, producer.id);
        } catch (err) {
            this.onProducerTypeClose(type);
            console.log('Produce error:', err);
        }
    }

    /**
     * add a consumer to consume when having a new user(producer)
     * @param {*} producerId
     */
    async consume(producerId) {
        this.getConsumeStream(producerId).then(({ consumer, stream, kind }) => {
            this.consumers.set(consumer.id, consumer);

            let elem;

            if (kind === 'video') {
                elem = document.createElement('video');
                elem.srcObject = stream;
                elem.id = consumer.id;
                elem.playsinline = false;
                elem.autoplay = true;
                elem.muted = true;
                elem.className = Styled['call-vid'];
                this.remoteVideoEl.appendChild(elem);
                this.handleFullscreen(elem.id);
            } else {
                elem = document.createElement('audio');
                elem.srcObject = stream;
                elem.id = consumer.id;
                elem.playsinline = false;
                elem.autoplay = true;
                this.remoteAudioEl.appendChild(elem);
            }

            consumer.on('trackended', () => {
                this.removeConsumer(consumer.id);
            });

            consumer.on('transportclose', () => {
                this.removeConsumer(consumer.id);
            });
        });
    }

    /**
     * support for consume
     * @param {*} producerId
     * @returns
     */
    async getConsumeStream(producerId) {
        const { rtpCapabilities } = this.device;
        const data = await this.socket.request('consume', {
            rtpCapabilities,
            consumerTransportId: this.consumerTransport.id, // might be
            producerId,
        });
        const { id, kind, rtpParameters } = data;
        const codecOptions = {};
        const consumer = await this.consumerTransport.consume({
            id,
            producerId,
            kind,
            rtpParameters,
            codecOptions,
        });
        const stream = new MediaStream();

        stream.addTrack(consumer.track);

        return {
            consumer,
            stream,
            kind,
        };
    }

    closeProducer(type) {
        if (!this.producerLabel.has(type)) return;

        let producerId = this.producerLabel.get(type);

        this.socket.emit('producerClosed', {producerId});
        console.log('Close producer', producerId);

        this.producers.get(producerId).close();
        this.producers.delete(producerId);
        this.producerLabel.delete(type);

        if (type !== mediaType.audio) {
            let elem = document.getElementById(producerId);

            elem.srcObject.getTracks().forEach( track => {track.stop()});
            elem.parentNode.removeChild(elem);
        }

        this.onProducerTypeClose(type);
    }

    pauseProducer(type) {
        if (!this.producerLabel.has(type)) {
            console.log('There is no producer for this type ' + type);
            return;
        }

        let producerId = this.producerLabel.get(type);

        this.producers.get(producerId).pause();
    }

    resumeProducer(type) {
        if (!this.producerLabel.has(type)) {
            console.log('There is no producer for this type ' + type);
            return;
        }

        let producerId = this.producerLabel.get(type);

        this.producers.get(producerId).resume();
    }

    removeConsumer(consumerId) {
        let elem = document.getElementById(consumerId);

        elem.srcObject.getTracks().forEach(track => {track.stop()});
        elem.parentNode.removeChild(elem);
        this.consumers.delete(consumerId);
    }

    exit(offline = false) {
        let clean = () => {
            this.isOpen = false;
            this.consumerTransport && this.consumerTransport.close();
            this.producerTransport && this.producerTransport.close();
            this.socket.removeAllListeners();
            this.socket.off('disconnect');
            this.socket.off('newProducers');
            this.socket.off('consumerClosed');
            Call.isInACall = false;
        };

        if (!offline) {
            this.socket
                .request('exitRoom')
                .then((e) => console.log(e))
                .catch((e) => console.warn(e))
                .finally(() => {
                    clean();
                });
        } else {
            clean();
        }
    }

    handleFullscreen(id) {
        let videoPlayer = document.getElementById(id)
        videoPlayer.addEventListener('fullscreenchange', (e) => {
          if (videoPlayer.controls) return
          let fullscreenElement = document.fullscreenElement
          if (!fullscreenElement) {
            videoPlayer.style.pointerEvents = 'auto'
            this.isVideoOnFullScreen = false
          }
        })
        videoPlayer.addEventListener('webkitfullscreenchange', (e) => {
          if (videoPlayer.controls) return
          let webkitIsFullScreen = document.webkitIsFullScreen
          if (!webkitIsFullScreen) {
            videoPlayer.style.pointerEvents = 'auto'
            this.isVideoOnFullScreen = false
          }
        })
        videoPlayer.addEventListener('click', (e) => {
          if (videoPlayer.controls) return
          if (!this.isVideoOnFullScreen) {
            if (videoPlayer.requestFullscreen) {
              videoPlayer.requestFullscreen()
            } else if (videoPlayer.webkitRequestFullscreen) {
              videoPlayer.webkitRequestFullscreen()
            } else if (videoPlayer.msRequestFullscreen) {
              videoPlayer.msRequestFullscreen()
            }
            this.isVideoOnFullScreen = true
            videoPlayer.style.pointerEvents = 'none'
          } else {
            if (document.exitFullscreen) {
              document.exitFullscreen()
            } else if (document.webkitCancelFullScreen) {
              document.webkitCancelFullScreen()
            } else if (document.msExitFullscreen) {
              document.msExitFullscreen()
            }
            this.isVideoOnFullScreen = false
            videoPlayer.style.pointerEvents = 'auto'
          }
        })
    }

    onProducerTypeClose(type) {
        const callbacks = this.producerTypeCloseCallbackMap.get(type) || [];

        callbacks.forEach(cb => cb());
    }

    registerProducerTypeCloseCallback(type, callback) {
        let callbacks = this.producerTypeCloseCallbackMap.get(type);

        if ( !callbacks ) {
            callbacks = [callback];
            this.producerTypeCloseCallbackMap.set(type, callbacks);
        } else {
            callbacks.push(callback);
        }
    }
}

export default RoomClient;