import { useRef, useEffect, useState, lazy, Suspense } from "react";
import Styles from "./PopupStory.module.css";
import { FaRegTimesCircle } from "react-icons/fa";
import Image from "next/image";
import axios from "axios";
const PopupStoryItem = lazy(() => import("./PopupStoryItem"));

export default function PopupStory({handleClick, setShowPopupStory, showPopupStory}) {

    const [newsCount, setNewsCount] = useState(10)

    const [isLoading, setIsLoading] = useState(true)

    const popupStory = useRef();
    const closePopupStory = e => {
        if (popupStory.current === e.target) {
            setShowPopupStory(false);

        }

        document.getElementsByTagName('html')[0].style.overflow = 'overlay';

    };

    const [listNews, setListNews] = useState([]);

    // const handleGetListNew = async (limit) => {
    //     setIsLoading(true)
    //     await axios.get(`https://dak-api.site/api/crawler/gg/vi?limit=${limit}`)
    //         .then((response) => {
    //             setListNews([...response.data]);
    //             console.log(response);
    //             if (response.status === 200) {
    //                 setIsLoading(false)
    //             }
    //         })
    //         .catch(error => {
    //             console.log(error);
    //         })
    // }

    // useEffect(() => {  
    //     handleGetListNew(newsCount)
    // }, [newsCount])

    // const handleScrollBody = event => {
    //     if(Math.floor(event.currentTarget.scrollTop + event.currentTarget.clientHeight + 1) === event.currentTarget.scrollHeight) {
    //         setNewsCount((prev)=> prev + 10)
    //     }
    // }

    useEffect(() => {
        if (showPopupStory) {
            document.getElementsByTagName('html')[0].style.overflow = 'hidden';
        }
    }, [showPopupStory])

    useEffect(() => {
        const handleGetListNew = async () => {
            await axios.get(`https://post.dakshow.com/api/crawler/gg/vi?limit=1000`)
                .then((response) => {
                    setListNews([...response.data]);
                    if (response.status === 200) {
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        }
        handleGetListNew()
    },[])


    return (
        <>
        {handleClick && 
            <div className={Styles["overlayPopupStory"]} ref={popupStory} onClick={closePopupStory}>
                <div className={Styles["popupstory"]}>
                    <div className={Styles["popupstory__upload-image"]}>
                        <div className={Styles["popupstory__heading"]}>
                            <h3 className={Styles["popupstory__title"]}>Tin Tức</h3>
                            <FaRegTimesCircle className={Styles["popupstory__icon-close"]} onClick={handleClick}/>
                        </div>
                        <div className={Styles["popupstory__body"]}>
                            <div className={Styles["popupstory__list"]} >
                            {/* <div className={Styles["popupstory__list"]} onScroll={handleScrollBody}> */}
                                
                                {listNews.map((news, index) => 
                                    <Suspense fallback={<div></div>} key={index}>
                                        <PopupStoryItem  link={news.link} title={news.title} thumbnail_img={news.thumbnail_img}/>
                                    </Suspense>
                                )}

                            </div>
                        </div>
                    </div>
                    {/* {isLoading &&
                        <div className={Styles["loader__comp"]}>
                            <span className={Styles["loader"]}></span>
                        </div>
                    } */}
                </div>
            </div>
        }
        </>
    )
}

