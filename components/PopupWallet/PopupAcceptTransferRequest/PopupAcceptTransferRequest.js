import Style from './PopupAcceptTransferRequest.module.css'
import {
    AiOutlineExclamationCircle,
} from "react-icons/ai";

import { useEffect, useState} from 'react'
import { getCookieUserLogin } from '../../../modules/Cookies/Auth/userLogin';

  
function PopupAcceptTransferRequest( {handleConfirmRequest, cancel, id, value}) {
    // test-render-web

    const userLogin = getCookieUserLogin();


    const [content, setContent] = useState({});

    useEffect(() => {
    if (userLogin.language !== undefined) {
        setContent(require(`./languages/${userLogin.language}.json`));
    } else {
        setContent(require(`./languages/en.json`));
    }
    }, [userLogin])
    return (
        <div className={Style["box"]}>
            <AiOutlineExclamationCircle className={Style["exclamation"]} />
            <p className={Style["statement"]}>{content.Dialog_question_delete}</p>
            <div className={Style["btn"]}>
                <button className={Style["btn_cancel"]} onClick={cancel} value={0} >{content.Dialog_cancel}</button>
                <button className={Style["btn_yes"]} value={1} onClick={() => handleConfirmRequest(id, value)}>{content.Dialog_yes}</button> 
            </div>
        </div>
    )
}

export default PopupAcceptTransferRequest