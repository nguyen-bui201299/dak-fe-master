import Head from "next/head";
import Image from "next/image";
import Footer from "../../../components/Footer/Footer";
import Layout from "../../../components/Layout/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import Background from "../../../public/images/bg.png";
import Dak from "../../../public/images/dak.png";
import Chart from "../../../public/images/chart.png";
import Styles from "../../../styles/Profile.module.css";
import {FaCheck, FaFacebookMessenger, FaPlusCircle, FaRegEdit, FaCheckCircle, FaEdit} from "react-icons/fa";
import {AiOutlineEuroCircle, AiOutlinePlusCircle} from 'react-icons/ai'
import {RiUserFollowFill} from 'react-icons/ri'
import { getCookieUserLogin } from "../../../modules/Cookies/Auth/userLogin";
import API, {endpoints, headers} from "../../../API";
import PopupStatistic from "../../../components/PopupStatistic/PopupStatistic";
import PopupEditProfile from "../../../components/PopupEditProfile/PopupEditProfile";
import { useSelector } from "react-redux";
import Statistic from "../../../components/StatisticUser/Statistic"

export default function Profile() {
    const [showPopupStatistic, setShowPopupStatistic] = useState(false)

    const userLogin = getCookieUserLogin();

    const [content, setContent] = useState({});

    useEffect(() => {
        if(userLogin.language!== undefined) {
            setContent(require(`../languages/${userLogin.language}.json`));
        }else{
            setContent(require(`../languages/en.json`));
        }
    }, [userLogin])

    return(
            <section className={Styles["profile"]}>
                <Statistic />
                {/* <div className={Styles["profile__statistic-content"]}>
                <h1>Coming Soon...</h1>
                    <div className={Styles["profile__statistic-day"]}>
                        <h2 className={Styles["profile__statistic-heading"]}>{content.profile_statistic_activities_24h}</h2>
                        <h3 className={Styles["profile__statistic-sub-heading"]}>{content.profile_statistic_points}</h3>
                        <div className={Styles["profile__statistic-action-list"]}>
                            <ActionItem/>
                            <ActionItem/>
                            <ActionItem/>
                            <ActionItem/>
                            <ActionItem/>
                            <ActionItem/>
                            <ActionItem/>
                            <ActionItem/>
                        </div>
                        <div className={Styles["profile__statistic-chart"]}>
                            <h3 className={Styles["profile__statistic-sub-heading"]}>{content.profile_statistic_activities_chart}</h3>
                            <div className={Styles["profile__statistic-chart-img"]}>
                                <Image src={Chart} alt="Chart"/>
                            </div>
                        </div>
                    </div>
                    <div className={Styles["profile__statistic-day"]}>
                        <h2 className={Styles["profile__statistic-heading"]}>{content.profile_statistic_activities_posts}</h2>
                        <h3 className={Styles["profile__statistic-sub-heading"]}>{content.profile_statistic_most_views}</h3>
                        <div className={Styles["profile__statistic-chart-img"]}>
                            <Image src={Chart} alt="Chart"/>
                        </div>
                        <div className={Styles["profile__statistic-chart"]}>
                            <h3 className={Styles["profile__statistic-sub-heading"]}>{content.profile_statistic_individual_posts}</h3>
                            <div className={Styles["profile__statistic-chart-img"]}>
                                <Image src={Chart} alt="Chart"/>
                            </div>
                        </div>
                    </div>
                </div> */}
            </section>
    )
}

export function ActionItem() {
    const userLogin = useSelector(state => state.infoUserLogin);

    const [content, setContent] = useState({});

    useEffect(() => {
        if(userLogin.language!== undefined) {
            setContent(require(`../languages/${userLogin.language}.json`));
        }else{
            setContent(require(`../languages/en.json`));
        }
    }, [userLogin])

    return (
        <div className={Styles["profile__statistic-action-item"]}>
            <p className={Styles["profile__statistic-action-title"]}>{content.profile_statistic_achieved_points}</p>
            <p className={Styles["profile__statistic-action-quantity"]}>50</p>
            <p className={Styles["profile__statistic-action-point"]}>+100 {content.profile_statistic_points}</p>
        </div>
    )
}