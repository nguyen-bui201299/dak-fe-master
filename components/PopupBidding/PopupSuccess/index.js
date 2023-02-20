import { FaCheck } from "react-icons/fa";
import { useEffect, useState } from "react";
import Styles from "./PopupSeccess.module.css";
import { getCookieUserLogin } from "../../../modules/Cookies/Auth/userLogin";

export default function PopupSuccess({ closePopup }) {

  const userLogin = getCookieUserLogin()

  const [content, setContent] = useState({});

  useEffect(() => {
    if (userLogin.language !== undefined) {
      setContent(require(`../languages/${userLogin.language}.json`));
    } else {
      setContent(require(`../languages/en.json`));
    }
  }, [userLogin]);

  const toggle = () => {
    closePopup(false);
  };

  useEffect( () =>{
      const idTimeOut = setTimeout(() => {
        toggle();
      }, 2000)
      return ()=>{
        clearTimeout(idTimeOut)
      }
    },
    []
  );

  return (
    <div className={Styles["notification"]}>
      <h2 className={Styles["success-noti"]}>
        {content.popupSuccess_bidding} <span>{content.popupSuccess_success}</span> !!
      </h2>
      <div className={Styles["success-icon"]}>
        <FaCheck></FaCheck>
      </div>
    </div>
  );
}
