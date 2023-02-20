import styles from "../../Modal.module.css";
import Admin from "../Modal.module.css";
import { useState, useEffect } from "react";
import { RiCloseLine } from "react-icons/ri";
import { RiArrowDownSFill } from "react-icons/ri";
import { getCookieUserLogin } from "../../../../modules/Cookies/Auth/userLogin";

const Modal = ({ setIsOpenEdit }) => {

  const userLogin = getCookieUserLogin()

  const [content, setContent] = useState({});

  useEffect(() => {
    if (userLogin.language !== undefined) {
      setContent(require(`../languages/${userLogin.language}.json`));
    } else {
      setContent(require(`../languages/en.json`));
    }
  }, [userLogin]);

  return (
    <>
      <div className={styles.darkBG} onClick={() => setIsOpenEdit(false)} />
      {/* <div
          className={`alert alert-success ${isShowingAlert ? 'alert-shown' : 'alert-hidden'}`}
          onTransitionEnd={() => setShowingAlert(false)}
        >
          <strong onClick={() => setShowingAlert(true)}>Success!</strong> Thank you for subscribing!
        </div> */}
      <div className={styles.centered}>
        <div className={Admin.modal__ShowEdit}>
          <div className={styles.modalHeader}>
            <h5 className={styles.heading_Show}>{content.modal_edit_edit_information}</h5>
          </div>
          <button
            className={styles.closeBtn}
            onClick={() => setIsOpenEdit(false)}
          >
            <RiCloseLine style={{ marginBottom: "-3px" }} />
          </button>
          <div className={styles.group_admin_title}>
            <label>{content.modal_edit_group_name}</label>
            <input type="text" placeholder={content.modal_edit_input_group_name} />
          </div>
          <div className={styles.group_admin_title}>
            <label>{content.modal_edit_privacy}</label>
            <div className={styles.selected}>
              <select className={styles.select_mode}>
                <option className={styles.select_option} value="global">
                  {content.modal_edit_global_group}
                </option>
                <option className={styles.select_option} value="private">
                  {content.modal_edit_private_group}
                </option>
              </select>
              <RiArrowDownSFill
                style={{
                  fontSize: "26px",
                  position: "relative",
                  right: "39px",
                  top: "8px",
                }}
              />
            </div>
          </div>
          <div className={styles.modalActions_Add}>
            <button
              className={styles.AddBtn_Group}
              onClick={() => setIsOpenEdit(false)}
            >
              {content.modal_edit_save_btn}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Modal;
