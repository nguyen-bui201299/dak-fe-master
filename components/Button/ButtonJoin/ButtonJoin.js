import React, { useState, useEffect, useCallback } from "react";
import Button from "../ButtonJoin/ButtonJoin.module.css";
import API, { endpoints, headers } from "../../../API";
import { NotificationToast } from "../../../modules/Notification/Notification";

import { RiCloseCircleLine } from "react-icons/ri";
import Modal from "../../Modal/Modal-GroupForAdmin/Modal-DeleteGroup/ModalDeleteGroup";
import Router from "next/router";
import { getCookieUserLogin } from "../../../modules/Cookies/Auth/userLogin";

export default function ButtonJoin(props) {
  const { handleOpenModal, isJoin, idGroup } = props;
  const [buttons, setButtons] = useState(true);
  const [params, setParams] = useState(props.isJoin ? "outGroup" : "joinGroup");
  const [superAdmin, setSuperAdmin] = useState();
  const [dataGroup, setDataGroup] = useState();
  const [otherMembers, setOtherMembers] = useState([])
  const [openPopupGrantPermission, setOpenPopupGrantPermission] = useState(false);
  const [openModalDeleteGroup, setOpenModalDeleteGroup] = useState(false);

  const userLogin = getCookieUserLogin()

  const handleClickJoinBtn = useCallback(async () => {
    try {
      setButtons(buttons => !buttons);

      const response = await API.post(
        endpoints[`${params}`](props.idGroup),
        {},
        { headers: headers.headers_token }
      );
      
      if(response.data.success){
        NotificationToast.fire({
          toast: true,
          position: 'bottom-end',
          icon: 'success',
          title: 'Join group successfully!',
        })
        if(props.setIsJoined != undefined){
          props.setIsJoined(props.idGroup)
        }
      }
    } catch (error) {}
  }, [isJoin])

  useEffect(() => {
    API.get(endpoints["getAllMember"](idGroup), {headers: headers.headers_token})
        .then(res => {
            if(res.data.success) {
              setDataGroup(res.data.data)
              const super_admin = res.data.data?.find(data => {
                return userLogin.id === data.owner.id && data.role.includes('SUPER_ADMIN')
              });

              const other_member = res.data.data?.filter(data => {
                return !data.role.includes('SUPER_ADMIN')
              });

              if(super_admin?.owner.id === userLogin.id) {
                setSuperAdmin(super_admin.owner.id);
                setOtherMembers(other_member);
              }
            }
        })
        .catch(err => {})
  },[])

  return (
    <>
      <div className={Button["button-inGroup"]}>
        <div className={Button["button-join"]}>
          <button
            className={`${props.isJoin ? `${Button.group_join_btn} ${Button.group_joined_btn}` : `${Button.group_join_btn}`}`}
            onClick={() => {
              handleClickJoinBtn(props.id);
              if (isJoin && (userLogin.id !== superAdmin)) {
                handleOpenModal()
              }
              if(isJoin && (userLogin.id === superAdmin)) {
                if(dataGroup.length == 1) {
                  setOpenModalDeleteGroup(true);
                }
                else {
                  setOpenPopupGrantPermission(prev => !prev);
                }
              }
            }}
          >
            {isJoin ? "Joined" : "Join"}
          </button>
        {
          openPopupGrantPermission && (
            <PopupGrantPermission 
              otherMembers={otherMembers} 
              idGroup={idGroup}
              setOpenPopupGrantPermission={setOpenPopupGrantPermission}
            />
          )
        }
        {
          openModalDeleteGroup && <Modal setIsOpenDelete={setOpenModalDeleteGroup} />
        }
        </div>
      </div>
    </>
  );
}

export function PopupGrantPermission({ otherMembers, idGroup, setOpenPopupGrantPermission }) {
  const [idUser, setIdUser] = useState();

  const handleGrantPermission = () => {
    if(idUser === undefined) {
      NotificationToast.fire({
        toast: true,
        position: 'top-right',
        icon: 'error',
        title: "You haven't selected the person to grant permission!",
      })
    }
    else {
      API.delete(endpoints["grantPermissionAndOutGroup"](idGroup, idUser), {headers: headers.headers_token})
      .then(res => {
        if(res.data.success){
          Router.push('/group/main-group');
          setOpenPopupGrantPermission(false);
          NotificationToast.fire({
            toast: true,
            position: 'top-right',
            icon: 'success',
            title: "Grant and out group successfully",
          })
        }
      })
      .catch(err => {})
    }
  }
  return (
    <>
      <div className={Button.overlayPopup}>
        <div className={Button.containerPopup}>
          <RiCloseCircleLine className={Button.iconPopup} onClick={() => setOpenPopupGrantPermission(false)} />
          <h2 className={Button.titlePopup}>Bạn phải cấp quyền quản lý nhóm cho người khác trước khi rời nhóm</h2>
          {
            otherMembers.map((member, index) => (
              <div key={member.owner.id} className={Button.listOtherMember}>
                <div className={Button.eachMember}>
                  <label>{member.owner.name}</label>
                  <input type="radio" name="id" onChange={() => setIdUser(member.owner.id)} />
                </div>
              </div>
            ))
          }
          <div className={Button.grantPermission}>
            <button onClick={handleGrantPermission}>Cấp quyền và rời nhóm</button>
          </div>
        </div>
      </div>
    </>
  )
}