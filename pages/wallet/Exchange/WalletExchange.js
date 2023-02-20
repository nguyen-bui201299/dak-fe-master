import React from 'react';
import Styles from "../../../styles/Wallet.module.css";
import { FaAlignLeft, FaCreditCard, FaDownload, FaHistory, FaRegCreditCard, FaUpload } from 'react-icons/fa';
import PopupReceivedTransferMoney from '../../../components/PopupWallet/PopupReceivedTransferMoney/PopupReceivedTransferMoney';
import PopupRequestMoney from '../../../components/PopupWallet/PopupRequestMoney/PopupRequestMoney';
import PopupSendMoney from '../../../components/PopupWallet/PopupSendMoney/PopupSendMoney';

export default function WalletExchange({
    send,
    toggleState,
    handleShow,
    handleClose,
    handleToggleTab,
    showNav,
    content,
    showPopupSend,
    showPopupRequest,
    showPopupReceivedTransferMoney,
    setShowPopupRequest,
    setShowPopupSend,
    setWalletPoint,
    walletPoint,
    language,
    handleIsTransfer,
    qrValue,
    handleTransferMoney,
    received,
    setShowPopupReceivedTransferMoney,
    transferMoney }) {
    return (
        <>
            <div
              className={`${Styles["wallet__body"]} ${
                toggleState === 2 ? Styles["show"] : ""
              }`}
            >
              <div className={Styles["wallet__action-left-icon"]}>
                <FaAlignLeft
                  className={Styles["wallet__barIcon"]}
                  onClick={handleShow}
                />
              </div>
              {showNav ? (
                <div className={Styles["overlayNavShow"]} onClick={handleClose}>
                  <ul className={Styles["wallet__nav-list-mobile"]}>
                    <li
                      onClick={() => handleToggleTab(1)}
                      className={`${Styles["wallet__nav-item-mobile"]} ${
                        toggleState === 1 ? Styles["show"] : ""
                      }`}
                    >
                      {content && content.wallet_menu_main_page}
                    </li>
                    <li
                      onClick={() => handleToggleTab(2)}
                      className={`${Styles["wallet__nav-item-mobile"]} ${
                        toggleState === 2 ? Styles["show"] : ""
                      }`}
                    >
                      {content && content.wallet_menu_transaction}
                    </li>
                    <li
                      onClick={() => handleToggleTab(3)}
                      className={`${Styles["wallet__nav-item-mobile"]} ${
                        toggleState === 3 ? Styles["show"] : ""
                      }`}
                    >
                      {content && content.wallet_menu_money_change}
                    </li>
                    <li
                      onClick={() => handleToggleTab(4)}
                      className={`${Styles["wallet__nav-item-mobile"]} ${
                        toggleState === 4 ? Styles["show"] : ""
                      }`}
                    >
                      {content && content.wallet_menu_stake}
                    </li>
                    <li
                      onClick={() => handleToggleTab(5)}
                      className={`${Styles["wallet__nav-item-mobile"]} ${
                        toggleState === 5 ? Styles["show"] : ""
                      }`}
                    >
                      {content && content.wallet_menu_history}
                    </li>
                    <li
                      onClick={() => handleToggleTab(6)}
                      className={`${Styles["wallet__nav-item-mobile"]} ${
                        toggleState === 6 ? Styles["show"] : ""
                      }`}
                    >
                      {content && content.wallet_menu_camera}
                    </li>
                  </ul>
                </div>
              ) : null}
              <ul className={Styles["wallet__action-list"]}>
                <li
                  className={Styles["wallet__action-item"]}
                  onClick={() => setShowPopupSend(!showPopupSend)}
                >
                  <FaUpload className={Styles["wallet__action-item-icon"]} />
                  <p className={Styles["wallet__action-item-name"]}>
                    {content &&
                      content.wallet_transaction_page_transfer_money_to_friends}
                  </p>
                </li>
                <li
                  className={Styles["wallet__action-item"]}
                  onClick={() => setShowPopupRequest(!showPopupRequest)}
                >
                  <FaDownload className={Styles["wallet__action-item-icon"]} />
                  <p className={Styles["wallet__action-item-name"]}>
                    {content &&
                      content.wallet_transaction_page_ask_friend_to_transfer_money}
                  </p>
                </li>
                <li
                  className={Styles["wallet__action-item"]}
                  onClick={() => setShowPopupSend(!showPopupSend)}
                >
                  <FaRegCreditCard
                    className={Styles["wallet__action-item-icon"]}
                  />
                  <p className={Styles["wallet__action-item-name"]}>
                    {content && content.wallet_transaction_page_buy_dak_point}
                  </p>
                </li>
                <li
                  className={Styles["wallet__action-item"]}
                  onClick={() => setShowPopupRequest(!showPopupRequest)}
                >
                  <FaCreditCard className={Styles["wallet__action-item-icon"]} />
                  <p className={Styles["wallet__action-item-name"]}>
                    {content && content.wallet_transaction_page_buy_token}
                  </p>
                </li>
                <li
                  className={Styles["wallet__action-item"]}
                  // onClick={() => setShowPopupRequest(!showPopupRequest)}
                  onClick={() => handleTransferMoney(send)}
                >
                  <FaHistory className={Styles["wallet__action-item-icon"]} />
                  <p className={Styles["wallet__action-item-name"]}>
                  {content && content.wallet_transaction_page_sent_transfer_money}
                  </p>
                </li>
                <li
                  className={Styles["wallet__action-item"]}
                  onClick={() => handleTransferMoney(received)}
                >
                  <FaHistory className={Styles["wallet__action-item-icon"]} />
                  <p className={Styles["wallet__action-item-name"]}>
                  {content && content.wallet_transaction_page_received_transfer_money}
                  </p>
                </li>
              </ul>
            </div>
            {showPopupSend && (
              <PopupSendMoney
                handleClick={() => setShowPopupSend(!showPopupSend)}
                setShowPopupSend={setShowPopupSend}
                setWalletPoint={setWalletPoint}
                walletPoint={walletPoint}
                language={language}
                handleIsTransfer={handleIsTransfer}
                qrValue={qrValue}
              />
            )}
            {showPopupRequest && (
              <PopupRequestMoney
                handleClick={() => setShowPopupRequest(!showPopupRequest)}
                setShowPopupRequest={setShowPopupRequest}
                language={language}
              />
            )}
            {showPopupReceivedTransferMoney && (
              <PopupReceivedTransferMoney
              handleClick={() => setShowPopupReceivedTransferMoney(!showPopupReceivedTransferMoney)}
              setShowPopupReceivedTransferMoney={setShowPopupReceivedTransferMoney}
              language={language}
              value = {transferMoney}
              walletPoint={walletPoint}
              handleIsTransfer={handleIsTransfer}
              />
            )}
        </>
    )
}