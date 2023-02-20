import { useEffect, useRef, useState } from "react";
import Styles from "./PopupAlbumEdit.module.css";
import React from 'react';
import API, {endpoints, headers} from "../../../API";
import { SuccessNotification } from '../../../modules/Notification/Notification'
import {
    FaReply,
    FaCogs
} from "react-icons/fa"
import { getCookieUserLogin } from "../../../modules/Cookies/Auth/userLogin";
function EditAlbum({ShowsetRerenderLib , id , value , handleClickEdit}){

            const userLogin = getCookieUserLogin()

            const [content, setContent] = useState({});
          
            useEffect(() => {
                if(userLogin.language!== undefined) {
                    setContent(require(`../languages/${userLogin.language}.json`));
                }else{
                    setContent(require(`../languages/en.json`));
                }
            }, [userLogin])

    const [title ,setTitle] = useState(value)
    // const [submitEdit,setSubmitEdit] = useState(false)
    const HandelSubmit =()=>{
        API.put(endpoints['CreateAlbum'],  {title: title , collection_id: id}, {headers : headers.headers_token})
            .then((res)=>{
                console.log(res.data)
                SuccessNotification(content.albumEdit_success)
                ShowsetRerenderLib()
                handleClickEdit()
            })
            .catch((error)=>{
                console.log(error)
            })
    }
    const HandelClickClose = ()=>{
        handleClickEdit()
    }
    const createBox = useRef()
    useEffect(()=>{
        const HandelOutSide = (e)=>{
            if(createBox.current && !createBox.current.contains(e.target)){
                handleClickEdit()
            }   
        }
        document.addEventListener('mousedown', HandelOutSide)
        return ()=>{
            document.removeEventListener('mousedown', HandelOutSide)
        }
    },[handleClickEdit])
    return  ( 
    <div className={Styles.AlbumCreate}>
        <div className={Styles.Album} ref={createBox}>
            <div className={Styles.container}>
                <div className={Styles.Album_heading}>
                    <div className={Styles.Album_title}>{content.albumEdit_title}</div>
                    <div className={Styles.Album_del}>
                        <FaReply onClick={HandelClickClose} />
                    </div>
                </div>
                <div className={Styles.Album_content}>
                    <p>{content.albumEdit_settings}</p>
                    <FaCogs />
                </div>
                <div className={Styles.Album_form}>
                    <form action="#" onSubmit={(e)=>(e.preventDefault())} className={Styles.Form_album}>
                        <div className={Styles.Album_from_name}>
                            <input
                                onChange={(e)=>(setTitle(e.target.value))}    
                                value={title}
                                type="text" 
                                placeholder={content.albumEdit_albumName}
                            />
                        </div>
                        <div className={Styles.Album_form_submit}>
                            <div>
                                <button onClick={HandelSubmit} >{content.albumEdit_submit_btn}</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    ) 
}
export default EditAlbum