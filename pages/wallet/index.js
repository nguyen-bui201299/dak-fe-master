import Head from "next/head";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import Styles from "../../styles/Wallet.module.css";
import {
  FaAngleDoubleDown,
  FaAlignLeft,
} from "react-icons/fa";
import Image from "next/image";
import Coin from "../../public/images/Logo.png";
import PopupSendMoney from "../../components/PopupWallet/PopupSendMoney/PopupSendMoney";
import PopupStake from "../../components/PopupWallet/PopupStake/PopupStake";
import API, { endpoints, headers } from "../../API";
import { QrReader } from 'react-qr-reader';
import formatDate from "../../modules/Time/formatDate";
import WalletTransaction from "./Transaction/WalletTransaction";
import WalletMain from "./MainTab/WalletMain";
import WalletExchange from "./Exchange/WalletExchange";
import {ethers} from "ethers"
import { chain } from "lodash";
import { getCookieUserLogin } from "../../modules/Cookies/Auth/userLogin";

export default function Wallet() {
  const [toggleState, setToggleState] = useState(1);
  const [showPopupSend, setShowPopupSend] = useState(false);
  const [showPopupRequest, setShowPopupRequest] = useState(false);
  const [showPopupStake, setShowPopupStake] = useState(false);
  const [showPopupFilter, setShowPopupFilter] = useState(false);
  const [showPopupReceivedTransferMoney, setShowPopupReceivedTransferMoney] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [walletPoint, setWalletPoint] = useState(0); //giá trị dakpoint
  const [walletDetail, setWalletDetail] = useState({}); //thông tin ví
  const [qrValue, setQrValue] = useState({});
  const [data, setData] = useState('');
  const [showNav, setShowNav] = useState(false);
  const [language, setLanguage] = useState("en");
  const [content, setContent] = useState();
  const [isRender, setIsRender] = useState(false)

  const [errorMetamask, setErrorMetamask] = useState(null)
  const [defaultAccountsMetamask, setDefaultAccountsMetamask] = useState(null)
  const [metamaskBalance, setMetamaskBalance] = useState(null)
  const [connectButtonText, setConnectButtonText] = useState("Connect Wallet")
  const [hide, setHide] = useState(false)
  const [style, setStyle] = useState("hideButtonMetamask")

  const [listTransaction, setListTransaction] = useState([]);

  const [send, setSend] = useState("send")
  const [received, setReceived] = useState("received")
  const [transferMoney, setTransferMoney] = useState("")

  const [allTransaction, setAllTransaction] = useState(true)
  const [sendTransaction, setSendTransaction] = useState(false)
  const [receivedTransaction, setReceivedTransaction] = useState(false)
  const [changeTransaction, setChangeTransaction] = useState(false)
  const [getDateTransaction, setGetDateTransaction] = useState(false)

  const userLogin = getCookieUserLogin()

  const handleGetAllTransaction = () => {
    setAllTransaction(true)
    setSendTransaction(false)
    setReceivedTransaction(false)
    setChangeTransaction(false)
    setGetDateTransaction(false)
  }
  
  const handleGetSendTransaction = () => {
    setAllTransaction(false)
    setSendTransaction(true)
    setReceivedTransaction(false)
    setChangeTransaction(false)
    setGetDateTransaction(false)
  }

  const handleGetReceivedTransaction = () => {
    setAllTransaction(false)
    setSendTransaction(false)
    setReceivedTransaction(true)
    setChangeTransaction(false)
    setGetDateTransaction(false)
  }

  const handleGetTransactionByDate = () => {
    setAllTransaction(false)
    setSendTransaction(false)
    setReceivedTransaction(false)
    setChangeTransaction(false)
    setGetDateTransaction(true)
  }


  useEffect(() => {
    setContent(require(`./languages/${language}.json`));
    const lang = userLogin?.language;
    if (lang) {
      setLanguage(lang);
    }
  }, []);

  useEffect(() => {
    setContent(require(`./languages/${language}.json`));
  }, [language]);

  //Do metamask here
    const connectWalletHandle = () => {
      if(window.ethereum) {
        window.ethereum.request({method: 'eth_requestAccounts'})
        .then(result => {
          accountChangeHandle(result[0])
          setConnectButtonText(changeStyle)
        })
      } else {
        setErrorMetamask("Install Metamask")
      }
    }

    const changeStyle = () => {
      setStyle("cont2");
    }

    const accountChangeHandle = (newAccount) => {
      setDefaultAccountsMetamask(newAccount)
      getMetamaskBalance(newAccount.toString())
    }

    const getMetamaskBalance = (address) => {
      window.ethereum.request({method: 'eth_getBalance', params: [address, 'latest']})
      .then(balance => {
        setMetamaskBalance(ethers.utils.formatEther(balance))
      })
    }

    const chainChangedHandle = () => {
      window.location.reload()
    }
    useEffect(() => {
      window?.ethereum?.on('accountsChanged', accountChangeHandle)
      window?.ethereum?.on('chainChanged', chainChangedHandle)
    }, [])
  //End metamask here

  const handleToggleTab = (index) => {
    setToggleState(index);
  };

  const toggle = () => {
    setPopupOpen((prev) => !prev);
  };

  const numberWithDot = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  useEffect(() => {
    API.get(endpoints["wallet"], { headers: headers.headers_token })
      .then(function (response) {
          setWalletPoint(response.data.data.dak_point.amount);
          setWalletDetail(response.data.data.wallet);
          setQrValue(response.data.data.wallet.wallet_address);
      })
      .catch(function (error) {});
  }, [isRender]);

  const [copied, setCopied] = useState(false);
  let copyText = walletDetail.wallet_address;

  const onCopy = (() => {
    setCopied(true);
  })

  const handleClick = () => {
    // Xử lý popup
    setPopupOpen(!popupOpen);

    setTimeout(() => {
      toggle();
    }, 1100);
  };

  const handleShow = () => {
    setShowNav(!showNav);
  };

  const handleClose = () => {
    setShowNav(false);
  };

  useEffect(() => {
    API.get(endpoints["getListTransaction"](200), { headers: headers.headers_token })
      .then((res) => {
        setListTransaction(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [isRender]);

  const handleTransferMoney = (e) => {
    setShowPopupReceivedTransferMoney(!showPopupReceivedTransferMoney)
    setTransferMoney(e)
  }

  const handleIsTransfer = () => setIsRender(!isRender)

    return (
      <>
        <Layout handleIsTransfer={handleIsTransfer} page="wallet" setLanguage={setLanguage}>
        <Head>
          <title>DAK - {content && content.wallet_title}</title>
          <link rel="stylesheet" href="/css/style.css" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
          <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
        </Head>
          <div className={Styles["wallet"]}>
            <div className={Styles["wallet__nav-list"]}>
              <div
                onClick={() => handleToggleTab(1)}
                className={`${Styles["wallet__nav-item"]} ${
                  toggleState === 1 ? Styles["show"] : ""
                }`}
              >
                {content && content.wallet_menu_main_page}
              </div>
              <div
                onClick={() => handleToggleTab(2)}
                className={`${Styles["wallet__nav-item"]} ${
                  toggleState === 2 ? Styles["show"] : ""
                }`}
              >
                {content && content.wallet_menu_transaction}
              </div>
              <div
                onClick={() => handleToggleTab(3)}
                className={`${Styles["wallet__nav-item"]} ${
                  toggleState === 3 ? Styles["show"] : ""
                }`}
              >
                {content && content.wallet_menu_money_change}
              </div>
              <div
                onClick={() => handleToggleTab(4)}
                className={`${Styles["wallet__nav-item"]} ${
                  toggleState === 4 ? Styles["show"] : ""
                }`}
              >
                {content && content.wallet_menu_stake}
              </div>
              <div
                onClick={() => handleToggleTab(5)}
                className={`${Styles["wallet__nav-item"]} ${
                  toggleState === 5 ? Styles["show"] : ""
                }`}
              >
                {content && content.wallet_menu_history}
              </div>
            </div>

            {/* Trang chính */}
            <WalletMain { ... { 
              toggleState,
              handleShow,
              handleClose,
              errorMetamask,
              style,
              changeStyle,
              defaultAccountsMetamask,
              metamaskBalance,
              connectButtonText,
              connectWalletHandle,
              accountChangeHandle,
              getMetamaskBalance,
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
              listTransaction, } }/>

            {/* Giao dịch */}
            <WalletExchange { ... { 
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
              transferMoney } }/>

            {/* Đổi DAK Token */}
            <div
              className={`${Styles["wallet__body"]} ${Styles["stake"]} ${
                toggleState === 3 ? Styles["show"] : ""
              }`}
            >
              <div className={Styles["wallet__change-left-icon"]}>
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
                  </ul>
                </div>
              ) : null}
              <div className={Styles["wallet__change"]}>
                <p className={Styles["wallet__change-heading"]}>
                  {content && content.wallet_change_money_page_amount_to_exchange}
                </p>
                <div className={Styles["wallet__change-item"]}>
                  <input
                    type="number"
                    className={Styles["wallet__change-input"]}
                    placeholder="0"
                  />
                  <select
                    className={Styles["wallet__change-select"]}
                    name="StakeCategory"
                  >
                    <option className={Styles["wallet__change-option"]} value="0">
                      {content && content.wallet_change_money_page_select_type}...
                    </option>
                    <option className={Styles["wallet__change-option"]} value="1">
                      Tether (USDT)
                    </option>
                    <option className={Styles["wallet__change-option"]} value="2">
                      USD Coin (USDC)
                    </option>
                    <option className={Styles["wallet__change-option"]} value="3">
                      Biance USD (BUSD)
                    </option>
                    <option className={Styles["wallet__change-option"]} value="4">
                      Etherum (ETH)
                    </option>
                    <option className={Styles["wallet__change-option"]} value="5">
                      BNB (BNB)
                    </option>
                    <option className={Styles["wallet__change-option"]} value="6">
                      TRON (TRX)
                    </option>
                  </select>
                </div>
                <FaAngleDoubleDown className={Styles["wallet__change-icon"]} />
                <p className={Styles["wallet__change-heading"]}>
                  {content && content.wallet_change_money_page_amount_received}
                </p>
                <div className={Styles["wallet__change-item"]}>
                  <input
                    type="number"
                    className={Styles["wallet__change-input"]}
                    value="0"
                    disabled
                  />
                  <select
                    className={Styles["wallet__change-select"]}
                    name="StakeCategory"
                  >
                    <option className={Styles["wallet__change-option"]} value="0">
                      {content && content.wallet_change_money_page_select_type}...
                    </option>
                    <option className={Styles["wallet__change-option"]} value="1">
                      Tether (USDT)
                    </option>
                    <option className={Styles["wallet__change-option"]} value="2">
                      USD Coin (USDC)
                    </option>
                    <option className={Styles["wallet__change-option"]} value="3">
                      Biance USD (BUSD)
                    </option>
                    <option className={Styles["wallet__change-option"]} value="4">
                      Etherum (ETH)
                    </option>
                    <option className={Styles["wallet__change-option"]} value="5">
                      BNB (BNB)
                    </option>
                    <option className={Styles["wallet__change-option"]} value="6">
                      TRON (TRX)
                    </option>
                  </select>
                </div>
                <div className={Styles["wallet__change-info"]}>
                  <h3 className={Styles["wallet__change-title"]}>
                    DAK Token (P)
                  </h3>
                  <p className={Styles["wallet__change-count"]}>11000P</p>
                </div>
              </div>
              <button className={Styles["wallet__change-btn"]}>
                {content && content.wallet_change_money_page_button_confirm}
              </button>
            </div>

            {/* Stake */}
            <div
              className={`${Styles["wallet__body"]} ${Styles["stake"]} ${
                toggleState === 4 ? Styles["show"] : ""
              }`}
            >
              <div className={Styles["wallet__stake-left-icon"]}>
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
              <div className={Styles["wallet__stake"]}>
                <ul className={Styles["wallet__stake-list"]}>
                  <li className={Styles["wallet__stake-item"]}>
                    <label className={Styles["wallet__stake-title"]}>
                      {content && content.wallet_stake_page_asset}
                    </label>
                    <select
                      className={Styles["wallet__stake-select"]}
                      name="StakeCategory"
                    >
                      <option
                        className={Styles["wallet__stake-option"]}
                        value="0"
                      >
                        {content && content.wallet_main_page_property_types}...
                      </option>
                      <option
                        className={Styles["wallet__stake-option"]}
                        value="1"
                      >
                        Tether (USDT)
                      </option>
                      <option
                        className={Styles["wallet__stake-option"]}
                        value="2"
                      >
                        USD Coin (USDC)
                      </option>
                      <option
                        className={Styles["wallet__stake-option"]}
                        value="3"
                      >
                        Biance USD (BUSD)
                      </option>
                      <option
                        className={Styles["wallet__stake-option"]}
                        value="4"
                      >
                        Etherum (ETH)
                      </option>
                      <option
                        className={Styles["wallet__stake-option"]}
                        value="5"
                      >
                        BNB (BNB)
                      </option>
                      <option
                        className={Styles["wallet__stake-option"]}
                        value="6"
                      >
                        TRON (TRX)
                      </option>
                    </select>
                  </li>
                  <li className={Styles["wallet__stake-item"]}>
                    <label className={Styles["wallet__stake-title"]}>
                      {content && content.wallet_stake_page_amount}
                    </label>
                    <input
                      type="text"
                      placeholder={
                        content && content.wallet_stake_page_amount_place
                      }
                      className={Styles["wallet__stake-input"]}
                    />
                  </li>
                  <li className={Styles["wallet__stake-item"]}>
                    <label className={Styles["wallet__stake-title"]}>
                      {content && content.wallet_stake_page_period}
                    </label>
                    <select
                      className={Styles["wallet__stake-select"]}
                      name="StakePeriod"
                    >
                      <option
                        className={Styles["wallet__stake-option"]}
                        value="0"
                      >
                        {content && content.wallet_stake_page_choose_a_period}
                      </option>
                      <option
                        className={Styles["wallet__stake-option"]}
                        value="1"
                      >
                        3 {content && content.wallet_stake_page_month}
                      </option>
                      <option
                        className={Styles["wallet__stake-option"]}
                        value="2"
                      >
                        6 {content && content.wallet_stake_page_month}
                      </option>
                      <option
                        className={Styles["wallet__stake-option"]}
                        value="3"
                      >
                        9 {content && content.wallet_stake_page_month}
                      </option>
                      <option
                        className={Styles["wallet__stake-option"]}
                        value="4"
                      >
                        12 {content && content.wallet_stake_page_month}
                      </option>
                      <option
                        className={Styles["wallet__stake-option"]}
                        value="5"
                      >
                        18 {content && content.wallet_stake_page_month}
                      </option>
                      <option
                        className={Styles["wallet__stake-option"]}
                        value="6"
                      >
                        24 {content && content.wallet_stake_page_month}
                      </option>
                      <option
                        className={Styles["wallet__stake-option"]}
                        value="7"
                      >
                        36 {content && content.wallet_stake_page_month}
                      </option>
                    </select>
                  </li>
                </ul>
                <ul className={Styles["wallet__stake-rate-list"]}>
                  <li className={Styles["wallet__stake-rate-item"]}>
                    <p className={Styles["wallet__stake-rate-title"]}>
                      {content && content.wallet_stake_page_interest_rates_year}
                    </p>
                    <p className={Styles["wallet__stake-rate-count"]}>6.02%</p>
                  </li>
                  <li className={Styles["wallet__stake-rate-item"]}>
                    <p className={Styles["wallet__stake-rate-title"]}>
                      {content && content.wallet_stake_page_expectedly}
                    </p>
                    <p className={Styles["wallet__stake-rate-count"]}>34.56T</p>
                  </li>
                </ul>
              </div>
              <button
                className={Styles["wallet__stake-btn"]}
                onClick={() => setShowPopupStake(!showPopupStake)}
              >
                {content && content.wallet_stake_page_button_stake}
              </button>
            </div>
            {showPopupStake && (
              <PopupStake
                handleClick={() => setShowPopupStake(!showPopupStake)}
                setShowPopupStake={setShowPopupStake}
                language={language}
              />
            )}

            {/* Lịch sử giao dịch */}
            <WalletTransaction { ... { 
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
              } }/>
              
            {/* QR Scanner*/}
            <div
              className={`${Styles["wallet__body"]} ${Styles["table"]} ${
                toggleState === 6 ? Styles["show"] : ""
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
              {toggleState === 6 && 
                  <QrReader
                    onResult={(result, error) => {
                    if (!!result) {
                    setData(result?.text);
                    setShowPopupSend(!showPopupSend)
                    }
                    if (!!error) {
                    console.info(error);
                    }
                  }}
                    style={{ width: '100%' }}
              />}
              {showPopupSend && (
                      <PopupSendMoney
                        handleClick={() => setShowPopupSend(!showPopupSend)}
                        handleIsTransfer={handleIsTransfer}
                        setShowPopupSend={setShowPopupSend}
                        setWalletPoint={setWalletPoint}
                        language={language}
                        dataScan={data}
                        qrValue={qrValue}
                      />
                    )}
              
            </div>
          </div>
        </Layout>
      </>
    );
}

export function StakItem( { transaction, content } ) {
  return (
    <>
      <li className={Styles["wallet__body-item"]}>
        <div className={Styles["wallet__body-avatar"]}>
          <Image src={Coin} alt="ImageCoin" />
        </div>
        <div className={Styles["wallet__body-info"]}>
          <p className={Styles["wallet__body-info-name"]}>DAK Point</p>
          <div className={Styles["wallet__body-user-count"]}>
            <p className={Styles["wallet__body-info-user"]}>
              {
                transaction.direction === 'send' && transaction.transition.type === 'ticket' ? 
                transaction.user.name + ' ' +content.buy_ticket :
                transaction.direction === 'send' && transaction.transition.type === 'lottery-reward' ?
                transaction.user.name + ' ' + content.won_lottery :
                transaction.direction === 'send' ?
                content.wallet_send + ' ' + transaction.user.name :
                content.wallet_receive + ' ' + transaction.user.name
              }
            </p>
            <p className={Styles["wallet__body-info-count"]}>
              {
                transaction.direction === 'send' && transaction.transition.type === 'lottery-reward' ?
                `+${transaction.transition.amount} P`: 
                  transaction.direction === 'send' ? 
                    `-${transaction.transition.amount} P`:
                    `+${transaction.transition.amount} P`
              }
            </p>
          </div>
        </div>
        <p className={Styles["wallet__body-day"]}>{formatDate(transaction.transition.created_at)}</p>
      </li>
    </>
  );
}
