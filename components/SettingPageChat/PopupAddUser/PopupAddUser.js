import axios from 'axios';
import Styles from "../../../styles/PopupOfferUser.module.css";
import { FaRegTimesCircle, FaSearch } from "react-icons/fa";
import { useEffect, useRef,  useState } from "react";
import API, { endpoints, headers } from "../../../API";
import { NotificationToast, SuccessNotification } from '../../../modules/Notification/Notification';

export default function PopupAddUser({
    handleClick, 
    setShowPopupAddUserToGroup,
    handleToggleTab,
    membergroup,
    idGroup,
}) {
    const [listUsers, setListUsers] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const [invite, setInvite] = useState(false)

    const popupAddUserToGroup = useRef();
    const [searchValue, setSearchValue] = useState('');
    const [debounced, setDebouncedValue] = useState("");

    const closePopupAddUserToGroup = e => {
        if (popupAddUserToGroup.current === e.target) {
            setShowPopupAddUserToGroup(false);
        }
    };
    console.log({membergroup})
    const handleFindFriends =()=>{
        API.get(endpoints["findFriends"](10, 1, debounced), {headers: headers.headers_token })
        .then((res)=>{
            if(res.data.success){
                const data=res.data.data;
                const filter = data.filter(item => !membergroup.includes(item.user.id))
                console.log({filter})
                setSearchResult(filter);
                if(listUsers.length>0){
                    for (var i = 0; i < listUsers.length; i++) {
                      for (var j = 0; j < filter.length; j++) {
                        if (filter[j].user.id === listUsers[i].user.id) {
                          setSearchResult((prev) => [...prev], (filter[j].user.check = true));
                        }
                    }}
                  }
            }
        }).catch((err)=>{console.log(err)});
        return;
    }

    const inviteFriend = () => setInvite(!invite)

    useEffect(()=>{
        handleFindFriends();
        console.log({invite})
    }, [debounced, invite])

    useEffect(() => {
        const handler = setTimeout(() => {
          setDebouncedValue(searchValue);
        }, 500);
        return () => clearTimeout(handler);
      }, [searchValue]);

    const handleAddUserTag = (id, action) => {
    for (var i = 0; i < searchResult.length; i++) {
        if (searchResult[i].user.id === id) {
        // Add check to checked item
        setSearchResult((prev) => [...prev], (searchResult[i].user.check = action));
        const index = listUsers.findIndex(item => item.user.id === id);
        // add listUsers
        if(action){
            if(index >=0) return;
            if(index < 0) setListUsers((prev) => [...prev, searchResult[i]]);
        }

        //remove listUsers
        if(!action){
            const tagedSlice = listUsers.splice(index, 1);
            const newTaged = listUsers.filter((prev) => prev.user !== tagedSlice.user);
            setListUsers(newTaged);
        }
        break;
        }
    }
    };

    // Xóa tất cả lựa chọn
    const removeAllChoice = () => {
        for (let i = 0; i < searchResult.length; i++) {
            if(searchResult[i].user.check == true) {
                searchResult[i].user.check = false
            }
        }
        const tagedSlice = listUsers.splice(0, listUsers.length);
        const newTaged = listUsers.filter((prev) => prev.user !== tagedSlice.user);
        setListUsers(newTaged);
    }


    const addUserToGroupChat = () => {
        var data = {
          "conversation_id": `${idGroup}`,
          "user_id": listUsers.map((user) => user.user.id)
        };

        var config = {
          method: 'patch',
          url: 'http://chat.dakshow.com/api/conversation/add-user',
          headers: headers.headers_token,
          data : data
        };
        axios(config)
        .then((response) =>{
            if(response.data.success){
                inviteFriend()
                setShowPopupAddUserToGroup(false);
                handleToggleTab(2);
                NotificationToast.fire({
                    toast: true,
                    position: 'top-right',
                    icon: 'success',
                    title: `${"Thêm người thành công"}`,
                })
            }
        }).catch((error) =>console.log(error));
    }
    return (
        <>
            <div className={Styles["overlayPopup"]} ref={popupAddUserToGroup} onClick={closePopupAddUserToGroup}>
                <div className={Styles["popupgroup"]}>
                    <div className={Styles["popupgroup__upload-image"]}>
                        <div className={Styles["popupgroup__heading"]}>
                            <h3 className={Styles["popupgroup__title"]}>Thêm thành viên</h3>
                            <FaRegTimesCircle className={Styles["popupgroup__icon-close"]} onClick={handleClick}/>
                        </div>
                        <div className={Styles["popupgroup__body"]}>
                            <ul className={Styles["popupgroup__add-list"]}>
                            {
                                listUsers && listUsers.map((user, index) => (
                                    <li 
                                        key={index} 
                                        className={Styles["popupgroup__add-item"]}
                                        onClick={() =>handleAddUserTag(user.user.id, false)}
                                    >
                                        <div className={Styles["popupgroup__add-avatar"]}>
                                            <img src={user.user.avatar} style={{objectFit: "cover", width: "100%", height: "100%"}} alt="Avatar"/>
                                        </div>
                                        <p className={Styles["popupgroup__add-name"]}>{user.user.name}</p>
                                        <FaRegTimesCircle className={Styles["popupgroup__add-icon"]}/>
                                    </li>
                                ))
                            }
                            </ul>
                            <div className={Styles["popupgroup__search-box"]}>
                                <input 
                                    type="text" className={Styles["popupgroup__search-input"]} 
                                    placeholder="Nhập tên..."
                                    onChange={(e)=>setSearchValue((e.target.value))}
                                />
                                <FaSearch className={Styles["popupgroup__search-icon"]} />
                            </div>
                            <div className={Styles["popupgroup__offer-heading"]}>
                                <h4 className={Styles["popupgroup__offer-title"]}>Đề xuất</h4>
                                <span 
                                    className={Styles["editprofile__offer-delete"]}
                                    onClick={removeAllChoice}
                                >
                                    Xóa tất cả lựa chọn
                                </span>
                            </div>
                            <ul className={Styles["popupgroup__offer-list"]}>
                                {    
                                    searchResult && searchResult.map((item, index)=>(
                                        <OfferAddUser user={item} key={index} handleClick={(event) =>
                                            handleAddUserTag(item.user.id,!item.user.check)
                                        }/>
                                    ))
                                }
                            </ul>
                        </div>
                        <button className={Styles["btn-submit"]} onClick={addUserToGroupChat}>Thêm</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export function OfferAddUser({user, handleClick}) {
    return (
        <>
            <li className={Styles["popupgroup__offer-item"]}>
                <div className={Styles["popupgroup__offer-avatar"]}>
                    <img className={Styles["people-avatar"]} src={user.user.avatar} style={{objectFit: "cover", width: "100%", height: "100%"}} alt="Avatar"/>
                </div>
                <h3 className={Styles["popupgroup__offer-name"]}>{user.user.name}</h3>
                <input className={Styles["popupgroup__offer-checkbox"]} type="checkbox" onChange={handleClick} value checked={user.user.check ? true : false}/>
            </li>
        </>
    )
}