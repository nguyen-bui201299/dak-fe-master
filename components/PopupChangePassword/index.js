import Styles from "../../components/PopupLogin/PopupForgetPassword/PopupForgetPassword.module.css";
import { FaRegTimesCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import API, { endpoints, headers } from "../../API";
import {
  SuccessNotification,
  ErrorNotification,
  WarnNotification,
  NotificationToast
} from "../../modules/Notification/Notification";
import {
  getRememberMeCookie,
  setRememberMeCookie,
  deleteRememberMeCookie
} from "../../modules/Cookies/Auth/account";
import { getCookieUserLogin } from "../../modules/Cookies/Auth/userLogin";
import { getLoginPublicKey } from "../../utils/getLoginPublicKey.ulti";
import { hashLoginPublicKey } from "../../utils/hashLoginPublicKey.util";
const bcrypt = require('bcryptjs')

export default function PopupChangePassword({ handleShowChangePass }) {
  const [showPopup, setShowPopup] = useState(true);
  const [inputOldPass, setInputOldPass] = useState(null);
  const [inputNewPass, setInputNewPass] = useState(null);
  const [inputRenewPass, setInputRenewPass] = useState(null);
  const [hashOldPass, setHashOldPass] = useState("");
  const [hashNewPass, setHashNewPass] = useState("");
  const popupForget = useRef();
  const [seePass, setSeePass] = useState([]);

  const userLogin = getCookieUserLogin();

  const [content, setContent] = useState({});

  const closePopupChangePass = (e) => {
    if (popupForget.current === e.target) {
      handleShowChangePass();
    }
  };

  useEffect(() => {
    if (userLogin.language !== undefined) {
      setContent(
        require(`../../languages/popupChangePassword/${userLogin.language}.json`)
      );
    } else {
      setContent(require(`../../languages/popupChangePassword/en.json`));
    }
  }, [userLogin]);

  const regexCheckPass =
    /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z](?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[0-9a-zA-Z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

  // Get Public Key

  // Hash Public Key
  const getOldPass = (e) => {
    const teampPass = e.target.value.trim();
    setInputOldPass(teampPass);
  };

  const getNewPass = (e) => {
    const teampPass = e.target.value;
    setInputNewPass(teampPass);
  };

  const getRenewPass = (e) => {
    const teampPass = e.target.value;
    setInputRenewPass(teampPass);
  };

  const handleEventSeePass = (index) => {
    if (seePass.includes(index)) {
      setSeePass(
        seePass.filter(function (value) {
          return value != index;
        })
      );
    } else {
      setSeePass([...seePass, index]);
    }
  };

  const changePassInCookie = () => {
    if (inputOldPass == getRememberMeCookie().password) {
      const objChangePass = {
        email: getRememberMeCookie().email,
        password: inputNewPass
      };
      deleteRememberMeCookie();
      setRememberMeCookie(objChangePass);
    }
  };

  const handleChangePass = async () => {
    const publicKey = await getLoginPublicKey(getCookieUserLogin().username);
    const bcryptPass = bcrypt.hashSync(inputNewPass, 10)

    const dataHash = JSON.stringify({
      old_password: inputOldPass,
      new_password: bcryptPass
    });
    const hashNewPass = await hashLoginPublicKey(dataHash, publicKey);

    const data = {
      data: hashNewPass
    }
    if (inputOldPass !== "" && inputNewPass !== "" && inputRenewPass !== "") {
      if (inputNewPass === inputRenewPass) {
        if (inputNewPass?.length >= 8) {
          if (regexCheckPass.test(inputNewPass)) {
            API.post(endpoints["alterPassword"], data, {
              headers: headers.headers_token
            })
              .then((res) => {
                if (res.data.success) {
                  changePassInCookie();
                  NotificationToast.fire({
                    toast: true,
                    position: "top-end",
                    icon: "success",
                    title: content.changePassword_success
                  });
                } else {
                  NotificationToast.fire({
                    toast: true,
                    position: "top-end",
                    icon: "error",
                    title: content.changePassword_error
                  });
                }
              })
              .catch((err) => {
                console.log(err);
              });
            setShowPopup(false);
          } else {
            NotificationToast.fire({
              toast: true,
              position: "top-end",
              icon: "warning",
              title: content.changePassword_requirement
            });
          }
        } else
          NotificationToast.fire({
            toast: true,
            position: "top-end",
            icon: "warning",
            title: content.changePassword_number_requirement
          });
      } else {
        NotificationToast.fire({
          toast: true,
          position: "top-end",
          icon: "warning",
          title: content.changePassword_reconfirm_error
        });
      }
    } else {
      NotificationToast.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: content.changePassword_not_allow_null
      });
    }
  };

  return (
    <>
      {/* <ToastContainer /> */}
      {showPopup === true && (
        <div
          className={Styles["overlayPopupForget"]}
          ref={popupForget}
          onClick={closePopupChangePass}
        >
          <div className={Styles["forget"]}>
            <div className={Styles["forget__heading"]}>
              <h3 className={Styles["forget__title"]}>
                {content.changePassword}
              </h3>
              <FaRegTimesCircle
                className={Styles["forget__icon-close"]}
                onClick={handleShowChangePass}
              />
            </div>
            <div className={`${Styles["forget__body"]} ${Styles["animation"]}`}>
              <div
                className={`${Styles["forget__body-form"]} ${Styles["pass"]}`}
              >
                <div className={Styles["form__control-box"]}>
                  <input
                    // ref={inputOldPass}
                    type={seePass.includes(1) ? "text" : "password"}
                    className={`${Styles["form__control-input"]} form__input-new-pwd`}
                    placeholder={content.oldPassword}
                    onChange={(e) => getOldPass(e)}
                    required
                  />
                  <div
                    onClick={() => {
                      handleEventSeePass(1);
                    }}
                  >
                    {seePass.includes(1) ? (
                      <FaEyeSlash
                        className={Styles["form__control-icon-eye"]}
                      />
                    ) : (
                      <FaEye className={Styles["form__control-icon-eye"]} />
                    )}
                  </div>
                  {/* <FaEye className={Styles["form__control-icon-eye"]} /> */}
                </div>
                <div className={Styles["form__control-box"]}>
                  <input
                    // ref={inputNewPass}
                    type={seePass.includes(2) ? "text" : "password"}
                    className={`${Styles["form__control-input"]} form__input-new-pwd`}
                    placeholder={content.newPassword}
                    onChange={(e) => getNewPass(e)}
                    required
                  />
                  <div
                    onClick={() => {
                      handleEventSeePass(2);
                    }}
                  >
                    {seePass.includes(2) ? (
                      <FaEyeSlash
                        className={Styles["form__control-icon-eye"]}
                      />
                    ) : (
                      <FaEye className={Styles["form__control-icon-eye"]} />
                    )}
                  </div>
                  {/* <FaEye className={Styles["form__control-icon-eye"]} /> */}
                </div>
                <div className={Styles["form__control-box"]}>
                  <input
                    // ref={inputRenewPass}
                    type={seePass.includes(3) ? "text" : "password"}
                    className={`${Styles["form__control-input"]} form__input-new-pwd`}
                    placeholder={content.verifyPassword}
                    onChange={(e) => getRenewPass(e)}
                    required
                  />
                  <div
                    onClick={() => {
                      handleEventSeePass(3);
                    }}
                  >
                    {seePass.includes(3) ? (
                      <FaEyeSlash
                        className={Styles["form__control-icon-eye"]}
                      />
                    ) : (
                      <FaEye className={Styles["form__control-icon-eye"]} />
                    )}
                  </div>
                  {/* <FaEye className={Styles["form__control-icon-eye"]} /> */}
                </div>
              </div>
              <button
                className={Styles["btn-submit"]}
                onClick={() => {
                  handleChangePass();
                }}
              >
                {content.changePassword}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
