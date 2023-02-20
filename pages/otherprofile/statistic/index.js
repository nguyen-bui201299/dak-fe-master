import Head from "next/head";
import Image from "next/image";
import Footer from "../../../components/Footer/Footer";
import Layout from "../../../components/Layout/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import Chart from "../../../public/images/chart.png";
import Styles from "../../../styles/Profile.module.css";
import {FaRegEdit} from "react-icons/fa";
import {AiOutlineEuroCircle, AiOutlinePlusCircle} from 'react-icons/ai'
import {RiUserFollowFill} from 'react-icons/ri'
import PopupStatistic from "../../../components/PopupStatistic/PopupStatistic";
import PopupEditProfile from "../../../components/PopupEditProfile/PopupEditProfile";

export default function OtherProfile() {
    // test-render-web
    useEffect(() => {
        console.log('render OtherProfile');
        }, [])

    const [active, setActive] = useState(2);

    const filters = [
        'Bài viết'
    ]

    const [showPopupStatistic, setShowPopupStatistic] = useState(false)
    const openStatistic = () => {
        setShowPopupStatistic(prev => !prev)
    }

    const [userLogin, setUserLogin] = useState({});
    const [interaction, setInteraction] = useState({});

    const [showEditProfile, setShowEditProfile] = useState(false);

    // useEffect(() => {

    //     setUserLogin(getCookieUserLogin());      
    //     API.get(endpoints['user/profile'] , {headers : headers.headers_token})
    //         .then(function (response2) {
    //             // console.log(response2.data);
    //             setInteraction(response2.data.data);
    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         });
    // }, [])
    
    return(
        <Layout>
            <Head>
                <title>DAK - Profile</title>
                <link rel="stylesheet" href="css/profile/profile.css"></link>
                <link rel="stylesheet" href="css/profile/profile-responsive.css"></link>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
                <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
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
                                            <span className={Styles.quantity}>{12}</span>
                                            {/* <span className={Styles.quantity}>{interaction.follower_count != undefined ? interaction.follower_count : 0 }</span> */}
                                        </li> 
                                        
                                        <li className={Styles.statisticItem}>
                                            <RiUserFollowFill />
                                            <span className={Styles.quantity}>{12 }</span>
                                            {/* <span className={Styles.quantity}>{interaction.following_count != undefined ? interaction.following_count : 0 }</span> */}
                                        </li> 
                                        <li className={Styles.statisticItem}>
                                            <p className={Styles.iconVote}>Vote</p>
                                            <span className={Styles.quantity}>{12}</span>    
                                            {/* <span className={Styles.quantity}>{interaction.vote_count != undefined ? interaction.vote_count : 0 }</span>     */}
                                        </li> 
                                        <li className={Styles.statisticItem}>
                                            <AiOutlineEuroCircle />
                                            <span className={Styles.quantity}>500</span>
                                        </li>  
                                    </ul>   
                                    <p className={Styles.captionUser}>
                                        { "ok" }
                                        {/* {userLogin.bio != undefined ? userLogin.bio : "" } */}
                                    </p> 
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
                <div className={Styles["profile__statistic-content"]}>
                    <div className={Styles["profile__statistic-day"]}>
                        <h2 className={Styles["profile__statistic-heading"]}>Hoạt động trong 24 giờ</h2>
                        <h3 className={Styles["profile__statistic-sub-heading"]}>Điểm</h3>
                        <div className={Styles["profile__statistic-action-list"]}>
                            <ActionItem/>
                            <ActionItem/>
                            <ActionItem/>
                            <ActionItem/>
                            <ActionItem/>
                            <ActionItem/>
                            <ActionItem/>
                            <ActionItem/>
                        </div>
                        <div className={Styles["profile__statistic-chart"]}>
                            <h3 className={Styles["profile__statistic-sub-heading"]}>Biểu đồ hoạt động</h3>
                            <div className={Styles["profile__statistic-chart-img"]}>
                                <Image src={Chart} alt="Chart"/>
                            </div>
                        </div>
                    </div>
                    <div className={Styles["profile__statistic-day"]}>
                        <h2 className={Styles["profile__statistic-heading"]}>Hoạt động từ các bài đăng của bạn</h2>
                        <h3 className={Styles["profile__statistic-sub-heading"]}>Xem hàng đầu</h3>
                        <div className={Styles["profile__statistic-chart-img"]}>
                            <Image src={Chart} alt="Chart"/>
                        </div>
                        <div className={Styles["profile__statistic-chart"]}>
                            <h3 className={Styles["profile__statistic-sub-heading"]}>Bài viết cá nhân</h3>
                            <div className={Styles["profile__statistic-chart-img"]}>
                                <Image src={Chart} alt="Chart"/>
                            </div>
                        </div>
                    </div>
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

export function ActionItem() {
    return (
        <div className={Styles["profile__statistic-action-item"]}>
            <p className={Styles["profile__statistic-action-title"]}>Tổng số điểm nhận được</p>
            <p className={Styles["profile__statistic-action-quantity"]}>50</p>
            <p className={Styles["profile__statistic-action-point"]}>+100 Điểm</p>
        </div>
    )
}