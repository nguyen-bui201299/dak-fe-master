import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
     FaAngleLeft, FaExclamationTriangle, FaEyeSlash, FaLink, FaRegBellSlash, FaRegFileImage, FaRegUserCircle, FaSearch, FaSpellCheck, FaUserFriends, FaUserLock, FaUserPlus,
    FaUsers, FaBrush
} from "react-icons/fa";
import Header from "../../components/Header/Header";
import PopupBackground from "../../components/SettingPageChat/PopupBackground/PopupBackground";
import PopupBlockChat from "../../components/SettingPageChat/PopupBlockChat/PopupBlockChat";
import PopupCreateGroup from "../../components/SettingPageChat/PopupCreateGroup/PopupCreateGroup";
import PopupHideChat from "../../components/SettingPageChat/PopupHideChat/PopupHideChat";
import PopupImageFile from "../../components/SettingPageChat/PopupImageFile/PopupImageFile";
import PopupLink from "../../components/SettingPageChat/PopupLink/PopupLink";
import PopupRename from "../../components/SettingPageChat/PopupRename/PopupRename";
import PopupAddUser from "../../components/SettingPageChat/PopupAddUser/PopupAddUser";
import PopupEditNameGroup from "../../components/SettingPageChat/PopupEditNameGroup/PopupEditNameGroup";
import PopupOutGroup from "../../components/SettingPageChat/PopupOutGroup/PopupOutGroup";
import { FiLogOut } from "react-icons/fi";
import PopupReport from "../../components/SettingPageChat/PopupReport/PopupReport";
import PopupDisplayMembers from "../../components/SettingPageChat/PopupDisplayMembers/PopupDisplayMembers";
import PopupTurnOffNoti from "../../components/SettingPageChat/PopupTurnOffNoti/PopupTurnOffNoti";
import { deleteCookieUserLogin, deleteTokenUserLogin, getCookieUserLogin, getTokenUserLogin } from "../../modules/Cookies/Auth/userLogin";
import Avatar from "../../public/images/bgAvatar.jpg";
import logo from "../../public/images/Logo.png"
import Styles from "../../styles/Chat.module.css";
import Image from "next/image";
import PopupNewMessUser from "../../components/PopupNewMessUser/PopupNewMessUser";
import { BsPlusCircle } from "react-icons/bs";
import { useBoxChatContext } from "../../components/BoxChat/BoxChatContext";
import ConversationList from './ConversationList';
import CONSTANTS from '../../utils/chatConstant';
import ConversationContent from './ConvesationContent';

export default function Chat() {
    const {language, setLanguage, socket, chatService, activeConversation, setAddChatGroup} = useBoxChatContext();
    const [showPopupAddUserToGroup, setShowPopupAddUserToGroup] = useState(false);
    const [toggleState, setToggleState] = useState(1); // Set trạng thái chuyển tab của tin nhắn và group
    const [isMsgLoading, setIsMsgLoading] = useState(false);
    const [showPopupBackground, setShowPopupBackground] = useState(false);
    const [showPopupRename, setShowPopupRename] = useState(false);
    const [showPopupImageFile, setShowPopupImageFile] = useState(false);
    const [showPopupLink, setShowPopupLink] = useState(false);
    const [showPopupCreateGroup, setShowPopupCreateGroup] = useState(false);
    const [showPopupTurnOffNoti, setShowPopupTurnOffNoti] = useState(false);
    const [showPopupReport, setShowPopupReport] = useState(false);
    const [showPopupHideChat, setShowPopupHideChat] = useState(false);
    const [showPopupBlockChat, setShowPopupBlockChat] = useState(false);
    const [showPopupSearch, setShowPopupSearch] = useState(false);

    const [showPopupEditNameGroup, setShowPopupEditNameGroup] = useState(false);
    const [showPopupOutGroup, setShowPopupOutGroup] = useState(false);
    const [showPopupDisplayMembers, setShowPopupDisplayMembers] = useState(false);

    //State with conversation
    const [listConversation, setListConversation] = useState([]);
    const [searchConver, setSearchConver] = useState([]);
    const [messContent, setMessContent] = useState('');
    //Có tin nhắn mới
    const [hasNewMess, setHasNewMess] = useState([]);
    const [newMess, setNewMess] = useState([]);
    const [openMenuSetting, setOpenMenuSetting] = useState(false);
    const [content, setContent] = useState({}); //Lưu nội dung của ngôn ngữ
    const [showChangePass, setShowChangePass] = useState(false)
    // const [soundMess] = useState(typeof Audio !== "undefined" && new Audio('/sound/mess.mp3'))

    const userLogin = getCookieUserLogin();

    const [comingSoon, setComingSoon] = useState(true);

    //handle copy-paste in input
    useEffect(() => {
            const pasteText = (e)=>{
                e.preventDefault()
                let text = e.clipboardData.getData('text')
                document.execCommand('insertText', false, text)
            }
            window.addEventListener('paste',pasteText,true)
            return () =>{
                window.removeEventListener('paste',pasteText,true)
            }
    }, []);

    //Find or create a new Conversation
    const [popupFindConver, setPopupFindConver]= useState(false);

    //  Xử lý chuyển tab tin nhắn & nhóm
    const handleToggleTab = (index) => {
        setToggleState(index);
    }

    // set trạng thái mở menu setting
    const handleShowChangePass = () => {
        setShowChangePass(!showChangePass)
        setOpenMenuSetting(false)
    }

    const handleFindConversation = (value, e) => {
        if(value !== "") {
            setSearchConver(searchConver.filter(conver => conver.conversation.name.includes(value)));
        }
        if(value === null || value === '') setSearchConver(listConversation);
    }

    useEffect(() => {
        if ( !socket ) return;
        console.log( '[socket] init events' );
        socket.on("NEW_MESSAGE",(data) =>{
            setNewMess([data]);
        });
    }, [socket]);

    useEffect(() => {
        if ( !chatService ) return;
        console.log( '[chatService] init service' );

        const load = async () => {
            const conversations = await chatService.getConversationInfos({
                limit: 50, // TODO: replace by constant
                offset: 0,
                isIncludeLTMsg: true,
            });

            setListConversation(conversations);
            setSearchConver(conversations);
        };

        load();
    }, [chatService]);

    // useEffect(() => {
    //     if(newMess.length > 0){
    //         handleNewMess(newMess[0]);
    //         soundMess.play();
    //     }
    // },[newMess]);

    useEffect(() => {
        if(messContent){
            //huy su kien enter xuong dong cua input
            document.getElementById("editor").addEventListener('keydown' , e =>{
                if(e.key === "Enter"){
                    e.preventDefault();
                }
            })
        }
    },[messContent]);

    useEffect(() => {
        if(language){
            setContent(require(`./languages/${language}.json`));
        }
    }, [language]);

    useEffect(() => {
        if (userLogin.mode !== undefined) {
            if (userLogin.mode === "dark") {
              document.documentElement.setAttribute("data-theme", "dark");
              window.localStorage.setItem("theme", "dark");
            } else {
              document.documentElement.removeAttribute("data-theme", "light");
              window.localStorage.setItem("theme", "light");
            }
          }

        if(userLogin.active === 0 || userLogin.deleted) {
            deleteCookieUserLogin();
            deleteTokenUserLogin();
            deleteRefreshToken();
            deleteXsrfToken();
            deleteChatToken();
            location.replace('/login');
        }
  }, []);

    return (
        <>
            <Head>
                <title>{content && content.chat_title}</title>
                <meta name="description" content="Build demo website version2" />
                <link rel="stylesheet" href="/css/global.css" />
                <link rel="stylesheet" href="/css/style.css" />
                <link rel="shortcut icon" href={logo.src} />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
                integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA=="
                crossOrigin="anonymous" referrerPolicy="no-referrer" />
            </Head>
            <Header/>
            {/* ${Styles["loadMess"]} */}
            <div className={`${Styles["chat__box"]} ${isMsgLoading ? Styles["loadMess"] : ''}`}>
                {/* Box Left */}
                <div className={Styles["chat__box-left"]}>
                    <div className={Styles["chat__box-left-heading"]}>
                        <div className={Styles["chat__box-title"]}>
                            <h2 className={Styles["chat__title"]}>{content && content.chat_message}</h2>
                            <ul className={Styles["chat__create-list"]}>
                                <li className={Styles["chat__create-item"]} onClick={()=>setPopupFindConver(true)}>
                                    <FaUserPlus className={Styles["chat__create-icon"]} />
                                    <span className={Styles["tooltip__create"]} >
                                        {content && content.chat_new_message}
                                    </span>
                                </li>
                                {
                                    !comingSoon ?
                                    <li className={Styles["chat__create-item"]} onClick={()=>setShowPopupCreateGroup(!showPopupCreateGroup)}>
                                        <FaUsers className={Styles["chat__create-icon"]} />
                                        {<span className={Styles["tooltip__create"]}>
                                            {content && content.chat_create_group}
                                        </span>}
                                    </li>
                                :
                                // Chưa deploy
                                    <li className={Styles["chat__create-item"]}>
                                        <FaUsers className={Styles["chat__create-icon"]} />
                                        {<span className={Styles["tooltip__create"]}>
                                            COMING SOON
                                        </span>}
                                    </li>
                                }
                            </ul>
                        </div>
                        <form action="" className={Styles["chat__form-group"]}>
                            <input type="text" className={Styles["chat__form-input"]} onChange={(e) =>handleFindConversation(e.target.value)} placeholder={content && content.chat_search_placeholder}/>
                            <FaSearch className={Styles["chat__icon-search"]} />
                        </form>
                    </div>
                    <div className={Styles["chat__box-left-body"]}>
                        <ul className={Styles["chat__nav-list"]}>
                            <li
                                className={`${Styles["chat__nav-item"]} ${toggleState === 1 ? Styles["active"] : ''}`}
                                onClick={() => handleToggleTab(1)}
                            >
                                {content && content.chat_message}
                                {/* Thêm class ${Styles["active"]} để bật tick đỏ khi có tin nhắn chưa đọc */}
                                <span className={`${Styles["chat__noti"]} ${ hasNewMess.length > 0  ? Styles["active"] : ''}`}></span>
                            </li>
                            {
                                !comingSoon ?
                                <li
                                    className={`${Styles["chat__nav-item"]} ${toggleState === 2 ? Styles["active"] : ''}`}
                                    onClick={() => handleToggleTab(2)}
                                >
                                    {content && content.chat_group}
                                    <span className={`${Styles["chat__noti"]}`}></span>
                                </li>
                                :
                                // Chưa deploy
                                <li
                                    className={Styles["chat__nav-item"]} style={{bacground: "transparent"}}
                                >
                                    COMING SOON
                                </li>
                            }
                        </ul>
                        <ConversationList
                            type={CONSTANTS.CONVERSATION.TYPE.INDIVIDUAL}
                            toggleState={toggleState}
                        />
                        <ConversationList
                            type={CONSTANTS.CONVERSATION.TYPE.GROUP}
                            toggleState={toggleState}
                        />
                    </div>
                </div>
                {popupFindConver &&
                    <PopupNewMessUser
                    setPopupFindConver={setPopupFindConver}
                    content={content}
                    setMessContent={setMessContent}
                    setListConversation={setListConversation}
                    setSearchConver={setSearchConver}
                    listConversation={listConversation}
                    chatService={chatService}
                />}
                {/* Box Content */}
                <ConversationContent
                    isMsgLoading={isMsgLoading}
                    setIsMsgLoading={setIsMsgLoading}
                    showPopupSearch={showPopupSearch}
                    setShowPopupSearch={setShowPopupSearch}
                    content={content}
				/>
                {/* Box Right */}
                {showPopupBackground && <PopupBackground
                    handleClick={() => setShowPopupBackground(!showPopupBackground)}
                    setShowPopupBackground={setShowPopupBackground}
                />}
                {showPopupRename && <PopupRename
                    handleClick={() => setShowPopupRename(!showPopupRename)}
                    setShowPopupRename={setShowPopupRename}
                    messContent={messContent}
                    userLogin={userLogin}
                />}

                {showPopupEditNameGroup && <PopupEditNameGroup
                    handleClick={() => setShowPopupEditNameGroup(!showPopupEditNameGroup)}
                    setShowPopupEditNameGroup={setShowPopupEditNameGroup}
                    messContent={messContent}
                />}

                {showPopupOutGroup && <PopupOutGroup
                    handleClick={() => setShowPopupOutGroup(!showPopupOutGroup)}
                    setShowPopupOutGroup={setShowPopupOutGroup}
                    idGroup={activeConversation.id}
                />}
                {
                    showPopupDisplayMembers && <PopupDisplayMembers
                    handleClick={() => setShowPopupDisplayMembers(!showPopupDisplayMembers)}
                    setShowPopupDisplayMembers={setShowPopupDisplayMembers}
                    messContent={messContent}
                    setShowPopupOutGroup={setShowPopupOutGroup}
                />}
                {showPopupCreateGroup && <PopupCreateGroup
                    content={content}
                    handleClick={() => setShowPopupCreateGroup(!showPopupCreateGroup)}
                    setShowPopupCreateGroup={setShowPopupCreateGroup}
                    setListConversation={setListConversation}
                    setSearchConver={setSearchConver}
                    userCreate={userLogin}
                    handleToggleTab={handleToggleTab}
                    setMessContent={setMessContent}
                    setAddChatGroup={setAddChatGroup}
                />}
                {showPopupAddUserToGroup && <PopupAddUser
                    handleClick={() => setShowPopupAddUserToGroup(!showPopupAddUserToGroup)}
                    setShowPopupAddUserToGroup={setShowPopupAddUserToGroup}
                    handleToggleTab={handleToggleTab}
                    membergroup={activeConversation.member}
                    idGroup={activeConversation.id}
                />}
                {showPopupImageFile && <PopupImageFile
                    handleClick={() => setShowPopupImageFile(!showPopupImageFile)}
                    setShowPopupImageFile={setShowPopupImageFile}
                />}
                {showPopupLink && <PopupLink
                    handleClick={() => setShowPopupLink(!showPopupLink)}
                    setShowPopupLink={setShowPopupLink}
                />}
                {showPopupTurnOffNoti && <PopupTurnOffNoti
                    handleClick={() => setShowPopupTurnOffNoti(!showPopupTurnOffNoti)}
                    setShowPopupTurnOffNoti={setShowPopupTurnOffNoti}
                />}
                {showPopupHideChat && <PopupHideChat
                    handleClick={() => setShowPopupHideChat(!showPopupHideChat)}
                    setShowPopupHideChat={setShowPopupHideChat}
                />}
                {showPopupBlockChat && <PopupBlockChat
                    handleClick={() => setShowPopupBlockChat(!showPopupBlockChat)}
                    setShowPopupBlockChat={setShowPopupBlockChat}
                />}
                {showPopupReport && <PopupReport
                    handleClick={() => setShowPopupReport(!showPopupReport)}
                    setShowPopupReport={setShowPopupReport}
                />}
                <input type="checkbox" className={Styles["tab-info"]} id="show-tab-info"/>
                <label htmlFor="show-tab-info" className={Styles["tab-info-overlay"]}></label>
                <div className={Styles["chat__box-right"]}>
                {
                    toggleState === 1 &&
                    <>
                        <div className={Styles["chat__box-right-heading"]}>
                            <label htmlFor="show-tab-info">
                                <FaAngleLeft  className={Styles["chat__box-icon-back"]}/>
                            </label>
                            <div className={Styles["chat__info-avatar"]}>
                                {   
                                    activeConversation?.avatar ?
                                    <picture>
                                        <img src={activeConversation.avatar} alt="Avatar" style={{objectFit: "cover", width: "100%", height: "100%"}}/>
                                    </picture>:
                                    <img src={Avatar.src} alt="Avatar"/>
                                }
                            </div>
                            <h3 className={Styles["chat__info-name"]}>{activeConversation?.name}</h3>
                            <p className={`${Styles["chat__info-time-onl"]} ${Styles["show"]}`}>{content && content.chat_active}</p>
                            <p className={`${Styles["chat__info-time-off"]}`}>Hoạt động 30 phút trước</p>
                            <div className={Styles["chat__info-button"]}>
                                <div className={Styles["chat__info-btn"]}>
                                    <Link href={`/otherprofile/${activeConversation?.id}`}>
                                        <a className={Styles["chat__info-btn-link"]}>
                                            <FaRegUserCircle className={Styles["chat__info-icon"]}/>
                                            <span>Xem trang cá nhân</span>
                                        </a>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className={Styles["chat__box-right-body"]}>
                            <div className={Styles["chat__info-option"]}>
                                <h4 className={Styles["chat__info-title"]}>{content && content.chat_custom_message}</h4>
                                <ul className={Styles["chat__info-option-list"]}>
                                    <li className={Styles["chat__info-option-item"]} onClick={() => setShowPopupBackground(!showPopupBackground)}>
                                        <FaBrush className={Styles["chat__info-option-icon"]}/>
                                        <span>{content && content.chat_change_background}</span>
                                    </li>
                                    <li className={Styles["chat__info-option-item"]} onClick={() => setShowPopupRename(!showPopupRename)}>
                                        <FaSpellCheck className={Styles["chat__info-option-icon"]}/>
                                        <span>{content && content.chat_edit_nickname}</span>
                                    </li>
                                </ul>
                            </div>

                            <div className={Styles["chat__info-option"]}>
                                <h4 className={Styles["chat__info-title"]}>{content && content.chat_other_custom}</h4>
                                <ul className={Styles["chat__info-option-list"]}>
                                    <li className={Styles["chat__info-option-item"]} onClick={() => setShowPopupCreateGroup(!showPopupCreateGroup)}>
                                        <FaUsers className={Styles["chat__info-option-icon"]}/>
                                        <span>{content && content.chat_create_group_user}</span>
                                    </li>
                                    <li className={Styles["chat__info-option-item"]} onClick={() => setShowPopupImageFile(!showPopupImageFile)}>
                                        <FaRegFileImage className={Styles["chat__info-option-icon"]}/>
                                        <span>{content && content.chat_photo_file}</span>
                                    </li>
                                    <li className={Styles["chat__info-option-item"]} onClick={() => setShowPopupLink(!showPopupLink)}>
                                        <FaLink className={Styles["chat__info-option-icon"]}/>
                                        <span>{content && content.chat_link}</span>
                                    </li>
                                    <li className={Styles["chat__info-option-item"]} onClick={() => setShowPopupSearch(!showPopupSearch)}>
                                        <FaSearch className={Styles["chat__info-option-icon"]}/>
                                        <span>{content && content.chat_search}</span>
                                    </li>
                                </ul>
                            </div>

                            <div className={Styles["chat__info-option"]}>
                                <h4 className={Styles["chat__info-title"]}>{content && content.chat_privacy_support}</h4>
                                <ul className={Styles["chat__info-option-list"]}>
                                    <li className={Styles["chat__info-option-item"]} onClick={() => setShowPopupTurnOffNoti(!showPopupTurnOffNoti)}>
                                        <FaRegBellSlash className={Styles["chat__info-option-icon"]}/>
                                        <span>{content && content.chat_off_notification}</span>
                                    </li>
                                    <li className={Styles["chat__info-option-item"]} onClick={() => setShowPopupHideChat(!showPopupHideChat)}>
                                        <FaEyeSlash className={Styles["chat__info-option-icon"]}/>
                                        <span>{content && content.chat_hide_chat}</span>
                                    </li>
                                    <li className={Styles["chat__info-option-item"]} onClick={() => setShowPopupBlockChat(!showPopupBlockChat)}>
                                        <FaUserLock className={Styles["chat__info-option-icon"]}/>
                                        <span>{content && content.chat_block}</span>
                                    </li>
                                    <li className={Styles["chat__info-option-item"]} onClick={() => setShowPopupReport(!showPopupReport)}>
                                        <FaExclamationTriangle className={Styles["chat__info-option-icon"]}/>
                                        <span>{content && content.chat_report_support}</span>
                                    </li>
                                </ul>
                            </div>
                            {showPopupTurnOffNoti && <PopupTurnOffNoti
                                handleClick={() => setShowPopupTurnOffNoti(!showPopupTurnOffNoti)}
                                setShowPopupTurnOffNoti={setShowPopupTurnOffNoti}
                            />}
                            {showPopupHideChat && <PopupHideChat
                                handleClick={() => setShowPopupHideChat(!showPopupHideChat)}
                                setShowPopupHideChat={setShowPopupHideChat}
                            />}
                            {showPopupBlockChat && <PopupBlockChat
                                handleClick={() => setShowPopupBlockChat(!showPopupBlockChat)}
                                setShowPopupBlockChat={setShowPopupBlockChat}
                            />}
                            {showPopupReport && <PopupReport
                                handleClick={() => setShowPopupReport(!showPopupReport)}
                                setShowPopupReport={setShowPopupReport}
                            />}
                        </div>
                    </>
                }
                {
                    toggleState === 2 &&
                    <>
                        <div className={Styles["chat__box-right-heading"]}>
                            <label htmlFor="show-tab-info">
                                <FaAngleLeft  className={Styles["chat__box-icon-back"]}/>
                            </label>
                            <div className={Styles["chat__info-avatar"]}>
                                {
                                    activeConversation?.avatar ?
                                    <picture>
                                        <img src={activeConversation?.avatar} alt="Avatar" style={{objectFit: "cover", width: "100%", height: "100%"}}/>
                                    </picture>:
                                    <img src={Avatar.src} alt="Avatar"/>
                                }
                            </div>
                            <h3 className={Styles["chat__info-name"]}>{activeConversation?.name}</h3>
                            {/* Thêm class ${Styles["show"]} để hiện đang hoạt động hoặc hoạt động bao nhiêu phút trước */}
                            <p className={`${Styles["chat__info-time-onl"]} ${Styles["show"]}`}>{content && content.chat_active}</p>
                            <p className={`${Styles["chat__info-time-off"]}`}>Hoạt động 30 phút trước</p>
                            <div className={Styles["chat__info-button"]}>
                                <div className={Styles["chat__info-btn"]}>
                                    {/* <Link href="#"> */}
                                        <a className={Styles["chat__info-btn-link"]} type='button' onClick={() => setShowPopupEditNameGroup(!showPopupEditNameGroup)}>
                                            <FaSpellCheck className={Styles["chat__info-icon"]}/>
                                            <span>{content && content.chat_edit_namegroup}</span>
                                        </a>
                                    {/* </Link> */}
                                </div>
                            </div>
                        </div>
                        <div className={Styles["chat__box-right-body"]}>
                            <div className={Styles["chat__info-option"]}>
                                <h4 className={Styles["chat__info-title"]}>{content && content.chat_custom_message}</h4>
                                <ul className={Styles["chat__info-option-list"]}>
                                    <li className={Styles["chat__info-option-item"]} onClick={() => setShowPopupBackground(!showPopupBackground)}>
                                        <FaBrush className={Styles["chat__info-option-icon"]}/>
                                        <span>{content && content.chat_change_background}</span>
                                    </li>
                                    <li className={Styles["chat__info-option-item"]} onClick={() => setShowPopupDisplayMembers(!showPopupDisplayMembers)}>
                                        <FaUserFriends className={Styles["chat__info-option-icon"]}/>
                                        <span>{content && content.chat_members}</span>
                                    </li>
                                    <li className={Styles["chat__info-option-item"]} onClick={() => setShowPopupRename(!showPopupRename)}>
                                        <FaSpellCheck className={Styles["chat__info-option-icon"]}/>
                                        <span>{content && content.chat_edit_nickname}</span>
                                    </li>
                                    <li className={Styles["chat__info-option-item"]} onClick={() => setShowPopupAddUserToGroup(!showPopupAddUserToGroup)}>
                                        <BsPlusCircle className={Styles["chat__info-option-icon"]}/>
                                        <span>{content && content.chat_add_user}</span>
                                    </li>
                                </ul>
                            </div>

                            <div className={Styles["chat__info-option"]}>
                                <h4 className={Styles["chat__info-title"]}>{content && content.chat_other_custom}</h4>
                                <ul className={Styles["chat__info-option-list"]}>
                                    <li className={Styles["chat__info-option-item"]} onClick={() => setShowPopupImageFile(!showPopupImageFile)}>
                                        <FaRegFileImage className={Styles["chat__info-option-icon"]}/>
                                        <span>{content && content.chat_photo_file}</span>
                                    </li>
                                    <li className={Styles["chat__info-option-item"]} onClick={() => setShowPopupLink(!showPopupLink)}>
                                        <FaLink className={Styles["chat__info-option-icon"]}/>
                                        <span>{content && content.chat_link}</span>
                                    </li>
                                    <li className={Styles["chat__info-option-item"]} onClick={() => setShowPopupSearch(!showPopupSearch)}>
                                        <FaSearch className={Styles["chat__info-option-icon"]}/>
                                        <span>{content && content.chat_search_placeholder}</span>
                                    </li>
                                </ul>
                            </div>

                            <div className={Styles["chat__info-option"]}>
                                <h4 className={Styles["chat__info-title"]}>{content && content.chat_privacy_support}</h4>
                                <ul className={Styles["chat__info-option-list"]}>
                                    <li className={Styles["chat__info-option-item"]} onClick={() => setShowPopupTurnOffNoti(!showPopupTurnOffNoti)}>
                                        <FaRegBellSlash className={Styles["chat__info-option-icon"]}/>
                                        <span>{content && content.chat_off_notification}</span>
                                    </li>
                                    <li className={Styles["chat__info-option-item"]} onClick={() => setShowPopupHideChat(!showPopupHideChat)}>
                                        <FaEyeSlash className={Styles["chat__info-option-icon"]}/>
                                        <span>{content && content.chat_hide_chat}</span>
                                    </li>
                                    <li className={Styles["chat__info-option-item"]} onClick={() => setShowPopupBlockChat(!showPopupBlockChat)}>
                                        <FaUserLock className={Styles["chat__info-option-icon"]}/>
                                        <span>{content && content.chat_block}</span>
                                    </li>
                                    <li className={Styles["chat__info-option-item"]} onClick={() => setShowPopupReport(!showPopupReport)}>
                                        <FaExclamationTriangle className={Styles["chat__info-option-icon"]}/>
                                        <span>{content && content.chat_report_support}</span>
                                    </li>
                                    <li className={Styles["chat__info-option-item"]} onClick={() => setShowPopupOutGroup(!showPopupOutGroup)}>
                                        <FiLogOut className={Styles["chat__info-option-icon"]}/>
                                        <span>{content && content.chat_out_group}</span>
                                    </li>
                                </ul>
                            </div>
                            {showPopupTurnOffNoti && <PopupTurnOffNoti
                                handleClick={() => setShowPopupTurnOffNoti(!showPopupTurnOffNoti)}
                                setShowPopupTurnOffNoti={setShowPopupTurnOffNoti}
                            />}
                            {showPopupHideChat && <PopupHideChat
                                handleClick={() => setShowPopupHideChat(!showPopupHideChat)}
                                setShowPopupHideChat={setShowPopupHideChat}
                            />}
                            {showPopupBlockChat && <PopupBlockChat
                                handleClick={() => setShowPopupBlockChat(!showPopupBlockChat)}
                                setShowPopupBlockChat={setShowPopupBlockChat}
                            />}
                            {showPopupReport && <PopupReport
                                handleClick={() => setShowPopupReport(!showPopupReport)}
                                setShowPopupReport={setShowPopupReport}
                            />}
                        </div>
                    </>
                }
                </div>
            </div>
        </>
    )
}
