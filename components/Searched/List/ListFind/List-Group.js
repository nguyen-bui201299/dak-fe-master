import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import Styled from '../../Result/Search-result.module.css'
import ButtonJoin from '../../../Button/ButtonJoin/ButtonJoin'
import API, { endpoints, headers } from "../../../../API"
import Link from "next/link";
import { getCookieUserLogin } from "../../../../modules/Cookies/Auth/userLogin";

var loadingGroup = false;


const List = () => {
    const [listGroup, setListGroup] = useState([]);

    // const [pageNumber, setPageNumber] = useState(1);
    const pageNumber = useRef(1);

    const router = useRouter();
    // console.log(router);

    const userLogin = getCookieUserLogin();


    const [content, setContent] = useState({});

    useEffect(() => {
      if(userLogin.language!== undefined) {
          setContent(require(`../../languages/${userLogin.language}.json`));
      }else{
          setContent(require(`../../languages/en.json`));
      }
    }, [userLogin])


    const findGroup = ({limit = 10, page = 1, keyword = ""}) => {
        loadingGroup = true;
        if(page > 0){
        
            API.get(endpoints['findgroup'](limit, page, keyword), {headers : headers.headers_token}) 
            .then((response) => {
                if(response.data.success){
                    if(response.data.data.length > 0){
                        setListGroup(prev => {

                            // setPage(prev2 => {prev2 + 1});
                            
                            loadingGroup = false;
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
                        loadingGroup = true;
                    }
                }else{
                    loadingGroup = false;
                }
            })
            .catch((error) => {
                loadingGroup = false;
            })
        }
    }

    //Bắt sự kiện kéo gần đến cuối trang và load bài viết
    const Pagination = () => {
        let body = document.body;
        // if(body.offsetHeight - (window.scrollY + window.innerHeight) < 600){ 
        //     if(!loadingGroup){
        //       console.log("Đến cuối trang");
        //       console.log(window.scrollY);
        //       //findGroup({ page : page , keyword : params.keyword });
        //     }
        // }

        if((window.innerHeight + window.scrollY) >= body.offsetHeight){ 
            if(!loadingGroup){
                
                console.log("Đến cuối trang");

                findGroup({ page: pageNumber.current, keyword: router.query.keyword });
            }
        }
    }

    useEffect(() => {

        //console.log(params.keyword)
        // findUser({ page: pageNumber, keyword : params.keyword });
        findGroup({ page: pageNumber.current, keyword: router.query.keyword });

        window.addEventListener('scroll', Pagination);
        return () => {
            window.removeEventListener('scroll', Pagination);
        }

    }, []);

    return (
        <div className={Styled["group"]}> 
            {listGroup == "" ? <h2 className={Styled["no-result"]}>{content.search_no_result}</h2>  : 
                <ul className={Styled["list_user"]}>
                {
                    listGroup.map((group, index) => {
                        return (
                            <li key={index} className={Styled["group-list"]}>
                                <div className={Styled["actual-group"]}>
                                    <div className={Styled["group-items"]}>
                                        <div className={Styled["group-images"]}>
                                            {/* <Image src={"/images/bg.png"} alt='picture-profile' width={60} height={60}/> */}
                                            <img className={Styled["group-avatar"]} src={group.group.avatar} alt="" />
                                        </div>
                                        <div className={Styled["group-name-member"]}>
                                            <div className={Styled["group-name"]}>
                                                <Link href={`/group/detail-group/${group.group.id}`} passHref>
                                                    <span>{group.group.name}</span>
                                                </Link>
                                            </div>
                                            <div className={Styled["group-member"]}>
                                                <span>{group.member_count} members</span>
                                            </div>
                                        </div>
                                    </div>
                                    <ButtonJoin isJoin={group.has_joined} idGroup={group.group.id} />
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
            }
        </div>
    );
};

export default List