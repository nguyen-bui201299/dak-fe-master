import Head from "next/head";
import Layout from "../../../components/Layout/Layout";
import { useState, useRef, useEffect } from "react";

import Styles from "../../../styles/Bidding.module.css";
import {
  BsChevronCompactRight,
  BsChevronCompactLeft,
  BsChevronLeft,
} from "react-icons/bs";

export default function Chart() {
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
      <Head>
        <title>DAK - Quản lý Bidding</title>
      </Head>
      <Layout>
        <div className={Styles["bidding"]}>
          <div className={Styles["bidding__heading"]}>
            <h1>Quản lý Bidding</h1>
          </div>
          <div className={Styles["bidding__chart"]}>
            <p className={Styles["bidding__chart-time"]}>
              <BsChevronLeft />
              04.2022
            </p>

            <div className={Styles["chart"]}>
              <p className={Styles["chart-name"]}>Tổng chi (DAK Point)</p>
              <div className={Styles["chart-container"]} id="cost-chart">
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
                <ColValue height={"80%"} value={1220} date={"10"} />
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
            </div>

            <div className={Styles["chart"]}>
              <p className={Styles["chart-name"]}>Lượt xem</p>
              <div className={Styles["chart-container"]} id="view-chart">
                <button
                  className={`${Styles["button-chart"]} ${Styles["button-chart-prev"]}`}
                  onClick={(e) => handlePrev(e)}
                >
                  <BsChevronCompactLeft
                    className={Styles["button-chart-icon"]}
                  />
                </button>
                {/* Có thể tách chart value ra component để render dựa trên dữ liệu */}
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
            </div>
          </div>
        </div>
      </Layout>
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
      <span className={Styles["col-name"]}>Ngày {date}</span>
    </div>
  );
}
