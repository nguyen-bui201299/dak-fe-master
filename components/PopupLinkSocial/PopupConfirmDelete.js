import { useEffect, useRef, useState } from "react"
import { AiOutlineCloseCircle } from "react-icons/ai"
import styles from "./PopupLinkSocial.module.css"
import { ErrorNotification, SuccessNotification } from "../../modules/Notification/Notification";
import API, { endpoints, headers } from "../../API";
import { getCookieUserLogin } from "../../modules/Cookies/Auth/userLogin";

export default function PopupConfirmDelete({ setShowConfirmDel, item, handleClick, setShowLink}) {
    const userLogin = getCookieUserLogin();


    const [content, setContent] = useState({});

    useEffect(() => {
        if (userLogin.language !== undefined) {
        setContent(require(`./languages/${userLogin.language}.json`));
        } else {
        setContent(require(`./languages/en.json`));
        }
    }, [userLogin]);

    const linkSocialRef = useRef();

    const handleYes = () => {
        setShowLink(prev => prev.filter(prev => prev.id !=item.id));
        API.delete(endpoints['deleteLinkProfile'](item.id), { headers: headers.headers_token })
            .then((res) => {
                console.log("res.data",res.data)
            if(res.data.success){
                SuccessNotification(content.popup_confirm_delete_success);
                setShowConfirmDel(false);
            }else{
                ErrorNotification(content.popup_confirm_delete_error)
            }
        }).catch(()=>console.error())
    }

    return (
        <>
            <div className={styles["overlayPopupSocial"]} ref={linkSocialRef}>
                <div className={styles["popupSocial"]}>
                    <div className={styles["popupSocial__header"]}>
                        <h2>{content.popup_confirm_delete_header}</h2>
                        <AiOutlineCloseCircle onClick={handleClick} className={styles["popupSocial__close"]} />
                    </div>
                    <> <div className={styles["popupSocial__body"]}>
                        <div className={styles["linkSocial__info"]}>
                            {/* <p>{`Bạn có chắc chắn xóa liên kết ${item.link} này`}</p> */}
                            <p>{content.popup_confirm_delete_asking}{item.link}</p>
                        </div>
                    </div>
                    <div className={styles["popupSocial__two_button"]}>
                        <button className={styles["popupSocial__button"]} onClick={handleYes}>{content.popup_confirm_delete_yes_btn}</button>
                        <button className={styles["popupSocial__button"]} onClick={handleClick}>{content.popup_confirm_delete_no_btn}</button>
                    </div></>
                </div>
            </div>
        </>
    )
}