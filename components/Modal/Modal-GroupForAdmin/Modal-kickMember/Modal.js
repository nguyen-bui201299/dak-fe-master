import styles from "../../Modal.module.css";
import { RiCloseLine } from "react-icons/ri";
import React, { useEffect, useState, useRef } from "react";
import API, {endpoints, headers} from "../../../../API";
import { getCookieUserLogin } from "../../../../modules/Cookies/Auth/userLogin";

const Modal = ({ groupId, userId, handleOnKickMember, setToggleKickModel, toggleKickModal, scrollPosition, setRemoveMember}) => {

  const userLogin = getCookieUserLogin()

  const [content, setContent] = useState({});

  const getScrollPosition = useRef()
  const [currentUserName, setCurrentUserName] = useState()
  if (scrollPosition > 0) {
    getScrollPosition.current = scrollPosition
  }

  useEffect(() => {
    if (userLogin.language !== undefined) {
      setContent(require(`../languages/${userLogin.language}.json`));
    } else {
      setContent(require(`../languages/en.json`));
    }
  }, [userLogin]);

  useEffect(() => {
    window.scrollTo(0, getScrollPosition.current)
  }, [toggleKickModal, scrollPosition])

  useEffect(() => {
    API.get(endpoints['user/profile'](userId), {headers: headers.headers_token})
    .then(res => {
      setCurrentUserName(res.data.data.name);
    })
    .catch(err => console.log(err))
  }, [])

  // const handleOnKickMember = () => {
  //   API.delete(endpoints['kickMember'](groupId.current, userId), {headers: headers.headers_token})
  //     .then(res => {
  //       console.log(res.data)
  //       if(res.data.success) {
  //           console.log(res.data)
  //           setIsOpenKick(false)
  //           setKick(true)
  //           setIsOpenUser(false)
  //       }
  //     })
  //     .catch(err => console.log(err))
  // }

  // useEffect(() => {
  //   API.delete(endpoints['kickMember'](groupId, userId), {headers: headers.headers_token})
  //     .then(res => {
  //       console.log(res)
  //     })
  //     .catch(err => console.log(err))
  // }, [groupId, userId])

  return (
    <>
      <div className={styles.darkBG} toggleKickModal={toggleKickModal}/>
      <div className={styles.centered} styles={{overflow: "hidden"}}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h5 className={styles.heading}>{content.kick_member_ban}</h5>
          </div>
          <button
            className={styles.closeBtn}
            onClick={() => setToggleKickModel(!toggleKickModal)}
          >
            <RiCloseLine style={{ marginBottom: "-3px" }} />
          </button>
          <div className={styles.modalContent}>
            <span>{content.kick_member_asking}</span>
            <span>{currentUserName && currentUserName} from group ?</span>
          </div>
          <div className={styles.modalActions}>
            <div className={styles.actionsContainer}>
              <button
                className={styles.deleteBtn}
                onClick={() => {
                  setRemoveMember(true)
                  setToggleKickModel(!toggleKickModal)
                  handleOnKickMember(groupId, userId)
                  }}
              >
                {content.kick_member_yes_btn}
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => setToggleKickModel(!toggleKickModal)}
              >
                {content.kick_member_cancel_btn}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
