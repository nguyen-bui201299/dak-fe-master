import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import Styled from '../../Result/Search-result.module.css'
import API, { endpoints, headers } from "../../../../API"
import Post from "../../../Post/Post";
import { getCookieUserLogin } from "../../../../modules/Cookies/Auth/userLogin";

var loandingPost = false;

const List = () => {
    const userLogin = getCookieUserLogin();


    const [content, setContent] = useState({});

    useEffect(() => {
      if(userLogin.language!== undefined) {
          setContent(require(`../../languages/${userLogin.language}.json`));
      }else{
          setContent(require(`../../languages/en.json`));
      }
  }, [userLogin])

    const [listPost, setListPost] = useState([]);

    // const [pageNumber, setPageNumber] = useState(1);
    const pageNumber = useRef(1);
    
    const router = useRouter();
    // console.log(router);


    const findPost = ({limit = 5, page = 1, keyword = ""}) => {
        loandingPost = true;
        if(page > 0){
        
            API.get(endpoints['findAllPost'](limit, page, keyword), {headers : headers.headers_token}) 
            .then((response) => {
                if(response.data.success){
                    if(response.data.data.length > 0){
                        setListPost(prev => {

                            // setPage(prev2 => {prev2 + 1});
                            
                            loandingPost = false;
                            console.log("chay vao day");
                            console.log(page);
                            console.log([...prev, ...response.data.data])
                            return [...prev, ...response.data.data]
                        });
                        // setPageNumber(prev => {prev + 1});
                        pageNumber.current += 1;
                    }
                    else{
                        //setPage(0);
                        loandingPost = true;
                    }
                }else{
                    loandingPost = false;
                }
            })
            .catch((error) => {
                loandingPost = false;
            })
        }
    }

    //Bắt sự kiện kéo gần đến cuối trang và load bài viết
    const Pagination = () => {
        let body = document.body;
        // if(body.offsetHeight - (window.scrollY + window.innerHeight) < 600){ 
        //     if(!loandingPost){
        //       console.log("Đến cuối trang");
        //       console.log(window.scrollY);
        //       //findPost({ page : page , keyword : params.keyword });
        //     }
        // }

        if((window.innerHeight + window.scrollY) >= body.offsetHeight){ 
            if(!loandingPost){
                
                console.log("Đến cuối trang");
                
                findPost({ page : pageNumber.current , keyword : router.query.keyword });
            }
        }
    }

    useEffect(() => {
        
        //console.log(params.keyword)
        // findPost({ page: pageNumber, keyword : params.keyword });
        findPost({ page: pageNumber.current, keyword : router.query.keyword });
        
        window.addEventListener('scroll', Pagination);
        return () => {
            window.removeEventListener('scroll', Pagination);
        }
        
    }, []);

    return (
        <div  className={Styled["post-content"]}>
           {listPost == "" ? <h2 className={Styled["no-result"]}>{content.search_no_result}</h2> : 
            <>
                 {listPost.map((post, index) => (
                    <>
                        {/* <div className={`${Styles["body__box-post"]} grid-item`}> */} 
                            {post.post_type == "youtube"   && <Post typepost={'youtube'}     url={post.post.post_url} key={index} postid={post.post.id} post={post}/>}
                            {post.post_type == "facebook"  && <Post typepost={'facebook'}    url={post.post.post_url} key={index} postid={post.post.id} post={post}/>}
                            {post.post_type == "tiktok"    && <Post typepost={'tiktok'}      url={post.post.post_url} key={index} postid={post.post.id} post={post}/>}
                            {post.post_type == "twitter"   && <Post typepost={'twitter'}     url={post.post.post_url} key={index} postid={post.post.id} post={post}/>}
                            {post.post_type == "twitch"    && <Post typepost={'twitch'}      url={post.post.post_url} key={index} postid={post.post.id} post={post}/>}
                            {post.post_type == "instagram" && <Post typepost={'instagram'}   url={post.post.post_url} key={index} postid={post.post.id} post={post}/>}
                        {/* </div> */}
                    </>
                ))
            }
            </>
           }
        </div>
    );
};

export default List