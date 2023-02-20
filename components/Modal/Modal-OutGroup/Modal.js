import styles from "../Modal.module.css";
import { RiCloseLine } from "react-icons/ri";

const Modal = (props) => {
    const { handleOpenModal,handleOutGroup } = props;

    return (
        <>
        <div className={styles.darkBG} onClick={handleOpenModal}/>
        <div className={styles.centered}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h5 className={styles.heading}>Warning</h5>
                </div>
                <button className={styles.closeBtn} onClick={handleOpenModal}>
                    <RiCloseLine style={{ marginBottom: "-3px" }} />
                </button>
                <div className={styles.modalContent}>
                    Do you want to leave group ?
                </div>
                <div className={styles.modalActions}>
                    <div className={styles.actionsContainer}>
                    <button className={styles.deleteBtn} onClick={handleOutGroup}>
                        Yes
                    </button>
                    <button
                        className={styles.cancelBtn}
                        onClick={handleOpenModal}
                    >
                        Cancel
                    </button>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default Modal;