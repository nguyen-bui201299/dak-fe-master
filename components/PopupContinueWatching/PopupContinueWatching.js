import Image from 'next/image';
import Styled from './PopupContinueWatching.module.css';
// import InputContentSharePost from "./InputContentSharePost/InputContentSharePost";
import Post from '../Post/Post';
import React, { useEffect, useRef, useState, useCallback, Suspense, lazy } from 'react';
import { useSpring, animated } from 'react-spring';

// import ReportOption from "./ReportOption/ReportOption"
// const BodyPostYoutube = lazy(() => import("../Post/component/BodyPostFacebook/BodyPostFacebook"))
import BodyPostYoutube from '../Post/component/BodyPostYoutube/BodyPostYoutube';
import BodyPostFacebook from '../Post/component/BodyPostFacebook/BodyPostFacebook';
import BodyPostTwitch from '../Post/component/BodyPostTwitch/BodyPostTwitch';
import BodyPostTiktok from '../Post/component/BodyPostTiktok/BodyPostTiktok';
import BodyPostTwitter from '../Post/component/BodyPostTwitter/BodyPostTwitter';
import BodyPostInstagram from '../Post/component/BodyPostInstagram/BodyPostInstagram';


export default function PopupContinueWatching({showModal, setShowModal, post, open}) {

    // const modalRef = useRef();
    const [titlePopup, setTitlePopup] = useState("");
    const [openFormCreatePost, setOpenFormCreatePost] = useState(true); //true
    
    const animation = useSpring({
        config: {
            duration: 200
        }, opacity: showModal ? 1 : 0, 
        transform: showModal ? 'translateY(0%)' : `translateY(100%)`
    })

    const closeModal = () => {
        // if (modalRef.current === e.target) {
            setShowModal(false)
        // }
    };

    // ref={modalRef} onClick={closeModal} 
    // showModal={showModal}

    return(
        <div className={Styled.wrapper}>
        {showModal &&      
            <div 
            className={Styled.overlayFormCreatePost}>
                <animated.div style={animation}>
                    <div className={Styled.formCreatePost} >
                        <div className={Styled.formHeader}>
                            <h2 className={Styled.formTitle}>{titlePopup}</h2>
                            <button className={Styled.btnGetOut} onClick={closeModal}>
                                <i className="fa-solid fa-x"></i>
                            </button>
                        </div>
                        <div className={Styled.formBody}>
                            
                            { post &&
                                <div className={Styled.createPost}>
                                    {(post.post_type === "youtube" || post.post.post_url_type === "youtube") &&
                                    <>
                                        <BodyPostYoutube url={post.post.post_url} />
                                    </>
                                    }

                                    {(post.post_type === "facebook" || post.post.post_url_type === "facebook") &&
                                    <>
                                            <BodyPostFacebook  
                                                dataHref={post.post.post_url}
                                                className={'fb-post'} 
                                                width={"300px"}
                                            />
                                    </>
                                    }   

                                    {(post.post_type == "twitch" || post.post.post_url_type === "twitch") &&
                                        <>
                                            <BodyPostTwitch post={post} url={post.post.post_url} />
                                        </>
                                    }

                                    {(post.post_type == "instagram" || post.post.post_url_type ==="instagram") &&
                                        <>
                                            <BodyPostInstagram url={post.post.post_url}/>
                                        </>
                                        
                                    }

                                    {(post.post_type == "tiktok" || post.post.post_url_type === "tiktok") &&
                                    <>
                                        <BodyPostTiktok url={post.post.post_url} />
                                    </>
                                    }

                                    {(post.post_type == "twitter" || post.post.post_url_type ==="twitter") &&
                                    <>
                                        <BodyPostTwitter url={post.post.post_url} />
                                    </>
                                    }  
                                </div>
                            }
                        </div>
                    </div>
                </animated.div>
            </div>  
        }
        </div>
    );
}