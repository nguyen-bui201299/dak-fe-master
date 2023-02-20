import Styles from "./PopupBlockChat.module.css";
import { FaRegTimesCircle } from "react-icons/fa";
import { useRef , useEffect} from "react";

export default function PopupBlockChat({handleClick, setShowPopupBlockChat}) {
    // test-render-web
    useEffect(() => {
        console.log('render PopupBlockChat');
        }, [])

    const popupBlockChat = useRef();
    const closePopupBlockChat = e => {
        if (popupBlockChat.current === e.target) {
            setShowPopupBlockChat(false);
        }
    };
    return (
        <>
            <div className={Styles["overlayPopupHideNoti"]} ref={popupBlockChat} onClick={closePopupBlockChat}>
                <div className={Styles["popuphide"]}>
                    <div className={Styles["popuphide__upload-image"]}>
                        <div className={Styles["popuphide__heading"]}>
                            <h3 className={Styles["popuphide__title"]}>Chặn tin nhắn</h3>
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