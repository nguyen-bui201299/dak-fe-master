import { useEffect, useRef, useState } from 'react';
import { AiOutlineShareAlt, AiOutlineStock, AiOutlineUserAdd, AiOutlineDelete } from 'react-icons/ai';
import { BsCalendarCheck } from 'react-icons/bs';
import { HiDotsHorizontal } from 'react-icons/hi';
import { IoCreateOutline, IoWarningOutline } from 'react-icons/io5';
import Styled from '../../Dropdown/Menu.module.css';
import PopupEditGroup from '../../Modal/Modal-GroupForAdmin/Modal-Edit/PopupEditGroup';
import ModalUser from '../../Modal/Modal-GroupForAdmin/Modal-User/Modal';
import Modal from '../../Modal/Modal-Report/Modal'
import ModalDeleteGroup from '../../Modal/Modal-GroupForAdmin/Modal-DeleteGroup/ModalDeleteGroup';

export default function DropdownGroupForAdmin(props) {
    return (
        <>
            <div>
                <DropIcon icon={<HiDotsHorizontal />} >
                    <DropdownMenu
                        permission={props.permission}
                        infoGroup={props.infoGroup}
                        setInfoGroup={props.setInfoGroup}
                        idGroupAdmin={props.idGroupAdmin}
                        handleHasJoined={props.handleHasJoined}
                        handleDeleteGroup={props.handleDeleteGroup}
                    />
                </DropIcon>
            </div>
        </>
    )
}

export function DropdownMenu(props) {

    const { infoGroup, setInfoGroup, idGroupAdmin, handleHasJoined, handleDeleteGroup } = props;
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [isOpenUser, setIsOpenUser] = useState(false);
    const [isOpenCen, setIsOpenCen] = useState(false);
    const [isOpenReport, setIsOpenReport] = useState(false);
    const [isOpenDelete, setIsOpenDelete] = useState(false);

    return (
        <>
            <div className={Styled.dropdown_GroupForAdmin}>
                {/* Chỉnh sửa lại thông tin nhóm */}
                { props.permission &&
                    <a href="#" className={Styled.menu__items__GroupForAdmin}>
                        <span className={Styled.icon__items}>{<IoCreateOutline onClick={() => setIsOpenEdit(true)} />}</span>
                        <p onClick={() => setIsOpenEdit(true)}>Chỉnh sửa thông tin<br /><hr /></p>
                        {isOpenEdit && <PopupEditGroup
                         setIsOpenEdit={setIsOpenEdit}
                         infoGroup={infoGroup}
                         setInfoGroup={setInfoGroup}
                        />}
                    </a>
                   
                }

                {/* Xem thành viên trong nhóm */}
                {/* <a href="#" className={Styled.menu__items__GroupForAdmin}>
                    <span className={Styled.icon__items}>{<AiOutlineUserAdd onClick={() => setIsOpenUser(true)} />}</span>
                    <p onClick={() => setIsOpenUser(true)}>Thành viên trong nhóm<br /><hr /></p>
                    {isOpenUser && <ModalUser setIsOpenUser={setIsOpenUser} infoGroup={infoGroup} />}
                </a> */}

                {/* Hoạt động của nhóm */}
                <a href="#" className={Styled.menu__items__GroupForAdmin}>
                    <span className={Styled.icon__items}>{<AiOutlineStock />}</span>
                    <p>Hoạt động của nhóm<br /><hr /></p>
                </a>

                {/* Chia sẻ nhóm */}
                <a href="#" className={Styled.menu__items__GroupForAdmin}>
                    <span className={Styled.icon__items}>{<AiOutlineShareAlt />}</span>
                    <p>Chia sẻ nhóm<br /><hr /></p>
                </a>

                {/* xóa nhóm */}
                {props.permission && <a href="#" className={Styled.menu__items__GroupForAdmin}>
                    <span className={Styled.icon__items}>{<AiOutlineDelete />}</span>
                    <p onClick={() => setIsOpenDelete(true)}>Xóa nhóm<br /><hr /></p>
                    {isOpenDelete && <ModalDeleteGroup handleDeleteGroup={handleDeleteGroup} setIsOpenDelete={setIsOpenDelete} idGroupAdmin={idGroupAdmin} />}
                </a>}

                {!props.permission &&
                    <a href="#" className={Styled.menu__items__GroupForAdmin}>
                        <span className={Styled.icon__items}>{<IoWarningOutline onClick={() => setIsOpenReport(true)} />}</span>
                        <p onClick={() => setIsOpenReport(true)}>Báo cáo nhóm<br /><hr /></p>
                        {isOpenReport && <Modal
                            setIsOpen={setIsOpenReport}
                        />}
                    </a>
                }
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
        return (() => {
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

