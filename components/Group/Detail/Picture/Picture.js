import Styled from "../../Detail/DetailContentGroup.module.css"
import Pictures from "../../Detail/Picture/Picture.module.css"
import { state, useState, useRef, useEffect } from 'react';
import Image from 'next/image'
import { AiOutlineVideoCameraAdd } from 'react-icons/ai'
import Modal from "../../../Modal/Modal-ShowUpload/Modal-Show"

const Picture = () => {

    // test-render-web
    useEffect(() => {
        console.log('render Picture')
        }, [])

    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <div className={Styled['picture-Group']}>
                <div className={Pictures['user-Group']}>
                    <div className={Pictures['name-User']}> 
                        <div className={Pictures['picture-User']}>
                            {/* <Image src={'/images/fpcyKuIW_400x400.jpg'} alt='picture-user' width={35} height={35}/> */}
                        </div>
                        <span>xQcOW</span>
                    </div>
                    <div className={Pictures['add-Picture-Video']} onClick={() => setIsOpen(true)}>
                        <AiOutlineVideoCameraAdd style={{ position: 'relative', right: '5px', top: '4px' }}/>Thêm ảnh / Video
                    </div>
                </div>
                <div className={Pictures['holdPictures-User']}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            {isOpen && <Modal setIsOpen={setIsOpen} />}
        </>
    )
}
export default Picture