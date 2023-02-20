import React, { useEffect, useRef, useState } from 'react';
import { FaEllipsisH } from 'react-icons/fa';
import Image from 'next/image';
import Avatar from '../../public/images/bgAvatar.jpg';
import Styles from '../../styles/Chat.module.css';
import { useBoxChatContext } from '../../components/BoxChat/BoxChatContext';
import PopupMore from './PopupMore';
import moment from 'moment/moment';

const ConversationItem = ({ conversation, messContent, toggleState }) => {
    const { userLogin, allUserObj, setActiveConversation, updateConversationState } = useBoxChatContext();
    const [showPopupMore, setShowPopupMore] = useState(false);
    const [iconMore, setIconMore] = useState(false);
    const [chatItem, setChatItem] = useState(false);
    const [displayLatestMsg, setDisplayLatestMsg] = useState({});

    const seenMess = () => {
        setActiveConversation(conversation);
        updateConversationState( conversation?.id, { unReadMsgCount: 0 } );
    };

    useEffect(() => {
        if (!conversation || !conversation.latestMessage) return;

        const { createdBy, content, createdAt } = conversation?.latestMessage;
        let displayContentMess = createdBy === userLogin.id
            ? 'Bạn : '
            : allUserObj[createdBy].username + ': ';

        displayContentMess +=
            content.slice(0, 4) == '<img'
                ? 'Đã gửi 1 ảnh!'
                : content.includes('<div>')
                ? content.split('<div>')[0].replaceAll('&nbsp;', ' ')
                : content.split('<br>')[0].replaceAll('&nbsp;', ' ');

        setDisplayLatestMsg({ createdAt, displayContentMess });
    }, [conversation, allUserObj, userLogin]);

    // Click outside to close Popupmore
    const popupMoreRef = useRef();
    useEffect(() => {
        let closePopupMore = (e) => {
            if (popupMoreRef.current && !popupMoreRef.current.contains(e.target)) {
                setShowPopupMore(false);
                setChatItem(false);
                setIconMore(false);
            }
        };
        document.addEventListener('click', closePopupMore);
        return () => {
            document.removeEventListener('click', closePopupMore);
        };
    }, []);

    return (
        // Thêm class ${Styles["have-mess"]} khi có tin nhắn mới để thông báo cho người dùng
        // Thêm class ${Styles["mess-select"]} khi có tin nhắn mới để thông báo cho người dùng
        <div
            className={`${Styles['chat__item']} ${conversation?.unReadMsgCount ? Styles['have-mess'] : ''} ${chatItem ? Styles.active : ''}`}
            onClick={seenMess}
            ref={popupMoreRef}>
            <div className={Styles['chat__avatar']}>
                {conversation?.avatar ? (
                    <picture>
                        <img src={conversation?.avatar} alt="Avatar" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                    </picture>
                ) : (
                    <Image src={Avatar} alt="Avatar" />
                )}
            </div>
            <div className={Styles['chat__content']}>
                <div className={Styles['chat__content-top']}>
                    <h3 className={Styles['chat__content-name']}>{conversation?.name}</h3>
                    <span className={Styles['chat__content-time']}>{moment(displayLatestMsg.createdAt).format("LT")}</span>
                </div>
                <div className={Styles['chat__content-bottom']}>
                    <p className={Styles['chat__content-mess']}>{displayLatestMsg.displayContentMess}</p>
                    <span className={Styles['chat__noti-count']}>{conversation?.unReadMsgCount > 9 ? 9 : conversation?.unReadMsgCount}+</span>
                </div>
            </div>
            <FaEllipsisH
                className={`${Styles['chat__icon-ellipsis']} ${iconMore ? Styles.active : ''}`}
                onClick={() => {
                    setShowPopupMore((prev) => !prev);
                    setIconMore(!iconMore);
                    setChatItem(!chatItem);
                }}
            />
            {showPopupMore && <PopupMore messContent={messContent} toggleState={toggleState} conversationId={conversation?.id} />}
        </div>
    );
}

export default ConversationItem;
