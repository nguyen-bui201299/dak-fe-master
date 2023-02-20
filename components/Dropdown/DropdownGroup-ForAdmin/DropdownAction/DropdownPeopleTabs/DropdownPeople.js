import { useState, useRef, useEffect } from 'react';
import Styled from '../../../Menu.module.css';
import { BsThreeDotsVertical } from 'react-icons/bs'
import DropdownMenu from './DropdownMenu';

export default function DropdownPeopleTabs ({ 
    handleOnKickMember, 
    scrollPosition, 
    groupId, 
    userId, 
    setRemoveMember, 
    banUser,
    setListMembersGroup,
    setUserListBan,
    groupDetail
}) {
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

    }, [ref, showBoxDropdown]);

    return (
        <>
            <span className={Styled.button__dropdown__items} ref={ref}>
                <span className={Styled.group_member_icon_action}>
                    <BsThreeDotsVertical className={`${Styled.menu_actions}`} onClick={() => setShowBoxDropdown(!showBoxDropdown)}/>
                </span>
                {showBoxDropdown && <DropdownMenu 
                    setRemoveMember={setRemoveMember}
                    userId={userId}
                    groupId={groupId}
                    scrollPosition={scrollPosition}
                    handleOnKickMember={handleOnKickMember}
                    banUser={banUser}
                    setListMembersGroup={setListMembersGroup}
                    setUserListBan={setUserListBan}
                    groupDetail={groupDetail}
                    setShowBoxDropdown={setShowBoxDropdown}
                />}
            </span>
        </>
    )
}