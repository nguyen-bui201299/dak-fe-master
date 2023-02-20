import React from 'react'
import Styles from "../Header.module.css";

export default function HeaderSocialTab({handleSocialList, social_item_filters, isYoutube, isFacebook, isTikTok, isInstagram, isTwitter, isTwitch, isWithFriend}) {
    return (
        <div className={Styles.social__box}>
            <ul className={Styles.social__list}>
            {social_item_filters.map((filter, i) => (
                <li
                className={`${Styles.social__item} ` }
                key={i}
                onClick={() => {
                    handleSocialList(filter.type);
                }}
                >
                <span
                    className={`${Styles.social__link} 
                    ${isYoutube && filter.type == 'youtube' ? Styles.youtube : ""}
                    ${isFacebook && filter.type == 'facebook' ? Styles.facebook : ""}
                    ${isTikTok && filter.type == 'tiktok' ? Styles.tiktok : ""}
                    ${isInstagram && filter.type == 'instagram' ? Styles.instagram : ""}
                    ${isTwitter && filter.type == 'twitter' ? Styles.twitter : ""}
                    ${isTwitch && filter.type == 'twitch' ? Styles.twitch : ""}
                    ${isWithFriend && filter.type == 'with_friend' ? Styles.withfriend : ""} `}
                >
                    <i className={filter.className}></i>
                    <span className={Styles.tooltip}>{filter.name}</span>
                </span>
                </li>
            ))}
            </ul>
        </div>
    )
}