import React from "react-dom";
import { useEffect, useRef, useState } from "react";
import Styles from "../../../styles/Profile.module.css";
import API, {endpoints, headers} from "../../../API";
import EditAlbum from "../../../components/PopupAlbum/PopupAlbumEdit/PopupAlbumEdit";
import AlbumDel from "../../../components/PopupAlbum/DelAlbum/PopupDelAlbum";
import CreateAlbum from "../../../components/PopupAlbum/PopupAlbumCreat/CreatAlbum";
import Post from "../../../components/Post/Post"
import FormUpdatePost from '../../../components/FormUpdatePost/FormUpdatePost'
import {
    FaTrashAlt,
    FaPen,
} from "react-icons/fa"
import { SuccessNotification } from '../../../modules/Notification/Notification'
import { getCookieUserLogin } from "../../../modules/Cookies/Auth/userLogin";
var isPost = false 
export default function ProfileLib( ) {
    const [createAlb,setCreateAlb] = useState(false); // Popup new Album
    const [showListAlbum , setShowListAlbum] = useState()
    const [reRenderLib , setRerenderLib] = useState(false)
    const [activePost,setActivePost] = useState()
    const [PagesRender,setPagesRender] = useState(false)
    const [showPostInLibrary,setshowPostInLibrary] = useState([])
    const [idLibPost,setIdLibPost] = useState() // Lay id cua thu vien da them bai Post
    const [isDeleteInLib, setIsDeleteInLib] = useState(false)
    const [showPostLib,setShowPostLib] = useState(false)
    const [showUpdatePost, setShowUpdatePost] = useState(false);
    const [updatePost, setUpdatePost] = useState('');
    const [Pagination, setPagination] = useState({"limit": 4, "page": 1, "totalItem": 9})
    const PagePostLib =  useRef(1)
    const idLib = useRef()
    useEffect(()=>{
        API.get(endpoints['ListAlbum'](4,Pagination.page) , {headers:headers.headers_token})
            .then(function (res){
                setPagination(res.data.pagination)  
                setShowListAlbum(res.data.data)
            })
            .catch(function (error){})
    },[reRenderLib, PagesRender ])
    const ShowAddAlbum = () =>{ 
        setCreateAlb(!createAlb)
    }
    const ShowsetRerenderLib = ()=>{
        setRerenderLib(!reRenderLib)
    }
    const ShowListPostLib = ()=>{
        setShowListAlbum(!showListAlbum)
    }
    const setShowPostFormLib = ()=>{
        setShowPostLib(!showPostLib)
    }

    const showsetIsDeleteInLib = ()=>{
        setIsDeleteInLib(!isDeleteInLib)
    }

    useEffect(() => {
        const close = (e) => {
          if(e.keyCode === 27){
            setCreateAlb(false)
          }
        }
        window.addEventListener('keydown', close)
        return () => window.removeEventListener('keydown', close)
      },[])
    
    const userLogin = getCookieUserLogin()


    const [content, setContent] = useState({});

    useEffect(() => {
        if(userLogin.language!== undefined) {
            setContent(require(`../languages/${userLogin.language}.json`));
        }else{
            setContent(require(`../languages/en.json`));
        }
    }, [userLogin])



    const HandelShowPost = ()=>{
        if(window.innerHeight + window.scrollY >= document.body.offsetHeight){
            if(isPost === true){
                HandelShowPostInLib(idLib.current)
            }
        }
    }



    useEffect(()=>{
        window.addEventListener('scroll',HandelShowPost)
        return ()=>{
            window.removeEventListener('scroll',HandelShowPost)
        }
    },[])
    // idLib.current = idLibPost
    if(idLibPost){
        idLib.current = idLibPost
    }
    useEffect(()=>{
        PagePostLib.current = 1;
        HandelShowPostInLib(idLibPost,1)
    },[idLibPost])
    const HandelShowPostInLib = (idLib)=> {
        API.get(endpoints['getPostInLib'](idLib,PagePostLib.current,20),{headers: headers.headers_token}) // Khi goi lai curren luc nay = 2  // Neu data > 0 thi van them vao  // Curen van lon hon 3
        .then(function (res){ 
            if(res.data.success){
                const checkNull = res.data.data.filter((item) => { return item !== null })
                setshowPostInLibrary(checkNull)
                setIdLibPost(idLib)
                // if(i === 1){
                //     setshowPostInLibrary([])
                // }  
                // if(res.data.data.length > 0 ){
                //     setshowPostInLibrary(prev => ([...prev , ...res.data.data])) // Dung Lay ra mang 1
                //     PagePostLib.current += 1;
                //     isPost = true
                // }else{
                //     console.log("Res.data.data.length < 0");
                //     isPost = false
                // }
                // // isPost = true // Neu dung isPost Van La true ==> Van Chay  
                // // setShowPostFormLib() // Render Lai
            }
        })
        .catch(function (error){})
    }

    // Update post
    const handleShowFormUpdatePost = (post,type) => {
    setShowUpdatePost(showUpdatePost => !showUpdatePost);
    setUpdatePost(post);
  };

    const HandelDelPostToLib = (idPost)=>{
        API.delete(endpoints['DelPostToLib'],{data: { collection_id: idLibPost , post_id: idPost }, headers : headers.headers_token})
            .then(function (res){
                const temp = showPostInLibrary.filter(item => item.post.id !== idPost)
                SuccessNotification(content.proifle_library_delete_post_library_success)
                setshowPostInLibrary(temp)
                showsetIsDeleteInLib()

            })
            .catch(err => {})
            setTimeout(()=>{
                showsetIsDeleteInLib()
            },300)
    }
    // Xu Ly Phan Trang 
    const HandelPaginationPrev = ()=>{
        const Page = Pagination.page - 1
        setPagination({
            ...Pagination, 
            "page" : Page
        })
        setPagesRender(!PagesRender)
        
    }
    const HandelPaginationNext = ()=>{
        const Page = Pagination.page + 1
        setPagination({
            ...Pagination, 
            "page" : Page
        })
        setPagesRender(!PagesRender)
    }

    return(
        <section className={Styles["profile"]}>
            <div className={Styles.profile_menu}>
                    <div className={Styles.profile_list}>
                       
                    </div>
                    <div className={Styles.profile_addAlbum}>
                        <button onClick={ShowAddAlbum}>+ {content.profile_library_create_album}</button>
                    </div>
                     {/* {createAlb   && <CreateAlbum setCreateAlb={setRenderAbl} HandelisShowCreate={HandelisShowCreate}/> } */}
                     {createAlb   && <CreateAlbum  setcreateAlb={ShowAddAlbum} ShowsetRerenderLib={ShowsetRerenderLib}  /> }
                </div>
                <div className={`${Styles["profile__post"]} ${Styles["all"]}`}>
                    <div className={Styles["profile__library-all-list"]}>
                        <section className={Styles.profile}>
                            <div className={Styles.themprofile}>
                                <div className={Styles.library_list}>
                                    {showListAlbum && showListAlbum.map((item, index) => (
                                          <div key={index} className={`${Styles.library_list_items} ${(activePost===index) ? Styles.items_hover : ''}` } onClick={(e)=>setActivePost(index)}>
                                                <LibraryAllItem key={index}  ShowsetRerenderLib={ShowsetRerenderLib} setShowPostFormLib={setShowPostFormLib}  item={item}  HandelShowPostInLib={HandelShowPostInLib} HandelPaginationPrev={HandelPaginationPrev} showListAlbum={showListAlbum} Pagination={Pagination} />
                                          </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
                <div className={Styles.Pages}>
                    <button className={Styles.btn} onClick={HandelPaginationPrev} disabled={Pagination.page <= 1} > {content.profile_library_back_btn}</button>
                    <button className={Styles.btn} onClick={HandelPaginationNext} disabled={Pagination.page >= Math.ceil(Pagination.totalItem / Pagination.limit) }>{content.profile_library_next_btn}</button>
                </div>

               {showPostInLibrary &&
                    showPostInLibrary.map((post,index)=>{
                            return <div key={index} className={Styles["profile_postInLib"]}>
                                        {
                                            post && 
                                                <Post
                                                    key={index}
                                                    typepost={post.post_type} 
                                                    url={post.post.post_url}
                                                    post={post}
                                                    postid={post.post.id}
                                                    deletePost={HandelDelPostToLib}
                                                    showDelToLib
                                                    updatePost={() => handleShowFormUpdatePost(post,'postNormal')}
                                                />
                                        }
                                </div>
                    })
               }
               {showUpdatePost && (
                    <FormUpdatePost
                        showmodal={showUpdatePost}
                        setShowModal={setShowUpdatePost}
                        postUpdate={updatePost}
                        setListPostProfile={setshowPostInLibrary}
                        listPostProfile={showPostInLibrary}
                    />
                 )}
       </section>
    )
}
export function LibraryAllItem({ item , ShowsetRerenderLib , HandelShowPostInLib, HandelPaginationPrev, showListAlbum, Pagination})  {
    const [id,Setid] = useState(false);
    const [showDelAlb,setShowDelAlb] = useState(false);
    const [succes,setSucess] = useState(false);
    const [showEditAlb,setShowEditAlb] = useState(false)
    let idLib1 = item.collection.id;
    const handleClickDel = ()=>{
        setShowDelAlb(!showDelAlb);
        Setid(item.collection.id)
    }
    const handleClickEdit= ()=>{
        setShowEditAlb(!showEditAlb);
        Setid(item.collection.id)
    }
    // const ShowSuccess = ()=>{
    //     setSucess(!succes)
    // }
    const HandelShowPost = ()=>{
        HandelShowPostInLib(idLib1)
    }
    return (
        <div onClick={HandelShowPost}>
            <div className={Styles.library_items_img} >
                <img src={item.collection.avatar} alt="" width="100%" height="100%" />
            </div>
            <div className={Styles.library_items_dis}>
                <div className={Styles.library_items_title}>
                    <span>{item.collection.title}</span>
                </div>
                <div className={Styles.libraru_items_active}>
                    <FaTrashAlt onClick={handleClickDel} className={Styles.libraru_items_active_img} /> 
                    {showDelAlb  && <AlbumDel id={id} ShowsetRerenderLib={ShowsetRerenderLib} handleClickDel={handleClickDel} HandelPaginationPrev={HandelPaginationPrev} showListAlbum={showListAlbum} Pagination={Pagination} HandelShowPostInLib={HandelShowPostInLib}/>}
                    {/* {succes && <PopupDelAlbumSuccess/>} */}
                    <FaPen onClick={handleClickEdit} className={Styles.libraru_items_active_img} />       
                    {showEditAlb && <EditAlbum value={item.collection.title}  ShowsetRerenderLib={ShowsetRerenderLib} handleClickEdit={handleClickEdit}  id={id}/>} 
                </div>
            </div>
        </div>
    )
}