import styles from "../Modal.module.css";
import { RiCloseLine } from "react-icons/ri";
import Report from "./ModalReport.module.css"
import { useEffect } from 'react'


const Modal = ({ setIsOpen = (val) => !val }) => {
    // test-render-web
    useEffect(() => {
        console.log('render Modal')
        }, [])

    return (
        <>
        <div className={styles.darkBG} onClick={() => setIsOpen(false)} />
        <div className={styles.centered}>
            <div className={Report.modal_Report}>
                <div className={styles.modalHeader}>
                    <h5 className={styles.headingReport}>Báo cáo</h5>
                    <span>Bạn muốn báo cáo điều gì</span>
                </div>
                <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                    <RiCloseLine style={{ marginBottom: "-3px" }} />
                </button>
                <div className={styles.modalContent_Report}>
                    <div className={Report.checked_list}>
                        <label className={Report.radio}>
                            <input className={Report.radio_input} type="radio" name="radio" />
                            <span className={Report.radio_span}>Làm phiền</span>
                            <hr/>
                        </label>
                        <label className={Report.radio}>
                            <input className={Report.radio_input} type="radio" name="radio"/>
                            <span className={Report.radio_span}>Đe dọa/ hành hung</span>
                            <hr/>
                        </label>
                        <label className={Report.radio}>
                            <input className={Report.radio_input} type="radio" name="radio"/>
                            <span className={Report.radio_span}>Spam</span>
                            <hr/>
                        </label>
                        <label className={Report.radio}>
                            <input className={Report.radio_input} type="radio" name="radio"/>
                            <span className={Report.radio_span}>Giả mạo</span>
                            <hr/>
                        </label>
                        <label className={Report.radio}>
                            <input className={Report.radio_input} type="radio" name="radio"/>
                            <span className={Report.radio_span}>Share nội dung không hợp lệ</span>
                            <hr/>
                        </label>
                    </div>
                </div>
                <div className={styles.modalActions}>
                    <div className={Report.actionsContainer}>
                        <button className={Report.ReportBtn} onClick={() => setIsOpen(false)}>
                            Báo cáo
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default Modal;