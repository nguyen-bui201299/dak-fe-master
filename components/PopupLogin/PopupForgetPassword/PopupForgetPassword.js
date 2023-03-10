import Styles from "./PopupForgetPassword.module.css";
import { FaRegTimesCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { useRef, useState, useEffect } from "react";
import { sendEmail } from "../../../modules/send-email";
import API, { endpoints, headers } from "../../../API";
import { ToastContainer } from "react-toastify";
import { SuccessNotification, ErrorNotification, WarnNotification, NotificationToast } from "../../../modules/Notification/Notification";


export default function PopupForgetPassword({ handleClick }) {
    const inputEmail = useRef();
    const [email, setEmail] = useState("");



    const handleGetInputEmail = (e) => {
        const teampEmail = e.target.value.trim()
        setEmail(teampEmail);
    }

    const handleGetVerifi = () => {
        if (email !== "") {
            API.post(endpoints["verifiForgetPassword"], { email }, { headers: headers.headers })
                .then((res) => {
                    console.log(res);
                    if(res.data.success){
                        NotificationToast.fire({
                            toast: true,
                            position: 'top-end',
                            icon: 'success',
                            title: 'Re Password In Your Mail!!!',
                          })
                    }
                    else{
                        NotificationToast.fire({
                            toast: true,
                            position: 'top-end',
                            icon: 'error',
                            title: 'Mail InCorrect!!!',
                          })
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        }else{
            NotificationToast.fire({
                toast: true,
                position: 'top-end',
                icon: 'warning',
                title: 'Email Not Be Empty!!!',
              })
        }
    }


    return (
        <>
            <div className={Styles["overlayPopupForget"]}>
                <div className={Styles["forget"]}>
                    <div className={Styles["forget__heading"]}>
                        <h3 className={Styles["forget__title"]}>Qu??n m???t kh???u</h3>
                        <FaRegTimesCircle className={Styles["forget__icon-close"]} onClick={handleClick} />
                    </div>
                   
                    <div className={Styles["forget__body"]}>
                        <p className={Styles["forget__body-heading"]}>
                            H??y nh???p email m?? b???n ???? d??ng ????? t???o t??i kho???n
                        </p>
                        <div className={Styles["forget__body-form"]}>
                            <input
                                ref={inputEmail}
                                className={`${Styles["forget__body-form-input"]} input-email`}
                                type="email"
                                placeholder="Nh???p email t???i ????y"
                                onChange={handleGetInputEmail}
                            />
                        </div>
                        <button
                            className={Styles["btn-submit"]}
                            onClick={handleGetVerifi}
                        >
                            G???i mail x??c th???c
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}