import Styled from "../Main/MainContent.module.css"
import style from "../List/list-Both.module.css"
import Link from "next/link";
import { BrowserRouter as Router } from 'react-router-dom';
import { useEffect, useState, useRef } from "react";
import Image from 'next/image'
import { FaSearch } from "react-icons/fa";
import {AiOutlineLoading3Quarters} from 'react-icons/ai'
import queryString from 'query-string';
import ChildPicturesGroup from "../component/ChildPicturesGroup";
import API, { endpoints, headers } from '../../../API';
import useDebouce from "../../../modules/Debounce/useDebounce";
import { getCookieUserLogin } from "../../../modules/Cookies/Auth/userLogin";

function randomArrayShuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }


export function ListGroup (props) {
    const userLogin = getCookieUserLogin()

    const [content, setContent] = useState({});

    useEffect(() => {
        if(userLogin.language!== undefined) {
            setContent(require(`../languages/${userLogin.language}.json`));
        }else{
            setContent(require(`../languages/en.json`));
        }
    }, [userLogin])

    const { activeIndex, joinGroup, groups } = props
    const [filterGroup, setFilterGroup] = useState(null)
    const [filterGroupJoined, setFilterGroupJoined] = useState([])

    //When you click anyway, this box will close!
    const [showBoxSearch, setShowBoxSearch] = useState(false);
    const ref = useRef(false);

    useEffect(() => { 
        if(groups && filterGroup === null) {
            // Xáo trộn render group ngẫu nhiên
            randomArrayShuffle(groups)

            // Lấy group chưa tham gia để render vào gợi ý
            const groupsId = groups.map((item) => {return item.group});
            const joinGroupId = joinGroup?.map(item => {return item.id});
            setFilterGroup(groupsId.filter(item => !joinGroupId?.includes(item.id)))
        }
    }, [])

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
    //Value Search
    const [inputSearch, setInputSearch] = useState('');
    const textSearch = {
        name: inputSearch,
    }
    //Show Value Resutl on SearchBox
    const [valueResult, setValueResult] = useState([]);
    // dữ liệu valueresult khi lần đầu bấm vào nút search
    
    const [loading, setLoading] = useState(false);

    const [searchSuccess, setSearchSuccess] = useState(false);
    //input search không thay đổi giá trị trong 0.5s thì debounced = inputSearch
    const debounced = useDebouce(inputSearch,500)
    //thay đổi kết quả search mỗi khi inputSearch thay đổi
    useEffect(()=>{
            const getdata = async () => {
                setLoading(true)
                
                const result = await API.get(endpoints['findGroup'](15, 1,debounced.length === 0 ? '':debounced), {headers: headers.headers_token})
                
                if(result.data.success){
                    setValueResult(result.data.data)
                    setSearchSuccess(true)
                    // Lấy danh sách group đã tham gia
                    const joined = result.data.data.filter((item) => item.has_joined )
                    setFilterGroupJoined(joined)
                }
                else{
                    setSearchSuccess(false)
                }

                setLoading(false)
                
            
            }
            getdata();    
    },[debounced])

    // Filter group quản lý
    const [groupAdmin, setGroupAdmin] = useState(false) 
    const [allGroup, setAllGroup] = useState(true)
    const showAllGroup = () => {
        setAllGroup(true)
        setGroupAdmin(false)
    }

    const showGroupAdmin = () => {
        setAllGroup(false)
        setGroupAdmin(true)
    }


    // Các nhóm gợi ý tham gia (nhóm user chưa tham gia)
    if (activeIndex === 1) {
        return (
            <div>
                <div className={Styled.main_content}>
                    <div className={Styled["main-content"]}>
                        {/* nếu để ở chỗ nhóm chưa tham gia thì cho cái tiêu đề là : "Gợi ý cho bạn" */}
                        <h2>{content.list_group_recommend}</h2>
                        {/* Gợi ý các group bạn có thể thích */}
                        <p>{content.list_group_recommend_groups}</p>
                    </div>
                    <div className={Styled["main-everyGroup"]}>
                        <div className={style.group__search} ref={ref}>
                            <div className={style.groupSearch__box}>
                                <input 
                                type="text" 
                                className={style.groupSearch__inputs} 
                                value={inputSearch} 
                                onChange={e => {
                                    if(e.target.value[0] != ' ') 
                                        setInputSearch(e.target.value)
                                }} 
                                onClick={() => setShowBoxSearch(!showBoxSearch)} 
                                placeholder={content.list_group_search_placeholder}
                                />
                                {loading ? 
                                <AiOutlineLoading3Quarters className={`${style.loadingIcon} ${loading && style.loading}`} />
                                :(
                                    inputSearch == '' ?
                                    <Link href="/group/main-group" passHref>
                                        <a className={style.groupSearch__icon}>
                                            <FaSearch className={style.groupHeader_icon} />
                                        </a>
                                    </Link> :
                                    <Link passHref
                                        href={inputSearch && inputSearch.trim().substring(0, 1) === "#" ?
                                        {
                                            pathname: "/searched/hastag",
                                            query: {
                                            keyword: inputSearch,
                                            },
                                        }
                                        :
                                        {
                                            pathname: "/searched/result/",
                                            query: {
                                            keyword: inputSearch,
                                            },
                                        }}
                                    >
                                        <a className={style.groupSearch__icon}>
                                            <FaSearch className={style.groupHeader_icon} />
                                        </a>
                                    </Link>
                                )    
                            }
                                
                                {showBoxSearch && (
                                    <div className={style.search__both}>
                                        <Router>
                                            <Link href={{
                                                pathname: '/searched/history',
                                                query: {
                                                    history: queryString.stringify(textSearch, null, null,
                                                        { encodeURIComponent })
                                                },
                                            }} passHref>
                                                <h3 className={style.search__both__heading}>{content.list_group_history_search}</h3>
                                            </Link>
                                        </Router>
                                        <ul className={style.search__both__list}>
                                            {/* load data from value search box */}
                                            { searchSuccess ?  
                                                (inputSearch !== '' && valueResult.map((item) => (
                                                    <li className={style.search__both__item} key={item.group.id}>
                                                        <Link href={`detail-group/${item.group.id}`} passHref>
                                                            <a className={style.search__both__link}>
                                                                <div className={style.search__both__avatar}>
                                                                    <Image src={item.group.background_img} width ={"30px"} height={"30px"} alt="Avatar" />
                                                                </div>
                                                                <h3 className={style.search__both__name}>{item.group.name}</h3>
                                                            </a>
                                                        </Link>
                                                    </li>))) 
                                                : (
                                                    <li className={style.search__both__item} >
                                                        <h3  className={style.search__both__name} >{content.list_group_no_result}</h3>
                                                    </li>
                                            )}

                                        {inputSearch != '' &&
                                            <div className={style.more__details}>
                                                <Link
                                                    href={inputSearch && inputSearch.trim().substring(0, 1) === "#" ?
                                                    {
                                                        pathname: "/searched/hastag",
                                                        query: {
                                                        keyword: inputSearch,
                                                        },
                                                    }
                                                    :
                                                    {
                                                        pathname: "/searched/result/",
                                                        query: {
                                                        keyword: inputSearch,
                                                        },
                                                    }}
                                                    passHref
                                                >
                                                    <a>
                                                    {content.list_group_looking_result} {`"${inputSearch}"`}
                                                    </a>
                                                </Link>
                                                </div>
                                            }
                                        </ul>
                                    </div>
                                )}
                                {/* to fix here */}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={Styled["main-groupPictures"]}>
                    {filterGroup && filterGroup.map((filter, index) => (<ChildPicturesGroup key={index} filterGroup={filter}/>))}  
                </div>
            </div>
        )
    }

    // Các nhóm user đã tham gia
    if (activeIndex === 2) {
        return (
            <div>
                <div className={Styled.main_content}>
                    <div className={Styled["main-content"]}>
                        {/* nếu để ở chỗ nhóm chưa tham gai thì cho cái tiêu đề là : "Gợi ý cho bạn" */}
                        <h2>{content.list_group_your_groups} </h2>
                        {/* Gợi ý các group bạn có thể thích */}
                        <p>{content.list_group_your_joined_groups}</p>
                        <div className={Styled.btn_filter}>
                            <button className={allGroup ? `${Styled.btn_filter_groups_active} ${Styled.btn_filter_groups}` : Styled.btn_filter_groups} onClick={showAllGroup}>{content.list_group_all}</button> 
                            <button className={groupAdmin ? `${Styled.btn_filter_groups_active} ${Styled.btn_filter_groups}` : `${Styled.btn_filter_groups}`} onClick={showGroupAdmin}>{content.list_group_admin}</button>  
                        </div>
                    </div>
                    <div className={Styled["main-everyGroup"]}>
                        <div className={style.group__search} ref={ref}>
                            <div className={style.groupSearch__box}>
                                <input type="text"
                                    className={style.groupSearch__inputs}
                                    value={inputSearch}
                                    onChange={e => {
                                        if(e.target.value[0] != ' ') 
                                            setInputSearch(e.target.value)
                                    }} 
                                    onClick={() => setShowBoxSearch(!showBoxSearch)} 
                                    placeholder={content.list_group_search_placeholder} />
                                    {loading ? 
                                        <AiOutlineLoading3Quarters className={`${style.loadingIcon} ${loading && style.loading}`} />
                                        :(
                                            inputSearch == '' ?
                                            <Link href="/group/main-group">
                                                <a className={style.groupSearch__icon}>
                                                    <FaSearch className={style.groupHeader_icon} />
                                                </a>
                                            </Link> :
                                            <Link 
                                                href={inputSearch && inputSearch.trim().substring(0, 1) === "#" ?
                                                {
                                                    pathname: "/searched/hastag",
                                                    query: {
                                                    keyword: inputSearch,
                                                    },
                                                }
                                                :
                                                {
                                                    pathname: "/searched/result/",
                                                    query: {
                                                    keyword: inputSearch,
                                                    },
                                                }}
                                            >
                                                <a className={style.groupSearch__icon}>
                                                    <FaSearch className={style.groupHeader_icon} />
                                                </a>
                                            </Link>
                                        )    
                                    }
                                {showBoxSearch && (
                                    <div className={style.search__both}>
                                        <Router>
                                            <Link href={{
                                                pathname: '/searched/history',
                                                query: {
                                                    history: queryString.stringify(textSearch, null, null,
                                                        { encodeURIComponent })
                                                },
                                            }} passHref>
                                                <h3 className={style.search__both__heading}>{content.list_group_history_search}</h3>
                                            </Link>
                                        </Router>
                                        <ul className={style.search__both__list}>
                                            {searchSuccess ? inputSearch !== '' && 
                                                filterGroupJoined.map((item) => {
                                                    return (
                                                        <li key={item.group.id} className={style.search__both__item}>
                                                            <Link href={`/group/detail-group/${item.group.id}`}>
                                                                <a className={style.search__both__link}>
                                                                    <div className={style.search__both__avatar}>
                                                                        <Image src={item.group.background_img} width ={"30px"} height={"30px"} alt="Avatar" />
                                                                    </div>
                                                                    <h3 className={style.search__both__name}>{item.group.name}</h3>
                                                                </a>
                                                            </Link>
                                                        </li>
                                                )})
                                            : (
                                                <li className={style.search__both__item} >
                                                    <h3  className={style.search__both__name} >{content.list_group_no_result}</h3>
                                                </li>
                                            )}
                                            
                                            {inputSearch != '' &&
                                            <div className={style.more__details}>
                                                <Link
                                                    href={inputSearch && inputSearch.trim().substring(0, 1) === "#" ?
                                                    {
                                                        pathname: "/searched/hastag",
                                                        query: {
                                                        keyword: inputSearch,
                                                        },
                                                    }
                                                    :
                                                    {
                                                        pathname: "/searched/result/",
                                                        query: {
                                                        keyword: inputSearch,
                                                        },
                                                    }}
                                                    passHref
                                                >
                                                    <a>
                                                    {content.list_group_looking_result} {`"${inputSearch}"`}
                                                    </a>
                                                </Link>
                                                </div>
                                            }
                                        </ul>
                                    </div>
                                )}
                                {/* to fix here */}
                            </div>
                        </div>
                    </div>
                </div>
                {allGroup && 
                    <div className={Styled["main-groupPictures"]}>
                        {joinGroup && joinGroup.map((group, index) => (<ChildPicturesGroup key={index} joinGroup={group}/>))}  
                    </div>  
                }

                {groupAdmin && 
                    <div className={Styled["main-groupPictures"]}>
                        {joinGroup && joinGroup.map((group, index) => (group.role === "ROLE_GROUP_SUPER_ADMIN" && <ChildPicturesGroup key={index} joinGroup={group}/>))}  
                    </div>  
                }

            </div>
        )
    }    
}
export default ListGroup