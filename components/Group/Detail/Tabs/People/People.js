import React, { useState, useEffect } from "react";
import Styles from './People.module.css'
import { RiShieldUserFill } from "react-icons/ri";
import { AiOutlineUser } from "react-icons/ai"
import DropdownPeople from '../../../../Dropdown/DropdownGroup-ForAdmin/DropdownAction/DropdownPeopleTabs/DropdownPeople'
import { getCookieUserLogin } from "../../../../../modules/Cookies/Auth/userLogin";
import API, { endpoints, headers } from "../../../../../API";

export default function People({ groupMember, currentGroupId, handleOnKickMember, setRemoveMember, groupDetail}) {
    const currentUserLogin = getCookieUserLogin()
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [userListBan, setUserListBan] = useState([]);
    const [listMembersGroup, setListMembersGroup] = useState([]);
    
    useEffect(() => {
        if (groupMember) {
            const user = groupMember.find((user) => {
                return user.owner.id === currentUserLogin.id && user.role.includes("ADMIN");
            })
            const super_admin = groupMember.find((user) => {
                return user.owner.id === currentUserLogin.id && user.role === "ROLE_GROUP_SUPER_ADMIN";
            })
            if (user) {
                setIsAdmin(true)
            }
            if(super_admin) {
                setIsSuperAdmin(true);
            }
        }
    }, [currentUserLogin, groupMember])

    useEffect(() => {
        API.get(endpoints['listUsersBan'](currentGroupId, 10, 1), {headers: headers.headers_token})
        .then(res => {
            setUserListBan(res.data.data)
        })
        .catch(err => {})
    }, [])

    useEffect(() => {
        API.get(endpoints.getAllMember(currentGroupId), {headers: headers.headers_token})
        .then(res => {
            setListMembersGroup(res.data.data)
        })
        .catch(err => {})
    }, [])

    const handleScroll = () => {
        const position = window.pageYOffset;
        setScrollPosition(position);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
    
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <div className={`${Styles.tab_group_container}`}>
                <div className={`${Styles.tab_group_member_container}`}>
                    <div className={`${Styles.tab_group_title}`}>
                        <label>Administrators & Moderators</label>
                    </div>
                    <div className={`${Styles.tab_group_member}`}>
                        {listMembersGroup && listMembersGroup.map((admin, index)=> (
                            <span key={index}>
                                {
                                admin.role.includes("ADMIN") && 
                                    <div className={`${Styles.group_member_admin}`}>
                                        <div className={`${Styles.group_member_info}`}>
                                            <span className={Styles.group_member_ava}><img src={admin.owner.avatar} alt="Ava" /></span>
                                            <span className={Styles.group_member_name}>{admin.owner.name}</span>
                                        </div>
                                        <div className={`${Styles.group_member_action}`}>
                                            <RiShieldUserFill  style={{fontSize: '24px', margin: '20px 10px'}}/>
                                            {isSuperAdmin && (admin.owner.id !== currentUserLogin.id) ? (
                                                <DropdownPeople 
                                                    setRemoveMember={setRemoveMember}
                                                    scrollPosition={scrollPosition}
                                                    handleOnKickMember={handleOnKickMember}
                                                    groupId={currentGroupId} 
                                                    userId={admin.owner.id}
                                                    setListMembersGroup={setListMembersGroup}
                                                    setUserListBan={setUserListBan}
                                                    groupDetail={groupDetail}
                                                />
                                                ) : (
                                                <div className={`${Styles.menu_actions}`} ></div>
                                            )}
                                        </div>
                                    </div>
                                }
                            </span>
                        ))}
                    </div>
                </div>
                <div className={`${Styles.group_divider}`}></div>
                <div className={`${Styles.tab_group_member_container}`}>
                    <div className={`${Styles.tab_group_title}`}>
                        <label>Members</label>
                    </div>
                    <div className={`${Styles.tab_group_member}`}>
                        {listMembersGroup && listMembersGroup.map((member, index)=> (
                            <span key={index}>
                                {
                                    !member.role.includes("ADMIN") && 
                                    <div className={`${Styles.group_member}`}>
                                        <div className={`${Styles.group_member_info}`}>
                                            <span className={Styles.group_member_ava}><img src={member.owner.avatar} alt="Ava" /></span>
                                            <span className={Styles.group_member_name}>
                                                <a href={`/otherprofile/${member.owner.id}`}>{member.owner.name}</a>
                                            </span>
                                        </div>
                                        <div className={`${Styles.group_member_action}`}>
                                            <AiOutlineUser  style={{fontSize: '24px', margin: '20px 10px'}}/>
                                            {isAdmin ? <DropdownPeople 
                                                setRemoveMember={setRemoveMember} 
                                                scrollPosition={scrollPosition} 
                                                handleOnKickMember={handleOnKickMember} 
                                                groupId={currentGroupId} 
                                                userId={member.owner.id}
                                                groupMember={groupMember}
                                                setListMembersGroup={setListMembersGroup}
                                                setUserListBan={setUserListBan}
                                                groupDetail={groupDetail}
                                                /> : <div className={`${Styles.menu_actions}`} ></div>}
                                        </div>
                                    </div>
                                }
                            </span>
                            
                        ))}
                    </div>
                </div>
                {
                    isAdmin &&
                    <>
                        <div className={`${Styles.group_divider}`}></div>
                        <div className={`${Styles.tab_group_member_container}`}>
                            <div className={`${Styles.tab_group_title}`}>
                                <label>Members Ban</label>
                            </div>
                            <div className={`${Styles.tab_group_member}`}>
                                {userListBan && userListBan.map((member, index)=> (
                                    <span key={index}>
                                        <div className={`${Styles.group_member}`}>
                                            <div className={`${Styles.group_member_info}`}>
                                                <span className={Styles.group_member_ava}><img src={member.avatar} alt="Ava" /></span>
                                                <span className={Styles.group_member_name}>
                                                    <a href={`/otherprofile/${member.id}`}>{member.name}</a>
                                                </span>
                                            </div>
                                            <div className={`${Styles.group_member_action}`}>
                                                <AiOutlineUser  style={{fontSize: '24px', margin: '20px 10px'}}/>
                                                {isAdmin ? 
                                                <DropdownPeople 
                                                    setRemoveMember={setRemoveMember}
                                                    scrollPosition={scrollPosition}
                                                    handleOnKickMember={handleOnKickMember}
                                                    groupId={currentGroupId}
                                                    userId={member.id}
                                                    banUser={member}
                                                    groupMember={groupMember}
                                                    setUserListBan={setUserListBan}
                                                    setListMembersGroup={setListMembersGroup}
                                                    groupDetail={groupDetail}
                                                /> : 
                                                <div className={`${Styles.menu_actions}`} ></div>}
                                            </div>
                                        </div>
                                    </span>
                                    
                                ))}
                            </div>
                        </div>
                    </>}
            </div>
        </>
        )
    }