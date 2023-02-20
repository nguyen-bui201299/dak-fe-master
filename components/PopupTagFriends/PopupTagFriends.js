import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai';
import ButtonFollow from '../Button/ButtonFollow/ButtonFollow';
import { getCookieUserLogin } from '../../modules/Cookies/Auth/userLogin';
import Styles from './PopupTagFriends.module.css'

export default function PopupTagFriends({post, setShowPopup, handleClick}) {
    const userLogin = getCookieUserLogin();

    const [content, setContent] = useState({});

    useEffect(() => {
        if (userLogin.language !== undefined) {
        setContent(require(`./languages/${userLogin.language}.json`));
        } else {
        setContent(require(`./languages/en.json`));
        }
    }, [userLogin]);

    const tagFriends = useRef();
    const closePopup = e => {
        if(tagFriends.current === e.target) {
            setShowPopup(false);
        }
    }

    return (
        
        <div className={Styles["overlayPopupTagFriends"]} ref={tagFriends} onClick={closePopup}>
            <div className={Styles["popupTagFriend"]}>
                <div className={Styles["popupTagFriend__header"]}>
                    <h2>{content.popupTagFriends_people}</h2>
                    <AiOutlineCloseCircle onClick={handleClick} className={Styles["popupTagFriend__close"]}/>
                </div>
            
               <div className={Styles.container__popup__list}>
                    <ul>
                    {post.tag_users &&
                        post.tag_users.map((user, index) => (
                        <li key={index}>
                            <div className={Styles["actual-people"]}>
                            <div className={Styles["people-items"]}>
                                <div className={Styles["people-images"]}>
                                <img
                                    className={Styles["people-avatar"]}
                                    src={user.avatar}
                                    alt="Avatar"
                                />
                                </div>
                                <div className={Styles["people-name-follow"]}>
                                <div className={Styles["people-name"]}>
                                    <Link href={`/otherprofile/${user.id}`} passHref>
                                    <span>{user.name}</span>
                                    </Link>
                                </div>
                                {/* <div className={Styles["people-follow"]}>
                                    <span>1 Followers</span>
                                </div> */}
                                </div>
                            </div>
                            <div className={Styles['button-follow']}>
                            {userLogin.id !== user.id ? <ButtonFollow
                                isFollow={user?.has_follow}
                                id={user.id}
                                idx={index}
                            /> : ''}
                            
                            </div>
                            </div>
                        </li>
                        ))}
                    </ul>
               </div>
            </div>
        </div>
    )
}
