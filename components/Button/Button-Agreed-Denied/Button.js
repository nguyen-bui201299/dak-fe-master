import { useState, useEffect } from "react";
import API, { endpoints, headers } from "../../../API";
import Button from "./Button.module.css";
import { ToastContainer } from "react-toastify";
import { NotificationToast, SuccessNotification, WarnNotification } from "../../../modules/Notification/Notification";

const ButtonAgreedOrDenied = (props) => {
  const [show, setShow] = useState(false);
  const [hidden, setHidden] = useState(false);
  const handleReponseInviteGroup = (action) => {
    API.post(endpoints.responseInviteGroup(props.idGroup, props.req_id, action), {}, { headers: headers.headers_token })
      .then(res => {
        if (res.data.success) {
          const temp = props.listReqJoin.filter(item => item.Join_request.id !== props.req_id)
          props.setListReqJoin(temp)
          NotificationToast.fire({
            toast: true,
            position: 'top-right',
            icon: 'success',
            title: `${res.data.message}`,
          })
        }else{
          NotificationToast.fire({
            toast: true,
            position: 'top-right',
            icon: 'warning',
            title: `${res.data.message}`,
          })
        }
      })
      .catch(err => {})
  }
  return (
    <>
      {/* <ToastContainer /> */}
      {!hidden && (
        <button
          className={Button.Agreed}
          onClick={() => handleReponseInviteGroup("accept")}
        >
          Phê duyệt
        </button>
      )}
      {/* {show && <p>This is your component</p>} */}
      {!hidden && (
        <button
          className={Button.Denied}
          onClick={() => handleReponseInviteGroup("deny")}
        >
          Từ chối
        </button>
      )}
    </>
  );
};

export default ButtonAgreedOrDenied;
