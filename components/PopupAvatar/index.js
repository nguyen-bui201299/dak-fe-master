import Styles from './PopupAvatar.module.css'
import { useEffect } from 'react'

export default function PopupAvatar(props){
    return(
        <div className={Styles.container}>
            <div className={Styles.container__icon}>
                    <i className="fa fa-times" aria-hidden="true" onClick={() => props.close(false)}></i>
            </div>
            <div className={Styles.container__avatar}>
                <img className={Styles.container__avatar__image} src={props.url} alt='' />
            </div>
        </div>
    )
}