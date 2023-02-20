import Image from 'next/image'
import Styles from './BoxChat.module.css'
import Avatar from '../../public/images/Logo.png'
import Link from 'next/link';
import {
    FaRegTimesCircle, FaVideo,
    FaTimes, FaPhoneAlt, FaImages,
    FaRegFileAlt, FaRegGrinBeam, FaRegPaperPlane,
    FaQuoteRight, FaRegLaugh, FaCheckCircle, FaRegCheckCircle
} from "react-icons/fa";
import { BsArrowBarDown } from 'react-icons/bs'
import { useState, useEffect, useRef, useContext, Suspense } from "react";
import { getCookieUserLogin, getTokenUserLogin } from '../../modules/Cookies/Auth/userLogin';
import io from "socket.io-client";
import API, {headers} from "../../API";
import dynamic from 'next/dynamic';
import BodyPostFacebook from "../../components/Post/component/BodyPostFacebook/BodyPostFacebook";
import BodyPostTiktok from "../../components/Post/component/BodyPostTiktok/BodyPostTiktok";
import BodyPostTwitch from "../../components/Post/component/BodyPostTwitch/BodyPostTwitch";
import BodyPostTwitter from "../../components/Post/component/BodyPostTwitter/BodyPostTwitter";
import BodyPostYoutube from "../../components/Post/component/BodyPostYoutube/BodyPostYoutube";
import BodyPostInstagram from "../../components/Post/component/BodyPostInstagram/BodyPostInstagram";
import TimeUserLogin from "../../modules/Time/formatTimeUserLogin";
import axios from 'axios';
import { TiDeleteOutline } from 'react-icons/ti';
import ChatService from '../../services/chat';
import { useBoxChatContext } from './BoxChatContext';
import { useConversationContext } from './ConversationContext';
import MessReceived from '../../pages/chat/ContentMessages/MessReceived';
import { linkify } from '../../utils/chatUrl';
import MessViewed from '../../pages/chat/ContentMessages/MessViewed';


const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });

export default function BoxChat() {
    // Init Service - Comment waiting to be fixed
    // const [chatService, setChatService] = useState(new ChatService(getTokenUserLogin()));
    // useEffect(() => {
    //     const load = async () => {
    //         // const service = chatService.getInstance();
    //         // const conversations = await chatService.getConversationInfos();
    //         setChatService(chatService)
    //     };

    //     load();
    // }, [chatService])

    const context = useBoxChatContext();
    const { boxchat, activeMessages, activeConversation, setBoxChat, allUserObj, openBoxChat } = useBoxChatContext()
    const { sendMessage, emitTypingOn } = useConversationContext()
    var listChatNoti = context.listChatNoti;

    var refChatNoti = useRef([]);
    var refBoxChat = useRef([]);
    refChatNoti.current = listChatNoti;
    const [soundMess] = useState(typeof Audio !== "undefined" && new Audio('/sound/mess.mp3'))
    if(listChatNoti.length > 0){
        refChatNoti.current = listChatNoti;
    }
    refBoxChat.current = boxchat;

    const userLogin = getCookieUserLogin();
    const [render, setRender] = useState(false);
    const messageRef = useRef(); // Biến set giá trị vị trí cho tin nhắn
    const messageRef2 = useRef();
    const [mess, setMess] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [image, setImage] = useState([
        {
            i:0,
            file:null
        },
        {
            i:1,
            file:null
        },
    ]);

    useEffect(() => {
        const handleMobile = () => {
            if(window.innerWidth <= 720) {
                setIsMobile(true);
            }
            else {
                setIsMobile(false);
            }
        }
        handleMobile();
        window.addEventListener("resize", handleMobile);
        return () => {
            window.removeEventListener("resize", handleMobile);
        }
    }, [])

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


// Xử lý vị trí tin nhắn và tự động trượt lên khi có tin nhắn mới
    // useEffect(() => {
    //     if (messageRef.current) {
    //         messageRef.current.scrollIntoView(
    //             {
    //                 behavior: 'auto',
    //                 block: 'end',
    //                 inline: 'nearest'
    //         })
    //     }if (messageRef2.current) {
    //         messageRef2.current.scrollIntoView(
    //             {
    //                 behavior: 'auto',
    //                 block: 'end',
    //                 inline: 'nearest'
    //         })
    //     }
    // }
    // )

    const [activePlaceholder, setActivePlaceholder] = useState(true);
    const [activeSend, setActiveSend] = useState(false);
    //Handle on change editor
    const handleEditor = (e) =>{
        emitTypingOn();
        if(e.target.innerText.trim() === "") {
            setMess("");
            return;
        }
        if (e.target.innerText.slice(0, 6) !== '&nbsp;') {
            setMess(e.target.innerText);
            setActivePlaceholder(false)
        } else {
            e.target.innerText = '';
        }
    }
    //catch breakline and submit content
    const handleBreakLine = (event,type) =>{
        if (event.key === 'Enter' && event.shiftKey) {
                event.preventDefault();
                setMess(mess + "<br/>")
            } else if (event.key === 'Enter') {
                event.preventDefault();
                if (mess || image) {
                    handleSubmit()
                    setActivePlaceholder(true)
                    setActiveSend(false)
                }
            }
        
    }

    //xử lí hiện boxchat khi có tn mới
    // function handleNewMessage(data){
    //     var checkShowChat = true;
    //     for (let index = 0; index < refBoxChat.current.length; index++) {
    //         const element = refBoxChat.current[index];
    //             if(element.conversation.id == data?.conversation_id )
    //             {
    //                 checkShowChat = false;
    //             }
    //     }
    //     if(refChatNoti.current != undefined){
    //         for (let j = 0; j < refChatNoti.current.length; j++) {
    //             const element = refChatNoti.current[j];
    //             if(element.conversation.id == data?.conversation_id )
    //             {
    //                 var arr = context.showNewMessMiniChat.filter(item => item != element.conversation.id);
    //                 arr.push(element.conversation.id);
    //                 context.setShowNewMessMiniChat(arr);
    //                 checkShowChat = false;
    //                 context.setRender(prev => !prev);
    //             }
    //         }
    //     }

    //     if(checkShowChat){
    //         if(refBoxChat.current.length == 1){
    //             API.get(`https://dakchat.site/api/conversation/${data.conversation_id}` , {headers: headers.headers_token})
    //             .then((response) =>{
    //             if(response.data.success){
    //                 console.log(refBoxChat.current[refBoxChat.current.length-1]);
    //                 context.setBoxChat([refBoxChat.current[refBoxChat.current.length-1] ,response.data.data]);
    //             }
    //             })
    //             .catch((error) =>{
    //                 console.log(error);
    //             })
    //         }
    //         else if(refBoxChat.current.length == 0){
    //             API.get(`https://dakchat.site/api/conversation/${data.conversation_id}` , {headers: headers.headers_token})
    //             .then((response) =>{
    //             if(response.data.success){
    //                 context.setBoxChat([response.data.data]);
    //             }
    //             })
    //             .catch((error) =>{
    //                 console.log(error);
    //             })
    //         }
    //         else if(refBoxChat.current.length >= 2){
    //             API.get(`https://dakchat.site/api/conversation/${data.conversation_id}` , {headers: headers.headers_token})
    //             .then((response) =>{
    //             if(response.data.success){
    //                 console.log(context.listChatNoti);
    //                 if(refChatNoti.current.length == 0){
    //                     context.setListChatNoti([response.data.data]);
    //                     var arr = context.showNewMessMiniChat.filter(item => item != response.data.data.conversation.id);
    //                     arr.push(response.data.data.conversation.id);
    //                     context.setShowNewMessMiniChat(arr);
    //                 }
    //                 else{
    //                     var arrChatNoti = refChatNoti.current;
    //                     arrChatNoti.push(response.data.data);
    //                     console.log(arrChatNoti);
    //                     context.setListChatNoti(arrChatNoti);
    //                     console.log(context.showNewMessMiniChat);
    //                     var arrNewMess = context.showNewMessMiniChat.filter(item => item != response.data.data.conversation.id);
    //                     arrNewMess.push(response.data.data.conversation.id);
    //                     console.log(arrNewMess);
    //                     context.setShowNewMessMiniChat(arrNewMess);
    //                 }
    //             }
    //             })
    //             .catch((error) =>{
    //                 console.log({error});
    //             })
    //         }
    //     }

    // }
    // function handleAddConver(data){
    //     let conver =
    //         {
    //             ...data.message,
    //             user : data.user
    //         }

    //     var checkBooleans = true;
    //     //thêm tn mới
    //     var arrNewMess = refBoxChat.current;
    //     for (let index = 0; index < arrNewMess.length; index++) {
    //         const element = arrNewMess[index];
    //         if(element.conversation.id === data.conversation_id){
    //             element.message_data.data.push(conver);
    //             // console.log('chay');
    //             checkBooleans = false;
    //         }
    //     }
    //     // thêm tn mới vào mini chat
    //     if(checkBooleans){
    //         for (let index = 0; index < refChatNoti.current.length; index++) {
    //             const element = refChatNoti.current[index];
    //             if(element.conversation.id === data.conversation_id){
    //                 element.message_data.data.push(conver);
    //             }
    //         }
    //     }
    // }
    // Xử lý khi click button send hoặc nhấn Enter để gửi
    const handleSubmit = async () => {
        const arrMess = mess.split("\n")
        arrMess.pop()
        mess = arrMess.join("")
        console.log(mess)
        if (image) {
            try {
                const result = await new UploadService(userLogin.token).upload(new FormData().append('files', image));

                sendMessage({
                    content: mess
                        ? `${mess} <br> <img src='${result.img}' alt='Image' width='100%'/>`
                        : `<img src='${result.img}' alt='Image' width='100%'/>`,
                    // send_to: messContent.conversation.member,
                    // message_data_id: messContent.message_data.id,
                });
            } catch (error) {
                console.error(error);
            }
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

    }

    // const handleSubmit = async () => {
    //     let message = mess.trim().replace(/\n/g, '');
    //     if (image) {
    //       const result = await new UploadService(userLogin.token).upload(new FormData().append('files', image))
    //         .catch(error => {
    //           console.error(error);
    //           return null;
    //         });
      
    //       if (result) {
    //         message += ` <br> <img src='${result.img}' alt='Image' width='100%'/>`;
    //       }
    //     }
      
    //     sendMessage({
    //       content: message,
    //     });
      
    //     setMess('');
    //     setImage(null);
    //   };

    const isFacebook = /^(https?:\/\/)?(www\.)?facebook.com\/[a-zA-Z0-9(\.\?)?]/;
    const isTiktok = /^https:\/+www\.[tiktok]+\.com\/([\w@]+\/?)([a-z0-9]+\/?)*/i;
    const isTwitter = /^https:\/+[twitter]+\.com\/([\w@]+\/?)([a-z0-9]+\/?)*/i;
    const isYoutube = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/i;
    const isInstagram = /((?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel)\/([^/?#&]+)).*/g;
    const isTwitch = /(https:)\/\/(www)(.)(twitch)(.)(tv)\/(.*)\/*.*/i;
    function getUrlType(urlArr) {
        if(urlArr.length > 0 ){
            if(isFacebook.test(urlArr[0])){
                return 'facebook';
            }
            if(isTiktok.test(urlArr[0])){
                return 'tiktok';
            }
            if(isTwitter.test(urlArr[0])){
                return 'twitter';
            }
            if(isYoutube.test(urlArr[0])){
                return 'youtube';
            }
            if(isInstagram.test(urlArr[0])){
                return 'instagram';
            }
            if(isTwitch.test(urlArr[0])){
                return 'twitch';
            }
        } else return;
    }

    useEffect(() =>{
        if(boxchat.length > 4){
            let element = boxchat.pop()
            listChatNoti.push(element)
        }
    },[context.change])

    //sự kiện thu nhỏ box chat
    function handleMinimizeChat(id) {
        let arrChatNoti = boxchat.filter(item => item?.id === id);
        context.setListChatNoti(prev => [...prev, arrChatNoti[0]]);

        let arrNew = boxchat.filter(item => item.id !== id)
        setBoxChat(arrNew)
    }

    function handleCloseBoxchat(id){
        let arrNew = boxchat.filter(item => item.id !== id)
        setBoxChat(arrNew)
    }

    return(
        <div style={{display: 'flex', justifyContent: 'flex-end', marginRight: '5%'}}>
        {openBoxChat &&
           boxchat?.map((boxchat, i) =>   (
                <div style={{width: '330px', margin: '0 0.5%'}} key={i}>
                    <BoxChatItem 
                        boxchat={boxchat}
                        setBoxChat={context.setBoxChat} 
                        handleMinimizeChat={handleMinimizeChat}
                        handleSubmit={handleSubmit}
                        deleteBoxChat={context.deleteBoxChat}
                        handleCloseBoxchat={handleCloseBoxchat}
                        activeMessages={activeMessages}
                        userLogin={userLogin}
                        activeConversation={activeConversation}
                        handleEditor={handleEditor}
                        handleBreakLine={handleBreakLine}
                        activePlaceholder={activePlaceholder}
                        setActivePlaceholder={setActivePlaceholder}
                        activeSend={activeSend}
                        setActiveSend={setActiveSend}
                        allUserObj={allUserObj}
                    />
                </div>
           ))
        }
        </div>
    )

}

export function MiniChatBox(){
    const {boxchat, setBoxChat, listChatNoti, setListChatNoti, toggleBoxChat} = useBoxChatContext();
    const handleCloseBoxchat = (id) => {
        let arr = listChatNoti.filter(item => item.id !== id)
        setListChatNoti(arr)
    }

    function handleMiniChatClick(conversation){
        let arr = boxchat.filter(item => item.id !== conversation.id);
        arr.push(conversation)
        setBoxChat(arr)

        let newArrChatNoti = listChatNoti.filter(item => item.id !== conversation.id)
        setListChatNoti(newArrChatNoti)
        toggleBoxChat()
        // var arrNewMess = refNewMess.current.filter(item => item != chat.conversation.id);
        // context.setShowNewMessMiniChat(arrNewMess);
        // console.log(refNewMess.current);
        // var arrNew= arr.filter(item => item.conversation.id != chat.conversation.id);
        // arrNew.push(chat);
        // context.setBoxChat(arrNew);
        // var arrChatNoti = [];
        // arrChatNoti = context.listChatNoti.filter(item => item?.conversation.id != chat.conversation.id);
        // if(context.boxchat.length > 1){
        //     arrChatNoti.push(context.boxchat[context.boxchat.length - 2]);
        // }
        // context.setListChatNoti(arrChatNoti);
    }
    // console.log(context.showNewMessMiniChat);

    return (
        <ul className={Styles["chatnoti-list"]} >
            {listChatNoti?.map((item, i) =>
                <li className={Styles["chatnoti-item"]}
                    key={i}
                >
                    <div className={Styles["chatnoti-avatar"]} onClick={() => handleMiniChatClick(item)} >
                        <a>
                            {item.user?.avatar == undefined ? <img src={Avatar.src} alt="Avatar"/> :
                                <picture>
                                    <img src={item.conversation.user?.avatar} alt="Avatar" style={{objectFit: "cover", width: "100%", height: "100%"}}/>
                                </picture>
                            }
                            {/* <img src={Avatar.src} alt="Avatar" /> */}
                        </a>
                    </div>
                    {/* <span className={`${Styles["chatnoti-count-mess"]} ${Styles["haveMess"]}`}>9+</span> */}
                    {item.type == 1 ?
                        item?.status == 1 ? <div className={Styles["chatnoti-active"]}></div> : '' :
                        <div className={Styles["chatnoti-active"]}></div>
                    }

                    {/* {refNewMess.current[i] == item.conversation.id ?
                    <div className={Styles["chatnoti-new-mess"]}></div>
                    : ''} */}

                    {/* {refNewMess.current.map((value) =>
                        value === item?.id ? <div className={Styles["chatnoti-new-mess"]}></div> : ''
                    )} */}

                    <FaRegTimesCircle className={Styles["chatnoti-close-icon"]}
                        onClick={()=> handleCloseBoxchat(item.id)}
                    />
                </li>
            )
            }

        </ul>
    )
}

export function BoxChatItem({handleMinimizeChat, handleSubmit, deleteBoxChat, boxchat,handleCloseBoxchat, activeMessages, userLogin, handleEditor, handleBreakLine, activePlaceholder , setActivePlaceholder, activeSend, setActiveSend, allUserObj}) {

    const [showPicker, setShowPicker] = useState(false);
    const [holderIcon, setHolderIcon] = useState(true);
    const selectIcon = useRef(true);
   

    const handleEmoji = (event, emojiObject) => {
        let editor = document.getElementById(`editor-${index}`)

        pasteHtmlAtCaret(`${emojiObject.emoji}`,editor)

        setHolderIcon(false)
        setActiveSend(true)
    };

    useEffect(() => {
        setActivePlaceholder(holderIcon)
    }, [holderIcon]);
    //Chon vi tri tro chuot de add icon
    const pasteHtmlAtCaret = (html,editor)=> {
        editor.focus();
        let sel = window.getSelection();
        if (window.getSelection) {
        // IE9 and non-IE
        if (sel.getRangeAt && sel.rangeCount) {
            var range = sel.getRangeAt(0);
            //
            if(selectIcon.current === true){
                range.selectNodeContents(editor);
                range.collapse(false);
            }
            const el = document.createElement("div");
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
            if(selectIcon.current === false){
                range.collapse(true);
            }
            sel.removeAllRanges();
            sel.addRange(range);
            }
        }
        } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
        }
        selectIcon.current = false;
    }
    //check click outside emoji
    const actionRef = useRef(null);
    useEffect(() =>{
    let handler = event =>{
        // Nếu menu đang mở và click bên ngoài khu vực container của box emoji thì tắt
        if(actionRef.current && !actionRef.current.contains(event.target)){
            setShowPicker(false);
        }
    };
    document.addEventListener("click", handler);
    return () =>{
        document.removeEventListener("click", handler);
    }
    })

    useEffect(() => {
        if(showPicker === false){
            selectIcon.current = true
        }
    }, [showPicker]);

    // useEffect(() => {
    //     if(boxchat){
    //         let editorTemp = document.getElementById(`editor-${index}`)
    //         editorTemp.addEventListener('keydown' , e =>{
    //             if(e.key === "Enter"){
    //                 e.preventDefault();
    //             }
    //         })
    //    }
    // }, [boxchat]);

   //catch event change image
    const handleImage =(e) =>{
        // setImage(image.map(item => item.i === index ? {...item, file : e.target.files[0]} : item))
        setActivePlaceholder(false)
    }
    const handleCloseImg =() =>{
        // setImage(image.map(item => item.i === index ? {...item, file : null} : item))
        setActivePlaceholder(true)
    }
    // Gọi cho người khác, gọi cho nhóm (nếu nhóm có ít hơn 10 thành viên)
     const handleCall = (e, boxchat, value) => {
        e.preventDefault();
        var spec  ="toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=350,width=800,height=600";
        if(name.split(',').length == 1){
            const url = `/videocall/callaway?id=${boxchat[index].conversation.user.id}&camera=${value}`
            var link = window.open(url,"_blank",spec)
        }
        else {
            if(name.split(',').length > 10) {
                ErrorNotification("Bạn không thể gọi nhóm!")
            }
            else {
                const url = `/videocall/callawaygroup?id=${boxchat[index].conversation.id}&camera=${value}`
                var link = window.open(url,"_blank",spec)
            }
        }
    }

    return (
       <>
       
            <div className={`${Styles["chatbox"]} ${Styles["showBoxChat"]}`}>
                <div className={Styles["chatbox-heading"]}>
                <div className={Styles["chatbox-info"]}>
                    <div className={Styles["chatbox-heading-avatar"]}>
                        {boxchat?.avatar ?
                        <Link href={`/otherprofile/${boxchat?.createdBy}`}>
                            <a>
                                
                                    <picture>
                                        <img src={boxchat.avatar} alt="Avatar" style={{objectFit: "cover", width: "100%", height: "100%"}}/>
                                    </picture>
                                
                                {/* <img src={Avatar.src} alt="Avatar" /> */}
                            </a>
                        </Link>
                        :
                                    <picture>
                                        <img src={Avatar.src} alt="Avatar" style={{objectFit: "cover", width: "100%", height: "100%"}}/>
                                    </picture>
                         }

                    </div>
                    <div className={Styles["chatbox-info-main"]}>
                        {/* tên người chat */}
                        <p className={Styles["chatbox-info-name"]}>{boxchat?.name}</p>
                        {boxchat?.type == 1 ?
                            <span className={Styles["chatbox-info-active"]}>
                                Đang hoạt động
                            </span>
                            :
                            <span className={Styles["chatbox-info-active"]}>
                                Đang hoạt động
                                <span className={Styles["chatbox-info-active-tick"]}></span>
                            </span>
                        }
                    </div>
                    {/* <FaAngleDown className={Styles["chatbox-info-arrow-icon"]} /> */}
                    <span className={Styles["chatbox-info-tooltip"]}>Mở tiện ích</span>
                </div>
                <ul className={Styles["chatbox-action-list"]}>
                    <li
                        className={Styles["chatbox-action-item"]}
                        onClick={(e) => {
                            handleCall(e, boxchat, false)
                        }}
                    >
                        <FaPhoneAlt className={Styles["chatbox-action-icon"]} />
                        <span className={Styles["chatbox-action-tooltip"]}>Bắt đầu gọi thoại</span>
                    </li>
                    <li
                        className={Styles["chatbox-action-item"]}
                        onClick={(e) => {
                            handleCall(e, boxchat, true)
                        }}
                    >
                        <FaVideo className={Styles["chatbox-action-icon"]} />
                        <span className={Styles["chatbox-action-tooltip"]}>Bắt đầu gọi video</span>
                    </li>
                    <li className={Styles["chatbox-action-item"]}>
                        <BsArrowBarDown className={Styles["chatbox-action-icon"]}
                            onClick={() => handleMinimizeChat(boxchat.id)}
                        />
                        <span className={Styles["chatbox-action-tooltip"]}>Thu nhỏ đoạn trò chuyện</span>
                    </li>
                    <li className={Styles["chatbox-action-item"]}>
                        <FaTimes className={Styles["chatbox-action-icon"]} onClick={() => {
                                    handleCloseBoxchat(boxchat.id);
                                }
                            }
                            />
                        <span className={Styles["chatbox-action-tooltip"]}>Đóng đoạn trò chuyện</span>
                    </li>
                </ul>
            </div>
            <div className={Styles["chatbox-body"]}>
                <div id='bottomChat' className={Styles["chatbox-body-main"]}>
                {activeMessages && activeMessages
                .map((message, i) =>
                    (
                        message.createdBy === userLogin.id ? 
                            <div className={Styles["avatar-member"]} style={{cursor: "pointer"}}>
                                <MessViewed
                                    linkify={linkify}
                                    message={message}
                                    fromUser={allUserObj[message.avatar]}
                                />
                            </div>
                            : 
                            <div className={Styles["message-group-received"]} key={i}>
                                <div className={Styles["message-group-received-avatar"]}>
                                    {message?.name ?
                                        <picture  >
                                            <img src='https://picsum.photos/100' alt="Avatar" style={{objectFit: "cover", width: "100%", height: "100%"}}/>
                                            <div className={Styles["info-container"]}>
                                                <span>{message.name}</span>
                                            </div>
                                        </picture>
                                        :
                                        <img src={Avatar.src} alt="Avatar"/>
                                    } 
                                </div>
                                <div className={Styles['message-group-chat']}>
                                    <MessReceived linkify={linkify} message={message} />
                                </div>
                            </div>
                    ))}
                    <div />
                </div>
                <div className={Styles["chatbox-body-chat"]}>
                    <ul className={Styles["chatbox-body-action-list"]}>
                        <li className={Styles["chatbox-action-body-item"]}>
                                <input
                                    className={Styles["chat__sent-image-input"]}
                                    type="file"
                                    id={`image`}
                                    onChange={e=> handleImage(e)}
                                    onClick = {e => e.target.value =""}
                                    />
                                    {/* htmlFor={`image-${index}`} */}
                                    <label >
                                        <FaImages className={Styles["chatbox-action-body-icon"]}/></label>
                                    <span className={Styles["chatbox-action-body-tooltip"]}>Đính kèm ảnh</span>
                        </li>
                        <li className={Styles["chatbox-action-body-item"]}>
                            <FaRegFileAlt className={Styles["chatbox-action-body-icon"]}/>
                            <span className={Styles["chatbox-action-body-tooltip"]}>Đính kèm tệp</span>
                        </li>
                    </ul>
                    <div className={Styles["chatbox-body-form-control"]} ref={actionRef}>
                         <div
                            contentEditable={true}
                            className={Styles["chatbox-body-input"]}
                            id="editor"
                            onInput = {e => handleEditor(e)}
                            onKeyUp = {e => handleBreakLine(e,boxchat.type)}
                        >
                        </div>
                        {/* { image.map(item => item.i === index && item.file != null ? <div className={Styles.previewImg}> 
                        <img src ={`${URL.createObjectURL(item.file)}`} alt ='Image' /> <TiDeleteOutline className={Styles.iconRemove} onClick={handleCloseImg}/> </div> : "" )} */}
                        {activePlaceholder && <span className={Styles['chat__form-input-label']}>Nhập nội dung ...</span>}
                        <FaRegGrinBeam className={Styles["chatbox-body-icon"]} onClick = {() => setShowPicker(val => !val)} />
                        {showPicker &&
                        <div className={Styles['box-icon']}>
                            <Picker
                                pickerStyle={{ width: '80%',paddingTop : '20px'}}
                                onEmojiClick = {handleEmoji}
                            />
                          </div>
                          }
                        {}
                    </div>
                    <FaRegPaperPlane
                        className={`${Styles['chatbox-body-icon-sent']} ${activeSend ? Styles.activeSend : ''}`}
                        onClick={() =>{
                            handleSubmit()
                            setActivePlaceholder(true)
                            setActiveSend(false)
                        }}
                    />
                </div>
            </div>
        </div>
        
       </>
    )

}