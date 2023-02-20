import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaAngleLeft, FaAngleRight, FaRegTimesCircle } from "react-icons/fa";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../../modules/Notification/Notification";
import { Transfer } from "../../../modules/Wallet/Transfer/transfer";
import Avatar from "../../../public/images/dak.png";
import Styles from "./PopupReceivedTransferMoney.module.css";
import API, { endpoints, headers } from "../../../API";
import formatDate from "../../../modules/Time/formatDate";
import PopupReceived from "../PopupReceived/PopupReceived";
import PopupSent from "../PopupSent/PopupSent";

export default function PopupReceivedTransferMoney({
  language,
  handleClick,
  setShowPopupReceivedTransferMoney,
  setWalletPoint,
  value,
  walletPoint,
  handleIsTransfer
}) {

  const [showPopup, setShowPopup] = useState(1);
  const popupSend = useRef();

  const [moneySend, setMoneySend] = useState(0);
  const [receiverAddress, setReceiverAddress] = useState("");
  const [receiverName, setReceiverName] = useState([]);

  const [warning, setWarning] = useState(false);
  const [content, setContent] = useState("");
  const [notify, setNotify] = useState(false);

  const [contentLanguage, setContentLanguage] = useState();

  const [listUser, setListUser] = useState([]);
  const [checkAccept, setCheckAccept] = useState(false);

  useEffect(() => {
    setContentLanguage(require(`./languages/${language}.json`));
  }, [language]);

  const closePopupSend = (e) => {
    if (popupSend.current === e.target) {
      setShowPopupReceivedTransferMoney(false);
      setMoneySend(0);
      setReceiverAddress("");
      setContent("");
    }
  };

  const handleCheckAccept = () => setCheckAccept(!checkAccept)

  useEffect(() => {
    if (value === "send") {
      API.get(endpoints["transferRequest"](value, 10000), {
        headers: headers.headers_token,
      })
        .then((res) => {
          console.log(res.data.data);
          if (res.data.success) {
            setListUser(res.data.data.data);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      API.get(endpoints["transferRequest"](value, 10000), {
        headers: headers.headers_token,
      })
        .then((res) => {
          if (res.data.success) {
            setListUser(res.data.data.data);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [value, checkAccept]);

  const handleChangeMoney = (e) => {
    setMoneySend(e.target.value);
  };

  const handleChangeAddress = (e) => {
    setReceiverAddress(e.target.value);
  };

  const handleChangeContent = (e) => {
    setContent(e.target.value);
  };

  const confirmSendMoney = () => {
    setNotify(true);
    let amount = moneySend;
    Transfer({
      wallet_address: receiverAddress,
      amount: amount,
      note: content,
    })
      .then((res) => {
        setWalletPoint((prev) => prev - Number(amount));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const checkReceiver = () => {
    if (!receiverAddress) {
      ErrorNotification("Chưa nhập địa chỉ người nhận!");
      return;
    }
    if (moneySend) {
      API.get(endpoints.getUserByWalletToken(receiverAddress), {
        headers: headers.headers_token,
      })
        .then((response) => {
          if (response.data.success) {
            setReceiverName(response.data.data);
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
      ErrorNotification("Chưa nhập số tiền cần chuyển!");
    }
  };

  function setStatus (id, status) {
    if(value === "received"){
      setListUser(prev => {
        prev.map((p,  index) => {
          if(p.id == id){
            prev[index].status = status
          }
        })

        return [...prev]
      })
    }
  }
  return (
    <>
      <div
        className={Styles["overlayPopupSend"]}
        ref={popupSend}
        onClick={closePopupSend}
      >
        {value === "received" ? (
          <div className={Styles["send"]}>
            <div className={Styles["send__heading"]}>
              <h3 className={Styles["send__title"]}>
                {contentLanguage && contentLanguage.popup_receive_money_title}
              </h3>
              <FaRegTimesCircle
                className={Styles["send__icon-close"]}
                onClick={handleClick}
              />
            </div>
            <div className={Styles["post"]}>
              {listUser &&
                listUser.map((user, index) => (
                  <PopupReceived
                    key={index}
                    user={user}
                    index={index}
                    setStatus={setStatus}
                    handleCheckAccept={handleCheckAccept}
                    walletPoint={walletPoint}
                    handleIsTransfer={handleIsTransfer}
                  />
                ))}
            </div>
          </div>
        ) : (
          <div className={Styles["send"]}>
            <div className={Styles["send__heading"]}>
              <h3 className={Styles["send__title"]}>
                {contentLanguage && contentLanguage.popup_send_money_title}
              </h3>
              <FaRegTimesCircle
                className={Styles["send__icon-close"]}
                onClick={handleClick}
              />
            </div>
            <div className={Styles["post"]}>
              {listUser &&
                listUser.map((user, index) => (
                  <PopupSent key={index} user={user} index={index} />
                ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
