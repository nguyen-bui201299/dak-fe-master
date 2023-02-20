import { useRef, useState, useEffect } from "react";
import Styles from "./PopupDisplayMembers.module.css";
import { FaEllipsisH, FaRegTimesCircle, FaRegUserCircle } from "react-icons/fa";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { AiOutlineDelete } from 'react-icons/ai';
import API, { endpoints, headers } from "../../../API";
import { getCookieUserLogin } from "../../../modules/Cookies/Auth/userLogin";
import { SuccessNotification, ErrorNotification, NotificationToast } from "../../../modules/Notification/Notification";
import Router from 'next/router';
import { FiLogOut } from "react-icons/fi";


export default function PopupDisplayMembers({
    handleClick, 
    setShowPopupDisplayMembers, 
    messContent, 
    setShowPopupOutGroup
}) {
    // test-render-web
    useEffect(() => {
        console.log('render PopupDisplayMembers');
        }, [])


    var messContentIdGroup = messContent.conversation.id;
    // console.log('id group: ',messContentIdGroup);
    const [name, setName] = useState([]);
    const [idAdmin, setIdAdmin] = useState([]);


    
    /**
     * 1. Lấy id của thành viên trong nhóm
     * 2. Sử dụng API để chuyển id -> name của thành viên đó
     */

    useEffect(() =>{
        var axios = require('axios');
        
        var config = {
            method: 'get',
            url: `http://chat.dakshow.com/api/conversation/listUser/${messContentIdGroup}`,
            headers: headers.headers_token,
        };
        
        axios(config)
        .then(function (response) {
            // console.log({response});
            response.data.data.map(userid =>{
                API.get(endpoints.getDetailProfile(userid.user_id), {
                    headers: headers.headers_token,
                })
                .then(function (res) {
                    setName(prev => [...prev, {userName: res.data.data, role: userid.role}]);
                })
                .catch(function (error) {
                    console.log(error);
                });
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    
    },[]);


    // Kiểm tra tài khoản mà bạn đang dùng
    let user = getCookieUserLogin();
    // console.log('Tên tài khoản của bạn là:',user.name);

    const handleKickMember = (id) =>{
        // console.log({id});
        var axios = require('axios');
        var data = JSON.stringify({
            "user_id": `${id}`,
            "conversation_id": `${messContentIdGroup}`
        });

        var config = {
            method: 'patch',
            url: 'http://chat.dakshow.com/api/conversation/delete-user',
            headers: headers.headers_token,
            data : data
        };

        axios(config)
            .then(function (response) {
                // console.log({response});
                if(response.data.code === 200){
                    setShowPopupDisplayMembers(false);
                    NotificationToast.fire({
                        toast: true,
                        position: 'top-right',
                        icon: 'success',
                        title: `${"Xóa người thành công!"}`,
                    })
                }
                else{
                    NotificationToast.fire({
                        toast: true,
                        position: 'top-right',
                        icon: 'warning',
                        title: `${"Không thể xóa!"}`,
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
        });
    }

    // Kiểm tra xem nếu trong danh sách người dùng có id của admin thì thêm vào mảng idAdmin
    useEffect(()=>{
        // console.log({name});
        let admin = [];
        name.map((item) => {
            if(item.role == 'admin'){
                admin.push(item)
            }
        })
        // console.log({admin});
        setIdAdmin(admin);
    },[name])

    const popupDisplayMembers = useRef();
    const closePopupDisplayMembers = e => {
        if (popupDisplayMembers.current === e.target) {
            setShowPopupDisplayMembers(false);
        }
    };

    // Log ra id của admin
    // useEffect(() =>{
    //     console.log({idAdmin})
    // }, [idAdmin])

    return(
        <>
            <div className={Styles["overlayPopupDisplayMembers"]} ref={popupDisplayMembers} onClick={closePopupDisplayMembers}>
                <div className={Styles["popupDisplayMembers"]}>
                    <div className={Styles["popupDisplayMembers__upload-image"]}>
                        <div className={Styles["popupDisplayMembers__heading"]}>
                            <h3 className={Styles["popupDisplayMembers__title"]}>Thành viên trong nhóm</h3>
                            <FaRegTimesCircle className={Styles["popupDisplayMembers__icon-close"]} onClick={handleClick}/>
                        </div>
                        <ul className={Styles["popupDisplayMembers__list"]}>
                            {
                                name.map((item, index) =>{
                                    return(
                                        <li key={index}>
                                            <ListMember 
                                                item={item}
                                                idAdmin={idAdmin}
                                                user={user}
                                                handleKickMember={handleKickMember}
                                                messContentIdGroup={messContentIdGroup}
                                                setShowPopupDisplayMembers={setShowPopupDisplayMembers}
                                                setShowPopupOutGroup={setShowPopupOutGroup}
                                            />
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export function ListMember ({ 
    item, 
    idAdmin, 
    user, 
    handleKickMember, 
    messContentIdGroup, 
    setShowPopupDisplayMembers, 
    setShowPopupOutGroup 
}){
    const [showPopupSetting, setShowPopupSetting ] = useState(false);

    // Click outside to close popupSetting
    const popupSettingRef = useRef();
    useEffect(() =>{
        let closePopupSetting = e =>{
            if(popupSettingRef.current && !popupSettingRef.current.contains(e.target)){
                setShowPopupSetting(false);
            }
        }
        document.addEventListener("click", closePopupSetting);
        return () =>{
            document.removeEventListener("click", closePopupSetting);
        }
    }, [])

    return(
        <>
                <div 
                    className={Styles["popupDisplayMembers__item"]} 
                    ref={popupSettingRef}
                    // onClick={() => console.log(item.userName.id)}
                >
                    <div className={Styles["popupDisplayMembers__item-avatar"]}>
                        <img src={item.userName.avatar} alt="Avatar" style={{objectFit: "cover", width: "100%", height: "100%"}}/>
                    </div>
                    <p className={Styles["popupDisplayMembers__item-name"]}>
                        {item.userName.name}
                    </p>
                    <p className={Styles["popupDisplayMembers__item-name"]}>{item.role === 'admin' ? `(${item.role})` : ''}</p>
                    <FaEllipsisH 
                        className={Styles["chat__icon-ellipsis"]} 
                        onClick={() => setShowPopupSetting(prev => !prev)}
                    />
                    {
                        showPopupSetting && <PopupSetting 
                            idAdmin={idAdmin}
                            item={item}
                            user={user}
                            handleKickMember={handleKickMember}
                            messContentIdGroup={messContentIdGroup}
                            setShowPopupSetting={setShowPopupSetting}
                            setShowPopupDisplayMembers={setShowPopupDisplayMembers}
                            setShowPopupOutGroup={setShowPopupOutGroup}
                        />
                    }
                </div>
        </>
    )
}

export function PopupSetting ({ 
    idAdmin, 
    item, 
    user, 
    handleKickMember, 
    messContentIdGroup, 
    setShowPopupSetting, 
    setShowPopupDisplayMembers, 
    setShowPopupOutGroup 
}) {

    const handleAdmin = id =>{
        var axios = require('axios');
        var data = JSON.stringify({
            "conversation_id": `${messContentIdGroup}`,
            "user_id": `${id}`
        });
    
        var config = {
            method: 'post',
            url: 'http://chat.dakshow.com/api/conversation/grant-permission',
            headers: headers.headers_token,
            data : data
        };
    
        axios(config)
        .then(function (response) {
            console.log(response.data);
            if(response.data.code === 200){
                setShowPopupSetting(false);
                setShowPopupDisplayMembers(false);
                NotificationToast.fire({
                    toast: true,
                    position: 'top-right',
                    icon: 'success',
                    title: `${"Cấp quyền thành công!"}`,
                })
                
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    // Nếu không phải là bạn thì là người khác
    const handleProfile = id =>{
        if(id === user.id){
            Router.push("/profile");
        }
        else{
            Router.push(`/otherprofile/${id}`);
        }
    }

    return(
        <div className={Styles["popup_setting_container"]}>
            {/* <div className={Styles["arrow-top"]}></div> */}
            <div className={Styles["setting__container"]}>
            {
                idAdmin.map(element =>{
                    if(user.id === element.userName.id){
                        return(
                            <div key={element} >
                                {
                                    // Nếu đã là quản trị viên thì có thể đi gỡ của người khác
                                    item.role === 'admin' ? 
                                        <button className={Styles["popupDisplayMembers__btn"]}>
                                            <MdOutlineAdminPanelSettings className={Styles["chat__info-icon"]}/>
                                            Gỡ vai trò quản trị viên
                                        </button>
                                    :
                                        <button 
                                            className={Styles["popupDisplayMembers__btn"]} 
                                            onClick={() => handleAdmin(item.userName.id)}>
                                            <MdOutlineAdminPanelSettings className={Styles["chat__info-icon"]}/>
                                            Cấp quyền quản trị viên
                                        </button>
                                }
                                <button 
                                    className={`${Styles["popupDisplayMembers__btn"]} ${item.role === 'admin' ? Styles.hidden : ''}`} 
                                    onClick={() => handleKickMember(item.userName.id)}
                                >
                                    <AiOutlineDelete className={Styles["chat__info-icon"]} />
                                    Xóa khỏi nhóm
                                </button>
                            </div>
                        )
                    }
                })
            }
                <button 
                    className={Styles["popupDisplayMembers__btn"]} 
                    onClick={() => handleProfile(item.userName.id)}
                >
                    <FaRegUserCircle className={Styles["chat__info-icon"]}/>
                    Xem trang cá nhân
                </button>
            {
                item.userName.id === user.id ?
                <button 
                    className={Styles["popupDisplayMembers__btn"]} 
                    onClick={() => setShowPopupOutGroup(prev => !prev)}
                >
                    <FiLogOut className={Styles["chat__info-icon"]}/>
                    Rời khỏi nhóm
                </button>:
                ''
            }
            </div>
        </div>
    )
}