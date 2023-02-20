import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { lazy, Suspense, useRef, useState, useEffect } from "react";
import { FaGlobeAsia, FaPlay } from "react-icons/fa";
import {RiGitRepositoryPrivateFill} from 'react-icons/ri'
import { getCookieUserLogin } from "../../modules/Cookies/Auth/userLogin";
import { formatCaption } from "../../modules/Posts/format-caption";
import mapTime from "../../modules/Time/mapTime";
import FormatCreatePost from "../../modules/Time/formatCreatePost"
import logoBidding from "../../public/images/logoBidding.png";
import Dropdown from "../Dropdown/Dropdowns";
import Interactive from "./component/Interactive/Interactive";
import PostShare from "./component/PostShare/PostShare.js";
import Styles from "./Post.module.css";
import { useDispatch } from "react-redux";
import { MdArrowRight } from "react-icons/md";
import PopupTagFriends from "../PopupTagFriends/PopupTagFriends";
import { deletePostThunk } from '../../redux/slices/postSlice'
import { ModalDeletePost } from "../Modal/ModalPost/ModalDeletePost";
import ButtonPermit from "../Button/Button-Agreed-Denied-Post-Group/Button"
import Router from "next/router";
import API, { endpoints, headers } from "../../API";

//useFacebookimport BodyPostYoutube from "./component/BodyPostYoutube/BodyPostYoutube";
const BodyPostYoutube = lazy(() =>
  import("./component/BodyPostYoutube/BodyPostYoutube")
);
const BodyPostFacebook = lazy(() =>
  import("./component/BodyPostFacebook/BodyPostFacebook")
);
const BodyPostTwitch = lazy(() =>
  import("./component/BodyPostTwitch/BodyPostTwitch")
);
const BodyPostTiktok = lazy(() =>
  import("./component/BodyPostTiktok/BodyPostTiktok")
);
const BodyPostInstagram = lazy(() =>
  import("./component/BodyPostInstagram/BodyPostInstagram")
);
const BodyPostTwitter = lazy(() =>
  import("./component/BodyPostTwitter/BodyPostTwitter")
);

var iframeId = [];

export default function Post({
  hide,
  typepost = "",
  url = "",
  postid = "",
  post,
  deletePost,
  showDelToLib,
  setPostContinue,
  setShowPostContinue,
  updatePost,
  isDeleted,
  iconBidding,
  isYoutube,
  isFacebook,
  isInstagram,
  isTikTok,
  isTwitter,
  isTwitch,
  isWithFriend,
  listPostProfile,
  setListPostProfile,
  postReviewInfo,
  setListPostReview,
  infoGroup
}) {
  const [hoverIcons, setStyle] = useState({ display: "none" });
  const [hoverTimes, setStyleTime] = useState({ display: "none" });
  const [deleted, setDeleted] = useState(false);
  const [showFullCaption, setShowFullCaption] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  // Use Redux
  const dispatch = useDispatch();

  const caption = useRef("");
  const user = getCookieUserLogin() || false;
  let owner = post.owner.id.toString();
  
  const userLogin = getCookieUserLogin();


  const [content, setContent] = useState({});

  useEffect(() => {
      if(userLogin?.language!== undefined) {
          setContent(require(`./languages/${userLogin.language}.json`));
      }else{
          setContent(require(`./languages/en.json`));
      }
  }, [userLogin])


  const handleDeletePost = (id) => {
    ModalDeletePost(dispatch, deletePostThunk, id, setDeleted, isDeleted,listPostProfile,setListPostProfile);
  };

  useEffect(() => {
    if(post.post.caption?.split("/n").length > 5 || post.post.caption?.split("/n")[0].length > 200) {
      setShowFullCaption(true)
    } else {
      setShowFullCaption(false)
    }
  },[])

  const handleShowCaption = () => {setShowFullCaption(false)}

  // var idIframe = useRef();
  // Object chứa link before và link after 
  // let obj = useRef({bef:'', aft:''});
  // const [autoplay, setAutoplay] = useState(false)
  // const [playing, setPlaying]  = useState(false)
  
  // Nhấn vào video khác thì video đang chạy sẽ tạm dừng
  // const handleClick = () => {
  //   setPlaying(!playing)
  //   iframeId.push(idIframe.current)
  //   obj.current.bef = iframeId[iframeId.length-1];
  //   obj.current.aft = obj.current.bef;
  //   obj.current.bef = iframeId[iframeId.length-2]
  //   if(iframeId.length >= 3) {iframeId.splice(0,1)}
  //   if(obj.current.aft?.getAttribute("src") !== obj.current.bef?.getAttribute("src")) {
  //     obj.current.aft?.contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*')
  //     obj.current.bef?.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*')
  //   }

  //   else {  
  //     setAutoplay(!autoplay)
  //   }
  //   console.log(obj.current)
  // }
  
  // useEffect(() => {
  //   if(autoplay) {
  //     idIframe.current?.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*')
  //   }
  //   else {
  //     idIframe.current?.contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*')
  //   }
  // },[autoplay])

  const [reRender, setRender] = useState(false);
  const [LibraryIds, setLibraryiId] = useState([]);
  useEffect(() => {
    API.get(endpoints["ListAlbum"](30, 1), { headers: headers.headers_token })
      .then(function (res) {
        setLibraryiId(res.data.data);
      })
      .catch(function (error) {});
  }, [reRender]);
  const [showlib, setShowLib] = useState(false);
  const [showReadLib, setShowReadLib] = useState(false);
  const [open, setOpen] = useState(false);
  
  const HandelshowReadLib = () => {
    setShowReadLib(!showReadLib);
  };
  const HandleToAlbum = () => {
    setShowLib(!showlib);
  };
  const ShowsetRender = () => {
    setRender(!reRender);
  };

  return (
    <>
      {!deleted && (
        <>
          <Head>
            <link rel="stylesheet" href="/css/global.css" />
            <link rel="stylesheet" href="/css/style.css" />
          </Head>

          <div className={`${Styles.profile__post__item}
             ${isYoutube && typepost === 'youtube' ? Styles.inactive__post : `${typepost === 'youtube'} ${Styles.active__post}`}
             ${isFacebook && typepost === 'facebook' ? Styles.inactive__post : `${typepost === 'facebook'} ${Styles.active__post}`}
             ${isInstagram && typepost === 'instagram' ? Styles.inactive__post : `${typepost === 'instagram'} ${Styles.active__post}`}
             ${isTikTok && typepost === 'tiktok' ? Styles.inactive__post : `${typepost === 'tiktok'} ${Styles.active__post}`}
             ${isTwitter && typepost === 'twitter' ? Styles.inactive__post : `${typepost === 'twitter'} ${Styles.active__post}`}
             ${isTwitch && typepost === 'twitch' ? Styles.inactive__post : `${typepost === 'twitch'} ${Styles.active__post}`}
             ${isWithFriend && typepost === 'with_friend' ? Styles.inactive__post : `${typepost === 'with_friend'} ${Styles.active__post}`}
           `}
           
           data-postid={postid}>
            <div className={Styles.profile__post__heading}>
              <div className={Styles.profile__post__avatar}>
                {/* <Image src={post.owner.avatar} alt="Avatar" /> */}
                <img
                  src={post.owner.avatar}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  alt="Avatar"
                />
              </div>
              <div className={Styles.profile__post__info}>
                <div className={Styles.profile__post__infoheading}>
                  {post.owner.name == undefined ? (
                    <h2 className={Styles.profile__post__user_name}>
                      {post.owner.name == undefined
                        ? "Popular"
                        : post.owner.name}
                    </h2>
                  ) : post.owner.id !== getCookieUserLogin().id ? (
                    <>
                      <Link href={`/otherprofile/${owner}`} passHref>
                        <h2 className={Styles.profile__post__user_name}>
                        {post.owner.name == undefined
                          ? "Popular"
                          : post.owner.name}
                      </h2>
                    </Link>
                    {
                      post.tag_users?.length > 0 && (
                        post.tag_users.length === 1 ? (
                          <div className={Styles.profile__post___tag__users}>
                            <div className={Styles.profile__post__tag_icon__1}>
                              <span > <MdArrowRight/> </span>
                            </div>
                            <Link passHref={`/otherprofile/${post.tag_users[0].id}`}>
                              <span className={Styles.profile__post__tag_users__1}>{post.tag_users[0].name}</span>
                            </Link>
                          </div>
                        ) : (
                          <div className={Styles.profile__post___tag__users}>
                            <div className={Styles.profile__post__tag_icon}>
                              <span > <MdArrowRight/> </span>
                            </div>
                            <div className={Styles.profile__post___show__user}>
                              <span  onClick={() => setShowPopup(true)} className={Styles.profile__post__tag_users}>{post.tag_users.length} {content.tag_user}</span>
                              <div className={Styles.profile__post__show_tag}>
                              {post.post.tag_friend.slice(0,15).map((item) => (
                                  <>
                                    <p className={Styles.profile__post__user_name_tag}> {item.name} </p>
                                    {post.post.tag_friend.length > 15 && <p className={Styles.profile__post__tag__friends}> & {post.post.tag_friend.length - 15} others </p>}
                                  </>
                                ))}
                              </div>
                            </div>
                          </div>
                        )
                      )
                    }
                    </>
                  ) : (
                    <>
                      <Link href={`/profile`} passHref>
                      <h2 className={Styles.profile__post__user_name}>
                        {post.owner.name == undefined
                          ? "Popular"
                          : post.owner.name}
                      </h2>
                    </Link>
                        {
                          post.post.tag_friend?.length > 0 && (
                            post.post.tag_friend.length === 1 ? (
                              <div className={Styles.profile__post___tag__users}>
                                <div className={Styles.profile__post__tag_icon__1}>
                                  <span > <MdArrowRight/> </span>
                                </div>
                                <Link passHref={`/otherprofile/${post.post.tag_friend[0].id}`}>
                                  <span className={Styles.profile__post_.post_tag_friend__1}>{post.tag_users[0].name}</span>
                                </Link>
                              </div>
                            ) : (
                              <div className={Styles.profile__post___tag__users}>
                                <div className={Styles.profile__post__tag_icon}>
                                  <span > <MdArrowRight/> </span>
                                </div>
                                <div className={Styles.profile__post___show__user}>
                                  <span  onClick={() => setShowPopup(true)} className={Styles.profile__post__tag_users}>{post.tag_users.length} {content.tag_user}</span>
                                  <div className={Styles.profile__post__show_tag}>
                                    {post.tag_users.map((item, index) => (
                                      <p key={index} className={Styles.profile__post__user_name_tag}>{item.name}</p>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )
                          )
                        }
                    </>
                  )}

                  {showPopup && <PopupTagFriends setShowPopup={setShowPopup}
                    handleClick={() => setShowPopup(false)} post={post}/>}
                  
                  {iconBidding && 
                    <div className={Styles.profile__post__bidding}> 
                      <Image style={{width: '100%'}}  src={logoBidding} alt="Icon Bidding" /> 
                    </div>}
                </div>
                
                <div className={`${Styles.profile__post_time_container}`}>
                  <div className={`${Styles.profile__post_time}`}  onClick={() => Router.push(`/post/${postid}`)}>
                    <p className={Styles.post__timeline}
                      onMouseEnter={(e) => {
                        setStyleTime({ display: "block" });
                      }}
                      onMouseLeave={(e) => {
                        setStyleTime({ display: "none" });
                      }}
                    >
                      {post.post.updated_at > post.post.created_at
                        ?
                        <>
                          <span>{mapTime(post.post.updated_at)}</span>
                        </>
                        :
                        mapTime(post.post.updated_at)
                      }
                    </p>
                  </div>
                  <div className={Styles.profile__post__global}>
                      { post.post.post_access && post.post.post_access === 2 ? (
                        < RiGitRepositoryPrivateFill
                        className={Styles.global__private}
                        onMouseEnter={(e) => {
                          setStyle({ display: "block" });
                        }}
                        onMouseLeave={(e) => {
                          setStyle({ display: "none" });
                        }}
                      />
                      ) : (
                        < FaGlobeAsia
                          className={Styles.global__private}
                          onMouseEnter={(e) => {
                            setStyle({ display: "block" });
                          }}
                          onMouseLeave={(e) => {
                            setStyle({ display: "none" });
                          }}
                        />
                      )}
                      <span className={Styles.public__private} style={hoverIcons}>
                        {post.post.post_access === 2 ? content.private : content.public}
                      </span>
                      {/* <Image src={Polygon2} alt="Icon Dropdown" /> */}
                    </div>
                </div>
                
                <span className={Styles.time__post} style={hoverTimes}>
                  {/* {formatCreatePost(post.post.created_at, userLogin.language)} */}
                  <FormatCreatePost postCreateDateFormat={post.post.updated_at} currentLanguage={userLogin?.language}/>
                </span>
              </div>
              {hide === undefined && hide !== "hide" && (
                <Dropdown
                  postId={postid}
                  deletePost={deletePost}
                  isUser={owner === user.id}
                  post={post}
                  showDelToLib={showDelToLib}
                  setPostContinue={setPostContinue}
                  setShowPostContinue={setShowPostContinue}
                  updatePost={updatePost}
                  typepost={typepost}
                  handleDeletePost={handleDeletePost}
                />
              )}
            </div>

            <div className={Styles.profile__post__main}>
              <div className={Styles.profile__post__content}>
                {post !== null && post !== undefined ? (
                  <p
                    ref={caption}
                    className={` ${Styles.profile__post__content__captions} ${!showFullCaption && Styles.activeFullCaption}`}
                  >
                    {formatCaption(post.post.caption)}
                   
                  </p>
                ) : (
                  <p className={Styles.profile__post__content__captions}>
                    {typepost}
                  </p>
                )}
                 {showFullCaption && <span className={Styles.readmore__caption} onClick={handleShowCaption}>{content.read_more}</span>}
                {typepost == "normal" && <PostShare />}

                {typepost == "youtube" && (
                  <>
                    <Suspense fallback={<div></div>}>
                      {/* <div className={Styles.iframe__youtube}>
                          <div className={Styles.button_youtube} onClick={handleClick}></div>
                          <div className={Styles.button_small_youtube} onClick={handleClick}></div>
                      </div> */}
                        <BodyPostYoutube url={url} />
                  </Suspense>
                  </>
                )}
                {typepost == "facebook" && (
                  <>
                    <Suspense fallback={<div></div>}>
                      <BodyPostFacebook dataHref={url} className={"fb-post"} />
                    </Suspense>
                  </>
                )}
                {typepost == "twitch" && (
                  <>
                    <Suspense fallback={<div></div>}>
                      <BodyPostTwitch post={post} url={url} />
                    </Suspense>
                  </>
                )}
                {typepost == "tiktok" && (
                  <>
                    <Suspense fallback={<div></div>}>
                      <BodyPostTiktok url={url} />
                    </Suspense>
                  </>
                )}
                {typepost == "instagram" && (
                  <>
                    <Suspense fallback={<div></div>}>
                      <BodyPostInstagram url={url} id={post.post.id} />
                    </Suspense>
                  </>
                )}
                {typepost == "twitter" && (
                  <>
                    <Suspense fallback={<div></div>}>
                      <BodyPostTwitter url={url} />
                    </Suspense>
                  </>
                )}
              </div>
              { post.group_name? <div style={{padding: "10px 0 10px 15px"}}>
                <ButtonPermit 
                postReviewInfo={postReviewInfo} 
                setListPostReview={setListPostReview}
                idGroup={infoGroup.id}
                post_id={postid}
                isDeleted={isDeleted}
                />
              </div> : <Interactive 
                        LibraryIds={LibraryIds}
                        postID={post.post.id}
                        post={post}
                        open={open}
                        setOpen1={setOpen}
                        HandelshowReadLib={HandelshowReadLib}
                        HandleToAlbum={HandleToAlbum}
                        ShowsetRender={ShowsetRender} hide={hide}
                        showlib={showlib}
                        />}
            </div>
          </div>
        </>
      )}
    </>
  );
}
