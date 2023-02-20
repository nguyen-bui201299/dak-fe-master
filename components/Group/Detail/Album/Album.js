import Styled from "../../Detail/DetailContentGroup.module.css"
import Album from "../../Detail/Album/Album.module.css"
import { useState, useEffect } from 'react';
import Image from 'next/image'
import { HiPlusSm } from 'react-icons/hi'
import Modal from "../../../Modal/Modal-ShowUpload/Modal-ShowUploadAlbum"


const Picture = () => {

    const [isOpenUploadAlbum, setIsOpenUploadAlbums] = useState(false);

    return (
        <>
            <div className={Styled['album-Group']}>
                <div className={Album['user-Group']}>
                    <div className={Album['name-User']}> 
                        <div className={Album['picture-User']}>
                            {/* <Image src={'/images/fpcyKuIW_400x400.jpg'} alt='picture-user' width={35} height={35}/> */}
                        </div>
                        <span>xQcOW</span>
                    </div>
                    <div className={Album['add-Albums']} onClick={() => setIsOpenUploadAlbums(true)}> 
                        <HiPlusSm style={{ position: 'relative', right: '5px', top: '4px' }} />Thêm Albums
                    </div>
                </div>
                <div className={Album['holdAlbums-Group']}>
                    <div className={Album['bunchAlbums-Group']}>
                        <span></span>
                    </div>
                </div>
            </div>
            {isOpenUploadAlbum && <Modal setIsOpenUploadAlbums={setIsOpenUploadAlbums} />}
        </>
    )
}
export default Picture