import React, { useEffect, useState } from 'react'
import { BsChatDotsFill} from "react-icons/bs";
import Styled from "../../styles/ListFriend.module.css";
import { useBoxChatContext } from '../BoxChat/BoxChatContext'
import API, { endpoints, headers } from "../../API";
import Router from 'next/router';

const BtnChatListfriend = ({friendId}) => {
    const [isMobile, setIsMobile] = useState(false);

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

        const {setBoxChat, boxchat, activeConversation, setActiveConversation, updateConversationState,toggleBoxChat} = useBoxChatContext();
        const openBoxChat = (conver) => {
            var arr = boxchat;
            var arrNew= arr.filter(item => item?.id !== conver?.id);
            arrNew.push(conver)
            setBoxChat(arrNew)
            setActiveConversation(conver)
            updateConversationState(conver.id,  { unReadMsgCount: 0 })
            toggleBoxChat()
        };
  return (
    <BsChatDotsFill className={Styled.iconFeature} onClick={openBoxChat} />
  )
}

export default BtnChatListfriend