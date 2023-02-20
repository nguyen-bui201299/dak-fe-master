import styles from "../Modal.module.css";
import { RiCloseLine } from "react-icons/ri";
import { BsPlusLg } from 'react-icons/bs'
import { FiUpload } from 'react-icons/fi'
import { useEffect } from 'react'

const Modal = ({ setIsOpenAdd }) => {
    // test-render-web
    useEffect(() => {
        console.log('render Modal')
        }, [])

    return (
        <>
        <div className={styles.darkBG} onClick={() => setIsOpenAdd(false)}/>
        <div className={styles.centered}>
            <div className={styles.modal__ShowAdd}>
                <div className={styles.modalHeader}>
                    <h5 className={styles.heading_Show}>Ảnh từ hệ thống</h5>
                </div>
                <button className={styles.closeBtn} onClick={() => setIsOpenAdd(false)}>
                    <RiCloseLine style={{ marginBottom: "-3px" }} />
                </button>
                <div className={styles.modalContent__ShowAdd}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
        </>
    );
};

export default Modal;