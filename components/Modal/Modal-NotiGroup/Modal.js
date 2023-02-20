import styles from "../Modal.module.css";
import { RiCloseLine } from "react-icons/ri";
import Noti from "../Modal-NotiGroup/ModalNoti.module.css"
import { useEffect } from 'react'

const Modal = ({ setIsOpen }) => {
    return (
        <>
        <div className={styles.darkBG} onClick={() => setIsOpen(false)} />
        <div className={styles.centered}>
            <div className={Noti.modal_Noti}>
                <div className={Noti.modalHeaderNoti}>
                    <h5 className={styles.headingNoti}>Quản lý thông báo</h5>
                </div>
                <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                    <RiCloseLine style={{ marginBottom: "-3px" }} />
                </button>
                <div className={styles.modalContent_Noti}>
                    <div className={Noti.checked_list}>
                        <label className={Noti.radio}>
                            <input className={Noti.radio_input} type="radio" name="radio" />
                            <span className={Noti.radio_span}>Tất cả bài viết</span><br/>
                            <small>Tất cả bài viết được đăng trên group</small>
                            <hr/>
                        </label>
                        <label className={Noti.radio}>
                            <input className={Noti.radio_input} type="radio" name="radio"/>
                            <span className={Noti.radio_span}>Cryptocurrency</span><br/>
                            <small>Tất cả bài viết được đăng trên group</small>
                            <hr/>
                        </label>
                        <label className={Noti.radio}>
                            <input className={Noti.radio_input} type="radio" name="radio"/>
                            <span className={Noti.radio_span}>Bank Transfer</span><br/>
                            <small>Tất cả bài viết được đăng trên group</small>
                            <hr/>
                        </label>
                    </div>
                </div>
                <div className={styles.modalActions}>
                    <div className={Noti.actionsContainer}>
                        <button className={Noti.NotiBtn} onClick={() => setIsOpen(false)}>
                            Lưu
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default Modal;