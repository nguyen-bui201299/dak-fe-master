import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import ButtonFollow from "../../../Button/ButtonFollow/ButtonFollow";
import Styled from "../../Result/Search-result.module.css";
import API, { endpoints, headers } from "../../../../API"
import Link from "next/link";
import { getCookieUserLogin } from "../../../../modules/Cookies/Auth/userLogin";

var loadingUser = false;


// let params = queryString.parse(location.search);

export default function ListPeople() {
  const userLogin = getCookieUserLogin();


  const [content, setContent] = useState({});

  useEffect(() => {
      if(userLogin.language!== undefined) {
          setContent(require(`../../languages/${userLogin.language}.json`));
      }else{
          setContent(require(`../../languages/en.json`));
      }
  }, [userLogin])

  const [listUser, setListUser] = useState([]);

  // const [pageNumber, setPageNumber] = useState(1);
  const pageNumber = useRef(1);
  
  const router = useRouter();
  // console.log(router);


  const findUser = ({limit = 10, page = 1, keyword = ""}) => {
    loadingUser = true;
    if(page > 0){
      
      API.get(endpoints['finduser'](limit, page, keyword), {headers : headers.headers_token}) 
      .then((response) => {
        if(response.data.success){
          if(response.data.data.length > 0){
            loadingUser = false;
            console.log("chay vao day");
            console.log(page);
            response.data.data.map((user, index) => {
              API.get(endpoints.getDetailProfile(user.user.id), {
                headers: headers.headers_token,
              }).then(function (res) {
                console.log(res.data.data.follower_count)
                setListUser(prev => [...prev, {userDetail: user, follower: res.data.data.follower_count}])
              }).catch(function (error) {
                  console.log(error);
                }
              );
            })
            // setPageNumber(prev => {prev + 1});
            pageNumber.current += 1;
          }
          else{
            //setPage(0);
            loadingUser = true;
          }
        }else{
          loadingUser = false;
        }
      })
      .catch((error) => {
        loadingUser = false;
      })
    }
  }

  //Bắt sự kiện kéo gần đến cuối trang và load bài viết
  const Pagination = () => {
    let body = document.body;
    // if(body.offsetHeight - (window.scrollY + window.innerHeight) < 600){ 
    //     if(!loadingUser){
    //       console.log("Đến cuối trang");
    //       console.log(window.scrollY);
    //       //findUser({ page : page , keyword : params.keyword });
    //     }
    // }

    if((window.innerHeight + window.scrollY) >= body.offsetHeight){ 
      if(!loadingUser){
        
        console.log("Đến cuối trang");
        
        
        // setTimeout(() => {
        //   // findUser({ page : pageNumber.current , keyword : params.keyword })
        //   findUser({ page : pageNumber.current , keyword : router.query.keyword })
        // }, 1500);
        findUser({ page : pageNumber.current , keyword : router.query.keyword });
      }
    }
  }

  useEffect(() => {
    
    //console.log(params.keyword)
    // findUser({ page: pageNumber, keyword : params.keyword });
    findUser({ page: pageNumber.current, keyword : router.query.keyword });

    window.addEventListener('scroll', Pagination);
    //console.log('add event')

    return () => {
        window.removeEventListener('scroll', Pagination);
        //console.log('remove event')
    }
    
  }, []);

  return (
    <div className={Styled["people"]}>
      {listUser == "" ? <h2 className={Styled["no-result"]}>{content.search_no_result}</h2> : 
        <ul className={Styled["list_user"]}>
        {listUser.map((user, index) => (
          <li key={index} className={Styled["user-list"]}>
            <div className={Styled["actual-people"]}>
              <div className={Styled["people-items"]}>
                <div className={Styled["people-images"]}>
                  <img className={Styled["people-avatar"]} src={user.userDetail.user.avatar} alt="Avatar"></img>
                </div>
                <div className={Styled["people-name-follow"]}>
                  <div className={Styled["people-name"]}>
                    <Link href={`/otherprofile/${user.userDetail.user.id}`} passHref>
                      <span>{user.userDetail.user.name}</span>
                    </Link>
                  </div>
                  <div className={Styled["people-follow"]}>
                    <span>{user.follower} Followers</span>
                  </div>
                </div>
              </div>
              {getCookieUserLogin()?.id !== user.userDetail.user.id && 
                <div className={Styled["button-follow"]}>
                  <ButtonFollow isFollow={user.userDetail.user.has_follow} id={user.userDetail.user.id} idx={index} />
                </div>
              }
            </div>
          </li>
        ))}
      </ul>
      }
    </div>
  );
}
