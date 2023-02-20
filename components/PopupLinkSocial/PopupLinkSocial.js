import { useEffect, useRef, useState } from "react"
import {AiOutlineCloseCircle} from "react-icons/ai"
import styles from "./PopupLinkSocial.module.css"
import Styles from "../PopupLogin/PopupForgetPassword/PopupForgetPassword.module.css"
import { NotificationToast } from "../../modules/Notification/Notification";
import API, { endpoints, headers } from "../../API";
import { getCookieUserLogin } from "../../modules/Cookies/Auth/userLogin"

export default function PopupLinkSocial({setShowPopup, handleClick, setShowLink, social_item_filters}) {
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
    const closePopup = e => {
        if(linkSocialRef.current === e.target) {
            setShowPopup(false);
        }
    }
    
    const [linkSocial, setLinkSocial] = useState("");
    const [option, setOption] = useState("");
    const [token, setToken] = useState('');
    const [code, setCode] = useState('000000');
    const [showVerifyPopup, setShowVerifyPopup] = useState(1);
    const linkRef = useRef(null);
    const inputNumber1 = useRef(null);
    const inputNumber2 = useRef(null);
    const inputNumber3 = useRef(null);
    const inputNumber4 = useRef(null);
    const inputNumber5 = useRef(null);
    const inputNumber6 = useRef(null);

    const verifyLink = () =>{
        const data = {
            "token": token,
            "code": code,
        }
        
        API.post(endpoints["verifyProfile"], data , {headers: headers.headers_token})
            .then((res)=>{console.log(res)
                if(res.data.success){
                    setShowPopup(false);
                    // showLink.push(res.data.data);
                    getAllLinkProfile();
                    NotificationToast.fire({
                        toast: true,
                        position: 'top-right',
                        icon: 'success',
                        title: `${content.popup_link_social_success}`,
                    })
                } else {
                    NotificationToast.fire({
                        toast: true,
                        position: 'top-right',
                        icon: 'warning',
                        title: `${content.popup_link_social_fail}`,
                    })
                }
            }) 
    }

    const getAllLinkProfile = () => {
        API.get(endpoints["getLinkProfile"](1), { headers: headers.headers_token })
            .then((res) => {
                setShowLink(res.data.data);
            })
    }

    const handleSaveLink =()=>{
        if(linkSocial !=""){
            const data = {
                "url":linkSocial,
            }
            if(linkSocial.includes('facebook' || 'fb')){
                API.post(endpoints["getEmailFacebook"], data, {headers: headers.headers_token})
                .then((res)=>{
                    if(res.data.success){
                        setToken(res.data.token);
                        setShowVerifyPopup(2);
                    } else{ 
                        NotificationToast.fire({
                            toast: true,
                            position: 'top-right',
                            icon: 'warning',
                            title: `${content.popup_link_social_invalid_link}`,
                        })
                    }})
            } else
            if(linkSocial.includes('twitch')){
                API.post(endpoints["getEmailTwitch"], data, {headers: headers.headers_token}).then((res)=>{
                    if(res.data.success){
                        setToken(res.data.token);
                        setShowVerifyPopup(2);
                    }else{ 
                        NotificationToast.fire({
                            toast: true,
                            position: 'top-right',
                            icon: 'warning',
                            title: `${content.popup_link_social_invalid_link}`,
                        })
                    }})
            } else
            if(linkSocial.includes('tiktok')){
                API.post(endpoints["getEmailTiktok"], data, {headers: headers.headers_token}).then((res)=>{
                    if(res.data.success){
                        setToken(res.data.token);
                        setShowVerifyPopup(2);
                    }else { 
                        NotificationToast.fire({
                            toast: true,
                            position: 'top-right',
                            icon: 'warning',
                            title: `${content.popup_link_social_invalid_link}`,
                        })
                    }})   
            } else
            if(linkSocial.includes('youtube')){
                API.post(endpoints["getEmailYoutube"], data, {headers: headers.headers_token}).then((res)=>
                {if(res.data.success){
                    setToken(res.data.token);
                    setShowVerifyPopup(2);
                }else{ 
                    NotificationToast.fire({
                        toast: true,
                        position: 'top-right',
                        icon: 'warning',
                        title: `${content.popup_link_social_invalid_link}`,
                    })
                }})
            } else
            if(linkSocial.includes('twitter')){
                API.post(endpoints["getEmailTwitter"], data, {headers: headers.headers_token}).then((res)=>{
                    if(res.data.success){
                        setToken(res.data.token);
                        setShowVerifyPopup(2);
                    }else{ 
                        NotificationToast.fire({
                            toast: true,
                            position: 'top-right',
                            icon: 'warning',
                            title: `${content.popup_link_social_invalid_link}`,
                        })
                    }})
            } else{
                NotificationToast.fire({
                    toast: true,
                    position: 'top-right',
                    icon: 'warning',
                    title: `${content.popup_link_social_not_support}`,
                })
            }
        } else{
            NotificationToast.fire({
                toast: true,
                position: 'top-right',
                icon: 'warning',
                title: `${content.popup_link_social_connect_link}`,
            })
        }
    }

    const getLink = (e) => {
        const link = e.target.value.trim();
        setLinkSocial(link);
    }

    const getOption = (e) =>{
        setOption(e.target.value);
        
    }

    const getCode = () => {
        try {
            const listCode = [...window.document.querySelectorAll(`.forget__body-form-input`)];
            var listcode = "";
            listCode.map((code, index) => {
                listcode += code.value.toString();
            });
            console.log(listcode)
            return listcode;
        } catch (err) {
            NotificationToast.fire({
                toast: true,
                position: 'top-right',
                icon: 'error',
                title: `${err}`,
            })
            return "000000";
        }
    }

    const handleInputNumber = (value, index) => {
        if (index == 1) {
            inputNumber2.current.focus();
        }
        if (index == 2) {
            inputNumber3.current.focus();
        }
        if (index == 3) {
            inputNumber4.current.focus();
        }
        if (index == 4) {
            inputNumber5.current.focus();
        }
        if (index == 5) {
            inputNumber6.current.focus();
        }
        if (index == 6) {
            setCode(getCode());
            verifyLink();
        }
    }

    useEffect(()=> {
        showVerifyPopup == 1 && linkRef.current.focus();
        showVerifyPopup == 2 && inputNumber1.current.focus();
    }, [])

    return (
        <>
            <div className={styles["overlayPopupSocial"]} ref={linkSocialRef} onClick={closePopup}>
                <div className={styles["popupSocial"]}>
                    <div className={styles["popupSocial__header"]}>
                        <h2>{content.popup_link_social_title}</h2>
                        <AiOutlineCloseCircle onClick={handleClick} className={styles["popupSocial__close"]}/>
                    </div>
                    { showVerifyPopup === 1 && <> <div className={styles["popupSocial__body"]}>
                        <div className={styles["linkSocial__info"]}>
                            <label>Link</label>
                            <input 
                            type="text" 
                            ref = {linkRef}
                            placeholder={content.popup_link_social_input_link}
                            className={styles["linkSocial__input"]} 
                            onChange={getLink}/>
                        </div>
                        <ul className={styles.linkSocial__icon}>
                            {social_item_filters.map((filter, i) => (
                                <li key={i}>
                                    <i className={filter.className}></i>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button className={styles["popupSocial__save"]} onClick={handleSaveLink}>{content.popup_link_social_next}</button></>}
                    {showVerifyPopup === 2 &&
                        <div className={`${Styles["forget__body"]} ${Styles["animation"]}`}>
                            <p className={`${Styles["forget__body-heading"]}`}>
                                {content.popup_link_social_verify_heading}
                                <p className={Styles["forget__body-heading-email"]}></p>
                            </p>
                            <div className={Styles["forget__body-form"]}>
                                <input ref={inputNumber1} className={`${Styles["forget__body-form-input"]} forget__body-form-input`} onChange={(event) => handleInputNumber(event.target.value,1)} type="number" />
                                <input ref={inputNumber2} className={`${Styles["forget__body-form-input"]} forget__body-form-input`} onChange={(event) => handleInputNumber(event.target.value,2)} type="number" />
                                <input ref={inputNumber3} className={`${Styles["forget__body-form-input"]} forget__body-form-input`} onChange={(event) => handleInputNumber(event.target.value,3)} type="number" />
                                <input ref={inputNumber4} className={`${Styles["forget__body-form-input"]} forget__body-form-input`} onChange={(event) => handleInputNumber(event.target.value,4)} type="number" />
                                <input ref={inputNumber5} className={`${Styles["forget__body-form-input"]} forget__body-form-input`} onChange={(event) => handleInputNumber(event.target.value,5)} type="number" />
                                <input ref={inputNumber6} className={`${Styles["forget__body-form-input"]} forget__body-form-input`} onChange={(event) => handleInputNumber(event.target.value,6)} type="number" />
                            </div>
                            <p className={Styles["forget__body-resend-box"]}>
                                {content.popup_link_social_resend_title}
                                <span className={Styles["forget__body-resend"]}>{content.popup_link_social_resend}</span>
                            </p>
                            <button 
                                className={Styles["btn-submit"]} 
                                onClick={() => { verifyLink() }}
                            >{content.popup_link_social_verify_btn}</button>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}
