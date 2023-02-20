import Head from 'next/head'
import Styles from './Layout.module.css';
import { useEffect} from 'react'

export default function Layout({ children }) {
    // test-render-web
    useEffect(() => {
        console.log('render Layout')
        }, [])

    return (
        <>
            <Head>
                <meta name="description" content="Build demo website version2" />
                <link rel="stylesheet" href="/css/global.css" />
                <link rel="stylesheet" href="/css/style.css" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
                    integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA=="
                    crossOrigin="anonymous" referrerPolicy="no-referrer" />
            </Head>

            <div className={Styles.container}>
                {children}
            </div>
        </>
    )
}