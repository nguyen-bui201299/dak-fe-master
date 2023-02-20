import { useState, useRef, useEffect } from 'react';
import Styled from '../../Dropdown/Menu.module.css';
import { HiDotsHorizontal} from 'react-icons/hi';
import { IoWarningOutline } from "react-icons/io5"
import Modal from '../../Modal/Modal-Report/Modal';

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
    function DropdownItems(props) {
        return (
            <>
                <a href="#" className={Styled.menu__items__Group}>
                    <span className={Styled.icon__items}>{props.leftIcon}</span>
                    {props.children}
                    {isOpen && <Modal setIsOpen={setIsOpen} />}
                </a>
                
            </>
        )
    }

    return (
        <>
            <div className={Styled.dropdown_Group}>
                    <DropdownItems  
                    leftIcon={<IoWarningOutline  onClick={() => setIsOpen(true)}/>}>
                        <p onClick={() => setIsOpen(true)}>Báo cáo group<br/><hr/></p>
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
                    {/* <span className={Styled.icon__button} onClick={() => setShowBoxDropdown(!showBoxDropdown)}> */}
                    {props.icon}
                </span>
                {showBoxDropdown && props.children}
            </li>
        </>
    )
}

