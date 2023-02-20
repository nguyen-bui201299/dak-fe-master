import axios from 'axios';
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import API, { endpoints, headers } from '../../API';
import { ErrorNotification } from '../../modules/Notification/Notification';
import { useBoxChatContext } from '../BoxChat/BoxChatContext';
import Styles from "./PopupNewMess.module.css";

export default function PopupNewMessUser({ 
    setPopupFindConver, 
    content, 
    setMessContent, 
    setListConversation,
    setSearchConver,
    listConversation,
    conversationId
}) {
    const {language, setLanguage, socket, chatService, activeConversation} = useBoxChatContext();
    const [listUsers, setListUsers] = useState('');
    const [searchvalue, setSearchValue] = useState('');

    const popupFindConverRef = useRef();
    const closePopupChat = e => {
        if (popupFindConverRef.current === e.target) {
            setPopupFindConver(false);
        }
    };

    const handleOnchageSearch = e => {
        setSearchValue(e.target.value);
    }

    const findOrCreateConver = async (userid, type) => {
        try {
            if (!chatService) return;
            const conversations = await chatService.createConversation({ "type": type, "memberIds": [`${userid}`] });
            window.location.reload();
        } catch (error) {
           ErrorNotification(error.response.data.data) 
        }
    };

    useEffect(()=>{
        API.get(endpoints["findFriends"](10, 1, searchvalue), {headers: headers.headers_token })
        .then((res)=>{
            if(res.data.success){
                setListUsers(res.data.data);
            }
        }).catch((err)=>{console.log(err)});
    }, [searchvalue])

    return (
        <div className={Styles.container} ref={popupFindConverRef} onClick={closePopupChat}>
            <div className={Styles.container__popup}>
                <div className={Styles.container__popup__icon}>
                    <i className="fa fa-times" aria-hidden="true" onClick={()=>setPopupFindConver(prev=> !prev )}></i>
                </div>
                <div className={Styles.container__popup__title}> Messages </div>
                <div className={Styles["search_group"]}>
                    <input 
                        type="text" 
                        className={Styles["search__form-input"]} 
                        placeholder="Tim kiem ban be."
                        onChange={(e) => handleOnchageSearch(e)}
                    />
                    <FaSearch className={Styles["search__icon-search"]} />
                </div>
                <div className={Styles.container__popup__list}>
                    <ul>
                        {
                            listUsers && listUsers.map((user, index) => (
                                <li key={index}>
                                    <div className={Styles["actual-people"]}>
                                        <div className={Styles["people-items"]}>
                                            <div className={Styles["people-images"]}>
                                                <img className={Styles["people-avatar"]} src={user.user.avatar} alt="Avatar"/>
                                            </div>
                                            <div className={Styles["people-name-follow"]}>
                                                <div className={Styles["people-name"]}>
                                                    <Link href={`/otherprofile/${user.user.id}`} passHref><span>{user.user.name}</span></Link>
                                                </div>
                                            </div>
                                        </div>
                                        <button className={Styles["button_message"]} onClick={()=>findOrCreateConver(user.user.id, 1)}>
                                            {content && content.chat_message}
                                        </button>
                                    </div>
                                </li>
                            ))
                        } 
                    </ul>
                </div>
            </div>
        </div>
    );
}