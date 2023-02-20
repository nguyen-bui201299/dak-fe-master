import Head from "next/head";
import Footer from "../../../components/Footer/Footer";
import Layout from "../../../components/Layout/Layout";
import { useState, useEffect } from "react";
import Search from "../../../components/Searched/History/Search-history.tsx"



export default function Searching() {
    // test-render-web
    useEffect(() => {
        console.log('render Searching');
        }, [])

    return(
        <Layout>
            <Head>
                <title>DAK - History</title>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
                <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
            </Head>
            <Search/>
            <Footer/>
        </Layout>
    )
}