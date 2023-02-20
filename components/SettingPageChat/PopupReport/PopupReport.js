import Styles from "./PopupReport.module.css";
import { FaRegTimesCircle } from "react-icons/fa";
import { useRef, useEffect } from "react";

export default function PopupReport({handleClick, setShowPopupReport}) {
    // test-render-web
    useEffect(() => {
        console.log('render PopupReport');
        }, [])

    const popupReport = useRef();
    const closePopupReport = e => {
        if (popupReport.current === e.target) {
            setShowPopupReport(false);
        }
    };
    return (
        <>
            <div className={Styles["overlayPopupReport"]} ref={popupReport} onClick={closePopupReport}>
                <div className={Styles["popupreport"]}>
                    <div className={Styles["popupreport__upload-image"]}>
                        <div className={Styles["popupreport__heading"]}>
                            <h3 className={Styles["popupreport__title"]}>Báo cáo và hỗ trợ</h3>
                            <FaRegTimesCircle className={Styles["popupreport__icon-close"]} onClick={handleClick}/>
                        </div>
                        <div className={Styles["popupreport__body"]}>
                            <h3 className={Styles["popupreport__title-report"]}>Bạn muốn báo cáo điều gì</h3>
                            <ul className={Styles["popupreport__report-list"]}>
                                <li className={Styles["popupreport__report-item"]}>
                                    <p className={Styles["popupreport__report-title"]}>Làm phiền</p>
                                    <input type="radio" name="report" className={Styles["popupreport__report-radio"]}></input>
                                </li>
                                <li className={Styles["popupreport__report-item"]}>
                                    <p className={Styles["popupreport__report-title"]}>Đe dọa/Hành hung</p>
                                    <input type="radio" name="report" className={Styles["popupreport__report-radio"]}></input>
                                </li>
                                <li className={Styles["popupreport__report-item"]}>
                                    <p className={Styles["popupreport__report-title"]}>Spam</p>
                                    <input type="radio" name="report" className={Styles["popupreport__report-radio"]}></input>
                                </li>
                                <li className={Styles["popupreport__report-item"]}>
                                    <p className={Styles["popupreport__report-title"]}>Giả mạo</p>
                                    <input type="radio" name="report" className={Styles["popupreport__report-radio"]}></input>
                                </li>
                                <li className={Styles["popupreport__report-item"]}>
                                    <p className={Styles["popupreport__report-title"]}>Chia sẻ nội dung không hợp lệ</p>
                                    <input type="radio" name="report" className={Styles["popupreport__report-radio"]}></input>
                                </li>
                            </ul>
                        </div>
                        <button className={Styles["btn-submit"]}>Báo cáo</button>
                    </div>
                </div>
            </div>
        </>
    )
}