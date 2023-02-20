import Styled from "../../Detail/DetailContentGroup.module.css"
import File from "../../Detail/File/File.module.css"
import Image from 'next/image'
import { ImFileZip } from 'react-icons/im'
import { VscNewFile } from 'react-icons/vsc'
import { useEffect } from 'react'

const Picture = () => {
    // test-render-web
    useEffect(() => {
        console.log('render Picture')
        }, [])

    return (
        <>
            <div className={Styled['file-Group']}>
                <div className={File['user-Group']}>
                    <div className={File['name-User']}>
                        <div className={File['picture-User']}>
                            {/* <Image src={'/images/fpcyKuIW_400x400.jpg'} alt='picture-user' width={35} height={35} /> */}
                        </div>
                        <span>xQcOW</span>
                    </div>
                    <div className={File['add-Files']}>
                        <VscNewFile style={{ position: 'relative', right: '5px', top: '4px' }} />Thêm Files
                    </div>
                </div>
                <div className={File['holdFiles-Group']}>
                    <div className={File['name-Files']}>
                        <strong><ImFileZip style={{ position: 'relative', right: '5px', top: '2px' }} />Jav.zip</strong>
                    </div>
                    <div className={File['size-Files']}>
                        <spam>21MB</spam>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Picture