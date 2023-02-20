import Modal from '../../Modal/Modal-CreateGroup/Modal'
import { state, useState, useRef, useEffect } from 'react';



const Button = () => {

    const [change, setChange] = useState(null)
    
    useEffect(() => {
        if(change) {
            window.history.replaceState({}, '', '/group/main-group')
            window.location.href = '/group/main-group'
            setChange(null)
        }
        else {
            // window.location.href = '/group/no-group'
        }
    }, [change])

    const [isOpenCreate, setIsOpenCreate] = useState(false);
    return (
        <>
            <a style={{ cursor: 'pointer' }} onClick={() => setIsOpenCreate(true)}>Tạo nhóm</a>
            {isOpenCreate && <Modal setIsOpenCreate={setIsOpenCreate} setChange={setChange}/>}
        </>
    )
}
export default Button