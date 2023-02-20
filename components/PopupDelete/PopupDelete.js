import React from 'react'
// import {CountdownCircleTimer} from 'react-countdown-circle-timer'
import { NotificationToast } from '../../modules/Notification/Notification'
import Styles from './PopupDelete.module.css'
const PopupDelete = ({setPopupDelete}) => {
  return (
    <div className={Styles.overlay}>
        <div className={Styles.popupDelete}>
            <h1 className={Styles.title}>Waitting Verify Deleting!!!</h1>
            <div className={Styles.countdown}>
                {/* <CountdownCircleTimer
                    isPlaying
                    duration={30}
                    colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                    colorsTime={[7, 5, 2, 0]}
                    onComplete = {() => {
                        setPopupDelete(false)
                        NotificationToast.fire({
                            toast: true,
                            position: 'top-right',
                            icon: 'error',
                            title: "TimeOut Varify Delete Account!!!",
                        })
                    }}
                >
                    {({ remainingTime }) => remainingTime}
                </CountdownCircleTimer> */}
            </div>
        </div>
    </div>
  )
}

export default PopupDelete