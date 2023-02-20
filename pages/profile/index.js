import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSelector, useDispatch} from "react-redux";
import { FaEdit, FaRegEdit, FaUserCircle, FaUserEdit } from "react-icons/fa";
import { RiImageEditFill, RiUserAddFill, RiUserFollowFill } from "react-icons/ri";
import { ToastContainer } from "react-toastify";
import API, { endpoints, headers } from "../../API";
import FormCreatePost from "../../components/FormCreatePost/FormCreatePost";
import Layout from "../../components/Layout/Layout";
import PopupContinueWatching from "../../components/PopupContinueWatching/PopupContinueWatching";
import PopupEditProfile from "../../components/PopupEditProfile/PopupEditProfile";
import PopupInteractive from "../../components/PopupInteractive";
import PopupAvatar from "../../components/PopupAvatar";
import Post from "../../components/Post/Post";
import { getCookieUserLogin, getExpiredToken } from "../../modules/Cookies/Auth/userLogin";
import { NotificationToast } from "../../modules/Notification/Notification";
import Styles from "../../styles/Profile.module.css";
import ProfileLibrary from "./library";
import ProfileStatistic from "./statistic";
import FormUpdatePost from "../../components/FormUpdatePost/FormUpdatePost";
import Masonry from "react-masonry-css";
import { MdOutlineGeneratingTokens, MdOutlineHowToVote } from "react-icons/md";
import { fetchPostThunk, selectAllPosts } from '../../redux/slices/postSlice'
import { Fragment } from "react";


var isLoad = false;
export default function Profile() {
  const [active, setActive] = useState(0);
  const [listPostProfile, setListPostProfile] = useState([]);
  const [showPopupStatistic, setShowPopupStatistic] = useState("");
  const [userLogin, setUserLogin] = useState({});
  const [interaction, setInteraction] = useState({});
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [isDeletePost, setIsDeletePost] = useState(false);
  const pageNumber = useRef(1);
  const [follower, setFollower] = useState([])
  const [following, setFollowing] = useState([])
  const [toggle, setToggle] = useState(false);
  const [content, setContent] = useState({});
  const [language, setLanguage] = useState("en"); //Lưu ngôn ngữ đang chọn
  const [style, setStyle] = useState({ right: "134px" });
  const pagePostInLib = useRef(1);
  const [showPostContinue, setShowPostContinue] = useState(false);
  const [postContinue, setPostContinue] = useState();
  const [showUpdatePost, setShowUpdatePost] = useState(false); //Kiểm tra mở form update bài viết
  const [postUpdate, setPostUpdate] = useState("");
  const [showBackground, setShowBackground] = useState(false);
  const [showPopupMoreAvatar, setShowPopupMoreAvatar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(null);

  // Use Redux
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);
  const postStatus = useSelector(state => state.posts.status)

  useEffect(() => {
    let userId = getCookieUserLogin().id;
    let currentPage = pageNumber.current;
    let limitPage = 10;
    if (postStatus === 'idle') {
      dispatch(fetchPostThunk({ userId, limitPage, currentPage }))
    }
  }, [postStatus, dispatch])
  const popupMoreAvatarRef = useRef();
  useEffect(() =>{
    let closePopupMoreAvatar = e =>{
      if(popupMoreAvatarRef.current && !popupMoreAvatarRef.current.contains(e.target)){
        setShowPopupMoreAvatar(false);
      }
    }
    document.addEventListener("click", closePopupMoreAvatar);
    return () =>{
      document.removeEventListener("click", closePopupMoreAvatar);
    }
  })

  useEffect(() => {
      API.get(endpoints['getUserFollower'](getCookieUserLogin().id, 100), {
        headers: headers.headers_token,
      })
        .then((res) => {
          setFollower(res.data.data);
        })
        .catch((err) => console.log({err}));

      API.get(endpoints['getUserFollowing'](getCookieUserLogin().id, 100), {
        headers: headers.headers_token,
      })
        .then((res) => {
          setFollowing(res.data.data);
        })
        .catch((err) => console.log({err}));
  }, [showPopupStatistic]);

  useEffect(() => {
    if (language) {
      setContent(require(`./languages/${language}.json`));
      if (language === "en") {
        setStyle({ right: "15px" });
      } else setStyle({ right: "15px" });
    }
  }, [language]);

  const filters = [
    content.profile_post,
    content.profile_library,
    content.profile_statistical,
  ];
  // const [listDetailPost, setListDetailPost] = useState([]);              //danh sách chi tiết bài viết

  const openStatistic = (str) => {
    setShowPopupStatistic(str);
    if (!str) {
      setToggle(!toggle);
    }
  };

  const [showFormCreatePost, setShowFormCreatePost] = useState(false); //Kiểm tra mở form tạo bài viết

  useEffect(() => {
    let user = getCookieUserLogin();
    API.get(endpoints.getDetailProfile(user?.id), {
      headers: headers.headers_token,
    })
      .then((res) => {
        if (res.data.success) {
          setInteraction(res.data.data);
        }
      })
      .catch((err) => {});
    setUserLogin(getCookieUserLogin());
  }, [toggle]);

  useEffect(() => {
    setLanguage(userLogin.language);
  }, [userLogin]);

  const openModal = () => {
    setShowFormCreatePost((prev) => !prev);
  };

  // Lay ra duoc bay post
  const getListPostProfile = () => {
    isLoad = true;
    setLoading(true)
    let user = getCookieUserLogin();
    let userId = user.id;
    let currentPage = pageNumber.current;
    let limitPage = 10;
    
    API.get(endpoints["getListPostProfile"](userId, limitPage, currentPage), {
      headers: headers.headers_token,
    })
      .then((res) => {
        if (res.data.success) {
          if (res.data.data.length > 0) {
            setListPostProfile((prev) => [...prev, ...res.data.data]);
            isLoad = false;
            setLoading(false)
            pageNumber.current += 1;
          } else {
            isLoad = true;
            setLoading(false)
          }
        } else {
          isLoad = false;
          setLoading(false)
        }
      })
      .catch((err) => {
        NotificationToast.fire({
          toast: true,
          position: 'top-end',
          icon: 'warning',
          title: content.profile_get_post_fail,
        })
        isLoad = false;
        setLoading(false)
        console.log(err);
      });
  };

  useEffect(() => {
    getListPostProfile()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const scrollLoadPost = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      if (!isLoad) {
        getListPostProfile();
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", scrollLoadPost);
    return () => window.removeEventListener("scroll", scrollLoadPost);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShowFormUpdatePost = (post) => {
    setShowUpdatePost(prev => !prev)
    setPostUpdate(post)
  }

  const breakpointColumnsObj = {
    default: 2,
    1100: 2,
    700: 1,
  };
  
  useEffect(() => {
    const close = (e) => {
      if(e.keyCode === 27){
        setShowBackground(false)
        setShowPopupMoreAvatar(false)
        setShowEditProfile(false)
        setShowUpdatePost(false)
        setShowPostContinue(false)
        setShowFormCreatePost(false)
        setShowPopupStatistic(false)
      }
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  },[])

  const [readBio, setReadBio] = useState(true)
  let checkLink = userLogin.bio?.split("\n");
  const linkRegexInString = /https?:\/\/\S+/g;

  const handleCheckLink = (item) => {
    let url = "";
    // find link in str
    for (const match of item.matchAll(linkRegexInString)) {
      url = match[0];
    }

    if (url) {
      let checkInStr = item.split(url);
      checkInStr = checkInStr.map((link, index) => (
        <Fragment key={`${item}-${index}`}>
          {/* if link get tag a else span */}
          {
            linkRegexInString.test(link) ? (
              <a> {link} </a>
            ) : (
              <span> {link} </span>
            )
          }

          {/* Check duplicate string and handle click link to page */}
          {
            index < checkInStr.length - 1 && 
              <a  onMouseLeave={() => setHover(null)} 
                  onMouseEnter={() => setHover(item)}
                  style={{ color: hover === item && '#f9d205'}} 
                  target="_blank" 
                  rel="noreferrer" href={url}>{url}
              </a>
          }
        </Fragment>
      ));
      return checkInStr;
    } else {
      return (
        <span>{item}</span>
      )
    }
  }
  return (
    <Layout setLanguage={setLanguage}>
      <Head>
        <title>DAK - {userLogin.name}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* // <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" /> */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </Head>
      <ToastContainer />
      <section className={Styles["profile"]}>
        <div className={Styles.themeProfile}>
          <div className={Styles.profileArea}>
            <div className={Styles.profileImageBackground}>
              {/* <Image src={Background} alt="Ảnh bìa"/> */}
              <img
                onClick={() => setShowBackground(true)}
                className={Styles.background_img}
                src={
                  userLogin !== null &&
                  userLogin !== undefined &&
                  userLogin.background_img != undefined
                    ? userLogin.background_img
                    : ""
                }
                alt="Avatar"
              ></img>
            </div>
            {showBackground && (
              <PopupAvatar
                url={interaction.background_img}
                close={setShowBackground}
              />
            )}
            <div className={Styles.infoProfile}>
              <div className={Styles.profile__cover} ref={popupMoreAvatarRef}>
                <div className={Styles.avatar__cover} 
                    onClick={() => setShowPopupMoreAvatar(prev => !prev)}>
                  <div className={Styles.avatarProfile}>
                    <img
                      className={Styles.avatar}
                      src={userLogin.avatar != undefined ? userLogin.avatar : ""}
                      alt="Avatar"
                    ></img>
                  </div>
                </div>
                  {
                    showPopupMoreAvatar && <PopupMoreAvatar 
                      interaction={interaction}
                      content={content}
                      setShowEditProfile={setShowEditProfile}
                      showEditProfile={showEditProfile}
                      setShowPopupMoreAvatar={setShowPopupMoreAvatar}
                      setUserLogin={setUserLogin}
                      language={language}
                    />
                  }
                <div className={Styles.wrapInfo}>
                  <div className={Styles.textProfile}>
                    <div className={Styles.mainInfo}>
                      <div className={Styles.nameUser}>
                        <h1 className={Styles.name}>
                          {" "}
                          {userLogin.name != undefined ? userLogin.name : ""}
                        </h1>
                      </div>
                      <ul className={Styles.listStatistic}>
                        <li
                          className={Styles.statisticItem}
                          onClick={() => {
                            openStatistic("list-follower");
                          }}
                        >
                          <RiUserAddFill />
                          <span className={Styles.quantity}>
                            {follower?.length}
                          </span>
                        </li>

                        <li
                          className={Styles.statisticItem}
                          onClick={() => {
                            openStatistic("list-following");
                          }}
                        >
                          <RiUserFollowFill />
                          <span className={Styles.quantity}>
                            {following?.length}
                          </span>
                        </li>
                        <li className={Styles.statisticItem}
                          onClick={() => {
                            openStatistic("vote-count");
                          }}
                        >
                          <p className={Styles.iconVote}>Voted</p>
                            {/* <MdOutlineHowToVote/> */}
                          <span className={Styles.quantity}>
                            {interaction.vote_count != undefined
                              ? interaction.vote_count
                              : 0}
                          </span>
                        </li>
                        <li className={Styles.statisticItem}>
                          <MdOutlineGeneratingTokens />
                          <span className={Styles.quantity__nft}>NFT</span>
                          <span className={Styles.quantity}>0</span>
                        </li>
                      </ul>
                      {showPopupStatistic === "list-follower" && (
                        <PopupInteractive
                          title="Follower"
                          count={follower?.length}
                          follower={follower}
                          closePopup={openStatistic}
                          language={language}
                        />
                      )}
                      {showPopupStatistic === "list-following" && (
                        <PopupInteractive
                          title="Following"
                          count={following?.length}
                          following={following}
                          closePopup={openStatistic}
                          language={language}
                        />
                      )}
                      {showPopupStatistic === "vote-count" && (
                        <PopupInteractive
                          title="Vote"
                          count={interaction.vote_count}
                          // vote={}
                          closePopup={openStatistic}
                          language={language}
                        />
                      )}
                      <p className={Styles.captionUser}>
                        {
                          checkLink?.length > 4 && readBio ? (
                            checkLink?.slice(0,4).map((item, index) => (
                              <Fragment key={index}>
                                {handleCheckLink(item)} <br/>
                              </Fragment>
                            ))
                          ) : checkLink?.map((item, index) => (
                            <Fragment key={index}>
                              {handleCheckLink(item)} <br/>
                            </Fragment>
                          ))
                        }
                        {
                          readBio && checkLink?.length > 4 ? <span className={Styles.readBio} onClick={() => setReadBio(false)}>Show more</span> : !readBio ? <span className={Styles.readBio} onClick={() => setReadBio(true)}>Show less</span> : ""
                        }
                      </p> 
                      {/* <div className={Styles.btnTaoTin}>
                                            <AiOutlinePlusCircle /> { content.profile_create_news }
                                        </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div 
            className={Styles.editMenu} 
            onClick={() => setShowEditProfile(!showEditProfile)}
          >
            <FaUserEdit className={Styles.editMenuIcon}/>
          </div>
          {/* <div
            className={Styles.btnChinhSua}
            style={style}
            onClick={() => setShowEditProfile(!showEditProfile)}
          >
            <FaEdit /> {content.profile_edit}
            
          </div> */}
        </div>
        <div className={Styles["profile__statistic"]}>
          <ul className={Styles["profile__statistic-list"]}>
            {filters.map((filter, index) => (
              <li
                className={`${Styles["profile__statistic-item"]} ${
                  Styles["hover"]
                } ${active === index ? Styles["active"] : ""}`}
                onClick={(e) => {
                  setActive(index);
                }}
                key={index}
              >
                <a className={Styles["profile__statistic-title"]}>{filter}</a>
              </li>
            ))}
          </ul>
          {/* <button className={Styles["btnCreatePost profile_active-btn"]} onClick={openModal}> */}
          {active === 0 && 
          <button 
            className={`${Styles.btnCreatePost}`}
            onClick={openModal}  
          >
            <FaRegEdit className={Styles["profile__icon-edit"]} />
            <span> {content.profile_create_post}</span>
          </button>}
        </div>
        {active === 0 && (
          <div className={Styles["header__create"]}>
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my_masonry_grid_column"
            >
              {listPostProfile &&
                listPostProfile.map((post, index) => {
                  if (post) {
                    if (post.post) {
                      return (
                        <Post
                          key={post.post.id}
                          typepost={post.is_post_share ? post.post_main.post_url_type : post.post.post_url_type}
                          url={post.is_post_share ? post.post_main.post_url : post.post.post_url}
                          post={post}
                          postid={post.post.id}
                          setPostContinue={setPostContinue}
                          setShowPostContinue={setShowPostContinue}
                          updatePost={() => handleShowFormUpdatePost(post)}
                        />
                      );
                    }
                  }
                })}
            </Masonry>
          </div>
        )}
        {active === 1 && <ProfileLibrary language={language} />}
        {active === 2 && <ProfileStatistic language={language} />}
      </section>

      {/* <PopupStatistic showModal={showPopupStatistic} setShowModal={setShowPopupStatistic}/>  */}
      {showEditProfile && (
        <PopupEditProfile
          handleClick={() => setShowEditProfile(!showEditProfile)}
          setShowEditProfile={setShowEditProfile}
          setUserLogin={setUserLogin}
          language={language}
        />
      )}

      {showFormCreatePost && ( <FormCreatePost
        language={language}
        showmodal={showFormCreatePost}
        setShowModal={setShowFormCreatePost}
        setListPostProfile={setListPostProfile}
        setShowFormCreatePost={setShowFormCreatePost}
      />
      )}

      {showUpdatePost && (
        <FormUpdatePost
          showmodal={showUpdatePost}
          setShowModal={setShowUpdatePost}
          postUpdate={postUpdate}
          setListPostProfile={setListPostProfile}
          listPostProfile={listPostProfile}
          setIsDeletePost={setIsDeletePost}
          isDeletePost={isDeletePost}
        />
      )}

      {showPostContinue && postContinue && (
        <PopupContinueWatching
          post={postContinue}
          showModal={showPostContinue}
          setShowModal={setShowPostContinue}
        />
      )}
     {loading && <AiOutlineLoading3Quarters className={Styles.loading} />}
    </Layout>
  );
}

export function PopupMoreAvatar({ interaction, content, setUserLogin, language , showEditProfile, setShowEditProfile, setShowPopupMoreAvatar}) {
  const [showAvatar, setShowAvatar] = useState(false);
  const handleEdit = () =>{
    setShowEditProfile(!showEditProfile)
    setShowPopupMoreAvatar(false);
  }
  return(
    <>
      <div className={Styles.moreAvatar}>
        {/* <div className={Styles.arrowTop}></div> */}
        <div className={Styles.popupMoreAvatar_container}>
          <button 
            onClick={() => setShowAvatar(true)}
            className={Styles.btnMoreAvatar}
          >
            <FaUserCircle className={Styles.icon_avatar} />
            {content.profile_watch_avatar}
          </button>
          
          <button 
            onClick={handleEdit}
            className={Styles.btnMoreAvatar}
          >
            <RiImageEditFill className={Styles.icon_avatar} />
            {content.profile_update_avatar}
          </button>
        </div>
        {showEditProfile && (
          <PopupEditProfile
          handleClick={() => setShowEditProfile(!showEditProfile)}
          setShowEditProfile={setShowEditProfile}
          setUserLogin={setUserLogin}
          language={language}
          />
          )}
      </div>
      {showAvatar && (
        <PopupAvatar url={interaction.avatar} close={setShowAvatar} />
      )}
    </>
  )
}