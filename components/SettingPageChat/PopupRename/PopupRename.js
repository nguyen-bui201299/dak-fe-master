import { useRef, useState, useEffect } from "react";
import Styles from "./PopupRename.module.css";
import API, { endpoints, headers } from "../../../API";
import { AiOutlineEdit } from "react-icons/ai";
import { FaRegTimesCircle } from "react-icons/fa";
import { MdOutlineFileDownloadDone } from "react-icons/md";


export default function PopupRename({handleClick, setShowPopupRename, messContent, userLogin}) {
    var messContentMembers = messContent.conversation.member;
    var idGroup = messContent.conversation.id
    const [name, setName] = useState([]);

    useEffect(() =>{
        var axios = require('axios');
        
        var config = {
            method: 'get',
            url: `http://chat.dakshow.com/conversations/listUser/${idGroup}`,
            headers: headers.headers_token,
        };
        
        axios(config)
        .then(function (response) {
            response.data.data.map(userid =>{
                API.get(endpoints.getDetailProfile(userid.user_id), {
                    headers: headers.headers_token,
                })
                .then(function (res) {
                    if(name.length <= messContentMembers.length){
                        setName(prev =>  [...prev, res.data.data]);
                    }
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

    const popupRename = useRef();
    const closePopupRename = e => {
        if (popupRename.current === e.target) {
            setShowPopupRename(false);
        }
    };
    
    return(
        <>
            <div className={Styles["overlayPopupRename"]} ref={popupRename} onClick={closePopupRename}>
                <div className={Styles["popuprename"]}>
                    <div className={Styles["popuprename__upload-image"]}>
                        <div className={Styles["popuprename__heading"]}>
                            <h3 className={Styles["popuprename__title"]}>Chỉnh sửa biệt danh</h3>
                            <FaRegTimesCircle className={Styles["popuprename__icon-close"]} onClick={handleClick}/>
                        </div>
                        <ul className={Styles["popuprename__list"]}>
                            {
                                name.map((item) =>{
                                    return(
                                        <div key={item.id}>
                                            <li className={Styles["popuprename__item"]}>
                                                <ListMember 
                                                    item={item}
                                                />
                                            </li>
                                        </div>
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

export function ListMember({ item }) {
    const [showInputRename, setShowInputRename] = useState(false);
    
    const handleOpenInputRename = () => {
        setShowInputRename(prev => !prev)
    }

    return(
        <>
            <div className={Styles["popuprename__item-avatar"]}>
                <img src={item.avatar} alt="Avatar"/>
            </div>
            {
                showInputRename ? (
                    <>
                        <InputRename 
                            item={item}
                        />
                        <MdOutlineFileDownloadDone 
                            className={Styles["popuprename__item-icon"]}
                            onClick={handleOpenInputRename}
                        />
                    </>    
                ) : (
                    <>
                        <div className={Styles["popuprename__item-name"]}>
                            <p className={Styles["popuprename__item_name"]}>{item.name}</p>
                            <span style={{fontSize: "10px"}}>Đặt biệt danh</span>
                        </div>
                        <AiOutlineEdit 
                            className={Styles["popuprename__item-icon"]}
                            onClick={handleOpenInputRename}
                        />
                    </>
                )
            }
        </>
    )
}

export function InputRename({ item }) {
    return (
        <>
            <div className={Styles["rename_container"]}>
                <input
                    placeholder={item.name}
                    className={Styles["popuprename__item-input"]}   
                />
            </div>
        </>
    )
}       