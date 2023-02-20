import { useRouter } from "next/router";
import Styled from "./Search-hashtag.module.css";
import { useEffect, useState,useRef } from "react"
import ListHashtags from "../List/ListFind/List-hashtags";
import API ,{endpoints,headers} from "../../../API";

export default function Searched() {
  // test-render-web
  const router = useRouter();
 
  var isLoad ;
  const [listPost, setListPost] = useState([]);

  const pageNumber = useRef(1);
  const [hashTag, setHashTag] = useState(undefined);
  const [countPost, setCountPost] = useState(0);

  //catch hashtag router
  useEffect(()=>{
    if(router.query.keyword){
      setHashTag(router.query.keyword.substring(1))
    }
  },[router])

  //sự kiện scroll loadmore và lấy 5 bài viết đầu
  useEffect(() => {
    
    if(hashTag != undefined){
      pageNumber.current = 1
      setListPost([])
      getListPostHashTag(hashTag)

      const loadMore = async () =>{
        if(window.innerHeight + document.documentElement.scrollTop + 400  > document.scrollingElement.scrollHeight){
          if(!isLoad){
            getListPostHashTag(hashTag)
          }
        }
      }
      //đếm số lượng bài viết dùng hashtag
      API.get(endpoints['findhastag'](hashTag, 1000000, 1), {headers : headers.headers_token})
      .then(res =>{
          setCountPost(res.data.data.length)
      })
      .catch(err => console.log(err))
      
      
      
      window.addEventListener("scroll" , loadMore)
      return () =>{
        window.removeEventListener("scroll",loadMore)
      }


    }

  }, [hashTag]);

  //Get Post
  const getListPostHashTag = async (hashtag) =>{
    isLoad = true
    const getList =  await API.get(endpoints['findhastag'](hashtag, 5, pageNumber.current), {headers : headers.headers_token})
  
    if(getList.data.success){
      setListPost(prev => [...prev,...getList.data.data])
      pageNumber.current += 1
      isLoad = false
    }
    else{
      console.log('Get API Error');
      isLoad= false
    }
  }

  return (
    <div className={Styled["hastag"]}>
      <div className={Styled["hastag-content"]}>
        <h1>{router.query.keyword}</h1>
        <p>Có {countPost} bài viết đang sử dụng hashtag này</p>
      </div>
      <hr />
      <div className={Styled["posts-of-user"]}>
        <div className={Styled["box-posts"]}>
          <div className={Styled["box-posts-left"]}>
            <ListHashtags listPost={listPost} /> 
          </div>
        </div>
      </div>
    </div>
  );
}
