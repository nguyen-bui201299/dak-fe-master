import Head from "next/head";
import Layout from "../Layout/Layout";
import { useState, useEffect } from "react";
import { getCookieUserLogin } from '../../modules/Cookies/Auth/userLogin';
import API, { endpoints, headers } from '../../API'

import Styles from "./Statistic.module.css";
import {
BsChevronCompactRight,
BsChevronCompactLeft,
BsChevronLeft,
} from "react-icons/bs";

export default function Statistic() {
    const locale = 'en';
    const [today, setDate] = useState(new Date());
    const [postStats, setPostStats] = useState();
    const [shareStats, setShareStats] = useState();
    const [likeStats, setLikeStats] = useState();
    // Get Statistic
    useEffect(() => {
        let user = getCookieUserLogin();
        let userId = user.id
        API.get(endpoints['getStatistics'](userId, 'post,share,like', 0), { headers: headers.headers_token})
            .then(function (res) {
                setPostStats(res.data.Statistic.post)
                setShareStats(res.data.Statistic.share)
                setLikeStats(res.data.Statistic.like)
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [])
    useEffect(() => {
        const timer = setInterval(() => { 
        setDate(new Date());
      }, 60 * 1000);
      return () => {
        clearInterval(timer);
      }
    }, []);
    const date = `${today.toLocaleDateString(locale, { year: 'numeric', month: '2-digit' })}\n\n`;


    const handlePrev = (e) => {
    let costChart = document.querySelector("#cost-chart");
    let viewChart = document.querySelector("#view-chart");
    const scrollStep = 150;

    costChart.contains(e.currentTarget)
    ? (costChart.scrollLeft -= scrollStep)
    : (viewChart.scrollLeft -= scrollStep);
};
const handleNext = (e) => {
    let costChart = document.querySelector("#cost-chart");
    let viewChart = document.querySelector("#view-chart");
    const scrollStep = 150;

    costChart.contains(e.currentTarget)
    ? (costChart.scrollLeft += scrollStep)
    : (viewChart.scrollLeft += scrollStep);
};

return (
    <>

        <div className={Styles["statistic"]}>

        <div className={Styles["statistic__chart"]}>
            <p className={Styles["statistic__chart-time"]}>
            <BsChevronLeft />
            {date}
            </p>

            <div className={Styles["chart"]}>
                <p className={Styles["chart-name"]}>Post</p>
                <div className={Styles["chart-container"]} id="cost-chart">
                    <button
                    className={`${Styles["button-chart"]} ${Styles["button-chart-prev"]}`}
                    onClick={(e) => handlePrev(e)}
                    >
                    <BsChevronCompactLeft
                        className={Styles["button-chart-icon"]}
                    />
                    </button>
                        {postStats && Object.entries(postStats).map((postStat, i) => <ColValue key={i} height={postStat[1]} value={postStat[1]} date={postStat[0]} />)}
                        {/* <ColValue height={"40%"} value={1000} date={"08"} />
                        <ColValue height={"20%"} value={500} date={"09"} />
                        <ColValue height={"80%"} value={1220} date={"10"} />
                        <ColValue height={"20%"} value={9000} date={"11"} />
                        <ColValue height={"60%"} value={3400} date={"12"} />
                        <ColValue height={"30%"} value={500} date={"13"} />
                        <ColValue height={"50%"} value={500} date={"14"} />
                        <ColValue height={"90%"} value={500} date={"15"} />
                        <ColValue height={"10%"} value={500} date={"16"} /> */}
                    <button
                    className={`${Styles["button-chart"]} ${Styles["button-chart-next"]} `}
                    onClick={(e) => handleNext(e)}
                    >
                    <BsChevronCompactRight
                        className={Styles["button-chart-icon"]}
                    />
                    </button>
                </div>
            </div>

            <div className={Styles["chart"]}>
                <p className={Styles["chart-name"]}>Share</p>
                <div className={Styles["chart-container"]} id="cost-chart">
                    <button
                    className={`${Styles["button-chart"]} ${Styles["button-chart-prev"]}`}
                    onClick={(e) => handlePrev(e)}
                    >
                    <BsChevronCompactLeft
                        className={Styles["button-chart-icon"]}
                    />
                    </button>
                        {shareStats && Object.entries(shareStats).map((shareStat, i) => <ColValue key={i} height={shareStat[1]} value={shareStat[1]} date={shareStat[0]} />)}
                        {/* <ColValue height={"40%"} value={1000} date={"08"} />
                        <ColValue height={"20%"} value={500} date={"09"} />
                        <ColValue height={"80%"} value={1220} date={"10"} />
                        <ColValue height={"20%"} value={9000} date={"11"} />
                        <ColValue height={"60%"} value={3400} date={"12"} />
                        <ColValue height={"30%"} value={500} date={"13"} />
                        <ColValue height={"50%"} value={500} date={"14"} />
                        <ColValue height={"90%"} value={500} date={"15"} />
                        <ColValue height={"10%"} value={500} date={"16"} /> */}
                    <button
                    className={`${Styles["button-chart"]} ${Styles["button-chart-next"]} `}
                    onClick={(e) => handleNext(e)}
                    >
                    <BsChevronCompactRight
                        className={Styles["button-chart-icon"]}
                    />
                    </button>
                </div>
            </div>

            <div className={Styles["chart"]}>
                <p className={Styles["chart-name"]}>Like</p>
                <div className={Styles["chart-container"]} id="cost-chart">
                    <button
                    className={`${Styles["button-chart"]} ${Styles["button-chart-prev"]}`}
                    onClick={(e) => handlePrev(e)}
                    >
                    <BsChevronCompactLeft
                        className={Styles["button-chart-icon"]}
                    />
                    </button>
                        {likeStats && Object.entries(likeStats).map((likeStat, i) => <ColValue key={i} height={likeStat[1]} value={likeStat[1]} date={likeStat[0]} />)}
                        {/* <ColValue height={"40%"} value={1000} date={"08"} />
                        <ColValue height={"20%"} value={500} date={"09"} />
                        <ColValue height={"80%"} value={1220} date={"10"} />
                        <ColValue height={"20%"} value={9000} date={"11"} />
                        <ColValue height={"60%"} value={3400} date={"12"} />
                        <ColValue height={"30%"} value={500} date={"13"} />
                        <ColValue height={"50%"} value={500} date={"14"} />
                        <ColValue height={"90%"} value={500} date={"15"} />
                        <ColValue height={"10%"} value={500} date={"16"} /> */}
                    <button
                    className={`${Styles["button-chart"]} ${Styles["button-chart-next"]} `}
                    onClick={(e) => handleNext(e)}
                    >
                    <BsChevronCompactRight
                        className={Styles["button-chart-icon"]}
                    />
                    </button>
                </div>
            </div>

            {/* <div className={Styles["chart"]}>
                <p className={Styles["chart-name"]}>Views</p>
                <div className={Styles["chart-container"]} id="view-chart">
                    <button
                    className={`${Styles["button-chart"]} ${Styles["button-chart-prev"]}`}
                    onClick={(e) => handlePrev(e)}
                    >
                    <BsChevronCompactLeft
                        className={Styles["button-chart-icon"]}
                    />
                    </button>
                    <ColValue height={"20%"} value={500} date={"07"} />
                    <ColValue height={"40%"} value={1000} date={"08"} />
                    <ColValue height={"20%"} value={500} date={"09"} />
                    <ColValue height={"80%"} value={122000} date={"10"} />
                    <ColValue height={"20%"} value={9000} date={"11"} />
                    <ColValue height={"60%"} value={3400} date={"12"} />
                    <ColValue height={"30%"} value={500} date={"13"} />
                    <ColValue height={"50%"} value={500} date={"14"} />
                    <ColValue height={"90%"} value={500} date={"15"} />
                    <ColValue height={"10%"} value={500} date={"16"} />
                    <button
                    className={`${Styles["button-chart"]} ${Styles["button-chart-next"]} `}
                    onClick={(e) => handleNext(e)}
                    >
                    <BsChevronCompactRight
                        className={Styles["button-chart-icon"]}
                    />
                    </button>
                </div>
            </div> */}
        </div>
        </div>
    </>
);
}

export function ColValue({ height, value, date }) {
return (
    <div className={Styles["chart-value"]}>
        <div className={Styles["chart-col"]}>
            <div className={Styles["chart-inner"]} style={{ height: height }}>
                <span className={Styles["col-value"]}>{value}</span>
            </div>
        </div>
        <span className={Styles["col-name"]}>{date}</span>
    </div>
);
}
