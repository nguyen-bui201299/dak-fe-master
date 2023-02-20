import { useRef, useState, useEffect } from "react";
import Styles from "./PopupOutGroup.module.css";
import { FaRegTimesCircle } from "react-icons/fa";
import {headers} from "../../../API";
import { getCookieChatToken } from "../../../modules/Cookies/Auth/userLogin";
export default function PopupOutGroup({handleClick, setShowPopupOutGroup, idGroup}) {
    // test-render-web
    useEffect(() => {
        console.log('render PopupOutGroup');
    }, [])

    const popupOutGroup = useRef();
    const closePopupOutGroup = e => {
        if (popupOutGroup.current === e.target) {
            setShowPopupOutGroup(false);
        }
    };
    
    const handleOutGroup = () =>{
        var axios = require('axios');
        var data = JSON.stringify({
            "conversation_id": idGroup
        });
        var config = {
            method: 'post',
            url: 'http://chat.dakshow.com/conversations/out-group',
            headers: {
                'Authorization': getCookieChatToken(),
                'Content-Type': 'application/json'
              },
              data
          };
        axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data.code));
            if(response.data.code == '200'){
                console.log("Out group Successfully");
                localStorage.clear();
                window.location.reload();
            }
            else if(response.data.code == '400'){
                console.log("Can't out this group");
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    return (
        <>
            <div className={Styles["overlayPopupOutGroup"]} ref={popupOutGroup} onClick={closePopupOutGroup}>
                <div className={Styles["popupOutGroup"]}>
                    <div className={Styles["popupOutGroup__upload-image"]}>
                        <div className={Styles["popupOutGroup__heading"]}>
                            <h3 className={Styles["popupOutGroup__title"]}>Rời khỏi nhóm chat?</h3>
                            <FaRegTimesCircle className={Styles["popupOutGroup__icon-close"]} onClick={handleClick}/>
                        </div>
                        <div className={Styles["popupOutGroup__item"]}>
                            <span style={{color: '#fff', textAlign: 'justify', padding: '8px'}}>Bạn sẽ không nhận được tin nhắn từ cuộc trò chuyện này nữa và mọi người sẽ thấy bạn rời nhóm</span>
                        </div>
                        <button className={Styles["btn-submit"]} onClick={handleOutGroup}>Rời khỏi nhóm</button>
                        <button className={Styles["btn-submit"]} onClick={handleClick}>Hủy</button>
                    </div>
                </div>
            </div>
        </>
    )
}