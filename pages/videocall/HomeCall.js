import React, { useEffect, useState } from "react";
import Styled from "../../styles/Videocall.module.css";

import {
  BsCameraVideo,
  BsCameraVideoOff,
  BsVolumeMute,
  BsVolumeUp,
} from "react-icons/bs";
import { BiMicrophone, BiMicrophoneOff } from "react-icons/bi";
import Router, { useRouter } from "next/router";
import { MdCallEnd, MdOutlineZoomOutMap } from "react-icons/md";
import API, { endpoints, headers } from "../../API";
import { getCookieUserLogin, getTokenUserLogin } from "../../modules/Cookies/Auth/userLogin";
import { useRef } from "react";
import { useBoxChatContext } from "../../components/BoxChat/BoxChatContext";

const HomeCall = () => {
  const route = useRouter();

  const [userAvatar, setUserAvatar] = useState();
  const [userName, setUserName] = useState();

  const [camera, setCamera] = useState(route.query.camera);
  const [mic, setMic] = useState(true);
  const [volume, setVolume] = useState(true);

  const demoVideo = useRef();

  useEffect(() => {
    API.get(endpoints.getDetailProfile(route.query.id), {
      headers: headers.headers_token,
    })

      .then(function (response) {
        setUserName(response.data.data.name);
        setUserAvatar(response.data.data.avatar);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  let userLogin = getCookieUserLogin();

  const {userVideo,myVideo,getMedia} = useBoxChatContext()

  useEffect(() => {
    getMedia();

  }, []);

  return (
    <>
      <div className={Styled["container"]}>
        <div className={Styled["content"]}>
          <div
            className={Styled["body"]}
            style={{
              backgroundImage: `url(${userAvatar})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(100px)",
            }}
          ></div>
          <div className={Styled["user-video-content"]}>
            <div className={Styled["user-video"]}>
              <video playsInline ref={userVideo} autoPlay/>
            </div>
            <div className={Styled["username"]}>{userName}</div>
            <div className={Styled["calling"]}>00:00</div>
          </div>
        </div>

        <div className={Styled["my-video-content"]}>
          <div className={Styled["my-video"]}>
            <video playsInline ref={myVideo} autoPlay />
          </div>
          <div className={Styled["your-setting"]}>
            <div className={Styled["icon-item"]}
              style={{ background: "transparent" }}
            >
              <MdOutlineZoomOutMap className={Styled["icon-call"]} />
            </div>
          </div>
        </div>

        <div className={Styled["footer"]}>
          <div
            className={Styled["icon-item"]}
            onClick={() => setCamera((prev) => !prev)}
          >
            {camera ? (
              <BsCameraVideo className={Styled["icon-call"]} />
            ) : (
              <BsCameraVideoOff className={Styled["icon-call"]} />
            )}
          </div>
          <div
            className={Styled["icon-item"]}
            onClick={() => setMic((prev) => !prev)}
          >
            {mic ? (
              <BiMicrophone className={Styled["icon-call"]} />
            ) : (
              <BiMicrophoneOff className={Styled["icon-call"]} />
            )}
          </div>
          <div
            className={Styled["icon-item"]}
            onClick={() => setVolume((prev) => !prev)}
          >
            {volume ? (
              <BsVolumeUp className={Styled["icon-call"]} />
            ) : (
              <BsVolumeMute className={Styled["icon-call"]} />
            )}
          </div>
          <div
            className={Styled["icon-item"]}
            onClick={() => {
              Router.push("../videocall/callOff")
              setTimeout(() => window.close(), 1500)
            }}
            style={{ background: "red" }}
          >
            <MdCallEnd className={Styled["icon-call"]} />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeCall;
