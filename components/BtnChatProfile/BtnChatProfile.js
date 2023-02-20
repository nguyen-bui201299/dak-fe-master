import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
// import { useBoxChatContext } from '../BoxChat/BoxChatContext'
import { FaFacebookMessenger } from "react-icons/fa";
import Styles from '../../styles/Profile.module.css';
import Router from 'next/router';
import { BsChatDotsFill } from 'react-icons/bs';
import { useBoxChatContext } from '../BoxChat/BoxChatContext';


const BtnChatProfile = ({conver}) => {
  const [isMobile, setIsMobile] = useState(false);
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
      window.addEventListener("resize", handleMobile);
      return () => {
          window.removeEventListener("resize", handleMobile);
      }
  }, [])
  const {setBoxChat, boxchat, setActiveConversation, updateConversationState,toggleBoxChat} = useBoxChatContext();
  const openBoxChat = (conver) => {
    var arr = boxchat;
    var arrNew= arr.filter(item => item?.id !== conver?.id);
    arrNew.push(conver)
    setBoxChat(arrNew)
    setShowPopupChat(false);
    setActiveConversation(conver)
    updateConversationState(conver.id,  { unReadMsgCount: 0 })
    toggleBoxChat()
  };
  return (
      <div className={Styles.btnChat} onClick={openBoxChat}>
        <BsChatDotsFill />
      </div>
  )
}

export default BtnChatProfile