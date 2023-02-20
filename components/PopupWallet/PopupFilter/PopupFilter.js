import Styles from "./PopupFilter.module.css";
import { FaGripVertical, FaSignInAlt, FaSignOutAlt, FaExchangeAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import moment from "moment";

export default function PopupFilter({language, handleGetAllTransaction, handleGetSendTransaction, handleGetReceivedTransaction, setDate, handleGetTransactionByDate}) {
    const [content, setContent] = useState();

    const handelOnChange = (type, date) => {
        setDate(date)
        handleGetTransactionByDate()
    }
    
    useEffect(() => {
        setContent(require(`./languages/${language}.json`));
    }, [language])

    return (
            <ul className={Styles["filter__list"]}>
                <li  className={Styles["filter__item"]}>
                    <FaGripVertical className={Styles["filter__item-icon"]} />
                    <p className={Styles["filter__item-title"]}>{content && content.popup_filter_all}</p>
                    <input onClick={handleGetAllTransaction} type="radio" name="filter" className={Styles["filter__item-radio"]}/>
                </li>
                <li  className={Styles["filter__item"]}>
                    <FaSignInAlt className={Styles["filter__item-icon"]} />
                    <p className={Styles["filter__item-title"]}>{content && content.popup_filter_transfers}</p>
                    <input onClick={handleGetSendTransaction} type="radio" name="filter" className={Styles["filter__item-radio"]}/>
                </li>
                <li  className={Styles["filter__item"]}>
                    <FaSignOutAlt className={Styles["filter__item-icon"]} />
                    <p className={Styles["filter__item-title"]}>{content && content.popup_filter_receive_money}</p>
                    <input onClick={handleGetReceivedTransaction} type="radio" name="filter" className={Styles["filter__item-radio"]}/>
                </li>

                {/* Chưa có chức năng đổi tiền nên để tạm getAllTransaction */}
                <li style={{pointerEvents: 'none', opacity: 0.7}} onClick={handleGetAllTransaction} className={Styles["filter__item"]}>
                    <FaExchangeAlt className={Styles["filter__item-icon"]} />
                    <p className={Styles["filter__item-title"]}>{content && content.popup_filter_money_change}</p>
                    <input disabled type="radio" name="filter" className={Styles["filter__item-radio"]}/>
                </li>

                <li className={Styles["filter__item__date"]}>
                    <input
                    type="date" 
                    onChange={date =>
                      handelOnChange(
                        'date',
                        moment(date.target.value).format("YYYY-MM-DD"),
                      )
                    } name="filter" className={Styles["filter__item-radio"]}/>
                </li>
            </ul>
    )
}