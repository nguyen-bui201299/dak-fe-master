import { useState, useEffect } from "react";
import API, { endpoints, headers } from "../../../API";
import Button from "./Button.module.css";
import { ToastContainer } from "react-toastify";
import { NotificationToast, SuccessNotification, WarnNotification } from "../../../modules/Notification/Notification";

const ButtonAgreedOrDenied = (props) => {
  const [show, setShow] = useState(false);
  const [hidden, setHidden] = useState(false);
  console.log(props);
  const handleReponsePostGroup = (action) => {
    API.post(endpoints.responsePostReview(props.idGroup, props.post_id, action), {}, { headers: headers.headers_token })
      .then(res => {
        if (res.data.success) {
          const temp = props.postReviewInfo.filter(item => item.post.id !== props.post_id)
          props.setListPostReview(temp)
          // SuccessNotification(res.data.message)
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
          console.log(res);

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
          onClick={() => handleReponsePostGroup("1")}
        >
          Phê duyệt
        </button>
      )}
      {/* {show && <p>This is your component</p>} */}
      {!hidden && (
        <button
          className={Button.Denied}
          onClick={() => handleReponsePostGroup("2")}
        >
          Từ chối
        </button>
      )}
    </>
  );
};

export default ButtonAgreedOrDenied;
