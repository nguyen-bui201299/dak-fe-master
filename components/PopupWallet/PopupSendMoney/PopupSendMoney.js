import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaAngleLeft, FaAngleRight, FaRegTimesCircle } from "react-icons/fa";
import { ErrorNotification, NotificationToast, SuccessNotification, WarnNotification } from "../../../modules/Notification/Notification";
import { Transfer } from "../../../modules/Wallet/Transfer/transfer";
import Avatar from "../../../public/images/dak.png";
import Styles from "./PopupSendMoney.module.css";
import API, { endpoints, headers, transfer } from "../../../API";
import useDebounce from "../../../modules/Debounce/useDebounce";
import io from "socket.io-client";
import { getCookieRefreshToken, getCookieXSRFToken, getTokenUserLogin } from '../../../modules/Cookies/Auth/userLogin';



export default function PopupSendMoney({
  language,
  handleClick,
  setShowPopupSend,
  setWalletPoint,
  walletPoint,
  handleIsTransfer,
  dataScan,
  qrValue,
}) {

  const [showPopup, setShowPopup] = useState(1);
  const popupSend = useRef(); 

  const [moneySend, setMoneySend] = useState();
  const [receiverAddress, setReceiverAddress] = useState(dataScan);
  const [receiverName, setReceiverName] = useState([]); 

  const [warning, setWarning] = useState(false);
  const [warningPoint, setWarningPoint] = useState(false);
  const [warningAddress, setWarningAddress] = useState(false);
  const [warningNote, setWarningNote] = useState(false);

  const [content, setContent] = useState("");
  const [notify, setNotify] = useState(false);
  const [searchAddress, setSearchAddress] = useState()
  const [showBoxSearch, setShowBoxSearch] = useState(false)

  const [contentLanguage, setContentLanguage] = useState();

  const [loadingVerifyEmail, setLoadingVerifyEmail] = useState(false)

  const [loadingConfirmSend, setLoadingConfirmSend] = useState(false)


  const [publicKey, setPublicKey] = useState()
    
  useEffect(() => {
    setContentLanguage(require(`./languages/${language}.json`));
  }, [language])

  const debounced = useDebounce(receiverAddress, 1000);
  const [listFriend, setListFriend] = useState()
  useEffect(() => {
    const handleSearch = async () => {
      const res = await API.get(endpoints.findFriends(100, 1, debounced), {
        headers: headers.headers_token,
      });
      if (res.data.success) {
        if (res.data.data.length > 0) {
          setListFriend(res.data.data);
        }
      } else {
        NotificationToast.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: `${"Error"}`,
      })
      }

    };
    handleSearch();
  }, [debounced]);

  const closePopupSend = (e) => {
    if (popupSend.current === e.target) {
      setShowPopupSend(false);
      setMoneySend(0);
      setReceiverAddress("");
      setContent("");
    }
  };

  const handleSearch = (e, item) => {
    setShowBoxSearch(false)
    setReceiverAddress(item?.user.name)
    setSearchAddress(item?.user.wallet_address)
  }

  const handleChangeMoney = (e) => {
    setMoneySend(e.target.value);
  };

  const handleChangeAddress = (e) => {
    setShowBoxSearch(true)
    setSearchAddress(e.target.value)
    setReceiverAddress(e.target.value)
    // if(e.target.value?.length > 30 || e.target.value.includes('@') || e.target.value.includes('0' || '1') ) {
    //   setSearchAddress(e.target.value)
    // } else {
    //   setReceiverAddress(e.target.value)
    // }
  };

  const handleChangeContent = (e) => {
    setContent(e.target.value);
  };

  const confirmSendMoney = () => {
    setLoadingConfirmSend(true)
    setNotify(true);
    let amount = moneySend;
    let typeWallet
    if(searchAddress.length > 30 && !searchAddress.includes('-')) {
      typeWallet = 'wallet_address'
    } else if (searchAddress.includes('@')) {
      typeWallet = 'email'
    } else if(searchAddress.includes('0' || '1') && !searchAddress.includes('@') && !searchAddress.includes('-')) {
      typeWallet = 'phone_number'
    } else if (searchAddress.length > 30 && searchAddress.includes('-')) {
      typeWallet= 'user_id'
    }

    // setDataTransactionRaw({
    //   type: typeWallet,
    //   wallet_indentifier: searchAddress,
    //   amount: Number(amount),
    //   note: content,
    // })
  
    Transfer({
      type: typeWallet,
      wallet_indentifier: searchAddress,
      amount: Number(amount),
      note: content,
    }, {publicKey: publicKey,})
      .then((res) => {
        setWalletPoint((prev) => prev - Number(amount));
        NotificationToast.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `${contentLanguage.popup_send_money_sendSuccess}`,
        })
        finishTranfer();

      })
      .catch((err) => {
        console.log(err);
        NotificationToast.fire({
          toast: true,
          position: 'top-end',
          icon: 'warning',
          title: `${contentLanguage.popup_send_money_sendFailure}`,
      })
      });
  };

  const checkReceiver = () => {
    if(!searchAddress) {
      NotificationToast.fire({
        toast: true,
        position: 'top-end',
        icon: 'warning',
        title: `${contentLanguage.libraryAlbum_select_album}`,
    })
      return;
    }
    let res = /^[A-Za-z\d ]+$/.test(content)
    if(!res) {
      setWarningNote(true)
      return;
    }

    if(moneySend > walletPoint) {
      setWarningPoint(true);
      return;
    }
    if(qrValue === searchAddress) {
      setWarningAddress(true);
      return;
    }
    if(moneySend){
      API.get(endpoints.getUserByWalletToken(searchAddress), {
        headers: headers.headers_token,
      })
        .then((response) => {
          if (response.data.success) {
            setReceiverName(response.data.data);
            // setShowPopup(2);
            handleConfirmEmail()
            setWarning(false);
          } else {
            setWarning(true);
          }
        })
        .catch((error) => {
            console.log(error);
        });
    } else {
      NotificationToast.fire({
        toast: true,
        position: 'top-end',
        icon: 'warning',
        title: `${contentLanguage.popup_send_money_errorAmount}`,
    })
    }
  };

  const handleConfirmEmail = () => {
    // checkReceiver()
    confirmEmailBeforeSending()
    setLoadingVerifyEmail(true)
    countDown()
    // setShowPopup(2);
  }

  const hideToken = (token) => {
    if(token?.length > 30 && !token?.includes('@') ) {
      return `${token?.slice(0, 6)} ... ${token?.slice(-5)}`;
    } else {
      return token
    }
  };

  const confirmEmailBeforeSending = () => {
    API.post(endpoints.sendEmailConfirmSending, {}, {
      headers: headers.headers_token,
    })
      .then((response) => {
        console.log(response)
        NotificationToast.fire({
          toast: true,
          position: 'top-end',
          icon: 'warning',
          title: `PLease cofirm transaction!`,
        })
      })
      .catch((error) => {
          console.log(error);

          NotificationToast.fire({
            toast: true,
            position: 'top-end',
            icon: 'warning',
            title: `Opp! Some things went wrong`,
          })

        setLoadingVerifyEmail(false)

      });
  }


  // const handleConfirmSendMoney = () => {
  //   confirmSendMoney()
    
  // }

  const finishTranfer = () => {
    setLoadingConfirmSend(false)
    handleClick()
    handleIsTransfer()
  }

  // const checkBeforeClick = () => {
  //   if(!moneySend && !receiverAddress) {

  //   }
  // }



  const socket = io.connect(
    "wss://beta.dakshow.com", {
    transports: ["websocket"],
    auth: {
      token: getTokenUserLogin(),
      xsrf_token: getCookieXSRFToken(),
      refresh_token: getCookieRefreshToken(),
    }
  })

  // console.log(socket);
  

  socket.on("VERIFY_WALLET_SUCCESS", (data, callback) => {
      console.log("data: ", data);

      if (!!data) {
        setLoadingVerifyEmail(false)
        setShowPopup(2);
        setPublicKey(data.public_key)
      }

      callback({
          status: "ok"
      });
  })
  
  // const [countDown, setCountDown] = useState(Number(59));

  // const getTime = () => {
  //   setCountDown((countDown) => --countDown);
  // };

  // useEffect(() => {
  //   let timerID = setInterval(() => getTime(), 1000);

  //   return () => {
  //     clearInterval(timerID);
  //   };
  // }, []);

  const [number, setNumber] = useState()
  let seconds = 59;
  const countDown = () => {
    const interval = setInterval(() => {
      setNumber(seconds--)
      if (seconds === 0) {
        API.delete(endpoints.closeSectionConfirmEmail, {
          headers: headers.headers_token,
        })
          .then((response) => {
            console.log(response)
            setLoadingVerifyEmail(false)
            NotificationToast.fire({
              toast: true,
              position: 'top-end',
              icon: 'warning',
              title: `Time Out! Cancel Transaction`,
            })
            
            
          })
          .catch((error) => {
              console.log(error);
    
              NotificationToast.fire({
                toast: true,
                position: 'top-end',
                icon: 'warning',
                title: `Opp! Some things went wrong`,
              })
          });
      } else if (seconds < 0) {
        clearInterval(interval);
        setNumber(59)
      } 
    }, 1000);
  }

  
  
  return (
    <>
      {loadingVerifyEmail && <div
          className={Styles["overlayPopupSend"]}
          style={{zIndex: "1000"}}
          >
          <div className={Styles["containerspin"]}>
            <div className={`${Styles.dash} ${Styles.uno}`}></div>
            <div className={`${Styles.dash} ${Styles.dos}`}></div>
            <div className={`${Styles.dash} ${Styles.tres}`}></div>
            <div className={`${Styles.dash} ${Styles.cuatro}`}></div>
          </div>
          <div style={{
              color: "white", 
              fontSize: "100px", 
              paddingLeft: "calc(50% - 50px)", 
              paddingTop: "150px"}}
              >
                {number < 10 ? (`0${number}`) : (`${number}`)}
              </div>
        </div>}
      <div
        className={Styles["overlayPopupSend"]}
        ref={popupSend}
        onClick={closePopupSend}
      >
        <div className={Styles["send"]}>
          <div className={Styles["send__heading"]}>
            <h3 className={Styles["send__title"]}>
            {contentLanguage &&  contentLanguage.popup_send_money_title }
            </h3>
            <FaRegTimesCircle
              className={Styles["send__icon-close"]}
              onClick={handleClick}
            />
          </div>
          {showPopup === 1 && (
            <div className={Styles["send__body"]}>
              <div className={Styles["send__body-form"]}>
                <label className={Styles["send__body-form-title"]}>
                {contentLanguage &&  contentLanguage .popup_send_money_amount_to_transfer }
                </label>
                <input
                  className={`${Styles["send__body-form-input"]} ${Styles["send-body-form-type-number"]}`}
                  type="number" 
                  value={moneySend}
                  placeholder={contentLanguage &&  contentLanguage .popup_send_money_amount_to_transfer }
                  onChange={ handleChangeMoney }
                />
                <span className={Styles["send__body-form-input-name"]}>
                  DAK Point
                </span>
              </div>
              {warningPoint && (
                  <p className={Styles["send__body-form-warning-point"]}>
                    {contentLanguage &&  contentLanguage.popup_send_money_warning_not_enough_point}
                  </p>
                )}
              
              <div className={Styles["send__body-form"]}>
                <label className={Styles["send__body-form-title"]}>
                {contentLanguage &&  contentLanguage .popup_send_money_recipient_wallet_address }
                </label>
                <input
                  className={Styles["send__body-form-input"]}
                  type="text"
                  value={receiverAddress}
                  placeholder={contentLanguage &&  contentLanguage .popup_send_money_recipient_wallet_address_placeholder }
                  onChange={handleChangeAddress}
                />
                {warning && (
                  <p className={Styles["send__body-form-warning"]}>
                    {contentLanguage &&  contentLanguage.popup_send_money_warning_address}
                  </p>
                )}

                {warningAddress && (
                  <p className={Styles["send__body-form-warning"]}>
                    {contentLanguage &&  contentLanguage.popup_send_money_warning_address}
                  </p>
                )}

                {
                  showBoxSearch && receiverAddress !== '' && receiverAddress !== searchAddress.includes('0') && receiverAddress.length < 30 &&
                  <ul className={Styles.send__body__search}>
                    {receiverAddress !== '' && listFriend?.map((item) => (
                      <li onClick={(e) => handleSearch(e, item)} key={item.user.id} > 
                      <span> <img src={item.user.avatar} alt="avatar" /> </span> <span>{item.user.name}</span> 
                      </li>
                    ))}
                  </ul>
                }
              </div>
              <div className={Styles["send__body-form"]}>
                <label className={Styles["send__body-form-title"]}>
                {contentLanguage &&  contentLanguage .popup_send_money_money_transfer_content }
                </label>
                <input
                  className={Styles["send__body-form-input"]}
                  type="text"
                  maxLength={120}
                  placeholder={contentLanguage &&  contentLanguage.popup_send_money_money_transfer_content_placeholder }
                  onChange={handleChangeContent}
                />
                {warningNote && (
                  <p className={Styles["send__body-form-warning"]}>
                    {contentLanguage &&  contentLanguage.popup_send_money_warning_note}
                  </p>
                )}
              </div>
              <button
                className={Styles["btn-submit"]}
                onClick={() => {
                  checkReceiver()
                  // handleConfirmEmail()
                }}
              >
                {contentLanguage &&  contentLanguage.popup_send_money_button_next}
                <FaAngleRight className={Styles["btn-icon"]} />
              </button>
            </div>
          )}
          {showPopup === 2 && (
            <div className={Styles["send__body"]}>
              <div className={Styles["send__body-title-box"]}>
                <FaAngleLeft
                  className={Styles["send__body-title-icon"]}
                  onClick={() => setShowPopup(1)}
                />
                <p className={Styles["send__body-title"]}>
                {contentLanguage &&  contentLanguage.popup_send_money_remittance_confirmation }
                </p>
              </div>
              <div className={Styles["send__body-form"]}>
                <label className={Styles["send__body-form-title"]}>
                  {contentLanguage &&  contentLanguage .popup_send_money_amount_to_transfer }
                </label>
                <input
                  className={Styles["send__body-form-input"]}
                  type="number"
                  disabled
                  value={moneySend}
                />
                <span className={Styles["send__body-form-input-name"]}>
                  DAK Point
                </span>
              </div>
              <div className={Styles["send__body-form"]}>
                <label className={Styles["send__body-form-title"]}>
                  {contentLanguage &&  contentLanguage.popup_send_money_recipient_wallet_address }
                </label>
                <input
                  className={Styles["send__body-form-input"]}
                  type="text"
                  disabled
                  value={hideToken(searchAddress)}
                />
              </div>
              <div className={Styles["send__body-form"]}>
                <label className={Styles["send__body-form-title"]}>
                  {contentLanguage &&  contentLanguage.popup_send_money_recipients_name }
                </label>
                <input
                  className={Styles["send__body-form-input"]}
                  type="text"
                  disabled
                  value={receiverName.name}
                />  
              </div>
              {/* <div className={Styles["send__body-form"]}>
                <label className={Styles["send__body-form-title"]}>
                  {contentLanguage &&  contentLanguage.popup_send_money_transaction_fee }
                </label>
                <select className={Styles["send__body-form-select"]}>
                  <option
                    className={Styles["send__body-form-option"]}
                    value="0"
                  >
                    {contentLanguage && contentLanguage.popup_send_money_the_sender_pays} (100P)
                  </option>
                  <option
                    className={Styles["send__body-form-option"]}
                    value="1"
                  >
                    {contentLanguage && contentLanguage.popup_send_money_recipient_pays} (100P)
                  </option>
                </select>
              </div> */}
              <div className={Styles["send__body-form"]}>
                <label className={Styles["send__body-form-title"]}>
                {contentLanguage && contentLanguage.popup_send_money_money_transfer_content}
                </label>
                <input
                  className={Styles["send__body-form-input"]}
                  type="text"
                  disabled
                  value={content}
                />
              </div>
              <div className={Styles["send__body-footer"]}>

                {loadingConfirmSend? (
                  <button className={Styles["btn-submit"]} disabled={true}>
                    <div className={Styles["lds-ellipsis"]}>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  </button>
                ) : (
                  <button
                    className={Styles["btn-submit"]}
                    onClick={
                      confirmSendMoney
                    }
                  >
                    {contentLanguage && contentLanguage.popup_send_money_confirm}
                  </button>
                )}
               
                {notify ? (
                  <div className="notifySendSuccess">
                    <span className={Styles["textSuccess"]}>
                      {contentLanguage && contentLanguage.popup_send_money_success_text}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export function BodyItem() {
  return (
    <>
      <li className={Styles["send__body-item"]}>
        <div className={Styles["send__body-item-avatar"]}>
          <Image src={Avatar} alt="Avatar" />
        </div>
        <h2 className={Styles["send__body-item-name"]}>Nguyễn Văn A</h2>
        <div className={Styles["send__body-item-btn"]}>Chuyển tiền</div>
      </li>
    </>
  );
}
