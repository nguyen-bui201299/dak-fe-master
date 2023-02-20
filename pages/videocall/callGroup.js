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

const CallGroup = () => {
  const route = useRouter();
  console.log(route.query);

  const [name, setName] = useState([]);

  const [camera, setCamera] = useState(route.query.camera);
  const [mic, setMic] = useState(true);
  const [volume, setVolume] = useState(true);

  useEffect(() => {
    var axios = require("axios");

    var config = {
      method: "get",
      url: `http://chat.dakshow.com/api/conversation/${route.query.id}`,
      headers: headers.headers_token,
    };

    axios(config)
      .then(function (response) {
        response.data.data.conversation.member.map((userid) => {
          API.get(endpoints.getDetailProfile(userid), {
            headers: headers.headers_token,
          })
            .then(function (res) {
              setName((prev) => [...prev, res.data.data]);
            })
            .catch(function (error) {
              console.log(error);
            });
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <div className={Styled["container"]}>
      <div className={Styled["content"]}>
        <ul className={Styled["list-member"]}>
          {name.map((item, index) => {
            return (
              <li key={index} className={Styled["member"]}>
                <div className={Styled["name-member"]}>
                  <span>{item.name}</span>
                </div>
                <div
                  className={Styled["avatar-member-content"]}
                  style={{ backgroundImage: `url(${item.avatar})` }}
                ></div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={Styled["your-camera"]}>
        <div className={Styled["your-camera-body"]}></div>
        <div className={Styled["your-face"]}></div>
        <div className={Styled["your-setting"]}>
          <div
            className={Styled["icon-item"]}
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
  );
};

export default CallGroup;
