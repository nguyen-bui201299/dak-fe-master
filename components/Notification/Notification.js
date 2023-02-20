import React, { useState, useRef, useEffect } from 'react';
import Styles from './Notification.module.css';
import { FaCircle } from 'react-icons/fa'
import API, { endpoints, headers } from '../../API'
import mapTime from '../../modules/Time/mapTime'
import { NotificationToast } from '../../modules/Notification/Notification';
import Link from 'next/link';
import { getCookieUserLogin } from '../../modules/Cookies/Auth/userLogin';

export default function Notification({ notification, setShowMenuNoti, handleChangeState }) {
    const [content, setContent] = useState({});

    const userLogin = getCookieUserLogin()
  
    useEffect(() => {
        if(userLogin.language !== undefined) {
            setContent(require(`./languages/${userLogin.language}.json`));
        }else{
            setContent(require(`./languages/en.json`));
        }
    }, [userLogin])
        
    const [isFull, setIsFull] = useState(0)
    const [changeState, setChangeState] = useState(false)
    // Handle click outside to close menu setting
    const menuNotiRef = useRef();
    const closeMenuNoti = e => {
        if (menuNotiRef.current === e.target) {
            setShowMenuNoti(false)
        }
    };

    const handleCheckAllNoti = () => {
        let arrId = []
        let newArr = notification.filter(item => item.notification.status === 2)
        for(let i = 0; i < newArr.length; i++) {
            arrId.push(newArr[i].notification.id)
        }
        
        API.patch(endpoints['getNotification'], {ids : arrId}, {headers: headers.headers_token})
        .then((res) => {
            if(res.data.success) {
                handleChangeState()
                NotificationToast.fire({
                    toast: true,
                    position: 'bottom-start',
                    icon: 'success',
                    title: `${content.notification_read_success}`,
                })
            } else {
                NotificationToast.fire({
                    toast: true,
                    position: 'bottom-start',
                    icon: 'warning',
                    title: `${content.notification_read_null}`,
                })
            }
        })
        .catch((err) =>  {})
    }


    return (
        <>
            <div className={Styles.overlayDropdownNoti} ref={menuNotiRef} onClick={closeMenuNoti}>
                <div className={Styles.dropDownNoti}>
                    <div className={Styles.Text__Notification}>
                        <h2 className={Styles.Text__h2__Notification}> {content.notification_title} </h2>
                        <div className={Styles.dropDownNoti__filter_wrap}>
                            <div 
                                className={isFull === 0 ? Styles.dropDownNoti__filter_tab_active : Styles.dropDownNoti__filter_tab}
                                onClick={() => setIsFull(0)}
                                >
                                <p className={Styles.dropDownNoti__filter}> {content.notification_all} </p>
                            </div>

                            <div 
                                className={isFull === 1 ? Styles.dropDownNoti__filter_tab_active : Styles.dropDownNoti__filter_tab}
                                onClick={() => setIsFull(1)}
                                >
                                <p className={Styles.dropDownNoti__filter}>{content.notification_unread}</p>
                            </div>
                            <div 
                                className={isFull === 2 ? Styles.dropDownNoti__filter_tab_active : Styles.dropDownNoti__filter_tab}
                                onClick={handleCheckAllNoti}
                                >
                                <p className={Styles.dropDownNoti__filter}>{content.notification_markall}</p>
                            </div>
                        </div>
                    </div>
                    <div className={Styles.info__Noti}>
                        {isFull === 0 &&
                            <ul className={Styles.list__Noti}>
                                {
                                    notification?.length > 0 &&
                                    notification.map((itemChild, index) => 
                                        (
                                        <NotiItem
                                            key={index}
                                            item={itemChild}
                                            content={content}
                                        />
                                    )
                                    )
                                }
                            </ul>
                        }

                        {isFull === 1 &&
                            <ul className={Styles.list__Noti}>
                            {
                                notification?.length > 0 &&
                                notification.filter(item => item.notification.status === false).map((itemChild, index) => 
                                    (
                                    <NotiItem
                                        key={index}
                                        item={itemChild}
                                        content={content}
                                    />
                                )
                            )
                            }
                        </ul>
                        }
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export function NotiItem({item, content}) {
    const handleUpdateNotiStatus = () => {
        API.patch(endpoints['getNotification'], {ids : [item.notification.id]}, {headers: headers.headers_token})
        .then((res) => {})
        .catch((err) =>  {})}
    
    return (
            <li 
                onClick={handleUpdateNotiStatus}
                className={Styles.noti__item}
            >
                <Link  href={
                        item.notification.type === 10 ? `/group/detail-group/${item.notification.id}` :
                        item.notification.type === 9 ? `/otherprofile/${item.notification.id}` :
                        (
                            item.notification.type === 5 || 
                            item.notification.type === 6 || 
                            item.notification.type === 7 ||
                            item.notification.type === 8 
                        ) ?`/post/${item.notification.id}` : ""
                } passHref >
                    <a className={Styles.item__Noti}>
                        <div className={Styles.avatar__Noti}>
                            <div className={Styles.box__vatar__Nofi}>
                                <img src={item.sender.avatar} alt="Avatar"/>
                            </div>
                        </div>
                        <div className={Styles.area__Noti}>
                            <div className={Styles.box__content_Noti}>
                                <p className={Styles.username__Noti}>
                                    <span>{item.sender.name} </span> 
                                    <span className={Styles.content__Noti}>
                                        {
                                            item.notification.type === 2 ? content.notification_accept_post :
                                            item.notification.type === 4 ? content.notification_like :
                                            item.notification.type === 5 ? content.notification_comment :  
                                            item.notification.type === 6 ? content.notification_share : 
                                            item.notification.type === 7 ? content.notification_reply_comment :
                                            item.notification.type === 8 ? content.notification_vote: 
                                            item.notification.type === 9 ? content.notification_follow : 
                                            item.notification.type === 10 ? content.notification_invitegroup : 
                                            item.notification.type === 12 ? content.notification_transfer_request : ""
                                        }
                                    </span>
                                </p>
                                <p className={Styles.time__Noti}>
                                    {mapTime(item.notification.created_at)}
                                </p>
                            </div>
                        </div>
                        {item.notification.status === 2 ?
                            <FaCircle className={Styles.dropDownNoti__icon__new} /> 
                            :
                            ''
                        }
                </a>
                </Link>
            </li>
    )
    
}