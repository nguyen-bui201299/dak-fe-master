import React, { useEffect, useState } from "react";
import Styled from "../../../styles/Callaway.module.css";

import Router, { useRouter } from "next/router";
import { MdCallEnd } from "react-icons/md";
import API, { endpoints, headers } from "../../../API";
import { IoMdCall } from "react-icons/io";
import { useContext } from "react";
import { useBoxChatContext } from "../../../components/BoxChat/BoxChatContext";
import { getCookieUserLogin, getTokenUserLogin } from "../../../modules/Cookies/Auth/userLogin";
import io from "socket.io-client";
// const socket= io.connect(
//   "https://dakchat.site", {
//   // path: "/socket",
//   transports: ["websocket"],
//   auth: {
//       token: getTokenUserLogin(),
// }})

const Incomingcall = () => {
  const route = useRouter();

  const [userAvatar, setUserAvatar] = useState();
  const [userName, setUserName] = useState();

  const [camera, setCamera] = useState(route.query.camera);
  const [mic, setMic] = useState(true);
  const [volume, setVolume] = useState(true);


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



  const {answerCall} = useBoxChatContext();
  const handleAcceptCall = () =>{
    answerCall(getCookieUserLogin());
    // Router.push(`../videocall?id=${route.query.id}`)

  }
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
          <div className={Styled["avatar-content"]}>
            <div className={Styled["avatar"]}>
              <img
                src={userAvatar}
                alt="who"
                className={Styled["img-avatar"]}
              />
            </div>
            <div className={Styled["username"]}>{userName}</div>
            <div className={Styled["calling"]}>{userName} đang gọi cho bạn</div>
          </div>
        </div>
        <div className={Styled["footer"]}>
          <div
            className={Styled["icon-item"]}
            style={{ background: "green" }}
            onClick={() => handleAcceptCall()}
          >
            <IoMdCall className={Styled["icon-call"]} />
          </div>
          <div
            className={Styled["icon-item"]}
            style={{ background: "red" }}
            onClick={() => {
              Router.push("../videocall/callOff")
              setTimeout(() => window.close(), 1500)
            }}
          >
            <MdCallEnd className={Styled["icon-call"]} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Incomingcall;