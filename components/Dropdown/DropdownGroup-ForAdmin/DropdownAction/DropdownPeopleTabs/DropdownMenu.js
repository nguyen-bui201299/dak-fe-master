import { useState} from 'react';
import Styled from '../../../Menu.module.css';
import { HiBan, HiUserRemove } from 'react-icons/hi';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import ModalRole from '../../../../Modal/Modal-GroupForAdmin/Modal-ChangeRole/Modal';
import ModalKick from '../../../../Modal/Modal-GroupForAdmin/Modal-kickMember/Modal'
import ModalBan from '../../../../Modal/Modal-GroupForAdmin/ModalBanMember/ModelBanMember';
import { FiCheckCircle } from 'react-icons/fi';
import ModalUnban from '../../../../Modal/Modal-GroupForAdmin/ModalUbanMember/ModalUbanMember';

export default function DropdownMenu (props) {
    const {
        groupId, 
        userId, 
        handleOnKickMember, 
        scrollPosition, 
        setRemoveMember,
        banUser,
        setListMembersGroup,
        setUserListBan,
        groupDetail,
        setShowBoxDropdown
    } = props;
    
    const [toggleKickModal, setToggleKickModel] = useState(false);
    const [toggleGrantModal, setToggleGrantModal] = useState(false);
    const [toggleBanModal, setToggleBanModal] = useState(false);
    const [toggleUnbanModal, setToggleUnbanModal] = useState(false);

    return (
        <div className={Styled.dropdown_GroupOption}>
                <div>
                    <div className={Styled.menu__items__GroupOption} onClick={() => setToggleGrantModal(!toggleGrantModal)}>
                        <span className={Styled.icon__items}><MdOutlineAdminPanelSettings/></span>
                        <span className={Styled.icon__items_titles}>Grant permission</span>
                    </div>
                    {
                        toggleGrantModal && 
                        <ModalRole 
                            setIsOpenRole={setToggleGrantModal}
                            userId={userId}
                            groupId={groupId}
                        />
                    }
                    <div className={Styled.menu__items__GroupOption} onClick={() => setToggleKickModel(!toggleKickModal)}>
                        <span className={Styled.icon__items}><HiUserRemove/></span>
                        <span className={Styled.icon__items_titles}>Remove member</span>
                    </div>
                    {toggleKickModal && 
                        <ModalKick
                            groupId={groupId} 
                            userId={userId}
                            scrollPosition={scrollPosition}
                            handleOnKickMember={handleOnKickMember} 
                            setToggleKickModel={setToggleKickModel}
                            toggleKickModal={toggleKickModal}
                            setRemoveMember={setRemoveMember}
                        />
                    }
                    {
                        banUser === undefined ? (
                            <div className={Styled.menu__items__GroupOption} onClick={() => setToggleBanModal(!toggleBanModal)}>
                                <span className={Styled.icon__items}><HiBan/></span>
                                <span className={Styled.icon__items_titles}>Ban member</span>
                            </div>
                        ) : (
                        <div className={Styled.menu__items__GroupOption} 
                        onClick={() => setToggleUnbanModal(!toggleUnbanModal)}
                        >
                            <span className={Styled.icon__items}><FiCheckCircle/></span>
                            <span className={Styled.icon__items_titles}>Unban member</span>
                        </div>
                        )
                    }
                    
                    {toggleBanModal && 
                        <ModalBan
                            groupId={groupId} 
                            userId={userId}
                            scrollPosition={scrollPosition}
                            handleOnKickMember={handleOnKickMember} 
                            setToggleBanModal={setToggleBanModal}
                            toggleBanModal={toggleBanModal}
                            setRemoveMember={setRemoveMember}
                            setListMembersGroup={setListMembersGroup}
                            setUserListBan={setUserListBan}
                            groupDetail={groupDetail}
                            setShowBoxDropdown={setShowBoxDropdown}
                        />
                    }

                    {toggleUnbanModal && 
                        <ModalUnban
                            groupId={groupId} 
                            userId={userId}
                            scrollPosition={scrollPosition}
                            handleOnKickMember={handleOnKickMember} 
                            setToggleUnbanModal={setToggleUnbanModal}
                            toggleUnbanModal={toggleUnbanModal}
                            setRemoveMember={setRemoveMember}
                            setListMembersGroup={setListMembersGroup}
                            setUserListBan={setUserListBan}
                            groupDetail={groupDetail}
                            setShowBoxDropdown={setShowBoxDropdown}
                        />
                    }
                </div>
        </div>
    )
}