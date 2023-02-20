import Styles from "./PopupHideChat.module.css";
import { FaRegTimesCircle } from "react-icons/fa";
import { useRef, useEffect } from "react";

export default function PopupHideChat({handleClick, setShowPopupHideChat}) {
    // test-render-web
    useEffect(() => {
        console.log('render PopupHideChat');
        }, [])

    const popupHideChat = useRef();
    const closePopupHideChat = e => {
        if (popupHideChat.current === e.target) {
            setShowPopupHideChat(false);
        }
    };
    return (
        <>
            <div className={Styles["overlayPopupHideNoti"]} ref={popupHideChat} onClick={closePopupHideChat}>
                <div className={Styles["popuphide"]}>
                    <div className={Styles["popuphide__upload-image"]}>
                        <div className={Styles["popuphide__heading"]}>
                            <h3 className={Styles["popuphide__title"]}>Ẩn cuộc trò chuyện</h3>
                            <FaRegTimesCircle className={Styles["popuphide__icon-close"]} onClick={handleClick}/>
                        </div>
                        <div className={Styles["popuphide__btn-list"]}>
                            <div className={Styles["popuphide__btn-item"]}>Có</div>
                            <div className={Styles["popuphide__btn-item"]}>Không</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}