import { memo, useEffect, useRef, useState } from "react"
import API, { endpoints, headers } from "../../API"
import Style from "./LibraryAlbum.module.css"
import { NotificationToast } from '../../modules/Notification/Notification'
import { FiX } from "react-icons/fi";
import CreateAlbum from "../../components/PopupAlbum/PopupAlbumCreat/CreatAlbum"
import { getCookieUserLogin } from "../../modules/Cookies/Auth/userLogin";
function LibraryAlbum({LibraryIds , postID ,isshowLib ,HandelshowReadLib ,ShowsetRender ,HandleToAlbum}){
    const userLogin = getCookieUserLogin()

    const [content, setContent] = useState({});
    const closeRef = useRef();

    // Click outside to close
    const handleCloseAlbum = e => {
        if(closeRef.current === e.target) {
            HandleToAlbum();
        }
    }

    useEffect(() => {
        if(userLogin.language!== undefined) {
            setContent(require(`./languages/${userLogin.language}.json`));
        }else{
            setContent(require(`./languages/en.json`));
        }
    }, [])

    const [libIds,setLibIds] = useState([]);
    const [showAlb,setShowAlb] = useState(false);
    const [showPostInLibrary, setShowPostInLibrary] = useState([])
    const [getPostSuccess, setGetPostSuccess] = useState(false)
    const HandCLickLibId = (e,LibraryId)=>{
        e.target.parentElement.parentElement.classList.toggle(`${Style.BoxStyle}`)
        const id = LibraryId.collection.id
        libIds.includes(id) ? ( libIds.splice(libIds.indexOf(id),1)) : setLibIds([...libIds,id])

        // Get post in album
        API.get(endpoints['getPostInLib'](id, 1 ,50),{headers: headers.headers_token})
        .then(function (res){ 
            if(res.data.success){
                setShowPostInLibrary(res.data.data)
                setGetPostSuccess(true)
            }
        })
    }
    const HandelLibClose = ()=>{
        HandleToAlbum()
    }

    const HandelAddLib = ()=>{
        if(libIds.length === 0 ) {
            NotificationToast.fire({
                toast: true,
                position: 'top-end',
                icon: 'warning',
                title: `${content.libraryAlbum_select_album}`,
            })
            
            return;
        } 
        if(getPostSuccess) {
            // check post have yet
            let checkPost = showPostInLibrary.find((item) => { return item !== null && item.post.id === postID })
        
            // Add post to album if not exits
            if(checkPost?.post.id !== postID) {
                if(libIds.length >= 1){
                    libIds.forEach((libId , index)=>{
                    API.post(endpoints['PostReadToAlbum'],{collection_id: libId, post_id: postID},{ headers : headers.headers_token})
                        .then((res)=>{
                            NotificationToast.fire({
                                toast: true,
                                position: 'top-end',
                                icon: 'success',
                                title: `${content.libraryAlbum_add_success}`,
                            })
                        })
                        .catch((error)=>{})
                        })
                    setTimeout(()=>{
                        HandleToAlbum()
                    },500)
                } else{
                    NotificationToast.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'error',
                        title: `${content.libraryAlbum_add_fail}`,
                    })
                }
            } else {
                NotificationToast.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'warning',
                    title: `${content.libraryAlbum_check_post}`,
                })
            }
        }
    }

    // Tao thu vien 
    const HandelCreAlb = ()=>{
        setShowAlb(!showAlb)
    }
    return (
            <div className={Style.wrapper} ref={closeRef} onClick={handleCloseAlbum}>
                <div className={Style.box}>
                    <div className={Style.boxAddRead}>
                            <p>{content.libraryAlbum_title}</p>
                            <FiX onClick={HandelLibClose} />
                    </div>
                    <div className={Style.BoxlistTrue}>
                        <div>
                            {LibraryIds && LibraryIds.map((LibraryId,index)=>
                                (
                                        (
                                            <div key={index} className={`${Style.BoxItems}`} onClick={(e)=>{HandCLickLibId(e,LibraryId)}}>
                                                <div className={Style.BoxItems_img}>
                                                    <img src={LibraryId.collection.avatar} alt="avatar"/>
                                                </div>
                                                <div className={Style.BoxItems_title}>
                                                    <p>{LibraryId.collection.title}</p>
                                                </div>
                                            </div>
                                        )
                                )
                                
                                )
                            }
                        </div>
                    </div>
                    <div className={Style.addAlbum}>
                        <button onClick={HandelCreAlb}>{content.libraryAlbum_createLibrary_btn}</button>
                       {showAlb && <CreateAlbum showAlb={showAlb} setShowAlb={setShowAlb} isshowLib={isshowLib} HandelCreAlb={HandelCreAlb} HandelshowReadLib={HandelshowReadLib} ShowsetRender={ShowsetRender}/>}
                        <button onClick={HandelAddLib}>{content.libraryAlbum_addToLibrary_btn}</button>
                    </div>
                </div>
            </div>
    )
}
export default memo(LibraryAlbum);