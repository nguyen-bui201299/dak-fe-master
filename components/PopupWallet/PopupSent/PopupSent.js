import API, { endpoints, headers } from "../../../API";
import { useEffect, useState } from "react";
import Styles from "./PopupSent.module.css";
import formatDate from "../../../modules/Time/formatDate";
import { getCookieUserLogin } from "../../../modules/Cookies/Auth/userLogin";


export default function PopupSent(user, index) {
  const [senderAvatar, setSenderAvatar] = useState("");
  const [senderName, setSenderName] = useState("");

  const [content, setContent] = useState({});

  // const userLogin = useSelector(state => state.infoUserLogin);

  const userLogin = getCookieUserLogin();


    useEffect(() => {
      if (userLogin.language !== undefined) {
          setContent(require(`./languages/${userLogin.language}.json`));
      } else {
          setContent(require(`./languages/en.json`));
      }
    }, [])

  useEffect(() => {
    API.get(endpoints["getDetailProfile"](user.user.user_id_receive), {
      headers: headers.headers_token,
    }).then((res) => {
      if (res.data.success) {
        console.log(res.data.data);
        setSenderAvatar(res.data.data.avatar);
        setSenderName(res.data.data.name);
      }
    });
  },[ user ]);

  return (
    <>
      <div className={Styles["sender"]}>
        <div className={Styles["avatar"]}>
          <img
            key={index}
            src={senderAvatar}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          ></img>
        </div>
        <div className={Styles["content"]}>
          <div className={Styles["sender-info"]}>
            <div className={Styles["sender-name"]}>
              <h3 className={Styles["sender-name"]}>{senderName}</h3>
            </div>
            <div className={Styles["send-date-status"]}>
              <div className={Styles["send-date"]}>
                {formatDate(user.user.created_at)}
              </div>
              <div className={Styles["send-status"]}>
                {user.user.status === "deny" || user.user.status === "request" 
                ?
                <>
                {user.user.status === "deny" ?
                  <span className={Styles["deny-status"]}>
                    {content.canceled}
                  </span>
                :
                <span className={Styles["request-status"]}>
                  {content.Request}
                </span>
                }
                </> 
                :
                <span className={Styles["accepted-status"]}>
                  {content.accepted}
                </span>}
              </div>
            </div>
          </div>
          <div className={Styles["send-content"]}>
            <div className={Styles["send-note"]}>{user.user.note}</div>
            <div className={Styles["send-point"]}>
              <span>{user.user.dak_point}</span> DAK points
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
