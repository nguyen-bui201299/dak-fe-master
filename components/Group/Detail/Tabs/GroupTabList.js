import React from 'react'
import { useEffect, useCallback, useState } from 'react';
import { getCookieUserLogin } from '../../../../modules/Cookies/Auth/userLogin';
import Styles from './GroupTabs.module.css'

export default function GroupTabList ({toggleTab, toggleState, groupMember, detailGroup}) {
    const userLogin = getCookieUserLogin();
    
    const [language, setLanguage] = useState({});
    const [authorizePrivacy, setAuthorizePrivacy] = useState(false);

    const [isAdmin, setIsAdmin] = useState(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    // console.log(groupMember);

    // Kiểm tra xem người login hiện tại có phải là chủ group không || Group là private hay public
    // Điều kiện đê có kiểm duyệt: 
    // - Là chủ của group
    // - Group đó phải private
    const checkGroupPrivacy = useCallback(() => {
        if (detailGroup) {
            if(detailGroup.owner?.id === userLogin.id && (detailGroup.group.access === 'private' || detailGroup.group.access === 'PRIVATE')){
                setAuthorizePrivacy(true)
            }
            else {
                setAuthorizePrivacy(false)
            }
        }
    }, [detailGroup])

    useEffect(() => {
        if (groupMember) {
            const user = groupMember.find((user) => {
                return user.owner.id === userLogin.id && user.role.includes("ADMIN");
            })
            const super_admin = groupMember.find((user) => {
                return user.owner.id === userLogin.id && user.role.includes("ROLE_GROUP_SUPER_ADMIN");
            })
            // console.log(super_admin)
            if (user) {
                setIsAdmin(true)
            }
            if(super_admin) {
                setIsSuperAdmin(true);
            }
        }
    }, [userLogin, groupMember])

    // console.log("isAdmin :", isAdmin);
    // console.log("isSuperAdmin", isSuperAdmin);

    useEffect(() => {
        checkGroupPrivacy()
    }, [groupMember, detailGroup])

    useEffect(() => {
        if(userLogin.language!== undefined) {
          setLanguage(require(`../../languages/${userLogin.language}.json`));
        }else{
          setLanguage(require(`../../languages/en.json`));
        }
    }, [userLogin])

    return (
        <div className={`${Styles.btn_tabs}`}>
            <button
                className={toggleState === 1 ? `${Styles.item_active} ${Styles.item_menu}` : `${Styles.item_menu}`}
                onClick={() => toggleTab(1)}
            >
                About
            </button>
            <button
                className={toggleState === 2 ? `${Styles.item_active} ${Styles.item_menu}` : `${Styles.item_menu}`}
                onClick={() => toggleTab(2)}
            >
                Posts
            </button>
            <button
                className={toggleState === 3 ? `${Styles.item_active} ${Styles.item_menu}` : `${Styles.item_menu}`}
                onClick={() => toggleTab(3)}
            >
                Activity
            </button>

            {authorizePrivacy && 
                <button
                    className={toggleState === 4 ? `${Styles.item_active} ${Styles.item_menu}` : `${Styles.item_menu}`}
                    onClick={() => toggleTab(4)}
                >
                    Pending
                </button>
            }

            <button
                className={toggleState === 5 ? `${Styles.item_active} ${Styles.item_menu}` : `${Styles.item_menu}`}
                onClick={() => toggleTab(5)}
            >
                People
            </button>

            {isAdmin &&
                <button
                    className={toggleState === 6 ? `${Styles.item_active} ${Styles.item_menu}` : `${Styles.item_menu}`}
                    onClick={() => toggleTab(6)}
                >
                    Posts Permission
                </button> 
                || 
                isSuperAdmin &&
                <button
                    className={toggleState === 6 ? `${Styles.item_active} ${Styles.item_menu}` : `${Styles.item_menu}`}
                    onClick={() => toggleTab(6)}
                >
                    Posts Permission
                </button>
            }
        </div>
    )
}