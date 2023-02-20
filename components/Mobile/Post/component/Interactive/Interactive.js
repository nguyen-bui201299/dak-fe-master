
import { useState, useEffect } from 'react';
import Head from "next/head";
import Styles from "./Interactive.module.css";
import Logo from "../../../../../public/images/Logo.png";
import Image from "next/image";
import dynamic from 'next/dynamic';

import { 
    AiOutlineHeart, // Tim
    AiFillMessage, // Chat
    AiOutlineShareAlt, // Chia sẽ
} from "react-icons/ai";

import { 
    FaRegHeart, // Tim
    FaHeart,
    FaRegCommentDots
} from "react-icons/fa";
import Statistic from '../Statistic/Statistic';


const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });

export default function  Interactive() {
    // test-render-web
    useEffect(() => {
        console.log('render Interactive')
        }, [])

    const [inputStr, setInputStr] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [showStatistic, setShowStatistic] = useState(false)

   
    const onEmojiClick = (event, emojiObject) => {
      setInputStr(prevInput => prevInput + emojiObject.emoji);
      setShowPicker(false);
    };

    const handleShowStatistic = () => {
        setShowStatistic(!showStatistic)
    }
    
    return(
        <>
        <Head>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
        </Head>
        <Statistic showstatistic={showStatistic} setshowstatistic={setShowStatistic}/>
        <div className={Styles.reaction}>
            <div className={Styles.reaction__icon}>
                <FaRegHeart />
                <label className={Styles.reaction__title} onClick={handleShowStatistic}>
                    30
                </label>
            </div>
            <div className={Styles.reaction__icon}>
                <FaRegCommentDots />
                <label className={Styles.reaction__title} onClick={handleShowStatistic}>
                    10
                </label>
            </div>
            <div className={Styles.reaction__icon}>
                <span>vote</span>
                <label className={Styles.reaction__title} onClick={handleShowStatistic}>
                    10
                </label>
            </div>
            <div className={Styles.reaction__icon}>
                <AiOutlineShareAlt />
                <label className={Styles.reaction__title} onClick={handleShowStatistic}>
                    10
                </label>
            </div>
        </div>
        {/* <div className={Styles.reaction__comment__post}>
            <div className={Styles.reaction__comment__avatar}>
                <Image src={Logo} alt="Avatar"/>
            </div>
            <div className={Styles.reaction__comment__input}>
                <input 
                    type="text" 
                    value={inputStr}
                    onChange={e => setInputStr(e.target.value)}  
                    placeholder="Viết bình luận...">
                </input>
                <i className="fa-regular fa-face-grin-wide" onClick={() => setShowPicker(val => !val)}></i>
                {showPicker && <Picker
                    pickerStyle={{ width: '40%', position: 'absolute', zIndex:1}}
                    onEmojiClick={onEmojiClick} />
                }
            </div>
        </div> */}
        </>
    );
}
