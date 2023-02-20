import { useRef, useEffect } from "react";
import Styles from "./PopupTurnOffNoti.module.css";
import { FaRegTimesCircle } from "react-icons/fa";

export default function PopupTurnOffNoti({handleClick, setShowPopupTurnOffNoti}) {
    // test-render-web
    useEffect(() => {
        console.log('render PopupTurnOffNoti');
        }, [])

    const popupTurnOffNoti = useRef();
    const closePopupTurnOffNoti = e => {
        if (popupTurnOffNoti.current === e.target) {
            setShowPopupTurnOffNoti(false);
        }
    };
    return (
        <>
            <div className={Styles["overlayPopupTurnOffNoti"]} ref={popupTurnOffNoti} onClick={closePopupTurnOffNoti}>
                <div className={Styles["popupnoti"]}>
                    <div className={Styles["popupnoti__upload-image"]}>
                        <div className={Styles["popupnoti__heading"]}>
                            <h3 className={Styles["popupnoti__title"]}>Cài đặt thông báo</h3>
                            <FaRegTimesCircle className={Styles["popupnoti__icon-close"]} onClick={handleClick}/>
                        </div>
                        <div className={Styles["popupnoti__body"]}>
                            <h3 className={Styles["popupboti__title"]}>Tắt thông báo trong</h3>
                            <ul className={Styles["popupnoti__time-list"]}>
                                <li className={Styles["popupnoti__time-item"]}>
                                    <p className={Styles["popupnoti__time-title"]}>15 phút</p>
                                    <input type="radio" name="time" className={Styles["popupnoti__time-radio"]}></input>
                                </li>
                                <li className={Styles["popupnoti__time-item"]}>
                                    <p className={Styles["popupnoti__time-title"]}>30 phút</p>
                                    <input type="radio" name="time" className={Styles["popupnoti__time-radio"]}></input>
                                </li>
                                <li className={Styles["popupnoti__time-item"]}>
                                    <p className={Styles["popupnoti__time-title"]}>1 giờ</p>
                                    <input type="radio" name="time" className={Styles["popupnoti__time-radio"]}></input>
                                </li>
                                <li className={Styles["popupnoti__time-item"]}>
                                    <p className={Styles["popupnoti__time-title"]}>24 giờ</p>
                                    <input type="radio" name="time" className={Styles["popupnoti__time-radio"]}></input>
                                </li>
                                <li className={Styles["popupnoti__time-item"]}>
                                    <p className={Styles["popupnoti__time-title"]}>Cho tới khi bật lại</p>
                                    <input type="radio" name="time" className={Styles["popupnoti__time-radio"]}></input>
                                </li>
                            </ul>
                        </div>
                        <button className={Styles["btn-submit"]}>Lưu</button>
                    </div>
                </div>
            </div>
        </>
    )
}