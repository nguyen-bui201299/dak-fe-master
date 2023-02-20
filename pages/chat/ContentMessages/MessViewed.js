import React, { useEffect, useState, Suspense } from "react";
import {
    FaQuoteRight, FaRegLaugh
    } from "react-icons/fa";


import Avatar from "../../../public/images/bgAvatar.jpg";
import Styles from "../../../styles/Chat.module.css";
import Image from "next/image";


import BodyPostFacebook from "../../../components/Post/component/BodyPostFacebook/BodyPostFacebook";
import BodyPostTiktok from "../../../components/Post/component/BodyPostTiktok/BodyPostTiktok";
import BodyPostTwitch from "../../../components/Post/component/BodyPostTwitch/BodyPostTwitch";
import BodyPostTwitter from "../../../components/Post/component/BodyPostTwitter/BodyPostTwitter";
import BodyPostYoutube from "../../../components/Post/component/BodyPostYoutube/BodyPostYoutube";
import BodyPostInstagram from "../../../components/Post/component/BodyPostInstagram/BodyPostInstagram";
import { getUrlType } from '../../../utils/chatUrl';

const MessViewed = ({ message, fromUser, linkify }) => {
  if (!message) message = {};
    message.link = message?.content
    const [viewPost, setViewPost] = useState(false);
    useEffect(() => {
        setViewPost(false);
    }, [message]);

    // style={{width: `${getUrlType(message?.link) ? "75%" : ''}`}}
    return (
        <>
            <div className={Styles['message-sent']}>
                <div className={Styles['message-sent-text']} style={{ maxWidth: `${message?.link ? '75%' : ''}` }}>
                    <div dangerouslySetInnerHTML={{ __html: linkify && linkify(`${message?.content}`) }} />
                    <div>
                        {getUrlType(message?.link) && !viewPost && (
                            <div className={Styles['message-post-btn-view']} onClick={() => setViewPost(true)}>
                                xem trước
                            </div>
                        )}
                        {viewPost && (
                            <div className={Styles['message-post-main']}>
                                <div className={Styles['message-post-content']}>
                                    {getUrlType(message?.link) === 'youtube' && (
                                        <Suspense fallback={<div></div>}>
                                            <BodyPostYoutube url={message?.link} />
                                        </Suspense>
                                    )}
                                    {getUrlType(message?.link) === 'facebook' && (
                                        <Suspense fallback={<div></div>}>
                                            <BodyPostFacebook dataHref={message?.link} className={'fb-post'} />
                                        </Suspense>
                                    )}
                                    {getUrlType(message?.link) === 'tiktok' && (
                                        <Suspense fallback={<div></div>}>
                                            <BodyPostTiktok url={message?.link} />
                                        </Suspense>
                                    )}
                                    {getUrlType(message?.link) === 'twitter' && (
                                        <Suspense fallback={<div></div>}>
                                            <BodyPostTwitter url={message?.link} />
                                        </Suspense>
                                    )}
                                    {getUrlType(message?.link) === 'twitch' && (
                                        <Suspense fallback={<div></div>}>
                                            <BodyPostTwitch post={'id'} url={message?.link} />
                                        </Suspense>
                                    )}
                                    {getUrlType(message?.link) === 'instagram' && (
                                        <Suspense fallback={<div></div>}>
                                            <BodyPostInstagram url={message?.link} />
                                        </Suspense>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <ul className={Styles['message-list-icon']}>
                        <li className={Styles['message-item-icon']}>
                            <FaQuoteRight className={Styles['message-icon']} />
                            <span className={Styles['message-icon-tooltip']}>Trả lời</span>
                        </li>
                        <li className={Styles['message-item-icon']}>
                            <FaRegLaugh className={Styles['message-icon']} />
                            <span className={Styles['message-icon-tooltip']}>Bày tỏ cảm xúc</span>
                        </li>
                    </ul>
                </div>
                <div className={Styles['message-sent-status']}>
                    <div className={Styles['message-sent-avatar']}>
                        {fromUser ? (
                            <picture>
                                <img src={fromUser.avatar} alt="Avatar" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                            </picture>
                        ) : (
                            <Image src={Avatar} alt="Avatar" />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default MessViewed;