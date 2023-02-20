import Head from "next/head";
import Styles from "../../styles/ComingSoon.module.css";
import ImageGifRes from "../../public/images/gif.gif";
import ImageGif from "../../public/images/gifweb.gif";
import Image from "next/image";
import { useEffect } from "react";

export default function Login() {
    // test-render-web
    useEffect(() => {
        console.log('render Login');
        }, [])

    return (
        <>
            <Head>
                <title>DAK - Coming soon</title>
                <link rel="stylesheet" href="/css/global.css"/>
            </Head>
            <div className={Styles["form__group"]}>
                <div className={Styles["form__group-left"]}>
                    <h1 className={Styles["form__group-left-title"]}>Coming Soon</h1>
                </div>
                <div className={Styles["form__group-right"]}>
                    <Image src={ImageGif} alt="ImageGif"/>
                </div>
                <div className={Styles["form__group-right-res"]}>
                    <Image src={ImageGifRes} alt="ImageGif"/>
                </div>
            </div>
        </>
    )
}