import { useState, useRef, useEffect } from 'react';
import Styled from '../../../Dropdown/Menu.module.css';
import { IoCreateOutline, } from 'react-icons/io5'
import ModalRole from '../../../Modal/Modal-GroupForAdmin/Modal-ChangeRole/Modal';
import ModalKick from '../../../Modal/Modal-GroupForAdmin/Modal-kickMember/Modal'
import { BsThreeDotsVertical } from 'react-icons/bs'

export default function DropdownOption(props) {
    const {groupId, userId, setKick, setIsOpenUser, handleOnKickMember} = props;

    return (
        <>
            {/* <DropIcon icon={<BiUserPlus style={{marginTop: '18px'}}/>} > */}
            <DropIcon icon={<BsThreeDotsVertical className={`${Styled.menu_actions}`}/>} >
                <DropdownMenu handleOnKickMember={handleOnKickMember} groupId={groupId} userId={userId} setKick={setKick} setIsOpenUser={setIsOpenUser}/>
            </DropIcon>
        </>
    )
}

export function DropdownMenu(props) {
    const {groupId, userId, setKick, setIsOpenUser, handleOnKickMember} = props;

    const [isOpenKick, setIsOpenKick] = useState(false);
    const [isOpenModalRole, setIsOpenRole] = useState(false);

    function DropdownItems(props) {
        return (
            <>
                <a href="#" className={Styled.menu__items__GroupOption}>
                    <span className={Styled.icon__items}>{props.leftIcon}</span>
                    {props.children}
                </a>
            {isOpenModalRole && <ModalRole setIsOpenRole={setIsOpenRole} />}
            {isOpenKick && <ModalKick handleOnKickMember={handleOnKickMember} groupId={groupId} userId={userId} setIsOpenKick={setIsOpenKick} setKick={setKick} setIsOpenUser={setIsOpenUser}/>}
            </>
        )
    }

    return (
        <>
            <div className={Styled.dropdown_GroupOption}>
                    <DropdownItems
                    leftIcon={<IoCreateOutline onClick={() => setIsOpenKick(true)}/>}>
                        <p onClick={() => setIsOpenKick(true)}>Đuổi thành viên<br/><hr/></p>
                    </DropdownItems>

                    {/* <DropdownItems
                    leftIcon={<AiOutlineUserAdd   onClick={() => setIsOpenRole(true)}/>}>
                        <p onClick={() => setIsOpenRole(true)}>Thay đổi quyền<br/><hr/></p>
                    </DropdownItems> */}

                    {/* <DropdownItems
                    leftIcon={<AiOutlineProfile onClick={``}/>}>
                        <p onClick={() => setIsOpenRole(true)}>Xem trang cá nhân<br/><hr/></p>
                    </DropdownItems> */}
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
            <span className={Styled.button__dropdown__items} ref={ref}>
                <span className={Styled.group_member_icon_action} onClick={() => setShowBoxDropdown(!showBoxDropdown)}>
                    {props.icon}
                </span>
                {showBoxDropdown && props.children}
            </span>
        </>
    )
}

