import styles from "../Modal.module.css";
import { state, useState, useRef, useEffect } from 'react';
import { RiCloseLine } from "react-icons/ri";
import { BsPlusLg } from 'react-icons/bs'
import { FiUpload } from 'react-icons/fi'

const Modal = ({ setIsOpenUploadAlbums }) => {
    // test-render-web
    useEffect(() => {
        console.log('render Modal')
        }, [])

    // const [isShowingAlert, setShowingAlert] = useState(false);

    const [picture, setPicture] = useState(null);
    const [imgData, setImgData] = useState(null);
    const onChangePicture = e => {
        if (e.target.files[0]) {
            setPicture(e.target.files[0]);
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setImgData(reader.result);
            });
            reader.readAsDataURL(e.target.files[0]);
            }
    };
    return (
        <>
        <div className={styles.darkBG} onClick={() => setIsOpenUploadAlbums(false)}/>
        {/* <div
          className={`alert alert-success ${isShowingAlert ? 'alert-shown' : 'alert-hidden'}`}
          onTransitionEnd={() => setShowingAlert(false)}
        >
          <strong onClick={() => setShowingAlert(true)}>Success!</strong> Thank you for subscribing!
        </div> */}
        <div className={styles.centered}>
            <div className={styles.modal__ShowAlbums}>
                <div className={styles.modalHeader}>
                    <h5 className={styles.heading_Show}>Tạo Album</h5>
                </div>
                <button className={styles.closeBtn} onClick={() => setIsOpenUploadAlbums(false)}>
                    <RiCloseLine style={{ marginBottom: "-3px" }} />
                </button>
                    <div className={styles.name__Album}>
                        <label>Tên Album</label>
                        <input type='text'/>
                    </div>
                <div className={styles.modalContent__ShowCP}>
                    <input type='file' onChange={onChangePicture}/>
                </div>
                    <div className={styles.content__UploadAlbum}>
                        <FiUpload className={styles.icon__upload}/>
                        <p style={{fontSize: '18px', color: 'grey'}}>Tải ảnh từ máy tính</p>
                    </div>
                    <img className={styles['bunchAlbum__User']} type='file' src={imgData} alt="file" />
                <div className={styles.modalActions_Add} onClick={() => setIsOpenUploadAlbums(false)}>
                        <button className={styles.AddBtn} >
                                Thêm
                        </button>
                </div>
            </div>
        </div>
        </>
    );
};

export default Modal;