import React, { useState } from 'react'
import { FaAlignLeft, FaFilter } from 'react-icons/fa'
import Styles from "../../../styles/Wallet.module.css";
import PopupFilter from '../../../components/PopupWallet/PopupFilter/PopupFilter'
import TransactionHistory from './TransactionHistory/TransactionHistory'

export default function WalletTransaction({
    language,
    toggleState,
    handleShow,
    handleClose,
    handleToggleTab,
    showNav,
    content,
    showPopupFilter,
    listTransaction,
    allTransaction,
    sendTransaction,
    receivedTransaction,
    setShowPopupFilter,
    handleGetAllTransaction,
    handleGetReceivedTransaction,
    handleGetSendTransaction,
    handleGetTransactionByDate,
    getDateTransaction
  }) {

    const [date, setDate] = useState()
    return (
        <div
              className={`${Styles["wallet__body"]} ${Styles["table"]} ${
                toggleState === 5 ? Styles["show"] : ""
              }`}
            >
              <div className={Styles["wallet__history-left-icon"]}>
                <FaAlignLeft
                  className={Styles["wallet__barIcon"]}
                  onClick={handleShow}
                />
              </div>
              {showNav && 
                <div className={Styles["overlayNavShow"]} onClick={handleClose}>
                  <ul className={Styles["wallet__nav-list-mobile"]}>
                    <li 
                        onClick={() => handleToggleTab(1)} 
                        className={`${Styles["wallet__nav-item-mobile"]} ${toggleState === 1 ? Styles["show"] : ''}`}
                    > {content && content.wallet_menu_main_page}</li>
                    <li 
                        onClick={() => handleToggleTab(2)} 
                        className={`${Styles["wallet__nav-item-mobile"]} ${toggleState === 2 ? Styles["show"] : ''}`}
                    >{content && content.wallet_menu_transaction}</li>
                    <li 
                        onClick={() => handleToggleTab(3)} 
                        className={`${Styles["wallet__nav-item-mobile"]} ${toggleState === 3 ? Styles["show"] : ''}`}
                    >{content && content.wallet_menu_money_change}</li>
                    <li 
                        onClick={() => handleToggleTab(4)} 
                        className={`${Styles["wallet__nav-item-mobile"]} ${toggleState === 4 ? Styles["show"] : ''}`}
                    >{content && content.wallet_menu_stake}</li>
                    <li 
                        onClick={() => handleToggleTab(5)} 
                        className={`${Styles["wallet__nav-item-mobile"]} ${toggleState === 5 ? Styles["show"] : ''}`}
                    >{content && content.wallet_menu_history}</li>
                    <li 
                        onClick={() => handleToggleTab(6)} 
                        className={`${Styles["wallet__nav-item-mobile"]} ${toggleState === 6 ? Styles["show"] : ''}`}
                    >{content && content.wallet_menu_camera}</li>
                  </ul>
                </div>
              }
              <div className={Styles["wallet__table-scroll"]}>
                <table className={Styles["wallet__history-table"]}>
                  <thead className={Styles["wallet__history-thead"]}>
                    <tr className={Styles["wallet__history-tr"]}>
                      <th className={Styles["wallet__history-th"]}>{content && content.wallet_transaction_history_time}</th>
                      <th className={Styles["wallet__history-th"]}>
                        {content && content.wallet_transaction_transaction_type}
                          <FaFilter
                            className={Styles["wallet__history-icon-filter"]}
                            onClick={() => setShowPopupFilter(!showPopupFilter)}
                          />
                        {showPopupFilter && <PopupFilter setDate={setDate} handleGetTransactionByDate={handleGetTransactionByDate} handleGetAllTransaction={handleGetAllTransaction} handleGetReceivedTransaction={handleGetReceivedTransaction} handleGetSendTransaction={handleGetSendTransaction} language={language} />}
                      </th>
                      <th className={Styles["wallet__history-th"]}>{content && content.wallet_transaction_content}</th>
                      <th className={Styles["wallet__history-th"]}>
                      {content && content.wallet_transaction_transaction_value}
                      </th>
                      {/* <th className={Styles["wallet__history-th"]}>{content && content.wallet_transaction_surplus}</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {
                        listTransaction?.map((transaction, index) => (
                          <TransactionHistory key={index} transaction={transaction} content={content} allTransaction={allTransaction} sendTransaction={sendTransaction} receivedTransaction={receivedTransaction} date={date} getDateTransaction={getDateTransaction} />
                        ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
    )
}