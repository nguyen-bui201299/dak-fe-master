import React from 'react'
import Head from 'next/head';
import Styles from '../../styles/Dao.module.css'
import Image from "next/image";
import Logo from "../../public/images/Logo.png";
import {GiWallet} from 'react-icons/gi'
import {BiChevronDown} from 'react-icons/bi'
import Link from 'next/link';
const index = () => {
  return (
    <>
        <Head>
            <title>DAO</title>
        </Head>
        <div className={Styles['wrap']} >
            <div className={Styles['wrap-circle']} style={{top : '30px' , left:'80px'}}></div>
            <div className={Styles['wrap-circle']} style={{bottom : '40px' , right:'-180px'}}></div>
            <div className={Styles['wrap-circle']} style={{bottom : '30px' , left:'-160px'}}></div>
         </div>
        <div className={Styles['container']}>
            <header className={Styles['header']}>
                <Link href="#">
                    <a  className={Styles['header-left']}>
                        <span className={Styles['header-left-text']}>D</span>
                        <span className={Styles['header-left-text']}>A</span>
                        <div className={Styles['header-left-logo']}>   
                            <Image className={Styles['header-left-logo-img']} src={Logo} alt="ImageLogo" />
                        </div>
                    </a>
                </Link>
                <div className={Styles['header-right']}>
                    <button className={Styles['header-right-btn']}>
                        <GiWallet />
                        <span>Connect wallet</span>
                    </button>
                    <button className={Styles['header-right-info']}>
                        <div className={Styles['user']}>
                            A
                        </div>
                        <BiChevronDown className={Styles['icon']} />
                    </button>
                </div>
            </header>
        </div>
    </>
  )
}

export default index