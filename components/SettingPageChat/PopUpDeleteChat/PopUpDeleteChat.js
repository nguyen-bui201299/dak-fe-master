import Styles from "./PopupDeleteChat.module.css";
import { FaRegTimesCircle } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { getCookieChatToken } from "../../../modules/Cookies/Auth/userLogin";
import { useBoxChatContext } from "../../BoxChat/BoxChatContext";

export default function PopUpDeleteChat({handleClick, setShowPopupDelete, idGroup, conversationId}) {
    const {language, setLanguage, socket, chatService, activeConversation} = useBoxChatContext();
    const [showModal, setShowModal] = useState(true);

    const handleCloseModal = () => {
        setShowModal(false)
    }

    const popupdelete = useRef();

    const closepopupdelete = e => {
        if (popupdelete.current === e.target) {
            setShowPopupDelete(false);
        }
    };

    const handleDeleteChat = async (conversationId) => {
        try {
          if(!chatService) return;
          await chatService.deleteConversation(conversationId);
          window.location.reload();
        } catch (error) {
          console.error(error);
          // Báo lỗi nếu cần thiết
        }
      };
    

    return (
        <>
            {showModal && (
                <div className={Styles["overlayPopupDelete"]} ref={popupdelete} onClick={closepopupdelete}>
                    <div className={Styles["popupdelete"]}>
                        <div className={Styles["popupdelete__upload-image"]}>
                            <div className={Styles["popupdelete__heading"]}>
                                <h3 className={Styles["popupdelete__title"]}>Bạn có chắc muốn xóa cuộc trò chuyện?</h3>
                                <FaRegTimesCircle className={Styles["popupdelete__icon-close"]} onClick={handleCloseModal}/>
                            </div>
                            <div className={Styles["popupdelete__body"]}>
                            </div>
                            <button className={Styles["btn-submit"]} onClick={handleCloseModal}>Close</button>
                            <button className={Styles["btn-submit"]} onClick={() => handleDeleteChat(conversationId)}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
