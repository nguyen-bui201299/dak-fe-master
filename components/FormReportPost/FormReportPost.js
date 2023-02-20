import Image from 'next/image';
import Styled from './FormReportPost.module.css';
// import InputContentSharePost from "./InputContentSharePost/InputContentSharePost";
import Post from '../Post/Post';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSpring, animated } from 'react-spring';
import ReportOption from "./ReportOption/ReportOption"
import { getCookieUserLogin } from '../../modules/Cookies/Auth/userLogin';


export default function FormReportPost({showModal, setShowModal, post}) {
    const modalRef = useRef();
    const [titlePopup, setTitlePopup] = useState("Report");
    const [openFormCreatePost, setOpenFormCreatePost] = useState(true); //true

    // const userLogin = useSelector(state => state.infoUserLogin);

    const userLogin = getCookieUserLogin();

    const [content, setContent] = useState({});

    useEffect(() => {
        if(userLogin.language!== undefined) {
            setContent(require(`././languages/${userLogin.language}.json`));
        }else{
            setContent(require(`././languages/en.json`));
        }
    }, [userLogin])


    const animation = useSpring({
        config: {
            duration: 200
        }, opacity: showModal ? 1 : 0, 
        transform: showModal ? 'translateY(0%)' : `translateY(100%)`
    })

    const closeModal = e => {
        if (modalRef.current === e.target) {
            setShowModal(false)
        }
    };

    return(
        <>
        {showModal &&      
            <div className={Styled.overlayFormCreatePost} ref={modalRef} onClick={closeModal}>
                <animated.div style={animation}>
                    <div className={Styled.formCreatePost} showModal={showModal}>
                        <div className={Styled.formHeader}>
                            <div className={Styled.formHeader_title}>
                                <h2 className={Styled.formTitle}>{content.formReportPost_title}</h2>
                                <button className={Styled.btnGetOut} onClick={() => setShowModal(prev => !prev)}>
                                    <i className="fa-solid fa-x"></i>
                                </button>
                            </div>
                            <p style={{ color : "var(--main-text)" }}>{content.formReportPost_heading}</p>
                        </div>

                        <div className={Styled.formBody}>
                            { openFormCreatePost &&
                                <div className={Styled.createPost}>
                                    <ReportOption />
                                    <button className={Styled.btnReport}>{content.formReportPost_report_btn}</button>
                                </div>
                            }

                        </div>
                    </div>
                </animated.div>
            </div> 
        }
        </>
    );
}