import Styles from "./PopupStake.module.css";
import { FaRegTimesCircle } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

export default function PopupStake({handleClick, setShowPopupStake, language}) {
    // test-render-web
    useEffect(() => {
        console.log('render PopupStake');
        }, [])

    const popupStake = useRef();
    const [content, setContent] = useState();
    
    useEffect(() => {
        setContent(require(`./languages/${language}.json`));
    }, [language])

    const closePopupStake = e => {
        if (popupStake.current === e.target) {
            setShowPopupStake(false);
        }
    };

    

    
    return (
        <>
            <div className={Styles["overlayPopupStake"]} ref={popupStake} onClick={closePopupStake}>
                <div className={Styles["stake"]}>
                    <div className={Styles["stake__heading"]}>
                        <h3 className={Styles["stake__title"]}>{content && content.popup_stake_title}</h3>
                        <FaRegTimesCircle className={Styles["stake__icon-close"]} onClick={handleClick}/>
                    </div>
                    <div className={Styles["stake__body"]}>
                        <div className={Styles["stake__body-form"]}>
                            <label className={Styles["stake__body-form-title"]}>{content && content.popup_stake_amount_to_stake}</label>
                            <input className={Styles["stake__body-form-input"]} type="text" value="5 BTC" disabled/>
                        </div>
                        <div className={Styles["stake__body-form"]}>
                            <label className={Styles["stake__body-form-title"]}>{content && content.popup_stake_period}</label>
                            <input className={Styles["stake__body-form-input"]} type="text" value="3 tháng" disabled/>
                        </div>
                        <div className={Styles["stake__body-form"]}>
                            <label className={Styles["stake__body-form-title"]}>{content && content.popup_stake_interest_rates_year}</label>
                            <input className={Styles["stake__body-form-input"]} type="text" value="6.02%" disabled/>
                        </div>
                        <div className={Styles["stake__body-form"]}>
                            <label className={Styles["stake__body-form-title"]}>{content && content.popup_stake_interest_rates}</label>
                            <input className={Styles["stake__body-form-input"]} type="text" value="34.56T" disabled/>
                        </div>
                        <div className={Styles["stake__body-form"]}>
                            <label className={Styles["stake__body-form-title"]}>{content && content.popup_stake_start_day}</label>
                            <input className={Styles["stake__body-form-input"]} type="text" value="23/03/2022" disabled/>
                        </div>
                        <div className={Styles["stake__body-form"]}>
                            <label className={Styles["stake__body-form-title"]}>{content && content.popup_stake_end_date}</label>
                            <input className={Styles["stake__body-form-input"]} type="text" value="23/06/2022" disabled/>
                        </div>
                        <div className={Styles["stake__body-form"]}>
                            <label className={Styles["stake__body-form-title"]}>{content && content.popup_stake_receiving_wallet_address_interest}</label>
                            <input className={Styles["stake__body-form-input"]} type="text" value="0x1Cd302a...7sd234a8D" disabled/>
                        </div>
                        <button className={Styles["btn-submit"]}>{content && content.popup_stake_button_confirm}</button>
                    </div>
                </div>
            </div>
        </>
    )
}