import Styled from './Menusetting.module.css';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from "next/router";
import {FiLogIn, FiLogOut} from 'react-icons/fi';
import { FaGlobe, FaAngleLeft } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { BsFillGearFill } from "react-icons/bs";
import {useDispatch} from 'react-redux';    
import { updateReduxUser } from '../../redux/slices/loginSlice';
import API, { endpoints, headers } from '../../API';
import { deleteChatToken, deleteCookieUserLogin, deleteRefreshToken, deleteTokenUserLogin, deleteXsrfToken, getCookieUserLogin } from '../../modules/Cookies/Auth/userLogin';

import { NotificationToast } from '../../modules/Notification/Notification';
import Link from "next/link";
import { AiOutlineShareAlt } from 'react-icons/ai';
import Router from 'next/router';

export default function MenuSetting({ setLanguage, setShowMenuSetting, handleShowChangePass, setLoader, page = "",}) {
    const userLogin = getCookieUserLogin()
    const [userInfo, setUserInfo] = useState(userLogin);

    const route = useRouter();
    const currentPathUrl = route.asPath;

    const handelOnChange = (id, value) => {
        setUserInfo(
            {
             ...userInfo,
                [id]: value 
            });
    }

    const dispatch = useDispatch();

    const handleChangeConfig=(type, mode, language)=>{
        const NotiftMessage = '';
        if(type === 'theme'){
            // NotiftMessage = `${content.menusetting_successChangeTheme}`
            let data={
                mode,
            };
            API.put(endpoints["updateprofile"], data , { headers : headers.headers_token})
            .then(function (response) {
                if(response.data.success){
                    NotificationToast.fire({
                        toast: true,
                        position: 'bottom-end',
                        icon: 'success',
                        title: `${content.menusetting_successChangeTheme}`,
                      })
                }
            })
            .catch(function (error) {})
        }
        if(type === 'language'){
            language === 'en' ? NotiftMessage = "Successfull Translation." :
            language === 'vn' ? NotiftMessage = "Thay đổi ngôn ngữ thành công" : 
            language === 'th' ? NotiftMessage = "เปลี่ยนความสำเร็จของภาษา" :
            language === 'phi' ? NotiftMessage = "Baguhin ang Tagumpay ng Wika" :
            language === 'id' ? NotiftMessage = "Ubah Bahasa Sukses" :
            language === 'in' ? NotiftMessage = "भाषा बदलें सफलता" : NotiftMessage = "改变语言成功" 
              
            let data={
                language,
            };
            setUserInfo({
                ...userInfo,
                [type]: language
            });
            dispatch(updateReduxUser({type: 'language', data: language}));
            return new Promise((resolve, reject) => {
                API.put(endpoints["updateprofile"], data , { headers : headers.headers_token})
                .then(function (response) {
                    if(response.data.success){
                        resolve(response.data);
                        setLanguage(language);
                        setShowMenuSetting(false);
                        setUserInfo({...userInfo});
                        NotificationToast.fire({
                            toast: true,
                            position: 'bottom-end',
                            icon: 'success',
                            title: `${NotiftMessage}`,
                        })
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    resolve (error);
                });
            });
        }
    }

    const handleToggle = (event) => {
        if(event.target.checked){
            handelOnChange('mode', 'dark');
            dispatch(updateReduxUser({type: 'mode', data: 'dark'}));
            handleChangeConfig('theme','dark');
        }
        else {
            handelOnChange('mode', 'light');
            dispatch(updateReduxUser({type: 'mode', data: 'light'}));
            handleChangeConfig('theme','light');
        }
    };

    const handleLogoutInfo = async () => {
        try {
            const res = await API.post(endpoints['auth/logout'], {}, {headers: headers.headers_token})
            if(res.data.success) {
                deleteCookieUserLogin();
                deleteTokenUserLogin();
                deleteRefreshToken();
                deleteXsrfToken();
                deleteChatToken();
                location.replace("/login");
            }
        }
        catch(err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (userInfo.mode !== undefined) {
            if (userInfo.mode === "dark") {
                // Set value of  darkmode to dark
                document.documentElement.setAttribute('data-theme', 'dark');
                window.localStorage.setItem('theme', 'dark');
            } else {
                // Set value of  darkmode to light
                document.documentElement.removeAttribute('data-theme', 'light');
                window.localStorage.setItem('theme', 'light');
            }
        }
    }, [userInfo]);

    const [showMenuLanguage, setShowMenuLanguage] = useState(false);

    // Handle click outside to close menu setting
    const menuSettingRef = useRef();
    const closeMenuSetting = e => {
        if (menuSettingRef.current === e.target) {
            setShowMenuSetting(false)
        }
    };

    const [content, setContent] = useState({});

    useEffect(() => {
        if(userInfo.language!== undefined) {
            setContent(require(`./languages/${userInfo.language}.json`));
        }else{
            setContent(require(`./languages/en.json`));
        }
    }, [userInfo])

    return (
        <div className={Styled.overlayDropdownMenu} ref={menuSettingRef} onClick={closeMenuSetting}>
            <div className={Styled.dropDownMenu} style={userLogin == undefined ? {height:"260px"} : {height:"auto"}}>
                <div className={Styled.menu_setting}>
                    {userLogin != undefined &&
                        <div style={{cursor: 'pointer'}} onClick={() => location.replace('/profile')} >
                            <a>
                                <div className={Styled.goTo_profile}>
                                    <div className={Styled.avatar_user}>
                                        <img className={Styled.avatar} src={userLogin.avatar} alt="Avatar"/>
                                    </div>
                                    <div className={Styled.info_user}>
                                        <p className={Styled.name_user}>{userLogin.name}</p>
                                        <span className={Styled.sub_name_user}>{content.menusetting_see_your_profile}</span>
                                    </div>
                                </div>
                            </a>
                        </div> 
                    }
                    <div className={Styled.features}>
                        <ul className={Styled.list_feature}>
                            <li className={Styled.feature_item}>
                                <span>{content.menusetting_change_theme}</span>
                                <div>
                                    <form action="#">
                                        <label className={Styled.switch}>
                                            <input type="checkbox" checked={userInfo.mode != undefined && userInfo.mode == "dark" ? true : false} onChange={handleToggle}/>
                                            <span className={Styled.slider}></span>
                                        </label>
                                    </form>
                                </div>
                            </li>
                            <li className={Styled.feature_item}
                                onClick={() => setShowMenuLanguage(!showMenuLanguage)}
                            >
                                <span>{content.menusetting_language_setting}</span>
                                <FaGlobe className={Styled.menusetting_icon} />
                            </li>
                            {/* Có set css inline top = 0 ở đây */}
                            {showMenuLanguage && (
                                <div className={`${Styled.dropDownMenu} ${Styled.subDropDownMenu}`}>
                                    <div className={Styled.menu_setting}>
                                        {/* <div className={Styled.goTo_profile}> */}
                                            <p className={Styled.goBackMainMenu}
                                                onClick={() => setShowMenuLanguage(!showMenuLanguage)}>
                                                <FaAngleLeft className={Styled.menusetting_icon} />
                                                    {content.goback}
                                            </p>
                                        {/* </div> */}
                                        <div className={`${Styled.features} ${Styled.subDropDownMenu}`}>
                                            <ul className={Styled.list_feature}>
                                            <li 
                                                className={Styled.feature_item} 
                                                onClick={() =>handleChangeConfig('language','', 'en')
                                            }>
                                                <span>English</span>
                                            </li>
                                            <li 
                                                className={Styled.feature_item} 
                                                onClick={() =>handleChangeConfig('language','', 'vn')
                                            }>
                                                <span>Vietnamese</span>
                                            </li>
                                            <li 
                                                className={Styled.feature_item} 
                                                onClick={() =>handleChangeConfig('language','', 'cn')
                                            }>
                                                <span>Chinese</span>
                                            </li>
                                            <li 
                                                className={Styled.feature_item} 
                                                onClick={() =>handleChangeConfig('language','', 'th')
                                            }>
                                                <span>Thai</span>
                                            </li>
                                            <li 
                                                className={Styled.feature_item} 
                                                onClick={() =>handleChangeConfig('language','', 'in')
                                            }>
                                                <span>Indian</span>
                                            </li>
                                            <li 
                                                className={Styled.feature_item} 
                                                onClick={() =>handleChangeConfig('language','', 'id')
                                            }>
                                                <span>Indonesian </span>
                                            </li>
                                            <li 
                                                className={Styled.feature_item} 
                                                onClick={() =>handleChangeConfig('language','', 'phi')
                                            }>
                                                <span>Phillipinese</span>
                                            </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {
                            userLogin == undefined ? null : 
                            <li className={Styled.feature_item}>
                                <span>{content.menusetting_setting_and_privacy}</span>
                                <BsFillGearFill className={Styled.menusetting_icon} />
                            </li>
                            }
                            {
                            userLogin == undefined ? null : 
                            <li className={Styled.feature_item} onClick={() => handleShowChangePass()} >
                                    {content.menusetting_change_password}
                                <RiLockPasswordLine className={Styled.menusetting_icon}/>
                            </li>
                            }

                            <li className={Styled.feature_item} onClick={() => Router.push("/linksocial")}>
                                <span>Link social</span>
                                <AiOutlineShareAlt className={Styled.menusetting_icon} />
                            </li>
                            
                            <li className={Styled.feature_item} 
                                onClick={handleLogoutInfo}>
                                <span>{userLogin == undefined ? content.menusetting_log_in : content.menusetting_log_out}</span>
                                <span className={Styled.feature_item__logout_icons} style={{width: '30px'}}>{userLogin == undefined ? <FiLogIn/> : <FiLogOut/>}</span>
                            </li>
                        </ul>
                    </div>
                    <div className={Styled.copyright_menusetting}>
                        <span>{content.menusetting_about}</span>
                    </div>
                </div>
            </div>
        </div>        
    );
}