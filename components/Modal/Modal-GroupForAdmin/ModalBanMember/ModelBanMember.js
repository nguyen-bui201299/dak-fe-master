import styles from "../../Modal.module.css";
import { RiCloseLine } from "react-icons/ri";
import React, { useEffect, useState, useRef, useCallback } from "react";
import API, { endpoints, headers } from "../../../../API";
import { getCookieUserLogin } from "../../../../modules/Cookies/Auth/userLogin";
import { NotificationToast } from "../../../../modules/Notification/Notification";

const ModalBan = ({
  groupId,
  userId,
  setToggleBanModal,
  toggleBanModal,
  scrollPosition,
  setRemoveMember,
  setUserListBan,
  setListMembersGroup,
  groupDetail,
  setShowBoxDropdown
}) => {
  const userLogin = getCookieUserLogin();

  const [content, setContent] = useState({});
  const [contentNoti, setContentNoti] = useState({});

  const getScrollPosition = useRef();
  const [currentUserName, setCurrentUserName] = useState();
  if (scrollPosition > 0) {
    getScrollPosition.current = scrollPosition;
  }

  useEffect(() => {
    if (userLogin.language !== undefined) {
      setContent(require(`../languages/${userLogin.language}.json`));
    } else {
      setContent(require(`../languages/en.json`));
    }
  }, [userLogin]);
  
  useEffect(() => {
    if (userLogin.language !== undefined) {
      setContentNoti(require(`../languages/notification/${userLogin.language}.json`));
    } else {
      setContentNoti(require(`../languages/notification/en.json`));
    }
  }, [userLogin]);

  useEffect(() => {
    window.scrollTo(0, getScrollPosition.current);
  }, [toggleBanModal, scrollPosition]);

  useEffect(() => {
    API.get(endpoints["user/profile"](userId), {
      headers: headers.headers_token,
    })
      .then((res) => {
        setCurrentUserName(res.data.data.name);
      })
      .catch((err) => {});
  }, []);

  const handleUsersBan = () => {
    API.get(endpoints["listUsersBan"](groupId, 10, 1), {
      headers: headers.headers_token,
    })
      .then((res) => {
        setUserListBan(res.data.data);
      })
      .catch((err) => {});
  };

  const handleMemberGroup = () => {
    API.get(endpoints.getAllMember(groupId), {
      headers: headers.headers_token,
    })
      .then((res) => {
        setListMembersGroup(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleBanMember = async (groupId, userId) => {
    let data = JSON.stringify({
      reason: "ok",
      user_ids: [userId],
    });
    await API.put(endpoints.banUserGroupAdmin(groupId), data, {
      headers: headers.headers_token,
    })
      .then((res) => {
        if (res.data.success) {
          NotificationToast.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: `${contentNoti.ban_successfully}`,
          });
          handleUsersBan();
          handleMemberGroup();
          groupDetail();
          setShowBoxDropdown(false);
        }
      })
      .catch((err) => {
        NotificationToast.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Ban user fail!",
        });
      });
  };

  return (
    <>
      <div className={styles.darkBG} toggleBanModal={toggleBanModal} />
      <div className={styles.centered} styles={{ overflow: "hidden" }}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h5 className={styles.heading}>{content.ban_member}</h5>
          </div>
          <button
            className={styles.closeBtn}
            onClick={() => setToggleBanModal(!toggleBanModal)}
          >
            <RiCloseLine style={{ marginBottom: "-3px" }} />
          </button>
          <div className={styles.modalContent}>
            <span>{content.ban_member_asking}</span>
            <span><b style={{color: "var(--main-color)"}}>{currentUserName && currentUserName}</b></span>
          </div>
          <div className={styles.modalActions}>
            <div className={styles.actionsContainer}>
              <button
                className={styles.deleteBtn}
                onClick={() => {
                  setRemoveMember(true);
                  setToggleBanModal(!toggleBanModal);
                  handleBanMember(groupId, userId);
                }}
              >
                {content.kick_member_yes_btn}
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => setToggleBanModal(!toggleBanModal)}
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

export default ModalBan;
