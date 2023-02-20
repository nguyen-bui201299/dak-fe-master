import { useRef, useState, useEffect } from "react";
import Styles from "./PopupEditNameGroup.module.css";
import { FaRegTimesCircle, FaEdit } from "react-icons/fa";
import Image from "next/image";
import Avatar from "../../../public/images/bgAvatar.jpg";

export default function PopupEditNameGroup({handleClick, setShowPopupEditNameGroup, messContent}) {
    // test-render-web
    useEffect(() => {
        console.log('render PopupEditNameGroup');
    }, [])

    const [showInputEditNameGroup, setShowInputEditNameGroup] = useState(false);
    const popupEditNameGroup = useRef();
    const closePopupEditNameGroup = e => {
        if (popupEditNameGroup.current === e.target) {
            setShowPopupEditNameGroup(false);
        }
    };
    return (
        <>
            <div className={Styles["overlayPopupEditNameGroup"]} ref={popupEditNameGroup} onClick={closePopupEditNameGroup}>
                <div className={Styles["popupEditNameGroup"]}>
                    <div className={Styles["popupEditNameGroup__upload-image"]}>
                        <div className={Styles["popupEditNameGroup__heading"]}>
                            <h3 className={Styles["popupEditNameGroup__title"]}>Chỉnh sửa tên nhóm</h3>
                            <FaRegTimesCircle className={Styles["popupEditNameGroup__icon-close"]} onClick={handleClick}/>
                        </div>
                        <ul className={Styles["popupEditNameGroup__list"]}>
                            <li className={Styles["popupEditNameGroup__item"]}>
                                <div className={Styles["popupEditNameGroup__item-avatar"]}>
                                    {
                                        messContent.conversation.user ?
                                        <img src={messContent.conversation.user.avatar} alt="Avatar" style={{objectFit: "cover", width: "100%", height: "100%"}}/>:
                                        <Image src={Avatar} alt="Avatar"/>
                                    }
                                </div>
                                <p className={Styles["popupEditNameGroup__item-name"]}>{messContent.conversation.name}</p>
                                <FaEdit className={Styles["popupEditNameGroup__item-icon"]} onClick={() => setShowInputEditNameGroup(!showInputEditNameGroup)}/>
                            </li>
                            {showInputEditNameGroup &&
                                <input type="text" className={Styles["popupEditNameGroup__item-input"]} placeholder="Nhập biệt danh..."/>
                            }
                        </ul>
                        <button className={Styles["btn-submit"]}>Lưu</button>
                    </div>
                </div>
            </div>
        </>
    )
}