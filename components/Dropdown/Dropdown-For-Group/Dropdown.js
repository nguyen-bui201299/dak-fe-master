import { useState, useRef, useEffect } from 'react';
import Styled from '../../Dropdown/Menu.module.css';
import { HiDotsHorizontal} from 'react-icons/hi';
import { RiUserUnfollowLine } from 'react-icons/ri'
import { BsFillBellFill } from 'react-icons/bs'
import { ImExit } from 'react-icons/im'
import Modal from '../../Modal/Modal-OutGroup/Modal';
import Modals from '../../Modal/Modal-NotiGroup/Modal'

export default function DropdownGroup() {
    return (
        <>
            <div>
                <DropIcon icon={<HiDotsHorizontal/>} >
                    <DropdownMenu/>
                </DropIcon>
            </div>
        </>
    )
}

export function DropdownMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenNoti, setIsOpenNoti] = useState(false);
    function DropdownItems(props) {
        return (
            <>
                <a href="#" className={Styled.menu__items__Group}>
                    <span className={Styled.icon__items}>{props.leftIcon}</span>
                    {props.children}
                    {isOpen && <Modal setIsOpen={setIsOpen} />}
                    {isOpenNoti && <Modals setIsOpen={setIsOpenNoti} />}
                </a>
                
            </>
        )
    }

    
    return (
        <>
            <div className={Styled.dropdown_Group}>
                    <DropdownItems
                    leftIcon={<RiUserUnfollowLine/>}>
                        <p>Bỏ theo dõi group<br/><hr/></p>
                    </DropdownItems>

                    <DropdownItems
                    leftIcon={<BsFillBellFill onClick={() => setIsOpenNoti(true)}/>}>
                        <p onClick={() => setIsOpenNoti(true)}>Quản lý thông báo<br/><hr/></p>
                    </DropdownItems>

                    <DropdownItems  
                    leftIcon={<ImExit  onClick={() => setIsOpen(true)}/>}>
                        <p onClick={() => setIsOpen(true)}>Rời khỏi group<br/><hr/></p>
                    </DropdownItems>

            </div>
        </>
    )
}

export function DropIcon(props) {

    const [showBoxDropdown, setShowBoxDropdown] = useState(false);
    const ref = useRef(false);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setShowBoxDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return ( () => {
            document.removeEventListener("mousedown", handleClickOutside)
        })

    }, [ref, setShowBoxDropdown]);
    return (
        <>
            <li className={Styled.button__dropdown__items} ref={ref}>
                <span className={Styled.icon__button} onClick={() => setShowBoxDropdown(!showBoxDropdown)}>
                    {props.icon}
                </span>
                {showBoxDropdown && props.children}
            </li>
        </>
    )
}

