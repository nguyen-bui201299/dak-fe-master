import { useEffect, useRef, useState, useCallback } from 'react';
import {
    FaAngleDown,
    FaAngleLeft,
    FaAngleUp,
    FaHeart,
    FaImages,
    FaInfoCircle,
    FaPhoneAlt,
    FaRegFileAlt,
    FaRegGrinBeam,
    FaRegPaperPlane,
    FaRegTimesCircle,
    FaSearch,
    FaVideo,
} from 'react-icons/fa';

import { TiDeleteOutline } from 'react-icons/ti';

import Avatar from '../../public/images/bgAvatar.jpg';
import Styles from '../../styles/Chat.module.css';
import Image from 'next/image';
import dynamic from 'next/dynamic';


import { useBoxChatContext } from '../../components/BoxChat/BoxChatContext';
import MessReceived from './ContentMessages/MessReceived';
import MessViewed from './ContentMessages/MessViewed';
import UploadService from '../../services/chat/upload.service';
import { linkify } from '../../utils/chatUrl';
import { useConversationContext } from '../../components/BoxChat/ConversationContext';
import { getTokenUserLogin } from '../../modules/Cookies/Auth/userLogin';

import API, { endpoints, headers } from '../../API';
import axios from 'axios';
import { io } from 'socket.io-client';
import { NotificationToast } from '../../modules/Notification/Notification';

const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });


const ConversationContent = ({ isMsgLoading, setIsMsgLoading, showPopupSearch, setShowPopupSearch, content }) => {
    // const scrollBoxChatRef = useRef();
    // const currentScrollYBoxChatPosition = useRef();
    // const [loadingBoxChatPos, setLoadingBoxChatPos] = useState(currentScrollYBoxChatPosition.current)
    const { activeConversation, activeMessages, userLogin, allUserObj } = useBoxChatContext();
    const { sendMessage, emitTypingOn, emitTypingOff, videoCall, audioCall } = useConversationContext();

    // Set limit render message -- Negative for counting from end to start (top)
    const [limitMessages, setLimitMessages] = useState(Math.abs(20) * -1)
    const [loadingVisionable, setLoadingVisionable] = useState(false)

    // const handleOnScrollBoxChat = () => {
    //     const scrollTop = scrollBoxChatRef.current.scrollTop
    //     currentScrollYBoxChatPosition.current = scrollTop;
    //     console.log("Current Scrolling: ", currentScrollYBoxChatPosition.current)
    //     console.log("scrollBoxChatRef: ", scrollBoxChatRef.current)

    //     if (currentScrollYBoxChatPosition.current === 0) {

    //     }
    // }

    const handleOnLoadingMsg = useCallback(() => {
        if (activeMessages) {
            if (limitMessages > (Math.abs(activeMessages.length) * -1)) {
                console.log(limitMessages < activeMessages.length)
                setLimitMessages(prev => prev - 10)
            }else if (limitMessages <= (Math.abs(activeMessages.length) * -1)) {
                console.log("Message is limited")
                let temp = activeMessages.length - limitMessages;
                setLimitMessages(limitMessages - temp)
                setLoadingVisionable(true)
            }
        }
    },[activeMessages, limitMessages])

    //input image
    const [image, setImage] = useState();
    const [isMobile, setIsMobile] = useState(false);
    const [activePlaceholder, setActivePlaceholder] = useState(true);
    const selectIcon = useRef(true);
    const [showPicker, setShowPicker] = useState(false);
    const [mess, setMess] = useState('');
    // render emoji
    const menuRef = useRef();
    const messageRef = useRef(); // Biến set giá trị vị trí cho tin nhắn
    //catch event change image
    const handleImage = (e) => {
        setImage(e.target.files[0]);
    };
    const handleCloseImg = () => {
        setImage(null);
    };
    const handleBackIcon = (item) => {
        setIsMsgLoading(!isMsgLoading);
        // setMessContent(item);
        // const indexMess = hasNewMess.findIndex((prev) => prev.id === item.conversation.id);
        // if (indexMess >= 0) {
        //     setHasNewMess((prev2) => prev2.filter((prev3) => prev3.id !== item.conversation.id));
        // }
    };

    // Gọi cho người khác, gọi cho nhóm (nếu nhóm có ít hơn 10 thành viên)
    // let numOfMember = messContent?.conversation?.member.length;
    const handleCall = (e, isVideoCall) => {
        e.preventDefault();
        if ( isVideoCall ) {
            videoCall();
        } else {
            audioCall();
        }
    };
    // Add emoji at any position in the input
    const handleEmoji = (event, emojiObject) => {
        const editor = document.getElementById('editor');

        pasteHtmlAtCaret(`${emojiObject.emoji}`, editor);
        setMess(document.getElementById('editor').innerHTML);
    };
    // Chon vi tri tro chuot de add icon
    function pasteHtmlAtCaret(html, editor) {
        editor.focus();
        let sel = window.getSelection();
        if (window.getSelection) {
            // IE9 and non-IE
            if (sel.getRangeAt && sel.rangeCount) {
                var range = sel.getRangeAt(0);
                //
                if (selectIcon.current === true) {
                    range.selectNodeContents(editor);
                    range.collapse(false);
                }
                const el = document.createElement('div');
                el.innerHTML = html;
                let frag = document.createDocumentFragment(),
                    node,
                    lastNode;
                while ((node = el.firstChild)) {
                    lastNode = frag.appendChild(node);
                }
                range.insertNode(frag);
                if (lastNode) {
                    range = range.cloneRange();
                    range.setStartAfter(lastNode);
                    if (selectIcon.current === false) {
                        range.collapse(true);
                    }
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        } else if (document.selection && document.selection.type != 'Control') {
            // IE < 9
            document.selection.createRange().pasteHTML(html);
        }
        selectIcon.current = false;
    }
    //Handle on change editor
    const handleEditor = (e) => {
        emitTypingOn();
        if(e.target.innerText.trim() === "") {
            setMess("");
            return;
        }
        if (e.target.innerText.slice(0, 6) !== '&nbsp;') {
            setMess(e.target.innerText);
        } else {
            e.target.innerText = '';
        }
    };
    //catch breakline and submit content
    const handleBreakLine = (event, type) => {
        if (event.key === 'Enter' && event.shiftKey) {
            event.preventDefault();
            setMess(mess + "<br/>")
        } else if (event.key === 'Enter') {
            event.preventDefault();
            if (mess || image) {
                handleSubmit()
            }
        }
    };

    // Xử lý khi click button send hoặc nhấn Enter để gửi
    const handleSubmit = async () => {
        const arrMess = mess.split("\n")
        arrMess.pop()
        mess = arrMess.join("<br>")
        var data = new FormData();
        data.append('files', image);
        if(image !== undefined) {
            API.get(endpoints.getTokenUpload, {
                headers: headers.headers_token,
            })
            .then((res) => {
                if(res.data.success) {
                    var config = {
                      method: 'post',
                      url: 'https://storage.dakshow.com/api/upload',
                      headers: { 
                        'Authorization': `Bearer ${res.data.token} `
                      },
                      data : data
                    };
            
                    axios(config)
                    .then((res2) => {
                        if(res2.data.success) {
                            sendMessage({
                                type: 3,
                                content: mess
                                    ? `${mess} <img src='${res2.data.data.img}' alt='Image' width='100%'/>`
                                    : `<img src='${res2.data.data.img}' alt='Image' width='100%'/>`,
                                // send_to: messContent.conversation.member,
                                // message_data_id: messContent.message_data.id,
                            });
                        }
                    
                    })
                    .catch((err2) => {})
                }
            })
            .catch((err) => {})
        } else {
            sendMessage({
                content: mess,
                // send_to: messContent.conversation.member,
                // message_data_id: messContent.message_data.id,
            });
        }

        // const listUrl = mess.match(urlRegex) || [];
        // let displayMess;
        // if (mess && !image) {
        //     displayMess = mess;
        // } else if (image && !mess) {
        //     displayMess = `<img src ='${URL.createObjectURL(image)}' alt ='Image' width='100%'/>`;
        // } else {
        //     displayMess = `${mess} <br> <img src ='${URL.createObjectURL(image)}' alt ='Image' width='100%'/>`;
        // }
        // const messdata = {
        //     content: displayMess,
        //     time: new Date().getTime(),
        //     link: listUrl,
        // };
        // messContent.message_data.data.push(messdata);
        setMess('');
        setImage();
        document.getElementById('editor').innerHTML = '';
    };

    useEffect(() => {
        const handleMobile = () => {
            if (window.innerWidth <= 720) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
        };
        handleMobile();
        window.addEventListener('resize', handleMobile);
        return () => {
            window.removeEventListener('resize', handleMobile);
        };
    }, []);

    useEffect(() => {
        if (mess === '' || mess === '<br>') {
            setActivePlaceholder(true);
        } else {
            setActivePlaceholder(false);
        }
    }, [mess]);
    useEffect(() => {
        if (image) {
            setActivePlaceholder(false);
        } else {
            setActivePlaceholder(true);
        }
    }, [image]);
    useEffect(() => {
        if (showPicker === false) {
            selectIcon.current = true;
        }
    }, [showPicker]);
    // Click outside to close Emoji
    useEffect(() => {
        let handler = (event) => {
            // Nếu menu đang mở và click bên ngoài khu vực container của box emoji thì tắt
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowPicker(false);
            }
        };
        document.addEventListener('click', handler);
        return () => {
            document.removeEventListener('click', handler);
        };
    }, []);
    // Xử lý vị trí tin nhắn và tự động trượt lên khi có tin nhắn mới
    useEffect(() => {
        if (messageRef.current) {
            messageRef.current.scrollIntoView({
                behavior: 'auto',
                block: 'end',
                inline: 'nearest',
            });
        }
    }, []);

    return (
        <div className={Styles['chat__box-content']}>
            {activeConversation && (
                <>
                    <div className={Styles['chat__box-content-heading']}>
                        <FaAngleLeft className={Styles['chat__box-back-icon']} onClick={() => handleBackIcon(null)} />
                        <div className={Styles['chat__user-avatar']}>
                            {activeConversation?.avatar ? (
                                <picture>
                                    <img
                                        src={activeConversation.avatar}
                                        alt="Avatar"
                                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                    />
                                </picture>
                            ) : (
                                <Image src={Avatar} alt="Avatar" />
                            )}
                        </div>
                        <div className={Styles['chat__user-info']}>
                            <h3 className={Styles['chat__user-name']}>{activeConversation.name}</h3>
                            {/* Thêm class ${Styles["show"]} để hiện hoạt động hoặc hoạt động trước đó */}
                            <p className={`${Styles['chat__user-item']} ${Styles['show']}`}>
                                <span></span>
                                {content && content.chat_active}
                            </p>
                            <p className={`${Styles['chat__user-item']}`}>
                                <span></span>
                                Hoạt động 30 phút trước
                            </p>
                        </div>
                        <ul className={Styles['chat__user-action-list']}>
                            <li
                                className={Styles['chat__user-action-item']}
                                onClick={(e) => {
                                    handleCall(e, false);
                                }}>
                                <a href="#" target="_blank">
                                    <FaPhoneAlt className={Styles['chat__user-icon']} />
                                    <span className={Styles['tooltip__create']}>{content && content.chat_start_call}</span>
                                </a>
                            </li>
                            <li
                                className={Styles['chat__user-action-item']}
                                onClick={(e) => {
                                    handleCall(e, true);
                                    // handleIncomingCall(e, messContent)
                                }}>
                                <a href="#" target="_blank">
                                    <FaVideo className={Styles['chat__user-icon']}/>
                                    <span className={Styles['tooltip__create']}>{content && content.chat_start_videocall}</span>
                                </a>
                            </li>
                            <li className={`${Styles['chat__user-action-item']}`}>
                                <label htmlFor="show-tab-info">
                                    <FaInfoCircle className={Styles['chat__user-icon']} />
                                    <span className={Styles['tooltip__create']}>{content && content.chat_info_chat}</span>
                                </label>
                            </li>
                        </ul>
                        {showPopupSearch && (
                            <div className={Styles['chat__box-search']}>
                                <input
                                    type="text"
                                    name="search"
                                    className={Styles['chat__box-search-input']}
                                    placeholder={content && content.chat_search_placeholder}
                                />
                                <FaAngleDown className={Styles['chat__box-search-icon']} />
                                <FaAngleUp className={Styles['chat__box-search-icon']} />
                                <FaSearch className={Styles['chat__box-search-icon']} />
                                <FaRegTimesCircle
                                    className={Styles['chat__box-search-icon']}
                                    onClick={() => setShowPopupSearch(!showPopupSearch)}
                                />
                            </div>
                        )}
                    </div>
                    <div className={Styles['chat__box-content-body']}>
                    {/* onScroll={handleOnScrollBoxChat} ref={scrollBoxChatRef} */}
                        <div className={Styles['chat__box-mess']}>
                            {!loadingVisionable &&
                            <div className={Styles['chat__box-loading']} onClick={handleOnLoadingMsg}>
                                <span>
                                    Click to load previous messages...
                                </span>
                            </div>}
                            {activeMessages &&
                                activeMessages.slice(limitMessages).map((msg, index) => (
                                    // Nếu item.from = id của người dùng hoặc là kiểu dữ liệu của item.from là object (Do khi nhấn nút gửi trả về object này -> SyntheticBaseEvent{...})
                                    <>
                                        {msg.createdBy === userLogin.id ? (
                                            <div className={Styles['message-group-chat']} key={index}>
                                                <MessViewed
                                                    linkify={linkify}
                                                    message={msg}
                                                    fromUser={allUserObj[msg.avatar]}
                                                />
                                            </div>
                                        ) : (
                                            <div className={Styles['message-group-received']} key={index}>
                                                <div className={Styles['message-group-received-avatar']}>
                                                    {msg.user ? (
                                                        <div className={Styles['avatar-member']}>
                                                            <img
                                                                src={msg?.avatar}
                                                                alt="Avatar"
                                                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                                            />
                                                            <div className={Styles['info-container']}>
                                                                <span>{msg.user.username}</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <Image src={Avatar} alt="Avatar" />
                                                    )}
                                                </div>
                                                <div className={Styles['message-group-chat']}>
                                                    <MessReceived linkify={linkify} message={msg} />
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ))}
                            <div ref={messageRef} />
                        </div>

                        <div className={Styles['chat__box-chat']} style={{ position: 'relative' }} ref={menuRef}>
                            <ul className={Styles['chat__sent-list']}>
                                <li className={Styles['chat__sent-item']}>
                                    <input
                                        className={Styles['chat__sent-image-input']}
                                        type="file"
                                        id="image"
                                        onChange={(e) => handleImage(e)}
                                        onClick={(e) => (e.target.value = '')}
                                    />
                                    <label htmlFor="image">
                                        <FaImages className={Styles['chat__sent-icon']} />
                                    </label>
                                    <span className={Styles['chat__sent-tooltip']}>{content && content.chat_attach_photo}</span>
                                </li>
                                <li className={Styles['chat__sent-item']}>
                                    <FaRegFileAlt className={Styles['chat__sent-icon']} />
                                    <span className={Styles['chat__sent-tooltip']}>{content && content.chat_attach_file}</span>
                                </li>
                            </ul>
                            <div className={Styles['chat__form-control-sent']}>
                                <div
                                    contentEditable={true}
                                    className={Styles['chat__form-input-sent']}
                                    id="editor"
                                    onInput={(e) => handleEditor(e)}
                                    onKeyUp={(e) => handleBreakLine(e, activeConversation.type)}
                                ></div>
                                {image && (
                                    <div className={Styles.previewImg}>
                                        <img src={`${URL.createObjectURL(image)}`} alt="Image" />
                                        <TiDeleteOutline className={Styles.iconRemove} onClick={handleCloseImg} />
                                    </div>
                                )}
                                {activePlaceholder && <span className={Styles['chat__form-input-label']}>Nhập nội dung ...</span>}
                                {isMobile ? (
                                    ''
                                ) : (
                                    <FaRegGrinBeam
                                        className={Styles['chat__form-icon']}
                                        type="button"
                                        onClick={() => {
                                            setShowPicker((val) => !val);
                                        }}
                                    />
                                )}
                            </div>
                            {showPicker && (
                                <Picker
                                    className={Styles['picker']}
                                    pickerStyle={{ position: 'absolute', bottom: '50px', right: '7%' }}
                                    onEmojiClick={handleEmoji}
                                />
                            )}
                            <FaHeart className={Styles['chat__icon-like']} />
                            <FaRegPaperPlane
                                className={`${Styles['chat__icon-sent']} ${mess || image ? Styles.activeSend : ''}`}
                                onClick={handleSubmit}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ConversationContent;
