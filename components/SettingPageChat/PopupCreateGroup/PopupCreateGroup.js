import axios from 'axios';
import Styles from "../../../styles/PopupOfferUser.module.css";
import { FaRegTimesCircle, FaSearch } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { useEffect, useRef } from "react";
import { useState } from "react";
import API, { endpoints, headers } from "../../../API";
import { SuccessNotification } from '../../../modules/Notification/Notification';
import { getCookieChatToken } from '../../../modules/Cookies/Auth/userLogin';

export default function PopupCreateGroup({
    content,
    handleClick, 
    setShowPopupCreateGroup, 
    setListConversation, 
    setSearchConver, 
    userCreate, 
    handleToggleTab,
    setMessContent,
    setAddChatGroup
}) {
    const [listUsers, setListUsers] = useState([]);
    const [searchResult, setSearchResult] = useState([]);

    const popupCreateGroup = useRef();
    const [searchValue, setSearchValue] = useState('');
    const [debounced, setDebouncedValue] = useState("");

    const [stage, setStage] = useState(1);
    const [nameGroup, setNameGroup] = useState("");

    const closePopupCreateGroup = e => {
        if (popupCreateGroup.current === e.target) {
            setShowPopupCreateGroup(false);
        }
    };
    const handleFindFriends =()=>{
        API.get(endpoints["findFriends"](10, 1, debounced), {headers: headers.headers_token })
        .then((res)=>{
            if(res.data.success){
                const data=res.data.data;
                setSearchResult(data);
                if(listUsers.length>0){
                    for (var i = 0; i < listUsers.length; i++) {
                      for (var j = 0; j < data.length; j++) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            setSearchResult((prev) => {
              return prev.map((item) =>
                item.user.id === id
                  ? { ...item, user: { ...item.user, check: action } }
                  : item
              );
            });
      
            const index = listUsers.findIndex((item) => item.user.id === id);
            // add listUsers
            if (action) {
              if (index >= 0) return;
              if (index < 0)
                setListUsers((prev) => [...prev, searchResult[i]]);
            }
      
            //remove listUsers
            if (!action) {
              setListUsers((prev) => {
                return prev.filter((item) => item.user.id !== id);
              });
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

    const createNewGroupChat = () => {
        if(listUsers.length > 0) {
            const data = {
                "type": 2,
                "name": nameGroup ? nameGroup : [userCreate.name].concat([listUsers[0].user.name]).toString(),
                "memberIds":listUsers.map((user) => user.user.id)
            }
            var config = {
                method: 'post',
                url: 'http://chat.dakshow.com/conversations',
                headers: {
                    'Authorization': getCookieChatToken(),
                    'Content-Type': 'application/json'
                  },
                  data
              };
            axios(config)
            .then((response) =>{
                 if(response.status === 200){
                    SuccessNotification('Tạo nhóm thành công.')
                    setShowPopupCreateGroup(false);
                    handleToggleTab(2);
                    setAddChatGroup(prev => !prev);
                 }
            }).catch((error) => {});
        }
    }

    return (
        <>
            <div className={Styles["overlayPopup"]} ref={popupCreateGroup} onClick={closePopupCreateGroup}>
                <div className={Styles["popupgroup"]}>
                    <div className={Styles["popupgroup__upload-image"]}>
                        <div className={Styles["popupgroup__heading"]}>
                            <h3 className={Styles["popupgroup__title"]}>{content.chat_create_group}</h3>
                            <FaRegTimesCircle className={Styles["popupgroup__icon-close"]} onClick={handleClick}/>
                        </div>
                        {
                            stage === 1 &&
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
                                        placeholder="Enter name..."
                                        onChange={(e)=>setSearchValue((e.target.value))}
                                    />
                                    <FaSearch className={Styles["popupgroup__search-icon"]} />
                                </div>
                                <div className={Styles["popupgroup__offer-heading"]}>
                                    <h4 className={Styles["popupgroup__offer-title"]}>{content.chat_propose}</h4>
                                    <span 
                                        className={Styles["editprofile__offer-delete"]}
                                        onClick={removeAllChoice}
                                    >
                                        {content.chat_remove_all_choices}</span>
                                </div>
                                <ul className={Styles["popupgroup__offer-list"]}>
                                    {searchResult && searchResult.map((item, index)=>(
                                        <OfferItem user={item} key={index} handleClick={(event) =>
                                            handleAddUserTag(item.user.id,!item.user.check)
                                        }/>
                                    ))}
                                </ul>
                                <button className={Styles["btn-submit"]} onClick={()=>setStage(2)}>{content.chat_next_btn}</button>
                            </div>
                        }
                        {
                            stage === 2 && 
                            <div className={Styles["popupgroup__body"]}>
                                <button className={Styles["btn-back"]} onClick={()=>setStage(1)}>
                                    <IoArrowBack/>
                                    Back
                                </button>
                                <div className={Styles["popupgroup__search-box"]}>
                                    <input 
                                        type="text" className={Styles["popupgroup__search-input"]} 
                                        placeholder="Enter group name..."
                                        onChange={(e)=>setNameGroup((e.target.value))}
                                    />
                                    <FaSearch className={Styles["popupgroup__search-icon"]} />
                                </div>
                                <button className={Styles["btn-submit"]} style={{marginTop: "10px"}} onClick={()=>createNewGroupChat()}>{content.chat_create_btn}</button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export function OfferItem({user, handleClick}) {
    return (
        <>
            <li className={Styles["popupgroup__offer-item"]}>
                <div className={Styles["popupgroup__offer-avatar"]}>
                    {/* <Image src={Picture1} alt="Image"/> */}
                    <img className={Styles["people-avatar"]} src={user.user.avatar} style={{objectFit: "cover", width: "100%", height: "100%"}} alt="Avatar"/>
                </div>
                <h3 className={Styles["popupgroup__offer-name"]}>{user.user.name}</h3>
                <input className={Styles["popupgroup__offer-checkbox"]} type="checkbox" onChange={handleClick} value checked={user.user.check ? true : false}/>
            </li>
        </>
    )
}