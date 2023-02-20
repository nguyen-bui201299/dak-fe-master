import Styles from "./PopupBackground.module.css";
import { FaRegTimesCircle, FaPlus, FaUpload, FaAngleLeft } from "react-icons/fa";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Background from "../../../public/images/bg.png";

export default function PopupBackground({handleClick, setShowPopupBackground}) {
    // test-render-web
    useEffect(() => {
        console.log('render PopupBackground');
        }, [])

    const [showPopup, setShowPopup] = useState(1);
    const popupBackground = useRef();
    const closePopupBackground = e => {
        if (popupBackground.current === e.target) {
            setShowPopupBackground(false);
        }
    };
    return (
        <>
            <div className={Styles["overlayPopupBackground"]} ref={popupBackground} onClick={closePopupBackground}>
                <div className={Styles["popupbackground"]}>
                    <div className={Styles["popupbackground__upload-image"]}>
                        <div className={Styles["popupbackground__heading"]}>
                            <h3 className={Styles["popupbackground__title"]}>Cập nhật ảnh nền</h3>
                            <FaRegTimesCircle className={Styles["popupbackground__icon-close"]} onClick={handleClick}/>
                        </div>
                        { showPopup === 1 &&
                            <div className={Styles["popupbackground__upload-box"]}>
                                <div className={Styles["popupbackground__upload-left"]} onClick={() => setShowPopup(11)}>
                                    <FaPlus className={Styles["popupbackground__upload-icon"]}/>
                                    <span className={Styles["popupbackground__upload-title"]}>Chọn ảnh từ hệ thống</span>
                                </div>
                                <div className={Styles["popupbackground__upload-right"]}>
                                    <FaUpload className={Styles["popupbackground__upload-icon"]}/>
                                    <span className={Styles["popupbackground__upload-title"]}>Chọn ảnh từ máy tính</span>
                                </div>
                            </div>
                        }
                        
                        { showPopup == 11 &&
                            <div className={Styles["popupbackground__upload-body"]}>
                                <div className={Styles["popupbackground__upload-heading"]}>
                                    <FaAngleLeft className={Styles["popupbackground__upload-heading-icon"]} onClick={() => setShowPopup(1)}/>
                                    <h4 className={Styles["popupbackground__upload-heading-title"]}>Ảnh từ hệ thống</h4>
                                </div>
                                <div className={`${Styles["popupbackground__image-list"]} ${Styles["background"]}`}>
                                    <div className={Styles["popupbackground__image-item"]} onClick={() => setShowPopup(12)}>
                                        <Image src={Background} alt="Image"/>
                                    </div>
                                    <div className={Styles["popupbackground__image-item"]} onClick={() => setShowPopup(12)}>
                                        <Image src={Background} alt="Image"/>
                                    </div>
                                    <div className={Styles["popupbackground__image-item"]} onClick={() => setShowPopup(12)}>
                                        <Image src={Background} alt="Image"/>
                                    </div>
                                    <div className={Styles["popupbackground__image-item"]} onClick={() => setShowPopup(12)}>
                                        <Image src={Background} alt="Image"/>
                                    </div>
                                    <div className={Styles["popupbackground__image-item"]} onClick={() => setShowPopup(12)}>
                                        <Image src={Background} alt="Image"/>
                                    </div>
                                    <div className={Styles["popupbackground__image-item"]} onClick={() => setShowPopup(12)}>
                                        <Image src={Background} alt="Image"/>
                                    </div>
                                    <div className={Styles["popupbackground__image-item"]} onClick={() => setShowPopup(12)}>
                                        <Image src={Background} alt="Image"/>
                                    </div>
                                </div>
                            </div>
                        }
                        
                        { showPopup == 12 &&
                            <div className={Styles["popupbackground__upload-body"]}>
                                <div className={Styles["popupbackground__upload-heading"]}>
                                    <FaAngleLeft className={Styles["popupbackground__upload-heading-icon"]} onClick={() => setShowPopup(11)}/>
                                    <h4 className={Styles["popupbackground__upload-heading-title"]}>Ảnh từ hệ thống</h4>
                                </div>
                                <div className={`${Styles["popupbackground__image-selected"]} ${Styles["background"]}`}>
                                    <Image src={Background} alt="Image"/>
                                </div>
                                <button className={Styles["btn-submit"]}>Lưu</button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}