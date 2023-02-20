import io from 'socket.io-client';
import RoomClient from './RoomClient';

function getSocket(userToken) {
    const socket = io(`${process.env.NEXT_PUBLIC_CHAT_SERVER_URL}`, {
        transports: ['websocket'],
        auth: {
            token: userToken,
        },
        autoConnect: true,
    });

    socket.request = function request(type, data = {}) {
      return new Promise((resolve, reject) => {
        socket.emit(type, data, (data) => {
          if (data && data.error) {
            reject(data.error)
          } else {
            resolve(data)
          }
        })
      })
    }

    return socket;
}

let isEnumerateDevices = false;

class Call {
    static isInACall = false;

    // Require at least one of conversationId, directUserId
    constructor(localMedia, remoteVideos, remoteAudios, userToken, conversationId) {
        if (Call.isInACall) throw new Error('Multiple call are not allow.');

        this.localMedia = localMedia;
        this.remoteVideos = remoteVideos;
        this.remoteAudios = remoteAudios;
        this.userToken = userToken;

        this.joinRoom(conversationId);
        Call.isInACall = true;
    }

    joinRoom(conversationId) {
        initEnumerateDevices();

        this.roomClient = new RoomClient(
            this.localMedia,
            this.remoteVideos,
            this.remoteAudios,
            getSocket(this.userToken),
            conversationId,
            this.roomOpen,
        );
    }

    roomOpen() {
        //
    }
}

function initEnumerateDevices() {
    // Many browsers, without the consent of getUserMedia, cannot enumerate the devices.
    if (isEnumerateDevices) return;

    const constraints = {
        audio: true,
        video: true,
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            // enumerateDevices();
            stream.getTracks().forEach(function (track) {
                track.stop();
            });
        })
        .catch((err) => {
            console.error('Access denied for audio/video: ', err);
        });
}

function enumerateDevices() {
    // Load mediaDevice options
    navigator.mediaDevices.enumerateDevices().then((devices) =>
        devices.forEach((device) => {
            let el = null;
            if ('audioinput' === device.kind) {
                el = audioSelect;
            } else if ('videoinput' === device.kind) {
                el = videoSelect;
            }
            if (!el) return;

            let option = document.createElement('option');
            option.value = device.deviceId;
            option.innerText = device.label;
            el.appendChild(option);
            isEnumerateDevices = true;
        })
    );
}

export default Call;