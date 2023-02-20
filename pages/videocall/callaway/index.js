import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import API, { endpoints, headers } from "../../../API";
import Styled from "../../../styles/Callaway.module.css";

import {
  BsCameraVideo,
  BsCameraVideoOff,
  BsVolumeMute,
  BsVolumeUp,
} from "react-icons/bs";
import { BiMicrophone, BiMicrophoneOff } from "react-icons/bi";
import { MdCallEnd } from "react-icons/md";

const CallAway = () => {
  // Lấy dữ liệu từ đường dẫn
  let route = useRouter();


  const [userAvatar, setUserAvatar] = useState();
  const [userName, setUserName] = useState();

  const [camera, setCamera] = useState(false);
  const [mic, setMic] = useState(true);
  const [volume, setVolume] = useState(true);

  // Nếu như camera khác undefined thì setCamera
  useEffect(() => {
    if (route.query.camera != "undefined") {
      setCamera(route.query.camera == "true" ? true : false);
    }
  }, [route.query.camera]);

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


  return (
    <>
      <div className={Styled["container"]}>
        <div
          className={Styled["btn-call-off"]}
          onClick={() => {
            Router.push("../videocall/callOff")
            setTimeout(() => window.close(), 1500)
          }}
        >
          <MdCallEnd className={Styled["icon-call-off"]} />
        </div>
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
          <div className={Styled["avatar-content"]}>
            <div className={Styled["avatar"]}>
              <img
                src={userAvatar}
                alt="who"
                className={Styled["img-avatar"]}
              />
            </div>
            <div className={Styled["username"]}>{userName}</div>
            <div className={Styled["calling"]}>Calling ...</div>
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
        </div>
      </div>
    </>
  );
};

export default CallAway;
