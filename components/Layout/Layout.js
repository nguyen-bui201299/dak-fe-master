import Head from "next/head";
import Styles from "./Layout.module.css";
import { useState, useEffect } from "react";
import Shortcuts from "../Shortcuts/Shortcuts";
import QuickBidding from "../QuickBidding/QuickBidding";
import QuickLottery from "../QuickLottery/QuickLottery";
import Features from "../Features/Features";
import Header from "../Header/Header";
import BoxChat from "../BoxChat/BoxChat";
import { MiniChatBox } from "../BoxChat/BoxChat";
import { BoxChatProvider } from "../BoxChat/BoxChatContext";
import { ConversationProvider } from "../BoxChat/ConversationContext";

import PopupChangePassword from "../PopupChangePassword";
import API, { endpoints, headers } from "../../API";
import {
  deleteChatToken,
  deleteCookieUserLogin,
  deleteRefreshToken,
  deleteTokenUserLogin,
  deleteXsrfToken,
  setCookieRefreshToken,
  setCookieUserLogin,
  setCookieXSRFToken,
  setTokenUserLogin,
} from "../../modules/Cookies/Auth/userLogin";
import logo from "../../public/images/Logo.png";
import LoaderTab from "../LoaderTab/LoaderTab";
import Footer from "../Footer/Footer";
import { useRouter } from "next/router";
import formatDate from "../../modules/Time/formatDate";
import localStorage from "local-storage";


export const siteTitle = "Home";

export default function Layout({
  children,
  setListFilterType,
  listFilterType,
  setClick,
  page = "",
  setLanguage,
  language,
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
  filterRenderHandling,
  handleIsTransfer
}) {
  const [isLogin, setIsLogin] = useState(false);
  const [time, setTime] = useState(new Date());

  const [openMenuSetting, setOpenMenuSetting] = useState(false);
  const [showChangePass, setShowChangePass] = useState(false);

  const handleShowChangePass = () => {
    setShowChangePass(!showChangePass);
    setOpenMenuSetting(false);
  };

  const [loader, setLoader] = useState(false);
  useEffect(() => {
    API.get(endpoints.getUserLogin, { headers: headers.headers_token, 
      withCredentials: true 
    })
      .then((res) => {
        setIsLogin(res.data.success)
        setCookieUserLogin(res.data.data);
        if (res.data.data.mode !== undefined) {
          if (res.data.data.mode === "dark") {
            document.documentElement.setAttribute("data-theme", "dark");
            window.localStorage.setItem("theme", "dark");
          } else {
            document.documentElement.removeAttribute("data-theme", "light");
            window.localStorage.setItem("theme", "light");
          }
        }

                if(res.data.data.active === 0 || res.data.data.deleted) {
                    deleteCookieUserLogin();
                    deleteTokenUserLogin();
                    deleteRefreshToken();
                    deleteXsrfToken();
                    deleteChatToken();
                    location.replace('/login');
                    // location.replace('https://guest.dakshow.com/')
                }
            })
            .catch(err => {
                deleteCookieUserLogin();
                deleteTokenUserLogin();
                deleteRefreshToken();
                deleteXsrfToken();
                deleteChatToken();
                location.replace('/login');
                // location.replace('https://guest.dakshow.com/')
            });
  }, []);

  
  
  const getTime = () => {
    setTime(new Date());
  };

  // Run every 10s
  useEffect(() => {
    let timerID = setInterval(() => getTime(), 10000);

    return () => {
      clearInterval(timerID);
    };
  }, []);

  // Get expired time & convert to second
  const timeExpired = formatDate(localStorage.get('expiredTime')).props.children.props.children[2].props.children[1].split(':')
  var timeExpiredToSecond = (+timeExpired[0]) * 60 * 60 + (+timeExpired[1]) * 60 + (+timeExpired[2]);
  useEffect(() => {
    // Get time local & convert to second
    const times = time.toLocaleTimeString().split(':')
    var seconds = (+times[0]) * 60 * 60 + (+times[1]) * 60 + (+times[2]); 
    // Check if time local + 500 > expired time => call refresh token
    if(seconds + 500 > timeExpiredToSecond) {
      API.post(endpoints.refreshToken, {remember_me: false} ,{ headers: headers.headers_token})
      .then(res => {
        setTokenUserLogin(res.data.data.token)
        setCookieRefreshToken(res.data.data.refreshToken)
        setCookieXSRFToken(res.data.data.xsrfToken)
        localStorage.set("expiredTime", res.data.data.expiredAt)
      })
      .catch(err => {})
    }
   }, [time])
  const route = useRouter();
  const currentPathUrl = route.asPath;
  return (
    <>
      <div className={Styles.container}>
        <Head>
          <meta name="description" content="Build demo website version2" />
          <link rel="stylesheet" href="/css/global.css" />
          <link rel="stylesheet" href="/css/style.css" />
          <link rel="shortcut icon" href={logo.src} />
          <meta name="og:title" content={siteTitle} />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
            integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
        </Head>
            <>
            {isLogin && (
              <BoxChatProvider isLogin={isLogin.data}>
                <ConversationProvider>
                  <>
                      <Header
                        listFilterType={listFilterType}
                        setListFilterType={setListFilterType}
                        setLanguage={setLanguage}
                        language={language}
                        openMenuSetting={openMenuSetting}
                        setOpenMenuSetting={setOpenMenuSetting}
                        handleShowChangePass={handleShowChangePass}
                        handleYoutubePost={handleYoutubePost}
                        handleFacebookPost={handleFacebookPost}
                        handleInstagramPost={handleInstagramPost}
                        handleTikTokPost={handleTikTokPost}
                        handleTwitchPost={handleTwitchPost}
                        handleTwitterPost={handleTwitterPost}
                        handleFriendPost={handleFriendPost}
                        isYoutube={isYoutube}
                        isFacebook={isFacebook}
                        isInstagram={isInstagram}
                        isTikTok={isTikTok}
                        isTwitter={isTwitter}
                        isTwitch={isTwitch}
                        isWithFriend={isWithFriend}
                        filterRenderHandling={filterRenderHandling}
                      />

                      <div className={Styles.content}>
                        {loader && <LoaderTab />}
                        <div className={Styles.layout__left}>
                            <Shortcuts page={page} setLoader={setLoader} />
                            <QuickBidding />
                        </div>
                        <div className={Styles.body}>
                          <main>{children}</main>
                        </div>
                        <div className={Styles.layout__right}>
                            <Features />
                            <QuickLottery
                              handleIsTransfer={handleIsTransfer}
                              language={language}
                            />
    
                        </div>
                      </div>

                      <BoxChat />
                      <MiniChatBox />

                      {showChangePass && (
                          <PopupChangePassword  handleShowChangePass={handleShowChangePass} />
                      )}
                    </>
                  </ConversationProvider>
                </BoxChatProvider>
                  )}
            </>
      </div>
    </>
  );
}
