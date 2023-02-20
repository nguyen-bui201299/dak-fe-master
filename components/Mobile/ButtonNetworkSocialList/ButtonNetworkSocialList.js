import Styles from './ButtonNetworkSocialList.module.css';
import { FaYoutube, FaFacebookF, FaTwitter, FaTiktok, FaTwitch, FaUserFriends, FaInstagram } from 'react-icons/fa';
import {useState, useEffect} from "react";


export default function ButtonNetworkSocialList({setTypePost}) {
    // test-render-web
    useEffect(() => {
        console.log('render ButtonNetworkSocialList')
        }, [])

    const [activeBtn, setActiveBtn] = useState(0)

    const list_btn = [
        {   id: 1, 
            social: "youtube", 
            icon: <FaYoutube/>, 
            colorIcon: <FaYoutube style={{color: "var(--youtube-color)"}}/>
        },
        {   id: 2, 
            social: "facebook", 
            icon: <FaFacebookF/>,  
            colorIcon: <FaFacebookF style={{color: "var(--facebook-color)"}}/>
        }, 
        {   id: 3, 
            social: "twitter", 
            icon: <FaTwitter/>,         
            colorIcon: <FaTwitter style={{color: "var(--twitter-color)"}}/>
        }, 
        {   id: 4, 
            social: "tiktok", 
            icon: <FaTiktok/>,         
            colorIcon: <FaTiktok style={{color: "var(--tiktok-color)"}}/>
        }, 
        {   id: 5, 
            social: "twitch", 
            icon: <FaTwitch/>,        
            colorIcon: <FaTwitch style={{color: "var(--twitch-color)"}}/>
        }, 
        {   id: 6, 
            social: "instagram", 
            icon: <FaInstagram/>,        
            colorIcon: <FaInstagram style={{color: "var(--insta-color)"}}/>
        }, 
        {   id: 7, 
            social: "friend", 
            icon: <FaUserFriends/>,         
            colorIcon: <FaUserFriends style={{color: "var(--friends-color)"}}/>
        }
    ]

    const handleClickButtonNetworkSocialList = (typepost, index) => {
        setTypePost(typepost);
        setActiveBtn(index);
    }

    return (
        <>
        <div className={Styles.box_button_network_social_list}>
        {list_btn.map((element, index) =>            
            <><div className={Styles.item_button}>
                <button className={index === activeBtn ? Styles.active : Styles.button} 
                    onClick={(e) => handleClickButtonNetworkSocialList(element.social, index)}
                >
                    {index === activeBtn ? element.colorIcon : element.icon}  
                </button>
            </div></>
        )}
        </div>
        <div className={Styles.subNav}>
            <ul className={Styles.listSubNav}>
                <li className={Styles.itemSubNav}>Theo dõi</li>
                <li className={Styles.itemSubNav}>Đề xuất</li>
                <li className={Styles.itemSubNav}>Xếp hạng</li>
            </ul>
        </div>
        </>
    )
}