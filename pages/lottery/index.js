import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout/Layout";
import Styles from "../../styles/Lottery.module.css";
import { useEffect } from "react";
import API, { endpoints, headers } from "../../API";
import moment from "moment";

export default function Lottery() {
  const [listHistory, setListHistory] = useState()
  const [priceJackpot, setPriceJackpot] = useState()

  useEffect(() => {
    API.get(endpoints["getlottery"], { headers: headers.headers_token })
      .then((res) => {
        setListHistory(
          res.data.data.reverse()
        )
      })
      .catch((err) => {});

    API.get(endpoints["getPriceJackpot"], { headers: headers.headers_token })
      .then(function (res) {
        if (res.data.code == 200 && res.data.success) {
          setPriceJackpot(res.data.data);
        } else {
          setPriceJackpot(0);
        }
      })
      .catch(function (error) {
        setPriceJackpot(0);
        console.log(error);
      });
  }, []);

  return (
    <Layout page="lottery">
      <Head>
        <title>Lottery</title>
        <link rel="stylesheet" href="/css/style.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className={Styles.Container__Merge__Box__Lottery}>
        <Minilottery listHistory={listHistory} priceJackpot={priceJackpot} />
      </div>
    </Layout>
  );
}

export function Minilottery( { listHistory, priceJackpot} ) {
  const numberWithDot = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const date = new Date()

  date.setDate(date.getDate() + 1)
  return (
    <>
      {listHistory && listHistory.slice(0, 12).map((item) => (
        <div key={item.id} className={Styles.Container__Mini__Box__Lottery}>
        <h1 className={Styles.Title__Mini__Box__Lottery}> MEGA </h1>
  
        <div className={Styles.Box__Lottery}>
          <ul className={Styles.Box__Lottery__ul}>
            <li className={Styles.Box__Lottery__li}>
              <p className={Styles.Box__Lottery__li__number}> {item.slot1} </p>
            </li>
            <li className={Styles.Box__Lottery__li}>
              <p className={Styles.Box__Lottery__li__number}> {item.slot2} </p>
            </li>
            <li className={Styles.Box__Lottery__li}>
              <p className={Styles.Box__Lottery__li__number}> {item.slot3} </p>
            </li>
            <li className={Styles.Box__Lottery__li}>
              <p className={Styles.Box__Lottery__li__number}> {item.slot4} </p>
            </li>
            <li className={Styles.Box__Lottery__li}>
              <p className={Styles.Box__Lottery__li__number}> {item.slot5} </p>
            </li>
            <li className={Styles.Box__Lottery__li}>
              <p className={Styles.Box__Lottery__li__number}> {item.slot6} </p>
            </li>
          </ul>
        </div>
  
        <div className={Styles.Detail__Lottery__Box}>
          <h2 className={Styles.Detail__Lottery__Box__text__h2}>
            {" "}
            Jackpot:
            <span className={Styles.Detail__Lottery__Box__text__span}>
            {numberWithDot(parseInt(priceJackpot))} Dak-Point
            </span>
          </h2>
          <p className={Styles.Detail__Lottery__Box__text__p1}>
            {" "}
            Kỳ QSMT tiếp theo{" "}
          </p>
          <p className={Styles.Detail__Lottery__Box__text__p2}> {moment(date).format('DD MMMM YYYY')} </p>
          <div className={Styles.Button__Group}>
            <Link href="/lottery/detaillottery" passHref>
              <button className={Styles.Button__Website}> WEBSITE </button>
            </Link>
            <button className={Styles.Button__Sell}> MUA VÉ </button>
          </div>
        </div>
      </div>
      ))}
    </>
  );
}
