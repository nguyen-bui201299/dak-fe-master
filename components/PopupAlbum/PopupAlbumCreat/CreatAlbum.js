import { memo, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
// import AddAlbum from "../../LibraryAbbum/AddAblum/AddAblum";
import Styles from "./CreateAlbum.module.css";
import React from 'react';
import API, {endpoints, headers} from "../../../API"
import axios from "axios";
import { NotificationToast } from '../../../modules/Notification/Notification'
import {
    FaCogs,
    FaFileImage
} from "react-icons/fa"
import { AiOutlineCloseCircle } from "react-icons/ai";
import { getCookieUserLogin } from "../../../modules/Cookies/Auth/userLogin";
import logoDak from '../../../public/images/Logo.png'


function CreateAlbum({ShowsetRerenderLib ,showAlb  , setcreateAlb , HandelCreAlb, ShowsetRender } ){
    const userLogin = getCookieUserLogin()

    const [content, setContent] = useState({});
  
    useEffect(() => {
        if(userLogin.language!== undefined) {
            setContent(require(`../languages/${userLogin.language}.json`));
        }else{
            setContent(require(`../languages/en.json`));
        }
    }, [userLogin])

    const [avatar , setAvatar] = useState() // Lay Hinh anh
    const [title , setTitle] = useState(''); // Lay dc title
    const [imgAlbum , setImgAlbum] = useState("") 
    useEffect(()=>{
        return ()=>{
            URL.revokeObjectURL(avatar);
        }
    } , [avatar])
    const handlePreviewAvatar = (e)=>{
        const file = e.target.files[0];
        const data = new FormData();
        data.append('files',file)
        if(file.type === 'image/gif') {
            NotificationToast.fire({
                toast: true,
                position: 'top-right',
                icon: 'warning',
                title: `${content.createAlbum_no_gif}`,
            })
            return;
        }

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
              .then((response)=>{
                  setImgAlbum(response.data.data.img)
              })
              .catch((error)=>{})
            }
          })
          .catch((err) => {})
            
    }
    // Call API Lay url hinh anh
    const HandleClickClose = ()=>{
        if(setcreateAlb){setcreateAlb()}
        if(HandelCreAlb){HandelCreAlb()}
    }
    const handleSubmit = ()=>{
        if(title === "") {
           return;
        } else {
            API.post(endpoints['CreateAlbum'],{title: title , description: title , avatar: imgAlbum === "" ? logoDak.src : imgAlbum },{headers: headers.headers_token})
            .then(function (res){           
               if(res.data.success){
                    if(HandelCreAlb){
                        HandelCreAlb()
                        ShowsetRender()
                    }else if(ShowsetRerenderLib){
                        ShowsetRerenderLib()
                        setcreateAlb()
                    }
                    NotificationToast.fire({
                        toast: true,
                        position: 'top-right',
                        icon: 'success',
                        title: `${content.createAlbum_success}`,
                    })
                } else {
                    NotificationToast.fire({
                        toast: true,
                        position: 'top-right',
                        icon: 'warning',
                        title: `${content.createAlbum_same_name}`,
                    })
                }
            })
            .catch( function (error){})    } 
    }
    // Call API post data len server
    const createBox = useRef()
    useEffect(()=>{
        const HandelOutSide = (e)=>{
            if(createBox.current && !createBox.current.contains(e.target)){
                    if(HandelCreAlb){
                        HandelCreAlb()
                    }
                    if(setcreateAlb){
                        setcreateAlb()
                    }
            }   
        }
        document.addEventListener('mousedown', HandelOutSide)
        return ()=>{
            document.removeEventListener('mousedown', HandelOutSide)
        }
    },[HandelCreAlb,setcreateAlb])
    return (
        <div className={Styles.AlbumCreate}>
            <div className={showAlb === true ? Styles.Album_un : Styles.Album} ref={createBox}>
                <div className={Styles.container}>
                    <div className={Styles.Album_heading}>
                        <div className={Styles.Album_title}>
                            {content.createAlbum_title}
                        </div>
                        <div className={Styles.Album_del}>
                            <AiOutlineCloseCircle onClick={HandleClickClose} />
                        </div>
                    </div>
                    <div className={Styles.Album_content}>
                        <p>{content.createAlbum_settings}</p>
                        <FaCogs />
                    </div>
                    <div className={Styles.Album_form}>
                        <form action="#" onSubmit={(e)=>(e.preventDefault())} className={Styles.Form_album}>
                            <div className={Styles.Album_from_name}>
                                <input 
                                    type="text" 
                                    placeholder={content.createAlbum_album_name}
                                    value={title}
                                    onChange={(e)=>setTitle(e.target.value)}
                                    required
                                 />
                            </div>
                            <div className={Styles.Album_from_img}>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e)=>{handlePreviewAvatar(e)}}
                                />
                                {<FaFileImage />}
                                {(imgAlbum && <img src={imgAlbum} alt="Hình ảnh" width="auto" height="100%"/>) || <span >{content.createAlbum_upload_images_videos}</span> }
                            </div>
                            <div className={Styles.Album_form_submit}>
                                <div>
                                    <button onClick={handleSubmit}>{content.createAlbum_upload_btn}</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default memo(CreateAlbum)