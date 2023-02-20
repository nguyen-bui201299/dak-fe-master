import { useEffect, useState ,useRef } from "react";
import Styles from "./PopupDelAlbum.module.css";
import React from 'react';
import { } from "react-icons/fa"
import API, {endpoints, headers} from "../../../API";
import { NotificationToast, SuccessNotification } from '../../../modules/Notification/Notification'
import { getCookieUserLogin } from "../../../modules/Cookies/Auth/userLogin";
function AlbumDel({id , ShowsetRerenderLib , HandelPaginationPrev , handleClickDel, showListAlbum, Pagination, HandelShowPostInLib}){

    const userLogin = getCookieUserLogin();

    const [content, setContent] = useState({});
          
    useEffect(() => {
        if(userLogin.language!== undefined) {
                setContent(require(`../languages/${userLogin.language}.json`));
            }else{
                setContent(require(`../languages/en.json`));
        }
    }, [userLogin])


    const data = JSON.stringify({
        collection_id: id
    })
    console.log(id)
    const HandelClickClose = ()=>{
        handleClickDel()
    }
    const HandelClick = ()=>{
        API.delete(endpoints.DeleteAlbum, {data: data, headers: headers.headers_token})
        .then(res => {
            ShowsetRerenderLib()
            handleClickDel()
            HandelShowPostInLib()
            if(showListAlbum.length === 1 && Pagination.page !== 1) {
                HandelPaginationPrev()
            }

            NotificationToast.fire({
                toast: true,
                position: 'top-right',
                icon: 'success',
                title: `${content.delAlbum_success}`,
            })
            
        })
        .catch((err) => console.log(err))
            
    }
    const createBox = useRef()
    useEffect(()=>{
        const HandelOutSide = (e)=>{
            if(createBox.current && !createBox.current.contains(e.target)){
                handleClickDel()
            }   
        }
        document.addEventListener('mousedown', HandelOutSide)
        return ()=>{
            document.removeEventListener('mousedown', HandelOutSide)
        }
    },[handleClickDel])
    return (
        <div className={Styles.AlbumCreate}>
            <div className={Styles.Album_del} ref={createBox}>
                <div>
                    <div className={Styles.Album_container}>
                        <div className={Styles.Album_del_title}>
                            <h2>
                                {content.delAlbum_doYouWant} <span> {content.delAlbum_del} </span> {content.delAlbum_thisAlbum} ?
                            </h2>
                        </div>
                        <div className={Styles.Album_del_option}>
                            <div className={`${Styles.Album_del_btn} ${Styles.Album_del_yes}`}>
                                <div onClick={HandelClick}>
                                    <button>{content.delAlbum_yes_btn}</button>
                                </div>
                            </div>
                            <div className={`${Styles.Album_del_btn} ${Styles.Album_del_no}`}>
                                <div onClick={HandelClickClose}>
                                    <button>{content.delAlbum_close_btn}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AlbumDel