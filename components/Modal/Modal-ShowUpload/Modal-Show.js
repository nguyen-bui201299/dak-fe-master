import styles from "../Modal.module.css";
import { RiCloseLine } from "react-icons/ri";
import { BsPlusLg } from 'react-icons/bs'
import { FiUpload } from 'react-icons/fi'
import { state, useState, useRef, useEffect } from 'react';
import ModalAdd from "./Modal-ShowAdd";
import ModalCP from "./Modal-ShowCP";

const Modal = ({ setIsOpen }) => {
    // test-render-web
    useEffect(() => {
        console.log('render Modal')
        }, [])

    const [isOpenAdd, setIsOpenAdd] = useState(false);
    
    const [isOpenCP, setIsOpenCP] = useState(false);

    return (
        <>
        <div className={styles.darkBG} onClick={() => setIsOpen(false)} />
        <div className={styles.centered}>
            <div className={styles.modal__ShowUpload}>
                <div className={styles.modalHeader}>
                    <h5 className={styles.heading_Show}>Thêm ảnh và Video</h5>
                </div>
                <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                    <RiCloseLine style={{ marginBottom: "-3px" }} />
                </button>
                <div className={styles.modalContent__Show}>
                    <span onClick={() => setIsOpenAdd(true)}>
                        <BsPlusLg style={{ fontSize: '150px', color: 'grey' }}/>
                        <p>Chọn ảnh từ hệ thống</p>
                    </span>
                    <span onClick={() => setIsOpenCP(true)}> 
                        <FiUpload style={{ fontSize: '150px', color: 'grey' }}/>
                        <p>Tải ảnh từ máy tính</p>
                    </span>
                </div>
            </div>
        </div>
        {isOpenAdd && <ModalAdd setIsOpenAdd={setIsOpenAdd} />}
        {isOpenCP && <ModalCP setIsOpenCP={setIsOpenCP} />}
        </>
    );
};

export default Modal;