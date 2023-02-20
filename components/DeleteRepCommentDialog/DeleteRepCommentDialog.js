import Style from './DeleteRepCommentDialog.module.css'
import {
    AiOutlineExclamationCircle,
} from "react-icons/ai";

import { useEffect, useState} from 'react'
import { getCookieUserLogin } from '../../modules/Cookies/Auth/userLogin';

  
function DeleteRepCommentDialog( {yes, cancle, cid = "", repcid =""}) {
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
            <p className={Style["statement"]}>{content.DeleteRepCommentDialog_question_delete}</p>
            <div className={Style["btn"]}>
                <button className={Style["btn_cancel"]} onClick={cancle} value="cancel">{content.DeleteRepCommentDialog_cancel}</button>
                <button className={Style["btn_yes"]} value="yes" onClick={() => yes(cid, repcid)}>{content.DeleteRepCommentDialog_yes}</button> 
            </div>
        </div>
    )
}

export default DeleteRepCommentDialog