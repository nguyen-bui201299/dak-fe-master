import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Styled from './Comments.module.css';
import {AiFillHeart} from 'react-icons/ai';
import { IoHeartCircleOutline, IoHeartCircleSharp } from 'react-icons/io5'

export default function Comments({ img, name, comment_line, likes, time }) {

    // test-render-web
    useEffect(() => {
    console.log('render Comments')
    }, [])
    const [isLike, setLike] = useState(false) 

    const handleLikeEvent = () => {
        setLike(!isLike);
    }

    return <div className={Styled["comment-block"]}>
        <div className={Styled["comment"]}>
            <div className={Styled["wrapper"]}>
                <Image 
                    className={`${Styled.avatar} ${Styled["noti-icon-link"]}`}
                    src={img} 
                    alt="react-logo"
                    width={70}
                    height={70}
                />
                <span className={Styled["badge"]}>
                    {isLike ? 
                        <IoHeartCircleSharp className={`${Styled["icon-heart"]} ${Styled["liked"]}`} onClick={handleLikeEvent} color="red"/> 
                    : 
                        <IoHeartCircleOutline className={Styled["icon-heart"]} onClick={handleLikeEvent}/>
                    }
                    
                </span>
                
            </div>
            <div className={Styled["comment-title"]}>
                <strong>{name}</strong>
                <br/>
                <p>{comment_line}</p>
            </div> 
           
        </div> 
        <small>
           
            <div className={Styled["interact-icons-comment"]}>
                <IoHeartCircleSharp className={`${Styled["icon-heart"]} ${Styled["liked"]}`} color="red"/> 
                <small>{isLike ? parseInt(likes)+1 : parseInt(likes)}</small>
                <small>Trả lời</small>
                <small>{time}</small>
            </div>
        </small>
    </div>;
}

