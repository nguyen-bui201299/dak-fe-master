import { useEffect, useRef, useState } from 'react';
import { AiFillCaretDown, AiOutlineGlobal } from "react-icons/ai";
import { FaAngleLeft, FaSearch, FaUserPlus } from "react-icons/fa";
import { IoClose, IoEarth } from 'react-icons/io5';
import { RiGitRepositoryPrivateLine } from "react-icons/ri";
import { animated, useSpring } from 'react-spring';
import API, { endpoints, headers } from '../../API';
import { NotificationToast } from '../../modules/Notification/Notification';
import Styled from './FormSharePost.module.css';
import InputContentSharePost from "./InputContentSharePost/InputContentSharePost";
import io from "socket.io-client";
import { getCookieUserLogin, getTokenUserLogin } from '../../modules/Cookies/Auth/userLogin';


const socket= io.connect(
    "http://chat.dakshow.com", {
    // path: "/socket",
    transports: ["websocket"],
    auth: {
        token: getTokenUserLogin(),
}})


import {
    FaTiktok,
    FaFacebook,
    FaTwitter,
    FaYoutube,
    FaTwitch,
} from "react-icons/fa"

import {
    AiFillInstagram
} from "react-icons/ai"

import {
    SiApostrophe
} from "react-icons/si"
import { useBoxChatContext } from '../BoxChat/BoxChatContext';




export default function FormSharePost({showModal, setShowModal, post, isMessSharing}) {
    const modalRef = useRef();
    const [titlePopup, setTitlePopup] = useState("Chia sẻ");
    const [openInputLink, setOpenInputLink] = useState(false); //false
    const [openFormCreatePost, setOpenFormCreatePost] = useState(true); //true
    const [openFormTagUsers, setOpenFormTagUsers] = useState(false); //false
    const [openFormChangePermission, setOpenFormChangePermission] = useState(false)
    const [caption, setCaption] = useState('')
    const [permission, setPermission] = useState("public");


    const [debounced, setDebouncedValue] = useState("");

    const [searchResult, setSearchResult] = useState([]);
    const [taged, setTaged] = useState([]);
    const [searchValue, setSearchValue] = useState("");

    //Lấy thông thôngtin người dùng từ redux
    const userLogin = getCookieUserLogin()

    const [content, setContent] = useState({});


    var context = useBoxChatContext();

    const updateMessPost = (user_id) => {
        var axios = require("axios");
        var config = {
            method: "get",
            url: `http://chat.dakshow.com/api/conversation?page=1`,
            headers: headers.headers_token,
          };

          axios(config)
          .then(function (response) {
            var fetchData = response.data.data.filter(conver => conver.conversation.user.id === user_id)
            var conver = fetchData[0]
            var arr = context.boxchat;
            var arrNew = arr.filter((item) => item?.conversation.id != conver?.conversation.id );
            var arrNoti = context.listChatNoti.filter((item) => item.conversation?.id != conver.conversation.id);
            // let urlOrg = window.location.origin;
            arrNew.push(conver);
            context.setBoxChat(arrNew);
            context.setListChatNoti(arrNoti);
            context.setChange(!context.change);

            // const messdata = {
            //   content: `${urlOrg}/post/${post.post.id}`,
            //   from: getTokenUserLogin().id,
            //   time: new Date().getTime(),
            //   link: [],
            //   social_type: [getUrlType([])],
            //   user: {
            //     username: getTokenUserLogin().name,
            //   },
            // };
            // var newConver = conver.message_data.data.push(messdata);
            // console.log(newConver);
            // context.setBoxChat(newConver);
            // context.setChange(!context.change);
            // context.setRender((prev) => !prev);

          })
          .catch(function (error) {});
    }



    const openBoxChat = (user_id) => {
        var axios = require("axios");

        var config = {
          method: "get",
          url: `http://chat.dakshow.com/api/conversation?page=1`,
          headers: headers.headers_token,
        };

        axios(config)
          .then(function (response) {
            var fetchData = response.data.data.filter(conver => conver.conversation.user.id === user_id)
            var conver = fetchData[0]
            var arr = context.boxchat;
            var arrNew = arr.filter((item) => item?.conversation.id != conver?.conversation.id );
            var arrNoti = context.listChatNoti.filter((item) => item.conversation?.id != conver.conversation.id);
            let urlOrg = window.location.origin;
            arrNew.push(conver);
            context.setBoxChat(arrNew);
            context.setListChatNoti(arrNoti);
            context.setChange(!context.change);
            socket.emit(
              "SEND_MESSAGE",
              {
                send_to: conver.conversation.member,
                content: `${urlOrg}/post/${post.post.id}`,
                type: 1,
                time: new Date().getTime(),
                conversation_id: conver.conversation.id,
                message_data_id: conver.message_data.id,
              },
              () => {
                // console.log("share socket");
                updateMessPost(user_id)
              }
            );

            const messdata = {
              content: `${urlOrg}/post/${post.post.id}`,
              from: getTokenUserLogin().id,
              time: new Date().getTime(),
              link: [],
              social_type: [getUrlType([])],
              user: {
                username: getTokenUserLogin().name,
              },
            };

            var newConver = conver.message_data.data.push(messdata);
            context.setBoxChat(newConver);
            // context.setRender((prev) => !prev);

          })
          .catch(function (error) {});

        updateMessPost(user_id)
      };

    useEffect(() => {
        if(userLogin.language!== undefined) {
            setContent(require(`./languages/${userLogin.language}.json`));
        }else{
            setContent(require(`./languages/en.json`));
        }
    }, [])


    useEffect(() => {
        if (isMessSharing===true) {
            setTitlePopup(content.form_create_post_title4);
        } else {
            setTitlePopup(content.form_create_post_title1);
        }
      }, [content])

    // console.log(isMessSharing);

    // Debounce search value
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(searchValue);
      }, 500);
      return () => clearTimeout(handler);
    }, [searchValue]);

    // Search friends

    const animation = useSpring({
        config: {
            duration: 200
        }, opacity: showModal ? 1 : 0,
        transform: showModal ? 'translateY(0%)' : `translateY(100%)`
    })

    const closeModal = e => {
        if (modalRef.current === e.target) {
            setShowModal(false)
        }
        setCaption("")
    };

    const handleShowInputLink = () => {
        setOpenInputLink(!openInputLink);
    }

    const handleShowFormTagUsers = () => {
        setTitlePopup(content.form_create_post_title2);
        setOpenFormCreatePost(!openFormCreatePost);
        setOpenFormTagUsers(!openFormTagUsers);
    }

    //prev = 1 là form create post
    const handlePassPreForm = () => {
        setTitlePopup(content.form_create_post_title1);
        setOpenFormCreatePost(true);
        setOpenFormTagUsers(false);
        setOpenFormChangePermission(false)
    }

    const handleAddUserTag = (event, id, action) => {
        for (var i = 0; i < searchResult.length; i++) {
          if (searchResult[i].user.id === id) {
            // Add check to checked item
            setSearchResult((prev) => [...prev], (searchResult[i].user.check = action));
            const index = taged.findIndex(item => item.user.id === id);
            // add friend taged
            if(action){
              if(index >=0) return;
              if(index < 0) setTaged((prev) => [...prev, searchResult[i]]);
            }

            //remove taged
            if(!action){
              const tagedSlice = taged.splice(index, 1);
              const newTaged = taged.filter((prev) => prev.user !== tagedSlice.user);
              setTaged(newTaged);
            }
            break;
          }
        }
        setDebouncedValue("");
        setSearchValue("");
      };

      const handleFindFriends =()=>{
        API.get(endpoints.findFriends(10, 1, debounced), {
          headers: headers.headers_token,
        })
          .then((res) => {
            const data = res.data.data;
            setSearchResult(data);
            if(taged.length>0){
              for (var i = 0; i < taged.length; i++) {
                for (var j = 0; j < data.length; j++) {
                  if (data[j].user.id === taged[i].user.id) {
                    setSearchResult((prev) => [...prev], (data[j].user.check = true));
                  }
              }}
            }
            setSearchResult(data);
          })
          .catch((err) => console.log("err",err));
      }

      useEffect(() => {
        handleFindFriends();
      }, [debounced]);

      const sharePost = () => {
        setCaption("");
        setTaged([]);
        setSearchResult([]);
        API.post(
            endpoints['sharepost'],
          {
            "caption": caption,
            "post_id": post.post.id,
            "tag_friend": taged.map((user) => user.user.id) || [],
          },
          { headers: headers.headers_token }
        )
          .then((res) => {
            if (res.data.success) {
              NotificationToast.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: `${content.form_create_post_noti_success}`,
              })
            }
          })
          .catch((err) => console.log(err));

          setShowModal(false);
      };

    const handleShowFormChangePermission = () => {
        setTitlePopup(content.form_create_post_title3)
        setOpenFormChangePermission(true)
        setOpenFormCreatePost(false);
        setOpenFormTagUsers(false);
    }

    useEffect(() => {
        setCaption(userLogin.name);
    },[])

    const removeAll = () => {
        for (let i = 0; i < searchResult.length; i++) {
            if(searchResult[i].user.check == true) {
                searchResult[i].user.check = false
            }
        }
        const tagedSlice = taged.splice(0, taged.length);
        const newTaged = taged.filter((prev) => prev.user !== tagedSlice.user);
        setTaged(newTaged);
    }

    return(
        <>
        {showModal &&
            <div className={Styled.overlayFormCreatePost} ref={modalRef} onClick={closeModal}>
                <animated.div style={animation} className={Styled.FormCreatePostBox}>
                    <div className={isMessSharing? Styled.formSharePostMess : Styled.formCreatePost} showModal={showModal}>
                        <div className={Styled.formHeader}>
                            <h2 className={Styled.formTitle}>{
                                titlePopup
                            }</h2>
                            <button className={Styled.btnGetOut} onClick={() => setShowModal(prev => !prev)}>
                                <i className="fa-solid fa-x"></i>
                            </button>
                        </div>

                        { !isMessSharing ?
                            <div className={Styled.formBody}>
                                { openFormCreatePost &&
                                    <div className={Styled.createPost}>
                                        <div className={Styled.avtAndName}>
                                            <img className={Styled.avt} src={userLogin.avatar} alt="Avatar"/>
                                            <h2 className={Styled.name} > {userLogin.name} </h2>
                                            <div className={Styled.viewingRights} onClick={handleShowFormChangePermission}>
                                            {permission === "public"  && <IoEarth className={Styled.iconViewingRights} />}
                                            {permission === "private" && <RiGitRepositoryPrivateLine className={Styled.iconViewingRights}/>}
                                                <AiFillCaretDown className={Styled.iconDown}/>
                                            </div>
                                        </div>
                                        <div className={Styled.inputLinkAndContent}>
                                            <InputContentSharePost setCaption={setCaption} caption={caption}/>
                                            <span className={Styled.linkUrl}>{post.post.post_url}</span>
                                            <div className={Styled.boxFunctionAndBtnPost}>
                                                <div className={Styled.boxFunction}>
                                                    <FaUserPlus className={Styled.iconFunction} onClick={handleShowFormTagUsers}/>
                                                </div>
                                                <div className={Styled.boxBtnPost} onClick={sharePost}>
                                                    <button className={Styled.btnPost}>{content.form_create_post_title1}</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }

                                {openFormChangePermission &&
                                    <div className={Styled.formChoosePermission}>
                                        <div className={Styled.pass} onClick={(event) => handlePassPreForm(event)}>
                                            <FaAngleLeft className={Styled.iconPass} />
                                            <h4 className={Styled.titleFormPost}>{content.form_create_post_title1}</h4>
                                        </div>
                                        <form className={Styled.areaChoosePermission}>
                                            <div className={Styled.areaPress}>
                                                <AiOutlineGlobal className={Styled.iconPermission}/>
                                                <label className={Styled.choosePermission}>
                                                    {content.form_create_post_public}
                                                    <input
                                                    className={Styled.inputChoose}
                                                    type="radio"
                                                    value="all"
                                                    name="permission"
                                                    checked={permission === "public" ? true : false}
                                                    onClick={()=>setPermission('public')}/>
                                                </label>
                                            </div>
                                            <div className={Styled.areaPress}>
                                                <RiGitRepositoryPrivateLine />
                                                <label className={Styled.choosePermission}>
                                                    {content.form_create_post_privicy}
                                                    <input
                                                    className={Styled.inputChoose}
                                                    type="radio"
                                                    value="alone"
                                                    name="permission"
                                                    checked={permission === "private" ? true : false}
                                                    onClick={()=>setPermission('private')}
                                                    />
                                                </label>
                                            </div>
                                            {/* <button className={Styled.btnSavePermission}> Lưu </button> */}
                                        </form>
                                    </div>
                                }

                                {openFormTagUsers &&
                                    <div className={Styled.formTagsUser}>
                                        <div className={Styled.pass} onClick={(event) => handlePassPreForm(event)}>
                                            <FaAngleLeft className={Styled.iconPass} />
                                            <h4 className={Styled.titleFormPost}>{content.form_create_post_title1}</h4>
                                        </div>

                                        <div className={Styled.boxInputSearch}>
                                            <input
                                                className={Styled.inputSearch}
                                                placeholder={content.form_create_post_search_placeholder}
                                                onChange={(e) => setSearchValue(e.target.value)}
                                                value={searchValue}
                                            />
                                            <FaSearch className={Styled.buttonSearch}/>
                                        </div>
                                        {
                                            taged.length > 0 &&
                                            <p
                                                className={Styled.clearList}
                                                onClick={removeAll}
                                            >
                                                Xóa tất cả
                                            </p>
                                        }

                                        <div className={Styled.taggedUserList}>
                                            <p className={Styled.title}>{content.form_create_post_tags_title} </p>
                                            {taged.length > 0 &&
                                                taged.map(
                                                (user) =>
                                                (
                                                    <div
                                                        className={Styled.user}
                                                        key={user.user.id}
                                                        onClick={(event) =>
                                                        handleAddUserTag(event, user.user.id, false)
                                                        }
                                                    >
                                                        <h2 className={Styled.name}>
                                                        {user.user.name}
                                                        </h2>
                                                        <IoClose
                                                        className={Styled.close}
                                                        />
                                                    </div>
                                                    )
                                                )}
                                        </div>

                                        <div className={Styled.usersSearchResults}>
                                        {searchResult.map((user) => (
                                            <div className={Styled.user} key={user.user.id}>
                                            <img className={Styled.avt} src={user.user.avatar} alt="Avatar"/>
                                            <h2
                                                className={Styled.name}
                                                onClick={(event) =>
                                                handleAddUserTag(
                                                    event,
                                                    user.user.id,
                                                    !user.user.check
                                                )
                                                }
                                            >
                                                {user.user.name}
                                            </h2>
                                            <div
                                                className={`${user.user.check && Styled.checkBox}
                                                ${user.user.check && Styled.checkBox2}
                                                ${!user.user.check && Styled.checkBox3}`}
                                                onClick={(event) =>
                                                handleAddUserTag(
                                                    event,
                                                    user.user.id,
                                                    !user.user.check
                                                )
                                                }
                                            ></div>
                                            </div>
                                        ))}
                                        </div>
                                    </div>
                                }
                            </div>
                            :
                            <div className={Styled.formBodyShareMess}>
                                { openFormCreatePost &&
                                        <div className={Styled.sharePostMess}>
                                            <div className={Styled.sharePostMess_head}>
                                                <div className={Styled.sharePostMess_head_left}>
                                                    <div className={Styled.sharePostMess_head_left_user}>
                                                        <img className={Styled.avt} src={post.owner.avatar} alt="Avatar"/>
                                                        <h2 className={Styled.name} >{!!post.owner.name? post.owner.name : 'Popular'}</h2>
                                                    </div>

                                                    <div className={Styled.sharePostMess_head_left_content}>
                                                        <p>{post.post.caption}</p>
                                                    </div>
                                                </div>
                                                <div className={Styled.sharePostMess_head_right}>
                                                    <div className={Styled.sharePostMess_head_right_container}>

                                                        {!!post.tag_users == true &&
                                                        post.post.post_url_type !== "youtube" &&
                                                        post.post.post_url_type !== "facebook" &&
                                                        post.post.post_url_type !== "twitch" &&
                                                        post.post.post_url_type !== "tiktok" &&
                                                        post.post.post_url_type !== "twitter" &&
                                                        post.post.post_url_type !== "instagram" &&
                                                        (
                                                            <SiApostrophe style={{color: '#f9d205'}} size={35}/>
                                                        )}
                                                        {post.post.post_url_type == "normal" && (
                                                            <SiApostrophe style={{color: '#f9d205'}} size={35}/>
                                                        )}
                                                        {post.post.post_url_type == "youtube" && (
                                                            <FaYoutube style={{color: 'red'}} size={50}/>
                                                        )}
                                                        {post.post_type == "youtube" && (
                                                            <FaYoutube style={{color: 'red'}} size={50}/>
                                                        )}
                                                        {post.post.post_url_type == "facebook" && (
                                                            <FaFacebook style={{color: '#1974ec'}} size={40} />
                                                        )}
                                                        {post.post_type == "facebook"  && (
                                                            <FaFacebook style={{color: '#1974ec'}} size={40} />
                                                        )}
                                                        {post.post.post_url_type == "twitch"&& (
                                                            <FaTwitch style={{color: 'black'}} size={40} />
                                                        )}
                                                        {post.post_type == "twitch" && (
                                                            <FaTwitch style={{color: 'black'}} size={40} />
                                                        )}
                                                        {post.post.post_url_type == "tiktok"&& (
                                                            <FaTiktok style={{color: 'black'}} size={40} />
                                                        )}
                                                        {post.post_type == "tiktok" && (
                                                            <FaTiktok style={{color: 'black'}} size={40} />
                                                        )}
                                                        {post.post_type == "instagram" && (
                                                            <AiFillInstagram style={{color: '#7f3eb1'}} size={40}/>
                                                        )}
                                                        {post.post.post_url_type == "instagram" && (
                                                            <AiFillInstagram style={{color: '#7f3eb1'}} size={40}/>
                                                        )}
                                                        {post.post.post_url_type == "twitter" && (
                                                            <FaTwitter style={{color: '#009dec'}} size={50}/>
                                                        )}
                                                        {post.post_type == "twitter" && (
                                                            <FaTwitter style={{color: '#009dec'}} size={50}/>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={Styled.sharePostMess_body}>
                                                <div className={Styled.sharePostMess_body_friend}>
                                                    <div className={Styled.sharePostMess_body_friend_title}>
                                                        <h3>List Friends</h3>
                                                    </div>
                                                    <div className={Styled.sharePostMess_body_friend_list}>
                                                        <div className={Styled.boxInputSearch}>
                                                                <input
                                                                    className={Styled.inputSearch}
                                                                    placeholder={content.form_create_post_search_placeholder}
                                                                    onChange={(e) => setSearchValue(e.target.value)}
                                                                    value={searchValue}
                                                                />
                                                                <FaSearch className={Styled.buttonSearch}/>
                                                        </div>

                                                        <div className={Styled.taggedUserList}>
                                                            <p className={Styled.title}>{content.form_create_post_send_title} </p>
                                                        </div>

                                                        <div className={Styled.usersSearchResults}>
                                                            {searchResult.map((user,index) => (
                                                                <SearchItem key={index} user={user} openBoxChat={openBoxChat} />
                                                            ))}
                                                    </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                }


                            </div>
                        }
                    </div>
                </animated.div>
            </div>
        }
        </>
    );
}

const SearchItem = ({user,openBoxChat}) =>{
    const [isSendPost,setIsSendPost]=useState(false)
    useEffect(() => {console.log(isSendPost)},[isSendPost])
    return(
        <div className={Styled.user} key={user.user.id}>
            <img className={Styled.avt} src={user.user.avatar} alt="Avatar"/>
            <h2
                className={Styled.name}
            >
                {user.user.name}
            </h2>
            {isSendPost ?
            <div
            style={{display: 'flex', alignItems: 'center',justifyContent: 'center', width: '80px', height: '30px', backgroundColor: 'gray', fontWeight: '600', borderRadius: '10px', cursor: 'default'}}

            >
                Đã Gửi
            </div>
            :
            <div
                style={{display: 'flex', alignItems: 'center',justifyContent: 'center', width: '80px', height: '30px', backgroundColor: 'var(--main-color)', fontWeight: '600', borderRadius: '10px', cursor: 'pointer'}}
                onClick={() => {
                    openBoxChat(user.user.id)
                    setIsSendPost(true)
                }}
                >
                    Gửi
            </div>
            }
        </div>
    )
}