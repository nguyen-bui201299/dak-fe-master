import Style from './DeletePostDialog.module.css'
import Swal from 'sweetalert2'
import {
    AiOutlineExclamationCircle,
} from "react-icons/ai";

import { useEffect, useState} from 'react'
import { getCookieUserLogin } from '../../modules/Cookies/Auth/userLogin';

  
function DeletePostDialog({ handleDeletePostThunk, cancle, id }) {
    const userLogin = getCookieUserLogin();

    const [content, setContent] = useState({});

    useEffect(() => {
    if (userLogin.language !== undefined) {
        setContent(require(`././languages/${userLogin.language}.json`));
    } else {
        setContent(require(`././languages/en.json`));
    }
    }, [userLogin])

    useEffect(() => {
        Swal.fire({
            title: 'Are you sure?',
            // text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Cancel!',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.isConfirmed) {
                handleDeletePostThunk(id)
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
            }else {
                cancle()
            }
          })
    }, [])

    // return (
    //     <div className={Style["box"]}>
    //         <AiOutlineExclamationCircle className={Style["exclamation"]} />
    //         <p className={Style["statement"]}>{content.Dialog_question_delete}</p>
    //         <div className={Style["btn"]}>
    //             <button className={Style["btn_cancel"]} onClick={cancle} value="cancel">{content.Dialog_cancel}</button>
    //             <button className={Style["btn_yes"]} value="yes" onClick={() => handleDeletePostThunk(id)}>{content.Dialog_yes}</button> 
    //         </div>
    //     </div>
    // )
}

export default DeletePostDialog