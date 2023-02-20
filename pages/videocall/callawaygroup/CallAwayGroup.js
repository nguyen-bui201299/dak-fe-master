import React, { useEffect, useMemo, useState } from 'react';
import Styled from '../../../styles/Callaway.module.css';

import {
    BsCameraVideo,
    BsCameraVideoOff,
    BsVolumeMute,
    BsVolumeUp,
    BsFillFileArrowUpFill,
} from 'react-icons/bs';
import { BiMicrophone, BiMicrophoneOff } from 'react-icons/bi';
import Router, { useRouter } from 'next/router';
import { MdCallEnd } from 'react-icons/md';
import Call from '../../../components/BoxChat/call';
import { mediaType } from '../../../components/BoxChat/call/RoomClient';
import { getCookieChatToken, getTokenUserLogin } from '../../../modules/Cookies/Auth/userLogin';

const CallAwayGroup = () => {
    const route = useRouter();
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isMicOn, setIsMicOn] = useState(false);
    const [volume, setVolume] = useState(false);
    const [isShareScreen, setIsShareScreen] = useState(false);
    const call = useMemo(() => {
        const { conversationId } = route.query;
        const userToken = getCookieChatToken();

        if ( !userToken ) {
            console.error('Need to login');
            // TODO: redirect to login
            return;
        }

        if (!conversationId ) return;
        if ( Call.isInACall ) {
            alert('Multiple call are not allow.');
            return;
        }

        return new Call(
            document.getElementById('localMedia'),
            document.getElementById('remoteVideos'),
            document.getElementById('remoteAudios'),
            userToken,
            conversationId
        );
    }, [route]);

    useEffect(() => {
        if (isShareScreen) {
            call && call.roomClient.produce(mediaType.screen, undefined, () => {setIsShareScreen(false)});
        } else {
            call && call.roomClient.closeProducer(mediaType.screen);
        }
    }, [call, isShareScreen]);

    useEffect(() => {
        if (isCameraOn) {
            call && call.roomClient.produce(mediaType.video, undefined, () => {setIsCameraOn(false)});
        } else {
            call && call.roomClient.closeProducer(mediaType.video);
        }
    }, [call, isCameraOn]);

    useEffect(() => {
        if (isMicOn) {
            call && call.roomClient.produce(mediaType.audio, undefined, () => {setIsMicOn(false)});
        } else {
            call && call.roomClient.closeProducer(mediaType.audio);
        }
    }, [call, isMicOn]);

    return (
        <>
            <div className={Styled['container']}>
                <div
                    className={Styled['btn-call-off']}
                    onClick={() => {
                        call && call.roomClient.exit();
                        Router.push('../videocall/callOff');
                        setTimeout(() => window.close(), 1500);
                    }}>
                    <MdCallEnd className={Styled['icon-call-off']} />
                </div>
                <div className={Styled['content']}>
                    {/* <div
                        className={Styled['body']}
                        // style={{
                        //   backgroundImage: `url(${userAvatar})`,
                        //   backgroundRepeat: "no-repeat",
                        //   backgroundSize: "cover",
                        //   backgroundPosition: "center",
                        //   filter: "blur(100px)",
                        // }}
                    >
                    </div> */}
                    <a>Me</a>
                    <div id="localMedia" className={Styled['call-containers']}>
                        {/* <video id="localVideo" autoplay inline className="vid"></video>
                        <video id="localScreen" autoplay inline className="vid"></video> */}
                    </div>
                    <a>Others</a>
                    <div id="remoteVideos" className={Styled['call-containers']}>
                    </div>
                    <div id="remoteAudios"></div>

                    {/*<div className={Styled['avatar-content']}>
                        <div className={Styled['avatar']}>
                            <img src={conversation.avatar} alt="avatar" className={Styled['img-avatar']} />
                        </div>
                        <div className={Styled['username']}>{conversation.name}</div>
                        {/* <div className={Styled['calling']}>Calling ...</div> */}
                    {/* </div> */}
                </div>
                <div className={Styled['footer']}>
                    <div className={Styled['icon-item']} onClick={() => setIsCameraOn((prev) => !prev)}>
                        {isCameraOn ? <BsCameraVideo className={Styled['icon-call']} /> : <BsCameraVideoOff className={Styled['icon-call']} />}
                    </div>
                    <div
                        className={Styled['icon-item']}
                        onClick={() => {setIsMicOn((prev) => !prev)}}>
                        {isMicOn ? <BiMicrophone className={Styled['icon-call']} /> : <BiMicrophoneOff className={Styled['icon-call']} />}
                    </div>
                    <div className={Styled['icon-item']} onClick={() => setVolume((prev) => !prev)}>
                        {volume ? <BsVolumeUp className={Styled['icon-call']} /> : <BsVolumeMute className={Styled['icon-call']} />}
                    </div>
                    <div className={Styled['icon-item']} onClick={() => setIsShareScreen((prev) => !prev)}>
                        <BsFillFileArrowUpFill className={Styled['icon-call']} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default CallAwayGroup;