import React, { useEffect, useRef, useState } from 'react'
import { FaRegTimesCircle, FaSearch } from 'react-icons/fa';
import API, { endpoints, headers } from '../../../API';
import { NotificationToast } from '../../../modules/Notification/Notification';
import Styles from './ModalInvite.module.css'

export default function Modal({
    handleClick, 
    setShowFormInvitedFriend,
    idGroup,
    groupMember
}){
    const [listUsers, setListUsers] = useState([]);
    const [searchResult, setSearchResult] = useState([]);

    const modalInviteFriend = useRef();
    const [searchValue, setSearchValue] = useState('');
    const [debounced, setDebouncedValue] = useState("");
    // const [idUser, setIdUser] = useState([]);

    const closeModalInviteFriends = e => {
        if (modalInviteFriend.current === e.target) {
            setShowFormInvitedFriend(false);
        }
    };
    // Lấy id của member trong group
    let idMember = []
    groupMember = groupMember.filter((item) => idMember.push(item.owner.id))

    const handleFindFriends = () =>{
        API.get(endpoints["findFriends"](100, 1, debounced), {headers: headers.headers_token })
        .then((res)=>{
            if(res.data.success){
                const data=res.data.data;
                // Filter ra những người đã có trong group
                let filter = data.filter(item => !idMember.includes(item.user.id))
                setSearchResult(filter);
                if(listUsers.length>0){
                    for (var i = 0; i < listUsers.length; i++) {
                      for (var j = 0; j < filter.length; j++) {
                        if (data[j].user.id === listUsers[i].user.id) {
                          setSearchResult((prev) => [...prev], (data[j].user.check = true));
                        }
                    }}
                  }
            }
        }).catch((err)=>{});
        return;
    }
    
    useEffect(()=>{
        handleFindFriends();
    }, [debounced])

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
        console.log({searchResult})
        for (let i = 0; i < searchResult.length; i++) {
            if(searchResult[i].user.check == true) {
                searchResult[i].user.check = false
            }
        }
        const tagedSlice = listUsers.splice(0, listUsers.length);
        const newTaged = listUsers.filter((prev) => prev.user !== tagedSlice.user);
        setListUsers(newTaged);
    }

    let idUser = [];
    const handleInvite = () =>{
        listUsers.map(listuser =>{
            idUser.push(listuser.user.id)
        });

        API.post(
            endpoints.notiInviteGroup(idGroup), {friends: idUser}, 
            {headers: headers.headers_token}
        )
        .then(function (response) {
            NotificationToast.fire({
                toast: true,
                position: 'top-right',
                icon: 'success',
                title: `${"Mời thành công!"}`,
              })
            setShowFormInvitedFriend(false);
        })
        .catch(function (error) {
            NotificationToast.fire({
                toast: true,
                position: 'top-right',
                icon: 'warning',
                title: `${"Mời không thành công!"}`,
              })
            console.log(error);
        })
    }

    

    return (
        <>
            <div className={Styles["overlayModalInviteFriends"]} ref={modalInviteFriend} onClick={closeModalInviteFriends}>
                <div className={Styles["modalInvite"]}>
                    <div className={Styles["modalInvite__container"]}>
                        <div className={Styles["modalInvite__heading"]}>
                            <h3 className={Styles["modalInvite__title"]}>Mời bạn bè</h3>
                            <FaRegTimesCircle className={Styles["modalInvite__icon-close"]} onClick={handleClick}/>
                        </div>
                        <div className={Styles["modalInvite__body"]}>
                            <ul className={Styles["modalInvite__add-list"]}>
                            {
                                listUsers && listUsers.map((user, index) => (
                                    <li 
                                        key={index} 
                                        className={Styles["modalInvite__add-item"]}
                                        onClick={() =>handleAddUserTag(user.user.id, false)}
                                    >
                                        <div className={Styles["modalInvite__add-avatar"]}>
                                            <img src={user.user.avatar} style={{objectFit: "cover", width: "100%", height: "100%"}} alt="Avatar"/>
                                        </div>
                                        <p className={Styles["modalInvite__add-name"]}>{user.user.name}</p>
                                        <FaRegTimesCircle className={Styles["modalInvite__add-icon"]}/>
                                    </li>
                                ))
                            }
                            </ul>
                            <div className={Styles["modalInvite__search-box"]}>
                                <input 
                                    type="text" className={Styles["modalInvite__search-input"]} 
                                    placeholder="Nhập tên..."
                                    onChange={(e)=>setSearchValue((e.target.value))}
                                />
                                <FaSearch className={Styles["modalInvite__search-icon"]} />
                            </div>
                            <div className={Styles["modalInvite__offer-heading"]}>
                                <h4 className={Styles["modalInvite__offer-title"]}>Đề xuất</h4>
                                <span 
                                    className={Styles["editprofile__offer-delete"]}
                                    onClick={removeAllChoice}    
                                >
                                    Xóa tất cả lựa chọn</span>
                            </div>
                            <ul className={Styles["modalInvite__offer-list"]}>
                                {searchResult && searchResult.map((item, index)=>(
                                    <OfferItemGroup user={item} key={index} handleClick={(event) =>
                                        handleAddUserTag(item.user.id,!item.user.check)
                                      }/>
                                ))}
                            </ul>
                        </div>
                        <button className={Styles["btn-submit"]} onClick={() => handleInvite()}>Mời</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export function OfferItemGroup({user, handleClick}) {
    return (
        <>
            <li className={Styles["modalInvite__offer-item"]}>
                <div className={Styles["modalInvite__offer-avatar"]}>
                    <img className={Styles["people-avatar"]} src={user.user.avatar} style={{objectFit: "cover", width: "100%", height: "100%"}} alt="Avatar"/>
                </div>
                <h3 className={Styles["modalInvite__offer-name"]}>{user.user.name}</h3>
                <input 
                    className={Styles["modalInvite__offer-checkbox"]} 
                    type="checkbox" 
                    value 
                    checked={ user.user.check ? true: false }
                    onChange={handleClick}
                />
            </li>
        </>
    )
}