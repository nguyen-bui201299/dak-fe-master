import React, { useEffect, useState } from 'react';
import Head from "next/head";
import Link from "next/link";
import Layout from "../../../../components/Layout/Layout";
import Styles from "../../../../styles/Lottery.module.css";

import { LotteryTable } from '../../detaillottery/index.js';
import API, { endpoints, headers } from '../../../../API';
import formatDate from '../../../../modules/Time/formatDate';

export default function Historylottery() {

    const [active, setActive] = useState(0);
    const filters = [
        'Lịch sử giao dịch',
        'Jackpot',
    ]

    console.log("history", active);

    const [listHistory, setListHistory] = useState({ list: [] })
    function snoopingLottery(numberlottery) {
        console.log(numberlottery.length);
    }

    useEffect(() => {
        getBuyTicketHistory();
    }, [])

    const getBuyTicketHistory = () => {
        API.get(endpoints["getlotteryhistory"](50, 1, false), { headers: headers.headers_token })
            .then((res) => {
                console.log(res.data.data)
                setListHistory({
                    list: res.data.data,
                }),
                    console.log("listhistory ", listHistory)
            })
    }

    return (
        <Layout>
            <Head>
                <title>Home</title>
                <link rel="stylesheet" href="/css/style.css" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
                <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            </Head>

            <LotteryTable
                datashowlottery={(numberlottery) => { snoopingLottery(numberlottery) }}
                setListHistory={setListHistory}
                listHistory={listHistory}
            />
            <div className={Styles.Box__Detail}>
                <ul className={Styles.Box__Detail__ul}>
                    {filters.map((filter, index) => (
                        <li
                            className={`${Styles["Box__Detail__li"]} ${Styles["hover"]} 
                                    ${(active === index) ? Styles["active"] : ''}`}
                            onClick={(e) => { setActive(index) }} key={index}>
                            <Link
                                href={
                                    index === 0
                                        ? "/lottery/detaillottery/history"
                                        : (index === 1
                                            ? "/lottery/detaillottery"
                                            : "")}>
                                <a className={Styles.Box__Detail__link}>{filter}</a>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className={Styles.Box__Table__Jackpot}>
                <table className={Styles.Table__Jackpot}>
                    <tr className={Styles.Table__Jackpot__tr}>
                        <th className={Styles.Table__Jackpot__th}> Thời gian </th>
                        <th className={Styles.Table__Jackpot__th}> Số bạn chọn </th>
                        <th className={Styles.Table__Jackpot__th}> Tổng số trúng </th>
                        <th className={Styles.Table__Jackpot__th}> Giá trị trúng thưởng </th>
                    </tr>
                    {listHistory.list.map((history, index) => (<tr key={index} className={Styles.Table__Jackpot__tr}>
                        {<td key={index} className={Styles.Table__Jackpot__td}>{formatDate(history.date)}</td>}
                        {<td className={Styles.Table__Jackpot__td}>{history.slot1+" "+history.slot2+" "+history.slot3+" "+history.slot4+" "+history.slot5+" "+history.slot6}</td>}
                        <td className={Styles.Table__Jackpot__td}> {history.match_count === 0 ? "-" : history.match_count} </td>
                        <td className={Styles.Table__Jackpot__td__special}> {history.reward === 0 ? "-" : history.reward} </td>
                    </tr>))}
                </table>
            </div>
        </Layout>
    )
}
