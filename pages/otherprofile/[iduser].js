import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RiUserFollowFill, RiUserAddFill } from "react-icons/ri";
import { ToastContainer } from "react-toastify";
import API, { endpoints, headers } from "../../API";
import Layout from "../../components/Layout/Layout";
import PopupInteractive from "../../components/PopupInteractive";
import Post from "../../components/Post/Post";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../modules/Notification/Notification";
import Styles from "../../styles/Profile.module.css";
import PopupAvatar from "../../components/PopupAvatar";
import React from "react-dom";
var isLoad = false;
import Masonry from "react-masonry-css";
import ButtonFollow from "../../components/Button/ButtonFollow/ButtonFollow";
import PopupContinueWatching from "../../components/PopupContinueWatching/PopupContinueWatching";
import BtnChatProfile from "../../components/BtnChatProfile/BtnChatProfile";
import { MdOutlineGeneratingTokens, MdOutlineHowToVote } from "react-icons/md";
import { getCookieUserLogin } from "../../modules/Cookies/Auth/userLogin";
import { Fragment } from "react";


export default function OtherProfile() {
  const [active, setActive] = useState(0);
  const [listPostProfile, setListPostProfile] = useState([]);
  const [showPopupStatistic, setShowPopupStatistic] = useState("");
  const [interaction, setInteraction] = useState({});
  const [isDeletePost, setIsDeletePost] = useState(false);
  const pageNumber = useRef(1);
  const [showAvatar, setShowAvatar] = useState(false);
  const [showBackground, setShowBackground] = useState(false);
  const [content, setContent] = useState({});
  const [language, setLanguage] = useState("en"); //Lưu ngôn ngữ đang chọn
  const [style, setStyle] = useState({ right: "130px" });
  const [isFollow, setIsFollow] = useState(false);
  // const [userFollow, setUserFollow] = useState
  const router = useRouter();
  // const idUser = router.query.iduser;
  const [idUser, setIdUser] = useState("");
  const [follower, setFollower] = useState([]);
  const [following, setFollowing] = useState([]);
  const [postContinue, setPostContinue] = useState();
  const [showPostContinue, setShowPostContinue] = useState(false);
  const [loading, setLoading] = useState(false);

  const userLogin = getCookieUserLogin()

  useEffect(() => {
    if (router && router.query.iduser) {
      setIdUser(router.query.iduser);
    }
  }, [router]);

  useEffect(() => {
    if (language) {
      setContent(require(`./languages/${language}.json`));
      if (language === "en") {
        setStyle({ right: "130px" });
      } else setStyle({ right: "137px" });
    }
  }, [language]);

  const openStatistic = (str) => {
    setShowPopupStatistic(str);
  };

  useEffect(() => {
    setLanguage(userLogin?.language);
  }, [userLogin]);

  useEffect(() => {
    API.get(endpoints.getDetailProfile(idUser), {
      headers: headers.headers_token,
    })
      .then((res) => {
        if (res.data.success) {
          setInteraction(res.data.data);
        }
      })
      .catch((err) => {});
  }, [idUser, isFollow]);

  useEffect(() => {
    if (idUser != "") {
      API.get(endpoints.getListPostProfile(idUser, 10, pageNumber.current), {
        headers: headers.headers_token,
      })
        .then((res) => {
          setListPostProfile(res.data.data);
          pageNumber.current += 1;
        })
        .catch((error) => {});
    }
  }, [idUser]);

  const getListPostProfile = (_idUser) => {
    isLoad = true;
    setLoading(true)
    API.get(endpoints.getListPostProfile(_idUser, 10, pageNumber.current), {
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
          setLoading(false);
        }
      })
      .catch((err) => {
        ErrorNotification("Lỗi");
        isLoad = false;
        setLoading(false)
      });
  };

  useEffect(() => {
      API.get(endpoints['getUserFollower'](idUser, 100), {
        headers: headers.headers_token,
      })
        .then((res) => {
          setFollower(res.data.data);
        })
        .catch((err) => {});

      API.get(endpoints['getUserFollowing'](idUser, 100), {
        headers: headers.headers_token,
      })
        .then((res) => {
          setFollowing(res.data.data);
        })
        .catch((err) => {});
  }, [idUser]);

  useEffect(() => {
    if (idUser != "") {
      const scrollLoadPost = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
          if (!isLoad) {
            getListPostProfile(idUser);
          }
        }
      };

      window.addEventListener("scroll", scrollLoadPost);

      return () => window.removeEventListener("scroll", scrollLoadPost);
    }
  }, [idUser]);

  const handleDeletePost = (id) => {
    const isDeleted = window.confirm("Do you want to delete this post?");
    if (isDeleted) {
      API.delete(endpoints.deletePost, {
        data: { post_id: id },
        headers: headers.headers_token,
      })
        .then((res) => {
          setIsDeletePost(!isDeletePost);
          SuccessNotification("Xóa bài viết thành công");
        })
        .catch((err) => {
          ErrorNotification("Lỗi");
          location.replace("/login");
        });
    } else {}
  };

  const breakpointColumnsObj = {
    default: 2,
    1100: 2,
    700: 1,
  };

  useEffect(() => {
    const close = (e) => {
      if(e.keyCode === 27){
        setShowBackground(false)
        setShowAvatar(false)
      }
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  },[])

  const [readBio, setReadBio] = useState(true)
  const [hover, setHover] = useState(null);
  let checkLink = interaction.bio?.split("\n");
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
        <title>DAK - Profile</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
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
                  interaction !== null &&
                  interaction !== undefined &&
                  interaction.background_img != undefined
                    ? interaction.background_img
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
              <div className={Styles.profile__cover}>
                <div className={Styles.avatar__cover}>
                  <div className={Styles.avatarProfile}>
                    <img
                      onClick={() => setShowAvatar(true)}
                      className={Styles.avatar}
                      src={
                        interaction.avatar != undefined ? interaction.avatar : ""
                      }
                      alt="Avatar"
                    ></img>
                  </div>
                  {showAvatar && (
                    <PopupAvatar url={interaction.avatar} close={setShowAvatar} />
                  )}
                </div>
                
                <div className={Styles.wrapInfo}>
                  <div className={Styles.textProfile}>
                    <div className={Styles.mainInfo}>
                      <h1 className={Styles.nameUser}>
                        {" "}
                        {interaction.name != undefined ? interaction.name : ""}
                      </h1>
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
                        <li className={Styles.statisticItem}>
                          {/* <p className={Styles.iconVote}>Vote</p> */}
                          <MdOutlineHowToVote/>
                          <span className={Styles.quantity}>
                            {interaction.vote_count != undefined
                              ? interaction.vote_count
                              : 0}
                          </span>
                        </li>
                        <li className={Styles.statisticItem}>
                          <MdOutlineGeneratingTokens />
                          <span className={Styles.quantity}>0</span>
                        </li>
                      </ul>
                      {showPopupStatistic === "list-follower" && follower?.length !==0 && (
                        <PopupInteractive
                          title="Follower"
                          count={follower?.length}
                          closePopup={openStatistic}
                          follower={follower}
                          currentLoginIdUser={userLogin?.id}
                        />
                      )}
                      {showPopupStatistic === "list-following" && following?.length !==0 && (
                        <PopupInteractive
                          title="Following"
                          count={following?.length}
                          closePopup={openStatistic}
                          following={following}
                          currentLoginIdUser={userLogin?.id}
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
    
                      {/* Kiểm tra nếu người dùng chính tìm kiếm mình thì trang đó sẽ không hiện button follow và chat */}
                      {userLogin?.id === idUser ? (
                        ""
                      ) : (
                        <div className={Styles.wrapBtn}>
                          <BtnChatProfile />
                          <div className={Styles.btnFollow}>
                            <ButtonFollow
                              isFollow={interaction?.has_follow}
                              id={idUser}
                            />
                          </div>
                          {/* <div className={Styles.btnChat} onClick={openBoxChat}>
                            <FaFacebookMessenger /> {" Chat "}
                          </div> */}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={Styles["header__create"]}>
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my_masonry_grid_column"
          >
            {listPostProfile &&
              listPostProfile.map((post, index) => {

                if (post) {
                  if (post.post && post.post.post_access === 1) {
                    if (post.post?.post_url == undefined) {
                      post.post.post_url = "";
                      post.post.post_url_type = "";
                    }
                    return (
                      <Post
                        key={index}
                        typepost={post.post.post_url_type}
                        url={post.post.post_url}
                        post={post}
                        postid={post.post.id}
                        deletePost={handleDeletePost}
                        setPostContinue={setPostContinue}
                        setShowPostContinue={setShowPostContinue}
                      />
                    );
                  }
                  if (post.main_post) {
                    if (post.main_post?.post_url == undefined) {
                      post.main_post.post_url = "";
                      post.main_post.post_url_type = "";
                    }
                    return (
                      <Post
                        key={index}
                        typepost={post.main_post.post_url_type}
                        url={post.main_post.post_url}
                        post={post}
                        postid={post.main_post.id}
                        deletePost={handleDeletePost}
                        setPostContinue={setPostContinue}
                        setShowPostContinue={setShowPostContinue}
                      />
                    );
                  }
                }
              })}
          </Masonry>
        </div>
      </section>
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
