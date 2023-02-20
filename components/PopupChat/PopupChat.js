import Styles from "./PopupChat.module.css";
import {useState, useEffect} from 'react';
import { FaSearch, FaEllipsisH } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import Avatar from "../../public/images/bgAvatar.jpg";
import { useRef } from "react";
import { useBoxChatContext } from '../BoxChat/BoxChatContext';
import mapTime from "../../modules/Time/mapTime";
import moment from 'moment/moment';
import Router from "next/router";
import { getCookieUserLogin } from "../../modules/Cookies/Auth/userLogin";

export default function PopupChat({ setShowPopupChat, showPopupChat }) {
    const {setBoxChat, boxchat, change, setActiveConversation, updateConversationState,
        setShowNewMessMiniChat, conversations, deleteBoxChat, setChange, toggleBoxChat} 
        = useBoxChatContext();

    const userLogin = getCookieUserLogin()

    const [listConversation, setListConversation] = useState('');
    const [searchConver, setSearchConver] = useState();

    const popupChatRef = useRef();
    const closePopupChat = e => {
        if (popupChatRef.current === e.target) {
            setShowPopupChat(false);
        }
    };
    
    const handleFindConversation = (e) => {

        if(e.target.value !== "") {
            setSearchConver(searchConver.filter(conver => conver.conversation.name.includes(e.target.value)));
        }
        if(e.target.value === null || e.target.value === '') setSearchConver(listConversation);
      }

    function removeAccents(str) {
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D');
    }

    function handleSearch(name) {
        if (name == '') {
            setSearchConver(listConversation);
        } else {
            var arr = [];
            for (let index = 0; index < listConversation.length; index++) {
                var element = listConversation[index];
                // console.log(element);
                if (removeAccents(element.conversation.name).toUpperCase().indexOf(removeAccents(name).toUpperCase()) > -1) {
                    // console.log('ok');
                    arr.push(element);
                }
            }
            setSearchConver(arr);
            // console.log(arr);
        }
    }

    return (
        <div >
            <div className={Styles["overlayPopupChat"]} ref={popupChatRef} onClick={closePopupChat} >
                <div className={`${Styles["popupchat"]}`}>
                    <div className={Styles['popupchat__heading-body']}>
                        <div className={Styles["popupchat__heading"]}>
                            <h3 className={Styles["popupchat__title"]}>Tin nhắn</h3>
                            <div className={Styles["popupchat__form-control"]}>
                                <input className={Styles["popupchat__form-input"]} onChange={(e)=>handleSearch(e.target.value)} placeholder="Nhập tên cuộc trò chuyện" type="text"/>
                                <FaSearch className={Styles["popupchat__form-icon"]}/>
                            </div>
                        </div>
                        <ul className={Styles["popupchat__body-list"]}>
                            {conversations && conversations.map((conver, index)=>(
                                <PopupChatItem key={index} index={index} conver={conver} setBoxChat={setBoxChat}
                                boxchat={boxchat} setShowPopupChat={setShowPopupChat} setChangeChatNoti={setChange}
                                change={change} setShowNewMessMiniChat={setShowNewMessMiniChat} setActiveConversation={setActiveConversation}
                                updateConversationState={updateConversationState} toggleBoxChat={toggleBoxChat} userLogin={userLogin}
                                />
                            ))}
                        </ul>
                    </div>
                    <div className={Styles["popupchat__footer"]}>
                        <p className={Styles["popupchat__footer-title"]} onClick={deleteBoxChat}>
                            <Link href="/chat">
                                <a>Xem tất cả ở Tin nhắn</a>
                            </Link>
                        </p>
                    </div>
                    {/* <BoxChat boxchat={boxchat} /> */}
                </div>
            </div>
        </div>
    )
}

export function PopupChatItem({conver, index, setBoxChat, boxchat, setShowPopupChat, setChangeChatNoti, change, updateConversationState, setActiveConversation, toggleBoxChat, userLogin, allUserObj}) {

    const [isMobile, setIsMobile] = useState(false);
    const [displayLatestMsg, setDisplayLatestMsg] = useState({});

    useEffect(() => {
        const handleMobile = () => {
            if(window.innerWidth <= 720) {
                setIsMobile(false);
            }
            else {
                setIsMobile(true);
            }
        }
        handleMobile();
        window.addEventListener("resize", handleMobile)
        return () => {
            window.removeEventListener("resize", handleMobile)
        }
    }, [])

    const handleOpenPopupChat = () => {
        if(isMobile) {
            var arr = boxchat;
            var arrNew= arr.filter(item => item?.id !== conver?.id);
            arrNew.push(conver)
            setBoxChat(arrNew)
            setShowPopupChat(false);
            setChangeChatNoti(!change);
            setActiveConversation(conver)
            updateConversationState(conver.id,  { unReadMsgCount: 0 })
            toggleBoxChat()
        }
        else {
            Router.push('/chat');
        }
    }

    let displayContentMess ;
    let messData = conver;
    if(messData != '' && messData.createdBy === userLogin.id){
        displayContentMess = "Bạn : "
        if(messData?.latestMessage?.content.slice(0,4) =="<img"){
            displayContentMess += "Đã gửi 1 ảnh!"
        }
        else{
            displayContentMess +=  messData?.latestMessage?.content.includes("<div>") ? messData?.latestMessage?.content.split("<div>")[0].replaceAll('&nbsp;',' ') : messData?.latestMessage?.content.split("<br>")[0].replaceAll('&nbsp;',' ')
        }
    }
    else if(messData != '' && messData?.createdBy !== userLogin.id){
        displayContentMess ="Bạn của bạn: "
        if(messData?.latestMessage?.content.slice(0,4) =="<img"){
            displayContentMess += "Đã gửi 1 ảnh!"
        }
        else{
            displayContentMess +=  messData?.latestMessage?.content.includes("<div>") ? messData?.latestMessage?.content.split("<div>")[0].replaceAll('&nbsp;',' ') : messData?.latestMessage?.content.split("<br>")[0].replaceAll('&nbsp;',' ')
        }
    }

    // useEffect(() => {
    //     if (!conver || !conver.latestMessage) return;

    //     const { createdBy, content, createdAt } = conver?.latestMessage;
    //     let displayContentMess = createdBy === userLogin.id
    //         ? 'Bạn : '
    //         : allUserObj[createdBy]?.username + ': ';

    //     displayContentMess +=
    //         content.slice(0, 4) == '<img'
    //             ? 'Đã gửi 1 ảnh!'
    //             : content.includes('<div>')
    //             ? content.split('<div>')[0].replaceAll('&nbsp;', ' ')
    //             : content.split('<br>')[0].replaceAll('&nbsp;', ' ');

    //     setDisplayLatestMsg({ createdAt, displayContentMess });
    // }, [conver, allUserObj, userLogin]);
    return (
        <>
            <li className={`${Styles["popupchat__body-item"]}`} key={index}
            onClick={handleOpenPopupChat}>
                <div className={Styles["popupchat__body-item-avatar"]}>
                {
                    conver?.avatar ?
                    <img src='https://picsum.photos/100' alt="Avatar" style={{objectFit: "cover", width: "100%", height: "100%"}}/>:
                    <Image src={Avatar} alt="Avatar"/>
                }
                </div>
                <div className={Styles["popupchat__body-item-content"]}>
                    <h3 className={Styles["popupchat__body-item-name"]}>
                       {conver.name}
                        <span className={Styles["popupchat__body-item-time"]}>{moment(displayLatestMsg.createdAt).format("LT")}</span>
                    </h3>
                    <p className={Styles["popupchat__body-item-chat"]}>
                        { displayContentMess != '' &&  displayContentMess}
                    </p>
                </div>
                <div className={Styles["popupchat__body-item-viewer"]}>
                {
                    conver?.avatar ?
                    <img src='https://picsum.photos/100' alt="Avatar" style={{objectFit: "cover", width: "100%", height: "100%"}}/>:
                    <Image src={Avatar} alt="Avatar"/>
                }
                </div>
                <FaEllipsisH className={Styles["popupchat__icon-more-option"]}/>
            </li>
        </>
    )
}