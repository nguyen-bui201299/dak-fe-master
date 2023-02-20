import Image from "next/image";
import Link from "next/link";
import Router from 'next/router';
import Styles from "./Header.module.css";
import Logo from "../../public/images/Logo.png";
import { useEffect, useState, useRef, createRef } from "react";
import Head from "next/head";
import Notification from "../Notification/Notification";
import MenuSetting from "../MenuSetting/MenuSetting";
import PopupChat from "../PopupChat/PopupChat";
import {
  FaSearch,
  FaBars,
  FaWallet,
  FaBell,
  FaTimes,
  FaTicketAlt,
  FaGamepad,
  FaHandHoldingUsd,
  FaUserFriends,
  FaUserAlt
} from "react-icons/fa";
import { MdGroups, MdOutlineGeneratingTokens } from 'react-icons/md'
import { BsGearFill, BsFillChatDotsFill } from "react-icons/bs";
import { GoThreeBars } from "react-icons/go"
import API, { endpoints, headers } from "../../API"
import { useSelector, useDispatch } from 'react-redux';
import { setItemSocialList } from "../../redux/slices/socialSlice.js";
import { getCookiesSocialList, setCookiesSocialList } from "../../modules/Cookies/TypeSocial/social";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
import HeaderSearchBar from "./SearchBar/HeaderSearchBar";
import HeaderSocialTab from "./SocialTab/HeaderSocialTab";
import coinDark from '../../public/images/dak.png'
import { RiAuctionFill } from "react-icons/ri";
import { deleteChatToken, deleteCookieUserLogin, deleteRefreshToken, deleteTokenUserLogin, deleteXsrfToken, getCookieUserLogin } from "../../modules/Cookies/Auth/userLogin";
import { AiOutlineLogout } from "react-icons/ai";

export default function Header({ setListFilterType, setLanguage, language, openMenuSetting, setOpenMenuSetting, handleShowChangePass,
  handleYoutubePost,
  handleFacebookPost,
  handleInstagramPost,
  handleTikTokPost,
  handleTwitchPost,
  handleTwitterPost,
  handleFriendPost,
  isYoutube,
  isFacebook,
  isInstagram,
  isTikTok,
  isTwitter,
  isTwitch,
  isWithFriend,
  filterRenderHandling
 }) {
  // Đây là nút nhấn show ra notification
  const [ShowNoti, HideNoti] = useState(false);
  // Set trạng thái thông báo
  const [notify, setNotify] = useState(false)
  const [notification, setNotification] = useState([])
  const [changeState, setChangeState] = useState(false)
  // set trạng thái icon header
  const [activeList, setActiveList] = useState([0, 1, 2, 3, 4, 5, 6, 7]);
  // Set trạng thái PopupChat
  const [showPopupChat, setShowPopupChat] = useState(false);
  //When you click anyway, this box will close!
  const [showBoxSearch, setShowBoxSearch] = useState(false);
  const [showBoxMobileSearch, setShowBoxMobileSearch] = useState(false);
  //Value ô input trên header
  const [valueResult, setValueResult] = useState('');
  //Lấy thông tin socialListItems từ redux
  const socialListItems = useSelector(state => state.socialListItems);

  const [acticeHasTag,setActiveHasTag] = useState()
  const dispatch = useDispatch();
  const routes = useRouter()

  const userLogin = getCookieUserLogin()

  useEffect(() => {
      // dispatch(setReduxInfoUser(userLogin));
      dispatch(setItemSocialList(getCookiesSocialList()));
  }, [dispatch]);

  // Start handle show menu setting
  const showMenuSetting = () => {
    setOpenMenuSetting(!openMenuSetting);
    HideNoti(false);
    setShowPopupChat(false);
  };
  // End handle show menu setting

  // Start handle show noti
  const showMenuNoti = () => {
    HideNoti(!ShowNoti);
    currentPathUrl !== "/chat" && setOpenMenuSetting(false);
    setShowPopupChat(false);
  };
  // End handle show noti

  // Start handle show message
  const showMenuMess = () => {
    setShowPopupChat(!showPopupChat);
    setOpenMenuSetting(false);
    HideNoti(false);
  };
  // End handle show messenger

  const handleSocialList = (type) => {
    
      if(routes.pathname !== '') {
        routes.push('/')
      }
  
      if(routes.pathname === '/') {
        filterRenderHandling(type)
        if(type === 'youtube') {
          handleYoutubePost()
        }
        if(type === 'facebook') {
          handleFacebookPost()
        }
        if(type === 'instagram') {
          handleInstagramPost()
        }
        if(type === 'tiktok') {
          handleTikTokPost()
        }
        if(type === 'twitch') {
          handleTwitchPost()
        }
        if(type === 'twitter') {
          handleTwitterPost()
        }
        if(type === 'with_friend') {
          handleFriendPost()
        }
      }
  }

  useEffect(() => {
    setCookiesSocialList(socialListItems);
    try {
      setListFilterType(socialListItems);
    } catch (e) { }
  }, [socialListItems, setListFilterType]);

  const ref = useRef(false);
  const mobileRef = useRef(false);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowBoxSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return (() => {
      document.removeEventListener("mousedown", handleClickOutside)
    })
  }, [ref, setShowBoxSearch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileRef.current && !mobileRef.current.contains(event.target)) {
        setShowBoxMobileSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return (() => {
      document.removeEventListener("mousedown", handleClickOutside)
    })
  }, [mobileRef, setShowBoxMobileSearch]);

  //Value Search
  const [inputSearch, setInputSearch] = useState("");

  const inputRef = createRef();
  const search = () => setSearchedValue(inputSearch);
  const textSearch = {
    name: inputSearch,
  };
  //Danh sach nguoi dung tim kiem duoc
  const [listUser, setListUser] = useState({ list: [] });
  const [hashtag,setHastag] = useState({ list : []})

  //check api tim kiem - khi da tra ve ket qua thi moi được phép gọi api tiếp theo
  const [checkApiSearch, setCheckApiSearch] = useState(true);
  const [timeouts, setTimeouts] = useState();

  const [searchMock, setSearchMock] = useState('')
  const [selectActive,setActiveSelect] = useState()
  // Bat event tai o input khi nhap lieu
  // HandleEnter()

  const up = useRef(-1)
  // const ActiveHastag = useRef(-1)

  const changeHandler = (e) => {
    setValueResult(e.target.value);
    let page = 1;
    let limit = 5
    setShowBoxSearch(true);
    setShowBoxMobileSearch(true);
    const firstLetter = e.target.value.trim().substring(0, 1);
    const value = e.target.value.trim().substring(1,);
    if (firstLetter === '#') {
      if( value !== ''){
        API.get(endpoints['getListHasTag'](value) , {headers : headers.headers_token})
          .then((res)=>{
            setHastag({ list : [...res.data.data]}) // Data hastag keywork
          })
          .catch((error)=>{})
      }else{
        setHastag({ list : []})
      }
    }
    if (e.target.value != undefined && e.target.value != null && e.target.value != '') {
      clearTimeout(timeouts);
      setTimeouts(
        setTimeout(() => {
          API.get(endpoints['finduser'](limit, page, e.target.value), { headers: headers.headers_token })
            .then((response) => {
              setListUser({ list: [...response.data.data] });
            })
            .catch((err) => {})
        }, 300)
      );

    } else {
      setListUser({ list: [] });
    }
  };
  const social_item_filters = [
    {
      className: "fab fa-youtube",
      name: "Youtube",
      type: "youtube"
    },
    {
      className: "fab fa-tiktok",
      name: "Tiktok",
      type: "tiktok"
    },
    {
      className: "fab fa-facebook-f",
      name: "Facebook",
      type: "facebook"
    },
    {
      className: "fa-brands fa-instagram",
      name: "Instagram",
      type: "instagram"
    },
    {
      className: "fa-brands fa-twitch",
      name: "Twitch",
      type: "twitch"
    },
    {
      className: "fab fa-twitter",
      name: "Twitter",
      type: "twitter"
    },
    {
      className: "fa-solid fa-user-group",
      name: "Friends",
      type: "with_friend"
    },
  ];

  const menuSettingRef = useRef();
  const closeMenuSetting = (e) => {
    if (menuSettingRef.current === e.target) {
      setOpenMenuSetting(false);
    }
  };

  const [content, setContent] = useState({});

  useEffect(() => {
      if (userLogin.language !== undefined) {
        setContent(require(`./languages/${userLogin.language}.json`));
      } else {
        setContent(require(`./languages/en.json`));
      }
  }, [userLogin])

  const HandleEnter = (e)=>{
      const pathNameHagTag = '/searched/hastag'
      let pathnameUser
      const userSeach = e.target.value // Lay gia tri cua value
      if(e.key === "Enter") {
        if(selectActive > -1) {
          pathnameUser = '/otherprofile/'
          UrlEnter(userSeach='',pathnameUser, listUser.list[selectActive].user.id)
        }
        else {
          pathnameUser = '/searched/result'
          UrlEnter(userSeach='',pathnameUser)
        }
      }
  }
  const UrlEnter = (KeyHasTag,pathNameHagTag,idProfile)=>{
      if(idProfile){
        const url = `${pathNameHagTag}${idProfile}`
        routes.push(url)
      }else{
        const url = `${pathNameHagTag}?keyword=${inputSearch}${KeyHasTag}`
        routes.push(url)
      }
  } 


  // Seach
  const HanalePageOption = (e)=>{
      const value = inputSearch?.substring(0,1)
      if(value !== '#'){
        if(e.key === 'ArrowDown'){
          up.current = up.current + 1
          setActiveSelect(up.current)
          if(listUser){
            if(up.current < listUser.list.length){
              listUser.list.map((user,index)=>{
                if(index == up.current){
                  setInputSearch(user.user.name)
                }
              })
              
            }else{
              up.current = 0
              setActiveSelect(up.current)
              setInputSearch(listUser.list[0]?.user.name)
            }
          }
        if(e.key === 'ArrowUp'){
            if(up.current > 0){
              up.current = up.current - 1
              setActiveSelect(up.current)
              setInputSearch(listUser.list[up.current].user.name)
            }else{
              up.current = listUser.list.length-1
              setActiveSelect(up.current)
              setInputSearch(listUser.list[up.current].user.name)
            }
        }
      }
      // if(value === '#'){
      //   if(e.key === 'ArrowDown'){
      //     ActiveHastag.current = ActiveHastag.current + 1
      //     if(hashtag){
      //       hashtag.list.map((has,index)=>{
      //          if(index === ActiveHastag.current){
      //             if(ActiveHastag.current < 5){
      //               setActiveHasTag(ActiveHastag.current)
      //               setInputSearch(`#${has.name}`)
      //             }else{
      //               ActiveHastag.current = 0
      //               setActiveHasTag(ActiveHastag.current)
      //               setInputSearch(`#${has.name}`)
      //             }
      //          }
      //       })
      //     }
          
      //   }
      //   if(e.key === 'ArrowUp'){
      //     if(ActiveHastag.current > 0){
      //       ActiveHastag.current = ActiveHastag.current  - 1
      //       setActiveHasTag(ActiveHastag.current)
      //       setInputSearch(`#${hashtag.list[ActiveHastag.current].name}`)
      //     }else{
      //       ActiveHastag.current = 4
      //       setActiveHasTag(ActiveHastag.current)
      //       setInputSearch(`#${hashtag.list[ActiveHastag.current].name}`)
      //     }
          
      //   }
      // }
    }

  }

  const handleChangeState = () => setChangeState(!changeState)
  const [getNumber, setGetNumber] = useState()
  useEffect(() => {
    API.get(endpoints.getNotification, { headers: headers.headers_token })
    .then(res => {
      setNotification(res.data.data)
      // Check noti đã đọc
      let checkStatus = res.data.data.filter((item) => item.notification.status === 1)
      // Lấy số noti chưa đọc
      let checkNumber = res.data.data.filter((item) => item.notification.status === 2)
      setGetNumber(checkNumber)
      if(checkStatus.length === res.data.data.length) {
        setNotify(false)
      } else {
        setNotify(true)
      }
    })
    .catch(err => {})
    

  }, [changeState, ShowNoti])

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
      const handleMobile = () => {
          if(window.innerWidth <= 720) {
              setIsMobile(true);
          }
          else {
              setIsMobile(false);
          }
      }
      handleMobile();
      window.addEventListener("resize", handleMobile);
      return () => {
          window.removeEventListener("resize", handleMobile);
      }
  }, [])

  const [isChat, setIsChat] = useState({})
  const [shortcut, setShortCut] = useState(false)
  const currentPathUrl = routes.asPath;
  useEffect(() => {
    if(currentPathUrl === "/chat") {
      setIsChat({
        margin: "0 1rem",
        gridTemplateColumns: "80% 20%", 
      })
    }
  }, [currentPathUrl])

  const refShortcut = useRef(false);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (refShortcut.current && !refShortcut.current.contains(event.target)) {
        setShortCut(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return (() => {
      document.removeEventListener("mousedown", handleClickOutside)
    })
  }, [refShortcut, setShortCut]);

  const handleLogout = async () => {
    try {
      const res = await API.post(endpoints['auth/logout'], {}, {headers: headers.headers_token})
      if(res.data.success) {
          deleteCookieUserLogin();
          deleteTokenUserLogin();
          deleteRefreshToken();
          deleteXsrfToken();
          deleteChatToken();
          location.replace("/login");
      }
  }
  catch(err) {
      console.log(err);
  }
  }

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </Head>
      <ToastContainer />
      <section className={Styles.site__navbar}>
        <div className={Styles.box__narbar}>
          <div style={isChat} className={Styles.navbar}>
           <div className={Styles.navbar__left__main}>
           <div className={Styles.navbar__left}>
              <div className={Styles.navbar__left__logo}>
                  <Link passHref href="/">
                    <Image src={Logo} alt="ImageLogo" />
                  </Link>
              </div>
              {currentPathUrl !== "/chat" &&
                <label
                htmlFor="nav-mobile-input"
                className={Styles.nav__bars__btn}
              >
                <FaBars className={Styles.header_icon} />
              </label>}
            </div>
            {/* fix here */}
            {/* Add ref */}
           {currentPathUrl !== "/chat" &&  
           <div className={Styles.site__search} ref={ref}>
              <div className={Styles.search__boxs}>
                <input
                  type="text"
                  ref={inputRef}
                  value={inputSearch}
                  className={Styles.search__inputs}
                  onChange={(event) => { setSearchMock(event.target.value); /*console.log(event.target.value);*/ changeHandler(event) }}
                  onInput={(e) => setInputSearch(e.target.value)}
                  onClick={() => setShowBoxSearch(!showBoxSearch)}
                  placeholder={content.header_search_dak}
                  onKeyUp={(e)=>{HandleEnter(e),HanalePageOption(e)}}
                />
                {
                  inputSearch == '' ? '' :
                  <a className={Styles.search__icon}>
                    <FaSearch  className={Styles.header_icon} />
                  </a>
                }

                {showBoxSearch && (
                  <HeaderSearchBar   
                    content={content} 
                    textSearch={textSearch} 
                    searchMock={searchMock}
                    selectActive={selectActive}
                    hashtag={hashtag} 
                    acticeHasTag={acticeHasTag} 
                    listUser={listUser} 
                    valueResult={valueResult} 
                    inputSearch={inputSearch}
                  />
                )}
                {/* to fix here */}
              </div>
            </div>}
           </div>
            {/* End transfer light-dark mode button */}
            {
              currentPathUrl !== "/chat" && <HeaderSocialTab { ... { social_item_filters, isYoutube, isFacebook, isTikTok, isInstagram, isTwitter, isTwitch, isWithFriend, handleSocialList, filterRenderHandling } }/>
            }
            {<div className={Styles.navbar__right}>
              <ul className={Styles.navbar__right__list}>
                <li className={Styles.navbar__right__item}>
                  <a href="http://117.2.143.218/" rel="noreferrer" target={"_blank"} ><Image src={coinDark} className= {`${Styles.header_icon} ${Styles.header_icon__coin}`} alt={'coin-ico'}/></a>
                </li>
               {currentPathUrl !== "/chat" &&
                <>
                    <li
                      className={`${Styles["navbar__right__item"]}`}
                      onClick={() => isMobile ? Router.push("/chat") : showMenuMess()}
                    >
                      <div className={Styles.right_icons}>
                        <BsFillChatDotsFill className={Styles.header_icon} />
                      </div>
                    </li>
                </> }
                <li
                  className={Styles.navbar__right__item}
                  onClick={showMenuNoti}
                >
                  <div className={Styles.right_icons}>
                    <FaBell className={`${Styles.header_icon} ${Styles.header_icon__bell}`} />
                    <span
                      className={`${Styles.navbar__right__notifi} ${notify ? Styles.active : ""}`}
                    >{getNumber && getNumber.length}</span>
                  </div>
                </li>

                { currentPathUrl === "/chat" &&
                    <li ref={refShortcut}  className={`${Styles["navbar__right__item"]} ${Styles["navbar__chat__item"]} ${Styles.navbar__chat__shortcut__chat}`}>
                      <GoThreeBars onClick={() => setShortCut(!shortcut)} className={Styles.header_icon_chat} />
                      {
                        shortcut &&
                          <div  className={Styles.navbar__chat__shortcut}>
                            <ul>
                              <li>
                                <Link href="/profile" passHref>
                                  <a><FaUserAlt/> <span>Profile</span></a>
                                </Link>
                              </li>
                              <li> 
                                <Link href="/wallet" passHref>
                                  <a><FaWallet/> <span>Wallet</span></a>
                                </Link>
                              </li>
                              <li> 
                                <Link href="/lottery/detaillottery" passHref>
                                  <a><FaTicketAlt/> <span>Lottery</span></a>
                                </Link>
                              </li>
                              <li> 
                                <Link href="/listfriend" passHref>
                                  <a><FaUserFriends/> <span>Friends</span></a>
                                </Link>
                              </li>
                              <li>
                                <Link href="/group/main-group" passHref>
                                  <a><MdGroups/> <span>Groups</span></a>
                                </Link>
                              </li>
                              <li>
                                <Link href="/linksocial" passHref>
                                  <a><i className={`fa fa-share-alt`}></i> <span>Link social</span></a>
                                </Link>
                              </li>
                              <li>
                                <Link href="/bidding" passHref>
                                  <a><RiAuctionFill/> <span>Bidding</span></a>
                                </Link>
                              </li>
                              <li> 
                                  <a href="http://117.2.143.218:9099" target={"_blank"} rel="noreferrer" ><i className={`fab fa-battle-net`}></i> <span>DAO</span></a>
                              </li>
                              <li onClick={handleLogout}>
                                <p> <AiOutlineLogout/> <span>Logout</span> </p>
                              </li>
                            </ul>
                          </div>
                      }
                    </li>
                }
               
               {
                currentPathUrl !== "/chat" && 
                  <li
                  className={Styles.navbar__right__item}
                  onClick={showMenuSetting}
                  >
                    <div className={Styles.navbar__right__theme}>
                      <div className={Styles.navbar__right__avatar}>
                        {userLogin !== undefined && (
                          <img
                            className={Styles.avatar}
                            src={userLogin.avatar}
                            alt="Avatar"
                          />
                        )}
                      </div>
                      <BsGearFill className={`${Styles.header_icon} ${Styles.header_icon__gear}`} />
                    </div>
                  </li>
               }

              </ul>
              {ShowNoti && <Notification notification={notification}  setShowMenuNoti={HideNoti} handleChangeState={handleChangeState} />}
              {openMenuSetting && (
                <MenuSetting
                  handleShowChangePass={handleShowChangePass}
                  showMenuSetting={openMenuSetting}
                  setShowMenuSetting={setOpenMenuSetting}
                  setLanguage={setLanguage}
                  language={language}
                />

              )}
              {showPopupChat && (
                <PopupChat showPopupChat={showPopupChat} setShowPopupChat={setShowPopupChat} />
              )}
              {/* Up there */}
            </div>}
          </div>
          {/* Nav mobile */}
          <input
            type="checkbox"
            className={Styles.nav__input}
            id="nav-mobile-input"
          />
          <label
            htmlFor="nav-mobile-input"
            className={Styles.nav__overlay}
          ></label>
          <nav className={Styles.nav__mobile}>
            <div className={Styles.nav__mobile__heading}>
              <div className={Styles.nav__mobile__logo}>
                <Link href="/" passHref>
                  <a>
                    <Image src={Logo} alt="ImageLogo" />
                  </a>
                </Link>
              </div>
              <h3 className={Styles.nav__mobile__name}>DakShow</h3>
            </div>
            <label
              htmlFor="nav-mobile-input"
              className={Styles.nav__mobile__close}
            >
              <FaTimes className={Styles.nav__mobile__icon} />
            </label>
            <div className={Styles.nav__mobile__form} ref={mobileRef}>
              <div className={Styles.nav__mobile__control}>
              <input
                  type="text"
                  ref={inputRef}
                  value={inputSearch}
                  className={Styles.search__inputs}
                  onChange={(event) => { setSearchMock(event.target.value); /*console.log(event.target.value);*/ changeHandler(event) }}
                  onInput={(e) => setInputSearch(e.target.value)}
                  onClick={() => setShowBoxMobileSearch(!showBoxMobileSearch)}
                  placeholder={content.header_search_dak}
                  onKeyUp={(e)=>{HandleEnter(e),HanalePageOption(e)}}
                />
                {
                  inputSearch == '' ? '' :
                  <a className={Styles.search__icon}>
                    <FaSearch  className={Styles.header_icon} />
                  </a>
                }

                {showBoxMobileSearch && (
                  <HeaderSearchBar   
                    content={content} 
                    textSearch={textSearch} 
                    searchMock={searchMock}
                    selectActive={selectActive}
                    hashtag={hashtag} 
                    acticeHasTag={acticeHasTag} 
                    listUser={listUser} 
                    valueResult={valueResult} 
                    inputSearch={inputSearch}
                  />
                )}
                {/* <FaSearch className={Styles.nav__mobile__icon} /> */}
              </div>
            </div>
            <ul className={`${Styles.nav__mobile__list} ${Styles.color}`}>
              <h3 className={Styles.nav__mobile__title}>{content.header_social_network}</h3>
              {social_item_filters.map((filter, i) => (
                <li
                  className={`${Styles.nav__mobile__item} ` }
                  key={i}
                  onClick={() => {
                    handleSocialList(filter.type);
                  }}
                >
                  <span
                    className={`${Styles.nav__mobile__link} 
                    ${isYoutube && filter.type == 'youtube' ? Styles.youtube : ""}
                    ${isFacebook && filter.type == 'facebook' ? Styles.facebook : ""}
                    ${isTikTok && filter.type == 'tiktok' ? Styles.tiktok : ""}
                    ${isInstagram && filter.type == 'instagram' ? Styles.instagram : ""}
                    ${isTwitter && filter.type == 'twitter' ? Styles.twitter : ""}
                    ${isTwitch && filter.type == 'twitch' ? Styles.twitch : ""}
                    ${isWithFriend && filter.type == 'with_friend' ? Styles.withfriend : ""} `}
                  >
                    <i className={filter.className}></i>
                    <span>{filter.name}</span>
                  </span>
                </li>
                ))}
            </ul>
            <ul className={Styles.nav__mobile__list}>
              <h3 className={Styles.nav__mobile__title}>{content.header_group}</h3>
              <li className={Styles.nav__mobile__item}>
                <Link href="/listfriend">
                  <a className={Styles.nav__mobile__link}>
                    <FaUserFriends className={Styles.nav__mobile__icon} />
                    <span>{content.header_friends}</span>
                  </a>
                </Link>
              </li>
              <li className={Styles.nav__mobile__item}>
                <Link href="/group/main-group">
                  <a className={Styles.nav__mobile__link}>
                    <MdGroups className={Styles.nav__mobile__icon} />
                    <span>{content.header_group}</span>
                  </a>
                </Link>
              </li>
              {/* <li className={Styles.nav__mobile__item}>
                <Link href="/group/main-group">
                  <a className={Styles.nav__mobile__link}>
                    <FaPlus className={Styles.nav__mobile__icon} />
                    <span>{content.header_add_group}</span>
                  </a>
                </Link>
              </li> */}
            </ul>
            <ul className={Styles.nav__mobile__list}>
              <h3 className={Styles.nav__mobile__title}>{content.header_function}</h3>
              <li className={Styles.nav__mobile__item}>
                <Link href="/wallet">
                  <a className={Styles.nav__mobile__link}>
                    <FaWallet className={Styles.nav__mobile__icon} />
                    <span>{content.header_your_wallet}</span>
                  </a>
                </Link>
              </li>
              <li className={Styles.nav__mobile__item}>
                <Link href="/lottery/detaillottery">
                  <a className={Styles.nav__mobile__link}>
                    <FaTicketAlt className={Styles.nav__mobile__icon} />
                    <span>{content.header_lottery}</span>
                  </a>
                </Link>
              </li>
              <li className={`${Styles.nav__mobile__item} ${Styles.disable}`}>
                <Link href="">
                  <a className={Styles.nav__mobile__link}>
                  <i className={`${Styles.nav__mobile__icon} fab fa-battle-net`}></i> 
                    <span>DAO</span>
                  </a>
                </Link>
              </li>
              <li className={`${Styles.nav__mobile__item} ${Styles.disable}`}>
                <Link href="">
                  <a className={Styles.nav__mobile__link}>
                    <MdOutlineGeneratingTokens className={Styles.nav__mobile__icon} />
                    <span>NFT</span>
                  </a>
                </Link>
              </li>
              <li className={`${Styles.nav__mobile__item} ${Styles.disable}`}>
                <Link href="">
                  <a className={Styles.nav__mobile__link}>
                    <FaGamepad className={Styles.nav__mobile__icon} />
                    <span>{content.header_game}</span>
                  </a>
                </Link>
              </li>
              <li className={`${Styles.nav__mobile__item} ${Styles.disable}`}>
                <Link href="">
                  <a className={Styles.nav__mobile__link}>
                    <FaHandHoldingUsd className={Styles.nav__mobile__icon} />
                    <span>{content.header_fund}</span>
                  </a>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </section>
    </>
  );
}