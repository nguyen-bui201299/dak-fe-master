import Next, {useState, useEffect} from "react";
import Image from "next/image";
// import Dropdown from "../Dropdown/Dropdowns"
import Interactive from "./component/Interactive/Interactive";
import { FaGlobeAsia } from "react-icons/fa";
import Styles from "./Post.module.css";
import Logo from "../../../public/images/Logo.png";
import Head from "next/head";   
import { BsThreeDots } from 'react-icons/bs'


import BodyPostYoutube from "../../../components/Post/component/BodyPostYoutube/BodyPostYoutube";
import BodyPostFacebook from "../../../components/Post/component//BodyPostFacebook/BodyPostFacebook";
import BodyPostTiktok from "../../../components/Post/component/BodyPostTiktok/BodyPostTiktok";
import BodyPostInstagram from "../../../components/Post/component/BodyPostInstagram/BodyPostInstagram";
import BodyPostTwitter from "../../../components/Post/component/BodyPostTwitter/BodyPostTwitter";
import BodyPostTwitch from "../../../components/Post/component/BodyPostTwitch/BodyPostTwitch";

export default function Post({typepost = '', url = ''}) {

    const [hoverIcons, setStyle] = useState({display: 'none'});
    const [hoverTimes, setStyleTime] = useState({display: 'none'});
    return (
        <>
        <Head>
            <link rel="stylesheet" href="/css/global.css"/>
            <link rel="stylesheet" href="/css/style.css"/>
        </Head>        
        <div className={""}>
            <div className={Styles.profile__post__heading}>
                <div className={Styles.profile__post__avatar}>
                    <Image src={Logo} alt="Avatar"/>
                </div>
                <div className={""}>
                    <h2>Khoa Lê <span>Đã đăng video mới</span></h2>
                    <div className={Styles.hover__time__date}>
                        <p                      
                        onMouseEnter={e => {
                            setStyleTime({display: 'block'});
                        }}
                        onMouseLeave={e => {
                            setStyleTime({display: 'none'})
                        }}
                        >7 giờ trước - </p>
                        <span className={Styles.day__time} style={hoverTimes}>Thứ 9, ngày 32 tháng 13 năm unknown</span> 
                        <FaGlobeAsia className={Styles.global__private}
                        onMouseEnter={e => {
                            setStyle({display: 'block'});
                        }}
                        onMouseLeave={e => {
                            setStyle({display: 'none'})
                        }}
                        /><span className={Styles.public__private} style={hoverIcons}>Công Khai</span>
                    </div>
                </div>
                <BsThreeDots className={Styles.iconThreeDots}/>
                {/* <Dropdown /> */}
            </div>
            <div className={Styles.profile__post__main}>
                <div className={Styles.profile__post__content}>
                    {
                        typepost == "normal" && 
                            <p className={Styles.profile__post__content__captions}>fsdf fsf  345  dggdfg dg fdsg</p>
                    }
                    {
                        typepost == "youtube" && 
                        <>
                            <p className={Styles.profile__post__content__captions}>Caption youtube nè</p> 
                            <BodyPostYoutube url={url}/>
                        </>
                    }
                    {
                        typepost == "facebook" && 
                        <>
                            <p className={Styles.profile__post__content__captions}>Caption facebook nè</p> 
                            <BodyPostFacebook
                                dataHref={url}
                                className={'fb-post'}
                            />
                        </>
                    }
                    {
                        typepost == "twitch" && 
                        <>
                            <p className={Styles.profile__post__content__captions}>Caption twitch nè</p> 
                            <BodyPostTwitch url={url}/>
                        </>
                    }
                    {
                        typepost == "tiktok" && 
                        <>
                            <p className={Styles.profile__post__content__captions}>Caption tiktok nè</p> 
                            <BodyPostTiktok url={url}/>
                        </>
                    }
                    {
                        typepost == "instagram" &&
                        <>
                            <p className={Styles.profile__post__content__captions}>Caption instagram nè</p> 
                            <BodyPostInstagram url={url}/>
                        </>
                    }
                    {
                        typepost == "twitter" &&
                        <>
                            <p className={Styles.profile__post__content__captions}>Caption twitter nè</p> 
                            <BodyPostTwitter url={url}/>
                        </>
                    }
                    
                </div>
                <Interactive/>
            </div>
        </div>
        </>
    )
}
