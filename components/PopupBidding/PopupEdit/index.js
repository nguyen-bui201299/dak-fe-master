import Styles from "./PopupEdit.module.css";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

import { FaRegTimesCircle } from "react-icons/fa";
import Avatar from "../../../public/images/avatar.jpg";
import Bigthumb from "../../../public/images/bidding-big-thumb.png";
import { getCookieUserLogin } from "../../../modules/Cookies/Auth/userLogin";

export default function PopupEdit({ closeEdit }) {
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
  const editOverlay = useRef();

  const handleClose = (e) => {
    if (e.target === editOverlay.current) closeEdit(false);
  };

  const handleRemoveOverlay = () => {
    setShowSuccess(true);
    setTimeout(() => {
      closeEdit(false);
    }, 500);
  };

  return (
    <div
      className={Styles["edit__overlay"]}
      ref={editOverlay}
      onClick={(e) => handleClose(e)}
    >
      {!showSuccess ? (
        <div className={Styles["edit__content"]}>
          <div className={Styles["content__heading"]}>
            <h3 className={Styles["title"]}>{content.popupEdit_title}</h3>

            <FaRegTimesCircle
              className={Styles["close-icon"]}
              onClick={() => closeEdit(false)}
            />
          </div>

          <div className={Styles["content__body"]}>
            <div className={Styles["content__form"]}>
              <p className={Styles["form-label"]}>{content.popupEdit_bidding_fee}</p>
              <div className={Styles["popup-input"]}>
                <input
                  className={Styles["form-input"]}
                  type="number"
                  placeholder={content.popupEdit_input_fee}
                  // onChange={(e) => setCostBidding(e.target.value)}
                />
                <span className={Styles["form-unit"]}>DAK Point</span>
              </div>
            </div>
            <div className={Styles["content__form"]}>
              <p className={Styles["form-label"]}>{content.popupEdit_view_fee}</p>
              <div className={Styles["popup-input"]}>
                <input
                  className={Styles["form-input"]}
                  type="number"
                  placeholder={content.popupEdit_input_fee}
                  // onChange={(e) => setCostPerView(e.target.value)}
                />
                <span className={Styles["form-unit"]}>DAK Point</span>
              </div>
            </div>
            <div className={Styles["content__prior"]}>
              <span>{content.popupEdit_priority}</span>
              <ul className={Styles["prior-list"]}>
                <li>1</li>
                <li className={Styles["active"]}>2</li>
                <li>3</li>
                <li>4</li>
              </ul>
            </div>
            <div className={Styles["content__post"]}>
              <div className={Styles["post-info"]}>
                <div className={Styles["post-author"]}>
                  <div className={Styles["author-avatar"]}>
                    <Image src={Avatar} alt="Avatar"></Image>
                  </div>
                  <div className={"editBidding-author"}>
                    <h3 className={Styles["author-name"]}>Khoa Lê</h3>
                    <p className={Styles["res-time"]}>3 ngày trước</p>
                  </div>
                </div>

                <div className={Styles["post-meta"]}>
                  <p className={Styles["meta-description"]}>
                    Hôm nay tôi thật buồn....
                  </p>
                </div>
              </div>
              <div className={Styles["post-big-thumb"]}>
                <Image src={Bigthumb} alt="Status"></Image>
              </div>
            </div>
            <div className={Styles["content__button"]}>
              <button
                className={Styles["button-confirm"]}
                onClick={() => handleRemoveOverlay()}
              >
                {content.popupEdit_save_btn}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={Styles["edit-close"]}>
          <h2 className={Styles["edit-title"]}>
            {content.popupEdit_save_btn} <span className={Styles["highlight"]}>{content.popupEdit_success}</span> !!
          </h2>
        </div>
      )}
    </div>
  );
}
