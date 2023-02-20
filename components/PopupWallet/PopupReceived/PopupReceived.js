import API, { endpoints, headers } from "../../../API";
import { useEffect, useState } from "react";
import Styles from "./PopupReceived.module.css";
import formatDate from "../../../modules/Time/formatDate";
import PopupAcceptTransferRequest from "../PopupAcceptTransferRequest/PopupAcceptTransferRequest";
import PopupCancelTransferRequest from "../PopupCancelTransferRequest/PopupCancelTransferRequest";
import { NotificationToast } from "../../../modules/Notification/Notification";
import { getCookieUserLogin } from "../../../modules/Cookies/Auth/userLogin";

export default function PopupReceived({user, index, setStatus, handleCheckAccept, walletPoint, handleIsTransfer}) {
  const [senderAvatar, setSenderAvatar] = useState("");
  const [senderName, setSenderName] = useState("");
  const [showPopupAccept, setShowPopupAccept] = useState(false);
  const [showPopupCancel, setShowPopupCancel] = useState(false);
  const [rid, setRId] = useState("");
  const [value, setValue] = useState("");


  const userLogin = getCookieUserLogin();


    const [content, setContent] = useState({});

    useEffect(() => {
    if (userLogin.language !== undefined) {
        setContent(require(`./languages/${userLogin.language}.json`));
    } else {
        setContent(require(`./languages/en.json`));
    }
    }, [userLogin])

  useEffect(
    () => {
      API.get(endpoints["getDetailProfile"](user.user_id_send), {
        headers: headers.headers_token,
      }).then((res) => {
        if (res.data.success) {
          setSenderAvatar(res.data.data.avatar);
          setSenderName(res.data.data.name);
        }
      });
    },
    [user]
  );

  const handleCheckRequest = (value, id) => {
    if(value === 1) {
      if(user.dak_point > walletPoint) {
        NotificationToast.fire({
          toast: true,
          position: 'top-end',
          icon: 'warning',
          title: `${content.not_enought_point}`,
      })
      return;
      }
      setShowPopupAccept(true);
      setRId(id);
      setValue(value)
    }
    if(value === 0) {
      setShowPopupCancel(true);
      setRId(id);
      setValue(value)
    }
  };

  const handleConfirmRequest = (id, value) => {
    API.put(endpoints["verifyTransferRequest"], {transfer_request_id: id, status: value}, {headers: headers.headers_token})
      .then(res => {
        if(res.data.success) {
          setShowPopupAccept(false)
          setShowPopupCancel(false)
          setStatus(id, res.data?.data?.data?.status)
          handleCheckAccept()
          handleIsTransfer()
          if(res.data.data.data.status === 1) {
            NotificationToast.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: `${content.success}`,
            })
          } else {
            NotificationToast.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: `${content.fail}`,
            })
          }
        }
      })
      .catch(err => {})
  };

  const a_cancel = () => {
    setShowPopupAccept(false)
  }

  const c_cancel = () => {
    setShowPopupCancel(false)
  }


  return (
    <>
      {showPopupAccept && (
        <PopupAcceptTransferRequest handleConfirmRequest={handleConfirmRequest} cancel={a_cancel} id={rid} value={value} />
      )}
      {showPopupCancel && (
        <PopupCancelTransferRequest handleConfirmRequest={handleConfirmRequest} cancel={c_cancel} id={rid} value={value}/>
      )}
      <div className={Styles["sender"]}>
        <div className={Styles["avatar"]}>
          <img
            key={index}
            src={senderAvatar}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          ></img>
        </div>
        <div className={Styles["content"]}>
          <div className={Styles["sender-info"]}>
            <h3 className={Styles["sender-name"]}>{senderName}</h3>
            <div className={Styles["send-date-status"]}>
              <div className={Styles["send-date"]}>
                {formatDate(user.created_at)}
              </div>
              <div className={Styles["send-status"]}>
                {/* status === 1  accept || === 0  deny || === 2 pending*/}
              {user.status === 1 || user.status === 0
                ? 
                <>
                {user.status === 1 
                ? 
                  <div className={Styles["request-accepted"]}>
                    {content.accepted}
                  </div>
                :
                  <div className={Styles["request-canceled"]}>
                    {content.canceled}
                  </div>
                }
                </>
                :
                <>
                  <button
                      className={Styles["request-accept-btn"]}
                      value={1}
                      onClick={(e) => handleCheckRequest(Number(e.target.value), user.id)}
                  >
                      {content.accept}
                  </button>

                  <button
                    className={Styles["request-cancel-btn"]}
                    value={0}
                    onClick={(e) => handleCheckRequest(Number(e.target.value), user.id)}  
                  >
                    {content.cancel}
                  </button>
                </>
                }
            </div>
              
            </div>
          </div>
          <div className={Styles["send-content"]}>
            <div className={Styles["send-note"]}>{user.note}</div>
            <div className={Styles["send-point"]}>
              <span>{user.dak_point}</span> DAK points
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
