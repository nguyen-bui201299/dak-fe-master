import Head from "next/head";
import Image from "next/image";
import Footer from "../../../components/Footer/Footer";
import Layout from "../../../components/Layout/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import Background from "../../../public/images/bg.png";
import Dak from "../../../public/images/dak.png";
import Styles from "../../../styles/Profile.module.css";
import {FaCheck, FaFacebookMessenger, FaPlusCircle, FaRegEdit, FaCheckCircle, FaEdit} from "react-icons/fa";
import PopupStatistic from "../../../components/PopupStatistic/PopupStatistic";
import {AiOutlineEuroCircle, AiOutlinePlusCircle} from 'react-icons/ai'
import {RiUserFollowFill} from 'react-icons/ri'
import { getCookieUserLogin } from "../../../modules/Cookies/Auth/userLogin";
import API, {endpoints, headers} from "../../../API";
import PopupEditProfile from "../../../components/PopupEditProfile/PopupEditProfile";

export default function Profile() {
    const [active, setActive] = useState(1);
    const [activeLink, setActiveLink] = useState(1);

    const filters = [
        'Bài viết',
        'Thư viện',
        'Thống kê'
    ]

    const [showPopupStatistic, setShowPopupStatistic] = useState(false)
    const openStatistic = () => {
        setShowPopupStatistic(prev => !prev)
    }

    const [userLogin, setUserLogin] = useState({});
    const [interaction, setInteraction] = useState({});

    const [showEditProfile, setShowEditProfile] = useState(false);

    useEffect(() => {

        setUserLogin(getCookieUserLogin());      
        API.get(endpoints['user/profile'] , {headers : headers.headers_token})
            .then(function (response2) {
                // console.log(response2.data);
                setInteraction(response2.data.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [])
    
    return(
        <Layout>
            <Head>
                <title>DAK - Profile</title>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
                {/* <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800;900&display=swap" rel="stylesheet"/> */}
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
            </Head>
            <section className={Styles["profile"]}>
                <div className={Styles.themeProfile}>
                    <div className={Styles.profileArea}>
                        <div className={Styles.profileImageBackground}>
                            {/* <Image src={Background} alt="Ảnh bìa"/> */}
                            <img className={Styles.background_img} src={userLogin.background_img != undefined ? userLogin.background_img : "" } alt="Avatar"></img>
                        </div>
                        <div className={Styles.infoProfile}>
                            <div className={Styles.avatarProfile}>
                                <img className={Styles.avatar} src={userLogin.avatar != undefined ? userLogin.avatar : "" } alt="Avatar"></img>
                            </div>
                            <div className={Styles.textProfile}>
                                <div className={Styles.mainInfo}>
                                    <h1 className={Styles.nameUser}> {userLogin.name != undefined ? userLogin.name : "" }</h1> 
                                    <ul className={Styles.listStatistic} onClick={openStatistic}>
                                        <li className={Styles.statisticItem}>
                                            <AiOutlinePlusCircle />
                                            <span className={Styles.quantity}>{interaction.follower_count != undefined ? interaction.follower_count : 0 }</span>
                                        </li> 
                                        
                                        <li className={Styles.statisticItem}>
                                            <RiUserFollowFill />
                                            <span className={Styles.quantity}>{interaction.following_count != undefined ? interaction.following_count : 0 }</span>
                                        </li> 
                                        <li className={Styles.statisticItem}>
                                            <p className={Styles.iconVote}>Vote</p>
                                            <span className={Styles.quantity}>{interaction.vote_count != undefined ? interaction.vote_count : 0 }</span>    
                                        </li> 
                                        <li className={Styles.statisticItem}>
                                            <AiOutlineEuroCircle />
                                            <span className={Styles.quantity}>500</span>
                                        </li>  
                                    </ul>   
                                    <p className={Styles.captionUser}>
                                        {userLogin.bio != undefined ? userLogin.bio : "" }
                                    </p>  
                                    <div className={Styles.btnTaoTin}>
                                        <AiOutlinePlusCircle/> Tạo tin 
                                    </div>
                                    <div className={Styles.btnChinhSua} onClick={() => setShowEditProfile(!showEditProfile)}>
                                        <FaEdit/> Chỉnh sửa 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={Styles["profile__statistic"]}>
                    <ul className={Styles["profile__statistic-list"]}>
                        {filters.map((filter, index) => (
                            <li className={`${Styles["profile__statistic-item"]} ${Styles["hover"]} ${(active === index) ? Styles["active"] : ''}`}  onClick={(e) => {setActive(index)}} key={index}>
                                <Link href={index === 0 ? "/profile" : (index === 1 ? "/profile/library" : "/profile/statistic") }>
                                    <a className={Styles["profile__statistic-title"]}>{filter}</a>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <button className={Styles["profile__statistic-create"]}>
                        <FaRegEdit className={Styles["profile__icon-edit"]} />
                        <span>Tạo bài viết</span>
                    </button>
                </div>
                <div className={`${Styles["profile__post"]} ${Styles["all"]}`}>
                    <div className={Styles["profile__library-heading"]}>
                        <h2 className={Styles["profile__library-heading-title"]}>Mục đã lưu</h2>
                        <ul className={Styles["profile__library-nav"]}>
                            <li className={`${Styles["profile__library-nav-item"]} ${activeLink === 0 ? Styles["active"] : ''}`} onClick={() => setActiveLink(1)}>
                                <Link href="/profile/library">
                                    <a>Tất cả</a>
                                </Link>
                            </li>
                            <li className={`${Styles["profile__library-nav-item"]} ${activeLink === 1 ? Styles["active"] : ''}`} onClick={() => setActiveLink(2)}>
                                <Link href="/profile/library_list">
                                    <a>Thư viện</a>
                                </Link>
                            </li>
                        </ul>
                        <button className={Styles["profile__library-heading-btn"]}>Thêm thư viện</button>
                    </div>
                    <ul className={Styles["profile__library-list"]}>
                        <LiraryItem/>
                        <LiraryItem/>
                        <LiraryItem/>
                        <LiraryItem/>
                        <LiraryItem/>
                        <LiraryItem/>
                        <LiraryItem/>
                    </ul>
                </div>
            </section>
            <Footer/>
            <PopupStatistic showModal={showPopupStatistic} setShowModal={setShowPopupStatistic}/> 
                {showEditProfile && <PopupEditProfile 
                    handleClick={() => setShowEditProfile(!showEditProfile)} 
                    setShowEditProfile={setShowEditProfile}
            />}
        </Layout>
    )
}

export function LiraryItem() {
    return (
        <li className={Styles["profile__library-item"]}>
            <div className={Styles["profile__library-img"]}>
                {/* <Image src={Thumb} alt="Avatar"/> */}
                <i className="fa-solid fa-pen"></i>
            </div>
            <p className={Styles["profile__library-title"]}>Javascript Basic</p>
            <p className={Styles["profile__library-subtitle"]}>Để xem sau</p>
            <span className={Styles["profile__library-quantity"]}>30 Mục</span>
        </li>
    )
}