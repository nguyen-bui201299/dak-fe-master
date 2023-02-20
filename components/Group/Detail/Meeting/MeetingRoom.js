
import Styled from "../../Detail/Meeting/Meeting.module.css";
import Room_img from "../../../../public/images/coding.png";
import Image from 'next/image'
import { useEffect } from 'react'

const Meeting = () => {
    // test-render-web
    useEffect(() => {
        console.log('render Meeting')
        }, [])
    return (
        <>
            <div className={Styled["box-create"]}>
                <div className={Styled["box-header"]}>
                    <span>Tạo phòng họp mặt</span>
                </div>
                <div className={Styled["box-img"]}>
                    <Image src={'/images/coding.png'} alt='picture-group' width={300} height={300}/>
                </div>
                <div className={Styled["box-create-button"]}>
                    <button className={Styled["btn-create"]}>Tạo phòng</button>
                </div>  
            </div>
        </>
    )
}

export default Meeting;