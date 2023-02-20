import styles from "../../Modal.module.css";
import { RiCloseLine, RiShieldUserFill, RiUserAddLine } from "react-icons/ri";
import Report from "../../Modal-Report/ModalReport.module.css";
import { FiUsers } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import API, { endpoints, headers } from "../../../../API";
import { NotificationToast } from "../../../../modules/Notification/Notification";
import { getCookieUserLogin } from "../../../../modules/Cookies/Auth/userLogin";

const Modal = ({ setIsOpenRole, userId, groupId }) => {
  const userLogin = getCookieUserLogin()

  const [content, setContent] = useState({});
  const [role, setRole] = useState({
    member: "",
    admin: "",
    censor: "",
  })

  useEffect(() => {
    if (userLogin.language !== undefined) {
      setContent(require(`../languages/${userLogin.language}.json`));
    } else {
      setContent(require(`../languages/en.json`));
    }
  }, [userLogin]);

  const getApiGrantPermission = (role, data) => {
    API.put(endpoints.grantPermission(groupId, role), 
      { "role": data },
      { headers: headers.headers_token },
    )
    .then(res => {
      setIsOpenRole(false);
      NotificationToast.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Grant permission successfully!',
      })
    })
    .catch(err => {
      NotificationToast.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Grant permission fail!',
      })
    })
  }

  const handleGrantPermission = () => {
    let data;
    if(role.member === userId) {
      getApiGrantPermission(role.member, 1)
      // data = 1;
      // API.put(endpoints.grantPermission(groupId, role.member), 
      //   { "role": data },
      //   { headers: headers.headers_token },
      // )
      // .then(res => {
      //   console.log(res)
      //   setIsOpenRole(false);
      //   NotificationToast.fire({
      //     toast: true,
      //     position: 'top-end',
      //     icon: 'success',
      //     title: 'Grant permission successfully!',
      //   })
      // })
      // .catch(err => {
      //   NotificationToast.fire({
      //     toast: true,
      //     position: 'top-end',
      //     icon: 'error',
      //     title: 'Grant permission fail!',
      //   })
      // })
    }
    else if(role.admin === userId) {
      getApiGrantPermission(role.admin, 2)
      // data = 2;
      // API.put(endpoints.grantPermission(groupId, role.admin),
      // { "role": data },
      // { headers: headers.headers_token })
      // .then(res => {
      //   console.log(res)
      //   setIsOpenRole(false);
      //   NotificationToast.fire({
      //     toast: true,
      //     position: 'top-end',
      //     icon: 'success',
      //     title: 'Grant permission successfully!',
      //   })
      // })
      // .catch(err => {
      //   NotificationToast.fire({
      //     toast: true,
      //     position: 'top-end',
      //     icon: 'error',
      //     title: 'Grant permission fail!',
      //   })
      // })
    }
  }

  return (
    <>
      <div className={styles.darkBG} onClick={() => setIsOpenRole(false)} />
      <div className={styles.centered}>
        <div className={Report.modal_ChangeRole}>
          <div className={styles.modalHeader}>
            <h5 className={styles.headingReport}>{content.change_role_title}</h5>
          </div>
          <button
            className={styles.closeBtn}
            onClick={() => setIsOpenRole(false)}
          >
            <RiCloseLine style={{ marginBottom: "-3px" }} />
          </button>
          <div className={styles.modalContent_Report}>
            <div className={Report.checked_list}>
            <label className={Report.radio}>
                <input
                  className={Report.radio_input}
                  type="radio"
                  name="radio"
                  onChange={() => setRole({admin: "", censor: "", member: userId})}
                />
                <FiUsers style={{ marginRight: "9px" }} />
                <span className={Report.radio_span}>{content.change_role_member}</span>
                <hr />
              </label>
              <label className={Report.radio}>
                <input
                  className={Report.radio_input}
                  type="radio"
                  name="radio"
                  onChange={() => setRole({admin: userId, censor: "", member: ""})}
                />
                <RiShieldUserFill style={{ marginRight: "9px" }} />
                <span className={Report.radio_span}>{content.change_role_admin}</span>
                <hr />
              </label>
              <label className={Report.radio}>
                <input
                  className={Report.radio_input}
                  type="radio"
                  name="radio"
                  onChange={() => setRole({admin: "", censor: userId, member: ""})}
                />
                <RiUserAddLine style={{ marginRight: "9px" }} />
                <span className={Report.radio_span}>{content.change_role_censor}</span>
                <hr />
              </label>
            </div>
          </div>
          <div className={styles.modalActions}>
            <div className={Report.actionsContainer}>
              <button
                className={Report.ReportBtn}
                onClick={handleGrantPermission}
              >
                {content.change_role_change_btn}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
