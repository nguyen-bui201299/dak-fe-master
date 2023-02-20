import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import QR from "qrcode.react";
import { FaAlignLeft, FaFileCode } from 'react-icons/fa';
import { StakItem } from '..';
import Styles from "../../../styles/Wallet.module.css";

export default function WalletMain({ 
    toggleState,
    handleShow,
    handleClose,
    errorMetamask,
    changeStyle,
    style,
    defaultAccountsMetamask,
    metamaskBalance,
    connectButtonText,
    connectWalletHandle,
    accountChangeHandle,
    handleToggleTab,
    showNav,
    content,
    walletPoint,
    numberWithDot,
    onCopy,
    copyText,
    walletDetail,
    handleClick,
    popupOpen,
    qrValue,
    listTransaction }) {
    return (
        <div
            className={`${Styles["wallet__body"]} ${
            toggleState === 1 ? Styles["show"] : ""
            }`}
        >
            <div className={Styles["wallet__main-left-icon"]}>
            <FaAlignLeft
                className={Styles["wallet__barIcon"]}
                onClick={handleShow}
            />
            </div>
            <div className={Styles["wallet__body-main"]}>
            <div className={Styles["wallet__main-left"]}>
                {showNav ? (
                <div
                    className={Styles["overlayNavShow"]}
                    onClick={handleClose}
                >
                    <ul className={Styles["wallet__nav-list-mobile"]}>
                    <li
                        onClick={() => handleToggleTab(1)}
                        className={`${Styles["wallet__nav-item-mobile"]} ${
                        toggleState === 1 ? Styles["show"] : ""
                        }`}
                    >
                        {" "}
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
                <div className={Styles["wallet__main-left-top"]}>
                <div className={Styles["wallet__main-left-top-item"]}>
                    <p className={Styles["wallet__main-left-top-title"]}>
                    {content && content.wallet_main_page_dak_point}
                    </p>
                    <h3 className={Styles["wallet__main-left-top-point"]}>
                    {walletPoint != undefined
                        ? numberWithDot(parseInt(walletPoint))
                        : 0}
                    </h3>
                    <div className={Styles["wallet__main-left-bottom"]}>
                <p className={Styles["wallet__main-left-bottom-title"]}>
                    {content && content.wallet_main_page_your_wallet_code}
                </p>
                <CopyToClipboard onCopy={onCopy} text={copyText}>
                <h3 className={`${Styles["wallet__main-left-bottom-code"]}`}>
                    {walletDetail?.short_cut != undefined
                    ? walletDetail?.short_cut
                    : ""}
                    <FaFileCode
                    className={Styles["wallet__main-left-bottom-icon"]}
                    onClick={handleClick}
                    />
                    {popupOpen && (
                    <p
                        className={`${Styles["tooltip"]} ${
                        popupOpen ? Styles["show"] : Styles["hide"]
                        }`}
                    >
                        {content && content.wallet_copy_success}
                    </p>
                    )}
                </h3>
                </CopyToClipboard>
                    <div className={Styles["qrScan"]}>
                    {qrValue != "" && (
                        <QR value={qrValue} className={Styles["wallet_qrcode"]} />
                        )}
                    </div>
                </div>
                </div>
                <div className={Styles["wallet__main-left-top-item"]}>
                    <p className={Styles["wallet__main-left-top-title"]}>
                    {content && content.wallet_main_page_dak_token}
                    </p>
                    <h3 className={Styles["wallet__main-left-top-point"]}>{metamaskBalance}</h3>
                    <button className={Styles[style]} onClick={()=> {connectWalletHandle(); changeStyle()}}>{connectButtonText}</button>
                    
                    <div className={Styles["wallet__main-left-bottom"]}>
                        <h3 className={Styles["wallet__main-right-bottom-content"]}>Your Metamask Wallet</h3>
                        <p className={`${Styles["wallet__main-right-bottom-code"]}`}>{defaultAccountsMetamask}
                        </p>
                    </div>
                </div>
                </div>

            </div>
            {/* <div className={Styles["wallet__main-right"]}>
                <div className={Styles["wallet__main-right-qr"]}>
                <Image src={QRCode} alt="QRCode"/>
                {qrValue != "" && (
                    <QR value={qrValue} className={Styles["wallet_qrcode"]} />
                )}
                </div>
            </div> */}
            </div>
            <div className={Styles["wallet__body-title"]}>
            <h2 className={Styles["wallet__body-heading-item"]}>
                {content && content.wallet_menu_main_page_property_types}
            </h2>
            <h2 className={Styles["wallet__body-heading-item"]}>
                {content && content.wallet_menu_main_page_time_lock}
            </h2>
            </div>
            <ul className={Styles["wallet__body-list"]}>
            {
                listTransaction?.map((transaction, index)=>{
                return(
                    <StakItem key={index} transaction={transaction} content={content} />
                )
                })
            }
            </ul>
        </div>
    )
}