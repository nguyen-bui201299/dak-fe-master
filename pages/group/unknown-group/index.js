import Head from "next/head";
import Layout from "../../../components/Layout/Layout";
import DetailPrivate from "../../../components/Group/Detail/DetailPrivate-NotJoinYet"



export default function MainGroup() {
    return(
        <Layout>
            <Head>
                <title>DAK - Detail</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
            </Head>
            <DetailPrivate />
        </Layout>
    )
}