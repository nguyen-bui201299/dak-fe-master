import { useRef, useState, useEffect } from "react";
import Styles from "./PopupImageFile.module.css";
import { FaRegTimesCircle, FaRegFileAlt } from "react-icons/fa";
import Image from "next/image";

export default function PopupImageFile({handleClick, setShowPopupImageFile}) {
    // test-render-web
    useEffect(() => {
        console.log('render PopupImageFile');
        }, [])

    const [toggleState, setToggleState] = useState(1);
    const popupImageFile = useRef();
    const closePopupImageFile = e => {
        if (popupImageFile.current === e.target) {
            setShowPopupImageFile(false);
        }
    };
    const handleToggleTab = (index) => {
        setToggleState(index);
    }
    return (
        <>
            <div className={Styles["overlayPopupImageFile"]} ref={popupImageFile} onClick={closePopupImageFile}>
                <div className={Styles["popupfile"]}>
                    <div className={Styles["popupfile__upload-image"]}>
                        <div className={Styles["popupfile__heading"]}>
                            <h3 className={Styles["popupfile__title"]}>Ảnh và File</h3>
                            <FaRegTimesCircle className={Styles["popupfile__icon-close"]} onClick={handleClick}/>
                        </div>
                        <ul className={Styles["popupfile__nav-list"]}>
                            <li 
                                className={`${Styles["popupfile__nav-item"]} ${toggleState === 1 ? Styles["active"] : ''}`}
                                onClick={() => handleToggleTab(1)}
                            >Ảnh</li>
                            <li 
                                className={`${Styles["popupfile__nav-item"]} ${toggleState === 2 ? Styles["active"] : ''}`}
                                onClick={() => handleToggleTab(2)}
                            >File</li>
                        </ul>
                        <div className={`${Styles["popupfile__image-list"]} ${toggleState === 1 ? Styles["active"] : ''}`}>
                            <ImageItem/>
                            <ImageItem/>
                            <ImageItem/>
                            <ImageItem/>
                            <ImageItem/>
                            <ImageItem/>
                            <ImageItem/>
                            <ImageItem/>
                            <ImageItem/>
                            <ImageItem/>
                        </div>
                        <div className={`${Styles["popupfile__file-list"]} ${toggleState === 2 ? Styles["active"] : ''}`}>
                            <FileItem/>
                            <FileItem/>
                            <FileItem/>
                            <FileItem/>
                            <FileItem/>
                            <FileItem/>
                            <FileItem/>
                            <FileItem/>
                            <FileItem/>
                            <FileItem/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export function ImageItem() {
    return (
        <>
            <div className={Styles["popupfile__image-item"]}>
                {/* <Image src={Picture3} alt="Image"/> */}
            </div>
        </>
    )
}

export function FileItem() {
    return (
        <>
            <div className={Styles["popupfile__file-item"]}>
                <FaRegFileAlt className={Styles["popupfile__file-item-icon"]}/>
                <p className={Styles["popupfile__file-item-name"]}>file.zip</p>
                <span className={Styles["popupfile__file-item-weight"]}>2MB</span>
            </div>
        </>
    )
}