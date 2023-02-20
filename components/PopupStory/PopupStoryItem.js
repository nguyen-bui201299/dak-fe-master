import Styles from "./PopupStory.module.css";
import { useEffect } from 'react'


export default function PopupStoryItem({link = "", title = "", thumbnail_img = ""}) {
    // test-render-web
    useEffect(() => {
        console.log('render PopupStoryItem');
        }, [])

    return (
        <>
            <a href={link} target='_blank' rel="noopener noreferrer"className={Styles["popupstory__item"]}>
                <div className={Styles["popupstory__item-img-box"]}>
                    <img src={thumbnail_img} className={Styles["popupstory__item-img"]} alt="Avatar"/>
                </div>
                <p className={Styles["popupstory__item-name"]}>{title}</p>
            </a>
        </>
    )
}