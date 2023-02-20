import Styles from "./Statistic.module.css"
import Image from "next/image"
import Avatar from "/public/images/avatar.jpg"
import { MdArrowBackIosNew } from "react-icons/md"
import { useRef, useState, useEffect } from "react"
import { useSpring, animated } from 'react-spring';


export default function Statistic({showstatistic, setshowstatistic}) {
    // test-render-web
    useEffect(() => {
        console.log('render Statistic')
        }, [])

    const closeStatistic = e => {
        setshowstatistic(false)
    };

    return (
        <>
        {showstatistic ? 
            <div className={Styles.statistic}>
                <div className={Styles.statisticHeading}>
                    <p className={Styles.btnBack} >
                        <MdArrowBackIosNew onClick={closeStatistic}/>
                    </p>
                    <p className={Styles.nameUser}>
                        Nguyễn Thiên Phúc
                    </p>
                </div>
                <div className={Styles.statisticContent}>
                    <input className={Styles.statisticSearch} placeholder="Tìm kiếm" /> 
                    <ul className={Styles.listStatisticed}>
                        <li className={Styles.itemStatisticed}>
                            <div className={Styles.itemImage}>
                                <Image src={Avatar} alt=""/>    
                            </div>
                            <div className={Styles.itemInfo}>
                                <p className={Styles.itemInfo_Name}>Thiên Phúc</p>
                                <p className={Styles.itemInfo_Tag}>phucntp@2000</p>
                            </div>
                            <button className={Styles.itemBtn}>
                                Following
                            </button>
                        </li>
                        <li className={Styles.itemStatisticed}>
                            <div className={Styles.itemImage}>
                                <Image src={Avatar} alt=""/>    
                            </div>
                            <div className={Styles.itemInfo}>
                                <p className={Styles.itemInfo_Name}>Thiên Phúc</p>
                                <p className={Styles.itemInfo_Tag}>phucntp@2000</p>
                            </div>
                            <button className={Styles.itemBtn}>
                                Following
                            </button>
                        </li>
                        <li className={Styles.itemStatisticed}>
                            <div className={Styles.itemImage}>
                                <Image src={Avatar} alt=""/>    
                            </div>
                            <div className={Styles.itemInfo}>
                                <p className={Styles.itemInfo_Name}>Thiên Phúc</p>
                                <p className={Styles.itemInfo_Tag}>phucntp@2000</p>
                            </div>
                            <button className={Styles.itemBtn}>
                                Following
                            </button>
                        </li>
                        <li className={Styles.itemStatisticed}>
                            <div className={Styles.itemImage}>
                                <Image src={Avatar} alt=""/>    
                            </div>
                            <div className={Styles.itemInfo}>
                                <p className={Styles.itemInfo_Name}>Thiên Phúc</p>
                                <p className={Styles.itemInfo_Tag}>phucntp@2000</p>
                            </div>
                            <button className={Styles.itemBtn}>
                                Following
                            </button>
                        </li>
                        <li className={Styles.itemStatisticed}>
                            <div className={Styles.itemImage}>
                                <Image src={Avatar} alt=""/>    
                            </div>
                            <div className={Styles.itemInfo}>
                                <p className={Styles.itemInfo_Name}>Thiên Phúc</p>
                                <p className={Styles.itemInfo_Tag}>phucntp@2000</p>
                            </div>
                            <button className={Styles.itemBtn}>
                                Following
                            </button>
                        </li>
                        <li className={Styles.itemStatisticed}>
                            <div className={Styles.itemImage}>
                                <Image src={Avatar} alt=""/>    
                            </div>
                            <div className={Styles.itemInfo}>
                                <p className={Styles.itemInfo_Name}>Thiên Phúc</p>
                                <p className={Styles.itemInfo_Tag}>phucntp@2000</p>
                            </div>
                            <button className={Styles.itemBtn}>
                                Following
                            </button>
                        </li>
                    </ul>
                </div>  
            </div>
        : null }
        </>
    )
}