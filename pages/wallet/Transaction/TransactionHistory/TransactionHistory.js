import React, { useState } from 'react';
import formatDate from '../../../../modules/Time/formatDate';
import Styles from "../../../../styles/Wallet.module.css";

export default function TransactionHistory({ transaction, content, allTransaction, sendTransaction, receivedTransaction, getDateTransaction, date}) {
    const [showHistory, setShowHistory] = useState(false);
    const closeHistory = () => {
      setShowHistory(false);
    };
    return (
      <>
        { allTransaction ? <tr
          className={Styles["wallet__history-tr"]}
          onClick={() => setShowHistory(true)}
        >
          <td className={Styles["wallet__history-td"]}>
            {formatDate(transaction.transition.created_at)}
          </td>
          <td className={Styles["wallet__history-td"]}>
          { 
            transaction.direction === 'send' && transaction.transition.type === 'ticket' ? 
            content.wallet_transaction_buy_ticket : 
            transaction.direction === 'send' && transaction.transition.type === 'lottery-reward' ? 
            content.wallet_transaction_lottery_reward :
            transaction.direction === 'send' ?
            content.wallet_transaction_send : content.wallet_transaction_receive
          }
          </td>
          <td className={Styles["wallet__history-td"]}>
            {transaction.transition.note.length > 23 ? transaction.transition.note.slice(0,18) + "..." : transaction.transition.note}
          </td>
          <td className={Styles["wallet__history-td"]}>
            {transaction.direction === 'send' ? "-" : "+"} {transaction.transition.amount}
          </td>
          {/* <td className={Styles["wallet__history-td"]}>6666P 33T</td> */}
        </tr> : sendTransaction && transaction.direction === 'send' ? <tr
          className={Styles["wallet__history-tr"]}
          onClick={() => setShowHistory(true)}
        >
          <td className={Styles["wallet__history-td"]}>
            {formatDate(transaction.transition.created_at)}
          </td>
          <td className={Styles["wallet__history-td"]}>
          { 
            transaction.direction === 'send' && transaction.transition.type === 'ticket' ? 
            content.wallet_transaction_buy_ticket : 
            transaction.direction === 'send' && transaction.transition.type === 'lottery-reward' ? 
            content.wallet_transaction_lottery_reward :
            transaction.direction === 'send' ?
            content.wallet_transaction_send : content.wallet_transaction_receive
          }
          </td>
          <td className={Styles["wallet__history-td"]}>
            {transaction.transition.note.length > 23 ? transaction.transition.note.slice(0,18) + "..." : transaction.transition.note}
          </td>
          <td className={Styles["wallet__history-td"]}>
          {transaction.direction === 'send' ? "-" : "+"} {transaction.transition.amount}
          </td>
          {/* <td className={Styles["wallet__history-td"]}>6666P 33T</td> */}
        </tr> : receivedTransaction && transaction.direction === 'receive' ? <tr
          className={Styles["wallet__history-tr"]}
          onClick={() => setShowHistory(true)}
        >
          <td className={Styles["wallet__history-td"]}>
            {formatDate(transaction.transition.created_at)}
          </td>
          <td className={Styles["wallet__history-td"]}>
          { 
            transaction.direction === 'send' && transaction.transition.type === 'ticket' ? 
            content.wallet_transaction_buy_ticket : 
            transaction.direction === 'send' && transaction.transition.type === 'lottery-reward' ? 
            content.wallet_transaction_lottery_reward :
            transaction.direction === 'send' ?
            content.wallet_transaction_send : content.wallet_transaction_receive
          }
          </td>
          <td className={Styles["wallet__history-td"]}>
            {transaction.transition.note.length > 23 ? transaction.transition.note.slice(0,18) + "..." : transaction.transition.note}
          </td>
          <td className={Styles["wallet__history-td"]}>
          {transaction.direction === 'send' ? "-" : "+"} {transaction.transition.amount}
          </td>
          {/* <td className={Styles["wallet__history-td"]}>6666P 33T</td> */}
        </tr>
        
        : 
        
        getDateTransaction && formatDate(transaction.transition.created_at).props.children.props.children[0].props.children[1] === date && ( transaction.direction === 'send'  || transaction.direction === 'receive' ) ? 
        <tr
        className={Styles["wallet__history-tr"]}
        onClick={() => setShowHistory(true)}
        >
        <td className={Styles["wallet__history-td"]}>
          {formatDate(transaction.transition.created_at)}
        </td>
        <td className={Styles["wallet__history-td"]}>
        { 
          transaction.direction === 'send' && transaction.transition.type === 'ticket' ? 
          content.wallet_transaction_buy_ticket : 
          transaction.direction === 'send' && transaction.transition.type === 'lottery-reward' ? 
          content.wallet_transaction_lottery_reward :
          transaction.direction === 'send' ?
          content.wallet_transaction_send : content.wallet_transaction_receive
        }
        </td>
        <td className={Styles["wallet__history-td"]}>
          {transaction.transition.note.length > 23 ? transaction.transition.note.slice(0,18) + "..." : transaction.transition.note}
        </td>
        <td className={Styles["wallet__history-td"]}>
        {transaction.direction === 'send' ? "-" : "+"} {transaction.transition.amount}
        </td>
        {/* <td className={Styles["wallet__history-td"]}>6666P 33T</td> */}
      </tr> : null
      }
  
        
        {showHistory ? (
          <div className={Styles["overlayHistoryPopup"]} onClick={closeHistory}>
            <div
              className={Styles["history-popup"]}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={Styles["history__popup-title"]}>
                <span>
                  {content && content.wallet_transaction_history_details_title}
                </span>
                <i
                  style={{ cursor: "pointer" }}
                  className="fa fa-times"
                  aria-hidden="true"
                  onClick={closeHistory}
                ></i>
              </div>
              <div className={Styles["history__popup-col"]}>
                <span>
                  {transaction.direction === "send" && content
                    ? content.wallet_transaction_history_details_receiving_wallet_address
                    : content.wallet_transaction_history_details_sending_wallet_address}
                </span>
                <span>{transaction.wallet.wallet_address}</span>
              </div>
              <div className={Styles["history__popup-col"]}>
                <span>
                  {content && content.wallet_transaction_transaction_value}
                </span>
                <span style={{ color: "var(--main-color)" }}>
                  {transaction.transition.amount}
                </span>
              </div>
              <div className={Styles["history__popup-col"]}>
                <span>{content && content.wallet_transaction_content}</span>
                <span>{transaction.transition.note}</span>
              </div>
              <div className={Styles["history__popup-col"]}>
                <span>
                  {content && content.wallet_transaction_transaction_type}
                </span>
                <span>
                  { transaction.direction === 'send' && transaction.transition.type === 'ticket' ? 
                    content.wallet_transaction_buy_ticket : 
                    transaction.direction === 'send' && transaction.transition.type === 'lottery-reward' ? 
                    content.wallet_transaction_lottery_reward :
                    transaction.direction === 'send' ?
                    content.wallet_transaction_send : content.wallet_transaction_receive}
                </span>
              </div>
              <div className={Styles["history__popup-col"]}>
                <span>{content && content.wallet_transaction_history_time}</span>
                <span>
                  {formatDate(transaction.transition.created_at, false)}
                </span>
              </div>
              {/* <div className={Styles["history__popup-col"]}>
                        <span>{content && content.wallet_transaction_surplus}</span>
                        <span>666P 33T</span>
                      </div> */}
            </div>
          </div>
        ) : null}
      </>
    );
  }