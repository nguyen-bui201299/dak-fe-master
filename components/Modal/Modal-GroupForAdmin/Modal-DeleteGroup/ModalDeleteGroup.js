import React from 'react'
import styles from "../../Modal.module.css";
import { RiCloseLine } from "react-icons/ri";

const Modal = ({setIsOpenDelete, handleDeleteGroup}) => {

  return (
    <div>
        <div className={styles.darkBG} onClick={() => setIsOpenDelete(false)}>
            <div className={styles.centered}>
                <div className={styles.modal}>
                    <div className={styles.modalHeader}>
                        <h5 className={styles.heading_Show}>Xóa nhóm</h5>
                    </div>
                    <button className={styles.closeBtn} >
                    <RiCloseLine style={{ marginBottom: "-3px" }} onClick={() => setIsOpenDelete(false)} />
                    </button>
                    <div className={styles.modalContent}>
                        <label style={{ lineHeight: '110px'}}>Bạn có chắc chắc muốn xóa nhóm</label>
                    </div>
                    <div className={styles.modalActions}>
                        <div className={styles.actionsContainer}>
                        <button className={styles.deleteBtn} onClick={handleDeleteGroup} >
                            Có
                        </button>
                        <button
                            className={styles.cancelBtn}
                            onClick={() => setIsOpenDelete(false)}
                        >
                            Không
                        </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Modal