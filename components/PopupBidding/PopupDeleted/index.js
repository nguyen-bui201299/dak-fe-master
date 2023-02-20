import Styles from "./PopupDeleted.module.css";
import { useState, useRef, useEffect } from "react";
import { getCookieUserLogin } from "../../../modules/Cookies/Auth/userLogin";

export default function PopupDeleted({ closePopup }) {

  const userLogin = getCookieUserLogin()

  const [content, setContent] = useState({});

  useEffect(() => {
    if (userLogin.language !== undefined) {
      setContent(require(`../languages/${userLogin.language}.json`));
    } else {
      setContent(require(`../languages/en.json`));
    }
  }, [userLogin]);

  const [showSuccess, setShowSuccess] = useState(false);
  const deletedOverlay = useRef();

  const handlClose = (e) => {
    if (e.target === deletedOverlay.current) {
      closePopup(false);
    }
  };

  const handleShowSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      closePopup(false);
    }, 1000);
  };

  return (
    <div
      className={Styles["deleted-overlay"]}
      ref={deletedOverlay}
      onClick={(e) => handlClose(e)}
    >
      {!showSuccess ? (
        <div className={Styles["deleted-content"]}>
          <h2 className={Styles["deleted-title"]}>
            {content.popupDeleted_title}
          </h2>
          <div className={Styles["deleted-buttons"]}>
            <button
              className={`${Styles["button"]} ${Styles["active"]}`}
              onClick={() => handleShowSuccess(true)}
            >
              {content.popupDeleted_yes_btn}
            </button>
            <button
              className={`${Styles["button"]}`}
              onClick={() => closePopup(false)}
            >
              {content.popupDeleted_no_btn}
            </button>
          </div>
        </div>
      ) : (
        <div className={Styles["deleted-close"]}>
          <h2 className={Styles["deleted-title"]}>{content.popupDeleted_delete_success}</h2>
        </div>
      )}
    </div>
  );
}
