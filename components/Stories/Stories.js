import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Slider from 'react-slick';
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import PopupStory from '../PopupStory/PopupStory';
import Styled from './Stories.module.css';

export default function Stories({ rows = 1 }) {
    // test-render-web
    useEffect(() => {
        console.log('render Stories');
        }, [])


    const [stories, setStories] = useState([]);


    const getStories = async () => {
        await axios.get("https://post.dakshow.com/api/crawler/gg/vi?limit=1000")
            .then((res) => {
                setStories(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    useEffect(() => {
        getStories()
    }, [])
    
    function SampleNextArrow(props) {
        const { style, onClick } = props;
        return (
            <div className={Styled['btn-story-right']} onClick={onClick}>
                <FaChevronRight
                    className={Styled['icon-chevron']}
                    style={{
                        ...style,
                    }}
                    />
            </div>
        );
    }
    function SamplePrevArrow(props) {
        const { style, onClick } = props;
        return (
            <div className={Styled['btn-story-left']} onClick={onClick}>
                <FaChevronLeft
                    className={Styled['icon-chevron']}
                    style={{
                        ...style,
                    }}
                />
            </div>
        );
    }

    const settings = {
        slidesToShow: 5,
        infinite: true,
        speed: 350,
        swipeToSlide: true, // vuốt được nhiều items 
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 361,
                settings: {
                    slidesToShow: 1.5,
                    arrows: true
                }
            },
            {
                breakpoint: 541,
                settings: {
                    slidesToShow: 2,
                    arrows: true
                }
            },
            {
                breakpoint: 721,
                settings: {
                    slidesToShow: 3,
                    arrows: true
                }
            },
            {
                breakpoint: 941,
                settings: {
                    slidesToShow: 3,
                    arrows: true
                }
            },
            {
                breakpoint: 1201,
                settings: {
                    slidesToShow: 4,
                    arrows: true
                }
            },
            {
                breakpoint: 1501,
                settings: {
                    slidesToShow: 3,
                    arrows: true
                }
            },
            {
                breakpoint: 1921,
                settings: {
                    slidesToShow: 4,
                    arrows: true
                }
            }
        ]
    };

    const handleSharePopup = (e,story)=>{
        e.preventDefault()
        const url = story.link
        var spec  ="toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=350,width=800,height=600";
        var link = window.open(url,"_blank",spec)
    }
    return (
            <Slider {...settings} style={{position: 'relative'}}>
                {stories.map((story, index) =>
                        <div className={Styled["story"]} key={index} lazyOnload >
                            <a href={story.link} target='_blank' rel="noreferrer">
                                <img
                                    className={Styled["story-image"]}
                                    src={story.thumbnail_img}
                                    alt={story.title}
                                />
                                <div className={Styled["wrap-story-title"]}>
                                    <span className={Styled["story-title-center"]}>
                                        <p className={Styled["story-title"]}>{story.title}</p>
                                    </span>
                                </div>
                            </a>
                        </div>
                )}
                <PopupStory stories={stories} settings={settings} />
            </Slider>
    )
}
