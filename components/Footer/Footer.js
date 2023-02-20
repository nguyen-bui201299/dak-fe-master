import Head from "next/head";
import Link from "next/link";
import { useEffect } from 'react';
import Styles from "./Footer.module.css";

export default function Footer() {

    return(
        <>
            <Head>
                <link rel="stylesheet" href="/css/global.css" />
                <link rel="stylesheet" href="/css/style.css" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
            </Head> 
            <div className={Styles.container}>
                {/* <div className={Styles.footer__top}>
                    <ul className={Styles.footer__social__list}>
                        <li className={Styles.footer__social__item}><Link href="#"><a><i className="fab fa-facebook-f"></i></a></Link></li>
                        <li className={Styles.footer__social__item}><Link href="#"><a><i className="fab fa-twitter"></i></a></Link></li>
                        <li className={Styles.footer__social__item}><Link href="#"><a><i className="fab fa-tiktok"></i></a></Link></li>
                        <li className={Styles.footer__social__item}><Link href="#"><a><i className="fab fa-youtube"></i></a></Link></li>
                    </ul>
                    <div className={Styles.footer__logo}>
                        <Image src={Logo} alt="ImageLgo"/>
                    </div>
                    <ul className={Styles.footer__card__list}>
                        <li className={Styles.footer__card__item}><Link href="#"><a><i className="fab fa-cc-visa"></i></a></Link></li>
                        <li className={Styles.footer__card__item}><Link href="#"><a><i className="fab fa-cc-mastercard"></i></a></Link></li>
                        <li className={Styles.footer__card__item}><Link href="#"><a></a></Link></li>
                        <li className={Styles.footer__card__item}><Link href="#"><a></a></Link></li>
                    </ul>
                </div>
                <div className={Styles.footer__middle}>
                    <ul className={Styles.footer__contact}>
                        <li className={Styles.footer__contact__item}>
                            <i className="fas fa-envelope"></i>
                            <label>Mail</label>
                            <p>a@stech.com</p>
                        </li>
                        <li className={Styles.footer__contact__item}>
                            <i className="fas fa-phone"></i>
                            <label>Điện thoại</label>
                            <p>0123456789</p>
                        </li>
                        <li className={Styles.footer__contact__item}>
                            <i className="fas fa-map-marker-alt"></i>
                            <label>Địa chỉ</label>
                            <p>41-43 Trần Cao Vân</p>
                        </li>
                    </ul>
                </div> */}
                <div className={Styles.footer__bottom}>
                    <span className={Styles.footer__copyright}>&copy;DAK 2022. All rights reserved.</span>
                </div>
                <footer className={Styles.footer}></footer>
            </div>
        </>
    )
}
