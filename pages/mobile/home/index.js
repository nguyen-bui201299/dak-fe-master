

import Head from 'next/head'
import React, { useState, useEffect, useRef } from 'react';
import Layout, { siteTitle } from '../../../components/Mobile/Layout/Layout';
import Styles from '../../../styles/mobile/Home.module.css';
import Story from '../../../components/Mobile/Story/Story';
import ButtonNetworkSocialList from '../../../components/Mobile/ButtonNetworkSocialList/ButtonNetworkSocialList';
import PostList from '../../../components/Mobile/PostList/PostList';
import Header from '../../../components/Mobile/Header/Header';
import Statistic from '../../../components/Mobile/Post/component/Statistic/Statistic';

export default function Home() {
    // test-render-web
    useEffect(() => {
        console.log('render Home');
        }, [])

    const siteTitle = "Home";
    const [typePost, setTypePost] = useState("youtube");

    return (
        <>
            <Head>
                <title>{siteTitle}</title>
            </Head>
            <Layout>
                {/* Header */}
                <div className={Styles.header}>
                    <Header />
                </div>

                {/* Story */}
                <div className = {Styles.story}>
                    <Story/>
                </div>
                {/* Button mxh */}
                <div className = {Styles.button_network_social_list}>
                    <ButtonNetworkSocialList setTypePost = {setTypePost}/>
                </div>
                {/* Bai viet */}
                <div className = {Styles.post_list}>
                    <PostList typePost = {typePost}/>
                </div>
            </Layout>
        </>
    )
}