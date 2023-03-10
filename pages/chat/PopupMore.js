import React, { useState } from 'react';
import { FaExclamationTriangle, FaEyeSlash, FaPhoneAlt, FaRegBellSlash, FaUserLock, FaVideo } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import { FiLogOut } from 'react-icons/fi';

import PopupBlockChat from '../../components/SettingPageChat/PopupBlockChat/PopupBlockChat';
import PopupHideChat from '../../components/SettingPageChat/PopupHideChat/PopupHideChat';
import PopupOutGroup from '../../components/SettingPageChat/PopupOutGroup/PopupOutGroup';
import PopupReport from '../../components/SettingPageChat/PopupReport/PopupReport';
import PopupTurnOffNoti from '../../components/SettingPageChat/PopupTurnOffNoti/PopupTurnOffNoti';
import PopUpDeleteChat from '../../components/SettingPageChat/PopUpDeleteChat/PopUpDeleteChat';
import Styles from '../../styles/Chat.module.css';
import { useBoxChatContext } from '../../components/BoxChat/BoxChatContext';

const PopupMore = ({ messContent, toggleState, conversationId}) => {
    const {chatService} = useBoxChatContext()
    const [showPopupTurnOffNoti, setShowPopupTurnOffNoti] = useState(false);
    const [showPopupReport, setShowPopupReport] = useState(false);
    const [showPopupHideChat, setShowPopupHideChat] = useState(false);
    const [showPopupBlockChat, setShowPopupBlockChat] = useState(false);
    const [showPopupOutGroup, setShowPopupOutGroup] = useState(false);
    const [showPopupDeleteChat, setShowPopupDeleteChat] = useState(false)

    return (
        <div>
            <div className={Styles['arrow-top']}></div>
            <div className={Styles['more_chat__info-option']}>
                {showPopupTurnOffNoti && (
                    <PopupTurnOffNoti
                        handleClick={() => setShowPopupTurnOffNoti(!showPopupTurnOffNoti)}
                        setShowPopupTurnOffNoti={setShowPopupTurnOffNoti}
                    />
                )}
                {showPopupHideChat && (
                    <PopupHideChat
                        handleClick={() => setShowPopupHideChat(!showPopupHideChat)}
                        setShowPopupHideChat={setShowPopupHideChat}
                    />
                )}
                {showPopupBlockChat && (
                    <PopupBlockChat
                        handleClick={() => setShowPopupBlockChat(!showPopupBlockChat)}
                        setShowPopupBlockChat={setShowPopupBlockChat}
                    />
                )}
                {showPopupReport && (
                    <PopupReport handleClick={() => setShowPopupReport(!showPopupReport)} setShowPopupReport={setShowPopupReport} />
                )}
                {showPopupOutGroup && (
                    <PopupOutGroup
                        handleClick={() => setShowPopupOutGroup(!showPopupOutGroup)}
                        setShowPopupOutGroup={setShowPopupOutGroup}
                        idGroup={messContent?.conversation.id}
                    />
                )}
                {showPopupDeleteChat && (
                    <PopUpDeleteChat
                        handleClick={() => setShowPopupDeleteChat(!showPopupDeleteChat)}
                        setShowPopupDeleteChat={setShowPopupDeleteChat}
                        conversationId={conversationId}
                        chatService={chatService}
                    />
                )}
                <ul className={Styles['more_chat__info-option-list']}>
                    <li className={Styles['more_chat__info-option-item']}>
                        <FaPhoneAlt className={Styles['more_chat__info-option-icon']} />
                        <span>B???t ?????u g???i tho???i </span>
                    </li>
                    <li className={Styles['more_chat__info-option-item']}>
                        <FaVideo className={Styles['more_chat__info-option-icon']} />
                        <span>B???t ?????u g???i video </span>
                    </li>
                    <hr className={Styles['line-space']} />
                    <li className={Styles['more_chat__info-option-item']} onClick={() => setShowPopupTurnOffNoti(!showPopupTurnOffNoti)}>
                        <FaRegBellSlash className={Styles['more_chat__info-option-icon']} />
                        <span>T???t th??ng b??o </span>
                    </li>
                    <li className={Styles['more_chat__info-option-item']} onClick={() => setShowPopupHideChat(!showPopupHideChat)}>
                        <FaEyeSlash className={Styles['more_chat__info-option-icon']} />
                        <span>???n cu???c tr?? chuy???n</span>
                    </li>
                    <li className={Styles['more_chat__info-option-item']} onClick={() => setShowPopupBlockChat(!showPopupBlockChat)}>
                        <FaUserLock className={Styles['more_chat__info-option-icon']} />
                        <span>Ch???n</span>
                    </li>
                    <li className={Styles['more_chat__info-option-item']} onClick={() => setShowPopupReport(!showPopupReport)}>
                        <FaExclamationTriangle className={Styles['more_chat__info-option-icon']} />
                        <span>B??o c??o v?? h??? tr???</span>
                    </li>
                    {toggleState == 2 ? (
                        <li className={Styles['more_chat__info-option-item']} onClick={() => setShowPopupOutGroup(!showPopupOutGroup)}>
                            <FiLogOut className={Styles['more_chat__info-option-icon']} />
                            <span>R???i kh???i nh??m</span>
                        </li>
                    ) : (
                        ''
                    )}
                    <li className={Styles['more_chat__info-option-item']} onClick={() => setShowPopupDeleteChat(!showPopupDeleteChat)}>
                        <MdDeleteForever className={Styles['more_chat__info-option-icon']} />
                        <span>Xo??a cu???c tr?? chuy???n</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default PopupMore;
