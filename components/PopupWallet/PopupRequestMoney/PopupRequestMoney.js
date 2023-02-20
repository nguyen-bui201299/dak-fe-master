import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaAngleLeft, FaAngleRight, FaRegTimesCircle } from "react-icons/fa";
import { NotificationToast } from "../../../modules/Notification/Notification";
import Avatar from "../../../public/images/dak.png";
import Styles from "./PopupRequestMoney.module.css";
import API, { endpoints, headers } from "../../../API";
import { Request } from "../../../modules/Wallet/Transfer/request";
import useDebounce from "../../../modules/Debounce/useDebounce";

export default function PopupRequestMoney({
  language,
  handleClick,
  setShowPopupRequest,
  setWalletPoint,
}) {
  // test-render-web
  useEffect(() => {
    console.log("render PopupRequestMoney");
  }, []);

  const [showPopup, setShowPopup] = useState(1);
  const popupRequest = useRef();

  const [moneyReceiver, setMoneyReceiver] = useState();
  const [senderAddress, setSenderAddress] = useState("");
  const [senderName, setSenderName] = useState([]);

  const [warning, setWarning] = useState(false);
  const [warningNote, setWarningNote] = useState(false);

  const [content, setContent] = useState();
  const [notify, setNotify] = useState(false);
  const [searchAddress, setSearchAddress] = useState()
  const [showBoxSearch, setShowBoxSearch] = useState(false)

  const [contentLanguage, setContentLanguage] = useState();

  useEffect(() => {
    setContentLanguage(require(`./languages/${language}.json`));
  }, [language]);

  const closePopupRequest = (e) => {
    if (popupRequest.current === e.target) {
      setShowPopupRequest(false);
      setMoneyReceiver(0);
      setSenderAddress("");
      setContent("");
    }
  };

  const debounced = useDebounce(senderAddress, 1000);
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

  const handleSearch = (e, item) => {
    setShowBoxSearch(false)
    setSenderAddress(item?.user.name)
    setSearchAddress(item?.user.wallet_address)
  }

  const handleChangeMoney = (e) => {
    setMoneyReceiver(e.target.value);
  };

  const handleChangeAddress = (e) => {
    setShowBoxSearch(true)
    setSenderAddress(e.target.value)
    setSearchAddress(e.target.value)
  };

  const handleChangeContent = (e) => {
    setContent(e.target.value);
  };

  const confirmRequestMoney = () => {
    setNotify(true);
    let amount = moneyReceiver;
    // let typeWallet
    // if(searchAddress.length > 30 && !searchAddress.includes('-')) {
    //   typeWallet = 'wallet_address'
    // } else if (searchAddress.includes('@')) {
    //   typeWallet = 'email'
    // } else if(searchAddress.includes('0' || '1') && !searchAddress.includes('@') && !searchAddress.includes('-')) {
    //   typeWallet = 'phone_number'
    // } else if (searchAddress.length > 30 && searchAddress.includes('-')) {
    //   typeWallet= 'user_id'
    // }
    Request({
      // type: typeWallet,
      wallet_address: searchAddress,
      amount: Number(amount),
      note: content,
    })
      .then((res) => {
        // setWalletPoint((prev) => prev + Number(amount));
        NotificationToast.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `${contentLanguage.popup_request_amount_requestSuccess}`,
      })
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const checkSender = () => {
    if (!senderAddress) {
      NotificationToast.fire({
        toast: true,
        position: 'top-end',
        icon: 'warning',
        title: `${contentLanguage.popup_request_amount_errorSenderAddress}`,
    })
      return;
    }

    let res = /^[A-Za-z\d ]+$/.test(content)
    if(!res) {
      setWarningNote(true)
      return;
    }

    if (moneyReceiver) {
      API.get(endpoints.getUserByWalletToken(searchAddress), {
        headers: headers.headers_token,
      })
        .then((response) => {
          if (response.data.success) {
            setSenderName(response.data.data);
            setShowPopup(2);
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
        title: `${contentLanguage.popup_request_amount_errorAmount}`,
    })
    }
  };

  const hideToken = (token) => {
    return `${token.slice(0, 6)} ... ${token.slice(-5)}`;
  };

  const handleConfirmRequestMoney = () => {
    confirmRequestMoney();
    handleClick();
  };

  return (
    <>
      <div
        className={Styles["overlayPopupRequest"]}
        ref={popupRequest}
        onClick={closePopupRequest}
      >
        <div className={Styles["request"]}>
          <div className={Styles["request__heading"]}>
            <h3 className={Styles["request__title"]}>
              {contentLanguage && contentLanguage.popup_request_money_title}
            </h3>
            <FaRegTimesCircle
              className={Styles["request__icon-close"]}
              onClick={handleClick}
            />
          </div>
          {showPopup === 1 && (
            <div className={Styles["request__body"]}>
              <div className={Styles["request__body-form"]}>
                <label className={Styles["request__body-form-title"]}>
                  {contentLanguage &&
                    contentLanguage.popup_request_amount_to_receive}
                </label>
                <input
                  className={`${Styles["request__body-form-input"]} ${Styles["request-body-form-type-number"]}`}
                  type="number"
                  placeholder={
                    contentLanguage &&
                    contentLanguage.popup_request_amount_to_receive
                  }
                  onChange={handleChangeMoney}
                  value={moneyReceiver}
                />
                <span className={Styles["request__body-form-input-name"]}>
                  DAK Point
                </span>
              </div>
              <div className={Styles["request__body-form"]}>
                <label className={Styles["request__body-form-title"]}>
                  {contentLanguage &&
                    contentLanguage.popup_request_sender_wallet_address}
                </label>
                <input
                  className={Styles["request__body-form-input"]}
                  type="text"
                  placeholder={
                    contentLanguage &&
                    contentLanguage.popup_request_sender_wallet_address_placeholder
                  }
                  onChange={handleChangeAddress}
                  value={senderAddress}
                />
                {warning && (
                  <p className={Styles["request__body-form-warning"]}>
                    {contentLanguage &&
                      contentLanguage.popup_request_money_warning_address}
                  </p>
                )}

{
                  showBoxSearch && senderAddress !== '' && senderAddress !== searchAddress.includes('0') && senderAddress.length < 30 &&
                  <ul className={Styles.request__body__search}>
                    {senderAddress !== '' && listFriend?.map((item) => (
                      <li onClick={(e) => handleSearch(e, item)} key={item.user.id} > 
                      <span> <img src={item.user.avatar} alt="avatar" /> </span> <span>{item.user.name}</span> 
                      </li>
                    ))}
                  </ul>
                }
              </div>
              <div className={Styles["request__body-form"]}>
                <label className={Styles["request__body-form-title"]}>
                  {contentLanguage &&
                    contentLanguage.popup_request_money_content}
                </label>
                <input
                  className={Styles["request__body-form-input"]}
                  type="text"
                  placeholder={
                    contentLanguage &&
                    contentLanguage.popup_request_money_content_placeholder
                  }
                  onChange={handleChangeContent}
                />
                 {warningNote && (
                  <p className={Styles["request__body-form-warning"]}>
                    {contentLanguage &&  contentLanguage.popup_request_money_warning_note}
                  </p>
                )}
              </div>
              <button
                className={Styles["btn-submit"]}
                onClick={() => {
                  checkSender();
                }}
              >
                {contentLanguage &&
                  contentLanguage.popup_request_money_button_next}
                <FaAngleRight className={Styles["btn-icon"]} />
              </button>
            </div>
          )}
          {showPopup === 2 && (
            <div className={Styles["request__body"]}>
              <div className={Styles["request__body-title-box"]}>
                <FaAngleLeft
                  className={Styles["request__body-title-icon"]}
                  onClick={() => setShowPopup(1)}
                />
                <p className={Styles["request__body-title"]}>
                  {contentLanguage &&
                    contentLanguage.popup_request_confirm_sending_request}
                </p>
              </div>
              <div className={Styles["request__body-form"]}>
                <label className={Styles["request__body-form-title"]}>
                  {contentLanguage &&
                    contentLanguage.popup_request_amount_to_transfer}
                </label>
                <input
                  className={Styles["request__body-form-input"]}
                  type="number"
                  disabled
                  value={moneyReceiver}
                />
                <span className={Styles["request__body-form-input-name"]}>
                  DAK Point
                </span>
              </div>
              <div className={Styles["request__body-form"]}>
                <label className={Styles["request__body-form-title"]}>
                  {contentLanguage &&
                    contentLanguage.popup_request_sender_wallet_address}
                </label>
                <input
                  className={Styles["request__body-form-input"]}
                  type="text"
                  disabled
                  value={hideToken(searchAddress)}
                />
              </div>
              <div className={Styles["request__body-form"]}>
                <label className={Styles["request__body-form-title"]}>
                  {contentLanguage &&
                    contentLanguage.popup_request_money_senders_name}
                </label>
                <input
                  className={Styles["request__body-form-input"]}
                  type="text"
                  disabled
                  value={senderName.name}
                />
              </div>
              <div className={Styles["request__body-form"]}>
                <label className={Styles["request__body-form-title"]}>
                  {contentLanguage &&
                    contentLanguage.popup_request_money_content}
                </label>
                <input
                  className={Styles["request__body-form-input"]}
                  type="text"
                  placeholder={
                    contentLanguage &&
                    contentLanguage.popup_request_money_content_placeholder
                  }
                  value={content}
                />
              </div>
              <button
                className={Styles["btn-submit"]}
                onClick={handleConfirmRequestMoney}
              >
                {contentLanguage && contentLanguage.popup_request_money_confirm}
              </button>
              {notify ? (
                <div className="notifyRequestSuccess">
                  <span className={Styles["textSuccess"]}>
                    {contentLanguage &&
                      contentLanguage.popup_request_money_success_text}
                  </span>
                </div>
              ) : null}
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
      <li className={Styles["request__body-item"]}>
        <div className={Styles["request__body-item-avatar"]}>
          <Image src={Avatar} alt="Avatar" />
        </div>
        <h2 className={Styles["request__body-item-name"]}>Nguyễn Văn A</h2>
        <div className={Styles["request__body-item-btn"]}>Yêu cầu</div>
      </li>
    </>
  );
}
