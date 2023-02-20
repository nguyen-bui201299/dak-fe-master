import { useRef, useEffect} from "react";
import Styles from "./PopupLink.module.css";
import { FaRegTimesCircle } from "react-icons/fa";
import Link from "next/link";

export default function PopupLink({handleClick, setShowPopupLink}) {
    // test-render-web
    useEffect(() => {
        console.log('render PopupLink');
        }, [])

    const popuplink = useRef();
    const closePopupLink = e => {
        if (popuplink.current === e.target) {
            setShowPopupLink(false);
        }
    };
    return (
        <>
            <div className={Styles["overlayPopupLink"]} ref={popuplink} onClick={closePopupLink}>
                <div className={Styles["popuplink"]}>
                    <div className={Styles["popuplink__upload-image"]}>
                        <div className={Styles["popuplink__heading"]}>
                            <h3 className={Styles["popuplink__title"]}>Liên kết</h3>
                            <FaRegTimesCircle className={Styles["popuplink__icon-close"]} onClick={handleClick}/>
                        </div>
                        <ul className={Styles["popuplink__list"]}>
                            <LinkItem/>
                            <LinkItem/>
                            <LinkItem/>
                            <LinkItem/>
                            <LinkItem/>
                            <LinkItem/>
                            <LinkItem/>
                            <LinkItem/>
                            <LinkItem/>
                            <LinkItem/>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export function LinkItem() {
    return (
        <>
            <li className={Styles["popuplink__item"]}>
                <Link href="/">
                    <a className={Styles["popuplink__item-link"]}>www.figma.com</a>
                </Link>
            </li>
        </>
    )
}