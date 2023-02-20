import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import API, { endpoints, headers } from '../API'
import PopupStory from '../components/PopupStory/PopupStory';
import Layout, { siteTitle } from '../components/Layout/Layout';
import Post from '../components/Post/Post';
import FormCreatePost from '../components/FormCreatePost/FormCreatePost';
import Styles from '../styles/Home.module.css';
import Stories from '../components/Stories/Stories.js';
import { getListIdPost } from '../modules/Posts/get-list-id-post';
import { getDetailPost } from '../modules/Posts/get-detail-post';
import Masonry from 'react-masonry-css';
import { getCookieUserLogin } from '../modules/Cookies/Auth/userLogin';
import PopupContinueWatching from '../components/PopupContinueWatching/PopupContinueWatching';
import FormUpdatePost from '../components/FormUpdatePost/FormUpdatePost';
import LoaderPost from "../components/LoaderPost/LoaderPost";
import { NotificationToast } from '../modules/Notification/Notification';
import { useSelector } from 'react-redux';
import ListRankPost from '../components/Post/ListRankPost'

var loadingPost = false;

export default function Home() {
  const socialListItems = useSelector(state => state.socialListItems);
  const [listPostId, setListPostId] = useState([]); //danh sách id post
  const [listDetailPost, setListDetailPost] = useState([]); //danh sách chi tiết bài viết
  const [listPostBidding, setListPostBidding] = useState([]); //danh sách post bidding
  const [listPostIdHasRender, setListPostIdHasRender] = useState([]); //anh sách id post đã xuất ra màn hình
  const [showFormCreatePost, setShowFormCreatePost] = useState(false); //Kiểm tra mở form tạo bài viết
  const [showPopupStory, setShowPopupStory] = useState(false); //Kiểm tra show popup story
  const [listDetailPostBidding, setListDetailPostBidding] = useState([]); //danh sách chi tiết bài viết
  const [listFilterType, setListFilterType] = useState(socialListItems);
  const [language, setLanguage] = useState('en'); //Lưu ngôn ngữ đang chọn
  const [content, setContent] = useState({}); //Lưu nội dung của ngôn ngữ
  const [postContinue, setPostContinue] = useState();
  const [showPostContinue, setShowPostContinue] = useState(false);
  const [showUpdatePost, setShowUpdatePost] = useState(false);
  const [postUpdate, setPostUpdate] = useState('');
  const [iconBidding, setIconBidding] = useState(false)
  const [isYoutube, setIsYoutube] = useState(false)
  const [isFacebook, setIsFacebook] = useState(false)
  const [isInstagram, setIsInstagram] = useState(false)
  const [isTikTok, setIsTikTok] = useState(false)
  const [isTwitter, setIsTwitter] = useState(false)
  const [isTwitch, setIsTwitch] = useState(false)
  const [isWithFriend, setIsWithFriend] = useState(false)
  const [lastSocialMediaFilter, setLastSocialMediaFilter] = useState("")
  const [updataBidding, setUpdataBidding] = useState(undefined);
  const [contentLayout, setContentLayout] = useState(1)
  const [listRankPosts, setListRankPosts] = useState()

  const userLogin = getCookieUserLogin()
  
  const handleYoutubePost = () => setIsYoutube(prevState => !prevState)
  const handleFacebookPost = () => setIsFacebook(prevState => !prevState)
  const handleTikTokPost = () => setIsTikTok(prevState => !prevState)
  const handleTwitterPost = () => setIsTwitter(prevState => !prevState)
  const handleTwitchPost = () => setIsTwitch(prevState => !prevState)
  const handleInstagramPost = () => setIsInstagram(prevState => !prevState)
  const handleFriendPost = () => setIsWithFriend(prevState => !prevState)

  const breakpointColumnsObj = {
    default: 2,
    1100: 2,
    700: 1,
  };

  const openModal = () => {
    setShowFormCreatePost(prev => !prev);
  };

  // Start handle sticky nav
  const [sticky, setSticky] = useState(false);

  const controlNav = () => {
    if (window.scrollY > 350) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };

  const eventScroll = async () => {
    controlNav();

    try {
      let body = document.body;
      if (body.offsetHeight - (window.scrollY + window.innerHeight) < 1000) {
        if (!loadingPost) {
          if (listPostId.length >= 6) {
            loadingPost = true;
            let listid = listPostId;
            let listNewDetailsPost = await getDetailPost(listid.slice(0, 6));
            if (
              listNewDetailsPost.success &&
              listNewDetailsPost.data.length >= 0
            ) {
              let tempList = listid
              listNewDetailsPost.data.map((item) =>{
                 tempList = tempList.filter( idPost => idPost !== item.post.id )
              })
              setListDetailPost(prev => [...prev, ...listNewDetailsPost.data]);
              setListPostId([...tempList]);
            }
            loadingPost = false;
          } else {
            loadingPost = true;

            let data = {
              list_post_id: listPostIdHasRender,
              social_type: listFilterType,
            };

            let listNewId = await getListIdPost(data);
            if( listNewId.success && listNewId.data.dataNewfees.length >= 6){
              setListPostIdHasRender(prev => [...prev, ...listNewId.data.dataNewfees]);
              let listNewDetailsPost = await getDetailPost(
                listNewId.data.dataNewfees.splice(0, 6)
              );
              if(listNewDetailsPost.success && listNewDetailsPost.data.length >=0){
                setListDetailPost(prev => [
                  ...prev,
                  ...listNewDetailsPost.data,
                ]);
                setListPostId(prev => [...prev, ...listNewId.data.dataNewfees]);
              }
            }
            loadingPost = false;
          }
        }
      }
    } catch (e) {
      loadingPost = false;
    }
    };

  useEffect(() => {
    setListPostId([]);
    setLanguage(userLogin && userLogin.language ? userLogin.language : 'en');
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', eventScroll);
    return () => {
      window.removeEventListener('scroll', eventScroll);
    };
  }, [listFilterType, listPostId, listDetailPost, listPostIdHasRender]);

  // End handle sticky nav
  const openPopupStory = () => {
    setShowPopupStory(prev => !prev);
  };

  const loadRankPosts = async (abortController) => {
    const listRankPost = await API.get(endpoints['getRankPost'](100), { headers: headers.headers_token })
      .then(res => {
        if (res.data.code === 200) {
          return res.data.data
        }
      }).catch(e => console.log(e))
    setListRankPosts(listRankPost)
  }
  
  const loadPosts = async () => {
    try {
      loadingPost = true;
      let data = {
        list_post_id: listPostIdHasRender,
        social_type: listFilterType,
      };
      let listNewId = await getListIdPost(data);
      if (listNewId.success && listNewId.data.dataNewfees.length >= 6) {
        setListPostIdHasRender(prev => [...prev, ...listNewId.data.dataNewfees]);
        let listNewDetailsPost = await getDetailPost(
          listNewId.data.dataNewfees.slice(0, 6)
        )
        let listNewDetailsPostBidding = await getDetailPost(
          listNewId.data.databidding
        )
        ;
        if (listNewDetailsPost.success && listNewDetailsPost.data.length >= 0) {
          setListDetailPost(prev => [...prev, ...listNewDetailsPost.data]);
          setListDetailPostBidding(prev => [...prev, ...listNewDetailsPostBidding.data]);

          //start fix lap 6 bai post dau
            let tempListId = listNewId.data.dataNewfees
            listNewDetailsPost.data.map((item) => {
              tempListId = tempListId.filter(idItemPost => idItemPost != item.post.id)
            })
            //end
          setListPostId([...tempListId]);
        }
      }
      if(listNewId.success && listNewId.data.databidding.length >= 0) {
        setIconBidding(true)
        let listDetailPostBidding = await getDetailPost(
          listNewId.data.databidding
        )
        if(listDetailPostBidding.success && listDetailPostBidding.data.length >= 0) {
          setListPostBidding(prev => [...prev, ...listDetailPostBidding.data]);
        }
      }

      loadingPost = false;
    } catch (e) {
      loadingPost = false;
    }
  };

  //Load bài viết lần đầu tiên
  useEffect(() => {
    loadPosts();
    loadRankPosts();
  }, []);

  
  useEffect(() => {
    setContent(require(`../languages/home/${language}.json`));
  }, [language]);

  const handleShowFormUpdatePost = (post,type) => {
    setShowUpdatePost(prev => !prev);
    setPostUpdate(post);
    if(type === 'bidding'){
      setUpdataBidding(true)
    }
    else{
      setUpdataBidding(false)
    }
  };

  // Chặn khi người dùng tắt hết filter các mạng xã hội
  const filterRenderHandling = (socialMediaType) => {
    setLastSocialMediaFilter(socialMediaType)
  }
  
  useEffect(() => {
    if (isYoutube && isTikTok && isFacebook && isInstagram && isTwitter && isTwitch && isWithFriend) {
      if (lastSocialMediaFilter) {
        if(lastSocialMediaFilter === 'youtube') {
          NotificationToast.fire({
            toast: true,
            position: 'bottom-end',
            icon: 'warning',
            title: `Please let at least 1 social media activated`,
          })
          setIsYoutube(false)
        }
        if(lastSocialMediaFilter === 'facebook') {
          NotificationToast.fire({
            toast: true,
            position: 'bottom-end',
            icon: 'warning',
            title: `Please let at least 1 social media activated`,
          })
          setIsFacebook(false)
        }
        if(lastSocialMediaFilter === 'instagram') {
          NotificationToast.fire({
            toast: true,
            position: 'bottom-end',
            icon: 'warning',
            title: `Please let at least 1 social media activated`,
          })
          setIsInstagram(false)
        }
        if(lastSocialMediaFilter === 'tiktok') {
          NotificationToast.fire({
            toast: true,
            position: 'bottom-end',
            icon: 'warning',
            title: `Please let at least 1 social media activated`,
          })
          setIsTikTok(false)
        }
        if(lastSocialMediaFilter === 'twitch') {
          NotificationToast.fire({
            toast: true,
            position: 'bottom-end',
            icon: 'warning',
            title: `Please let at least 1 social media activated`,
          })
          setIsTwitch(false)
        }
        if(lastSocialMediaFilter === 'twitter') {
          NotificationToast.fire({
            toast: true,
            position: 'bottom-end',
            icon: 'warning',
            title: `Please let at least 1 social media activated`,
          })
          setIsTwitter(false)
        }
        if(lastSocialMediaFilter === 'with_friend') {
          NotificationToast.fire({
            toast: true,
            position: 'bottom-end',
            icon: 'warning',
            title: `Please let at least 1 social media activated`,
          })
          setIsWithFriend(false)
        }
      }
    }
  }, [isFacebook, isInstagram, isTikTok, isTwitch, isTwitter, isWithFriend, isYoutube, lastSocialMediaFilter])

  const handleOnChangeLayout = (layout) => {
    setContentLayout(layout)
  }

  return (
    <>
      <Head>
        <title>{siteTitle}</title>
        {/* <script src="https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.js"></script> */}
      </Head>
      <Layout
        setListFilterType={setListFilterType}
        listFilterType={listFilterType}
        setLanguage={setLanguage}
        language={language}
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
      >
        <div className={Styles['body__stories']}>
          <Stories handleClickInPopup />
        </div>

        <div className={Styles['body__post']}>
          <div
            className={`${Styles['body__header']} ${
              sticky && Styles['is_Sticky']
            }`}
          >
            <div className={Styles['header__list']}>
              <div className={Styles['header__list-left']}>
                <div
                  className={`${Styles['header__item']} ${contentLayout === 1 && Styles['active']}`}
                  onClick={() => handleOnChangeLayout(1)}
                >
                  {content.home_popular}
                </div>
                <div
                  className={Styles['header__item']}
                  onClick={() => setShowPopupStory(!showPopupStory)}
                >
                  {content.home_news}
                </div>
                <div className={`${Styles['header__item']} ${contentLayout === 2 && Styles['active']}`} onClick={() => handleOnChangeLayout(2)}>{content.home_new}</div>
                <div className={`${Styles['header__item']} ${contentLayout === 3 && Styles['active']}`} onClick={() => handleOnChangeLayout(3)}>
                  {content.home_rank}
                </div>
                <div className={Styles['header__item']}>
                  <button
                    className={Styles['header__create']}
                    onClick={openModal}
                  >
                    <i className='fas fa-edit'></i>
                    
                    {sticky? "" : content.home_create_post}
                  </button>
                </div>
              </div>
              {showPopupStory && (
                <PopupStory
                  handleClick={() => setShowPopupStory(!showPopupStory)}
                  setShowPopupStory={setShowPopupStory}
                  showPopupStory={showPopupStory}
                />
              )}
            </div>
          </div>

            {
              contentLayout === 2 || contentLayout === 3 ? (
                <div className={Styles.commingSoon}>
                  <h1>
                    <b>Coming soon</b>
                  </h1>
                </div>
              ) : ""
            }

          {/* <div className={`${Styles["body__list-post"]}`}> */}
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className='my-masonry-grid'
            columnClassName='my_masonry_grid_column'
          >
            {/* Post bidding */}
            {listPostBidding.length > 0 && listPostBidding.map((post) => (    
                  <Post
                    iconBidding={iconBidding}
                    typepost={post.post_type}
                    key={post.post.id}
                    postid={post.post.id}
                    post={post}
                    url={post.post.post_url}
                    setPostContinue={setPostContinue}
                    setShowPostContinue={setShowPostContinue}
                    updatePost={() => handleShowFormUpdatePost(post,'bidding')}
                    isYoutube={isYoutube}
                    isFacebook={isFacebook}
                    isInstagram={isInstagram}
                    isTikTok={isTikTok}
                    isTwitter={isTwitter}
                    isTwitch={isTwitch}
                    isWithFriend={isWithFriend}
                  />
            ))}

            {/* Post */}
            {contentLayout === 1 && 
              listDetailPost.map((post) => (
                <Post
                  typepost={post.post_type}
                  url={post.post.post_url}
                  key={post.post.id}
                  postid={post.post.id}
                  post={post}
                  setPostContinue={setPostContinue}
                  setShowPostContinue={setShowPostContinue}
                  updatePost={() => handleShowFormUpdatePost(post,'postNormal')}
                  isYoutube={isYoutube}
                  isFacebook={isFacebook}
                  isInstagram={isInstagram}
                  isTikTok={isTikTok}
                  isTwitter={isTwitter}
                  isTwitch={isTwitch}
                  isWithFriend={isWithFriend}
                />
              )) 
              }

             

              {/* {
                contentLayout === 3 && listRankPosts?.map((post) => (
                  <Post
                      typepost={post.post_type}
                      url={post.post.post_url}
                      key={post.post.id}
                      postid={post.post.id}
                      post={post}
                      setPostContinue={setPostContinue}
                      setShowPostContinue={setShowPostContinue}
                      updatePost={() => handleShowFormUpdatePost(post,'postNormal')}
                      isYoutube={isYoutube}
                      isFacebook={isFacebook}
                      isInstagram={isInstagram}
                      isTikTok={isTikTok}
                      isTwitter={isTwitter}
                      isTwitch={isTwitch}
                      isWithFriend={isWithFriend}
                  />
                ))
              } */}

              {contentLayout === 1 ? 
                listDetailPost.length > 0 && 
                <>
                  <LoaderPost />
                </> 
                : 
                <></>
              }
          </Masonry>
          
          {/* <button onClick={() => handleClick()} >Load more</button> */}
          {/* </div> */}
        </div>
      </Layout>
      {showFormCreatePost && <FormCreatePost
        language={language}
        showmodal={showFormCreatePost}
        setShowModal={setShowFormCreatePost}
        setListDetailPost={setListDetailPost}
        setShowFormCreatePost={setShowFormCreatePost}
        setListPostProfile={setListDetailPost}
      />}
      {showPostContinue && postContinue && (
        <PopupContinueWatching
          post={postContinue}
          showModal={showPostContinue}
          setShowModal={setShowPostContinue}
        />
      )}

        { 
          showUpdatePost && !updataBidding ? (

            <FormUpdatePost
            showmodal={showUpdatePost}
            setShowModal={setShowUpdatePost}
            postUpdate={postUpdate}
            setListPostProfile={setListDetailPost}
            listPostProfile={listDetailPost}
            // setIsDeletePost={setIsDeletePost}
            // isDeletePost={isDeletePost}
            />
            )
            : showUpdatePost && updataBidding ? (
              <FormUpdatePost
              showmodal={showUpdatePost}
              setShowModal={setShowUpdatePost}
              postUpdate={postUpdate}
              setListPostProfile={setListPostBidding}
              listPostProfile={listPostBidding}
              // setIsDeletePost={setIsDeletePost}
              // isDeletePost={isDeletePost}
              />
            )
        : ""
        }
    </>
  );
}