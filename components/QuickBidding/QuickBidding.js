import Styled from './QuickBidding.module.css'
import { useEffect, useState } from 'react'
import { getCookieUserLogin } from '../../modules/Cookies/Auth/userLogin';


export default function QuickBidding() {
    const userLogin = getCookieUserLogin()

    const [content, setContent] = useState({});

    useEffect(() => {
    if (userLogin?.language !== undefined) {
        setContent(require(`././languages/${userLogin.language}.json`));
    } else {
        setContent(require(`././languages/en.json`));
    }
    }, [userLogin])

    return(
        <>
        <div className={Styled.quick__bidding}>
            <h3 className={Styled.quick__bidding__title}>{content.bidding}</h3>
            
        </div>
        </>
    )
}