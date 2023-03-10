import Head from "next/head";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { BsSearch } from "react-icons/bs";
import { IoEarthSharp } from "react-icons/io5";
import { RiGitRepositoryPrivateLine } from "react-icons/ri";
import API, { endpoints, headers } from "../../../API";
import ButtonJoin from "../../../components/Button/ButtonJoin/ButtonJoin";
import Button from "../../../components/Button/ButtonJoin/ButtonJoin.module.css";
import DropdownGroupForAdmin from "../../../components/Dropdown/DropdownGroup-ForAdmin/Dropdown";
import FormCreatePostGroup from "../../../components/FormCreatePostGroup/FormCreatePostGroup";
import PicturePeopleGroup from "../../../components/Group/component/PicturePeopleGroup";
import Styled from "../../../components/Group/Detail/DetailContentGroup.module.css";
import Layout from "../../../components/Layout/Layout";
import ModalOutGroup from "../../../components/Modal/Modal-OutGroup/Modal";
import {
  NotificationToast,
  SuccessNotification,
} from "../../../modules/Notification/Notification";
import { ToastContainer } from "react-toastify";
import Modal from "../../../components/Modal/Modal-InviteFriend/Modal";
import FormUpdatePost from "../../../components/FormUpdatePost/FormUpdatePost";
import PopupContinueWatching from "../../../components/PopupContinueWatching/PopupContinueWatching";

// Tabs =========================================================================================== 
import GroupTabList from "../../../components/Group/Detail/Tabs/GroupTabList"
import GroupTabs from "../../../components/Group/Detail/Tabs/GroupTabs"
import { deleteGroup } from "../../../redux/slices/groupSlice";
import { getCookieUserLogin } from "../../../modules/Cookies/Auth/userLogin";

export default function MainGroup() {
  const [listPost, setListPost] = useState([]);
  const [detailGroup, setDetailGroup] = useState();
  const [infoGroup, setInfoGroup] = useState();
  const [groupMember, setGroupMember] = useState();
  const [language, setLanguage] = useState("en"); //L??u ng??n ng??? ??ang ch???n
  const [showFormCreatePost, setShowFormCreatePost] = useState(false);
  const [toggleOutgroupModal, setToggleOutgroupModal] = useState(false);
  const [isJoined, setIsJoined] = useState("");
  const [showFormInvitedFriend, setShowFormInvitedFriend] = useState(false);
  const [deletePost, setDeletePost] = useState(false)
  const [showUpdatePost, setShowUpdatePost] = useState(false);
  const [updatePost, setUpdatePost] = useState('');
  const [hasJoined, setHasJoined] = useState(false)
  const [showPostContinue, setShowPostContinue] = useState(false);
  const [postContinue, setPostContinue] = useState();
  const [removeMember, setRemoveMember] = useState(false);
  const [listPendingRequest, setListPendingRequest] = useState([]);
  const [listPostReview, setListPostReview] = useState([]);

  const userLogin = getCookieUserLogin();

  // Redux toolkit
  const dispatch = useDispatch();

  const [toggleState, setToggleState] = useState(2);
  
  const toggleTab = (index) => {
    setToggleState(index);
  };
  const router = useRouter();
  const idGroup = router.query.idGroup;
  
  const DetailGroup = () => {
    if (idGroup != undefined) {
      API.get(endpoints.getDetailGroup(idGroup), {
        headers: headers.headers_token,
      })
        .then((res) => {
          if (res.status == 200) {
            setDetailGroup(res.data);
            setInfoGroup(res.data.group);
          }
        })
        .catch((err) => {});
    }
  };

  // =======================================================================================================
  // ======================================================================= Ch??? Duy???t v??o nh??m ============
  // ============ L???y API list xin v??o nh??m
  useEffect(() => {
    if(idGroup) {
      // L???y list join request
      API.get(endpoints["getListReqJoin"](idGroup, 10, 1), {
        headers: headers.headers_token,
      })
        .then((json) => {
          setListPendingRequest(json.data.data)
        })
        .catch((error) => {});

      // L???y list post review
      API.get(endpoints["getListPostReview"](idGroup, 10, 1), {
        headers: headers.headers_token,
      })
        .then((json) => {
          setListPostReview(json.data.data)
          // console.log(listPostReview);
        })
        .catch((error) => {});
    }
  }, [idGroup]);


  // =============== L???y list post review

  useEffect(() => {
    if(idGroup) {
      API.get(endpoints["getListPostReview"](idGroup, 10, 1), {
        headers: headers.headers_token,
      })
        .then((json) => {
          setListPostReview(json.data.data)
          // console.log(listPostReview);
        })
        .catch((error) => {});
    }
  }, [idGroup, toggleState]);
  // console.log({listPostReview})
  

  // ============ Ki???m tra ng?????i d??ng c?? t???n t???i kh??ng
  const userIsExist = async (userId) => {
    try {
      const user = await API.get(endpoints["getDetailProfile"](userId), {
        headers: headers.headers_token,
      })
        .then((json) => {
          return json.data.data;
        })
        .catch((error) => {});

      // N???u ng?????i d??ng t???n t???i, request l??n back-end
      if (user) {
        return true;
      } else {
        return false;
      }
    } catch (error) {}
  };

  // ============ X??? l?? button ?????ng ?? v?? t??? ch???i tham gia nh??m
  const handleOnRequestPending = async (reqId, userId, isAccept) => {
    if (isAccept) {
      await API.post(
        endpoints.responseInviteGroup(idGroup, reqId, "accept"),
        {},
        { headers: headers.headers_token }
      )
        .then((json) => {
          setListPendingRequest((prevState) => {
            const newListPendingRequest = prevState.filter(
              (item) => item.Join_request.id !== reqId
            );
            return newListPendingRequest;
          });
          if (json.data.success) {
            NotificationToast.fire({
              toast: true,
              position: 'top-right',
              icon: 'success',
              title: `Duy???t th??nh vi??n v??o nh??m th??nh c??ng!`,
          })
          }
          handleHasJoined()
          return json.data;
        })
        .catch((error) => {});
    } else {
      await API.post(
        endpoints.responseInviteGroup(idGroup, reqId, "deny"),
        {},
        { headers: headers.headers_token }
      )
        .then((json) => {
          setListPendingRequest((prevState) => {
            const newListPendingRequest = prevState.filter(
              (item) => item.Join_request.id !== reqId
            );
            if (json.data.success) {
              NotificationToast.fire({
                toast: true,
                position: 'top-right',
                icon: 'success',
                title: "T??? ch???i th??nh c??ng!",
            })
            }
            return newListPendingRequest;
          });
          return json.data;
        })
        .catch((error) => {});
    }
  };

  // =======================================================================================================
  // ============================================================= X??a th??nh vi??n kh???i nh??m
  const handleOnKickMember = useCallback(async (groupId, userId) => {
    API.delete(endpoints['kickMember'](groupId, userId), {headers: headers.headers_token})
      .then(res => {
        if(res.data.success) {
            setRemoveMember(false)
            return res.data.data
        }
      })
      .catch(err => {})
  }, [])

  // Handle ng?????i d??ng khi tho??t kh???i group
  const handleOutGroup = useCallback(async () => {
    // const allGroup = await API.get(endpoints["findGroup"](200, 1, ""), {
    //   headers: headers.headers_token,
    // })
    //   .then((res) => {
    //     return res.data.data;
    //   })
    //   .catch((error) => console.log(error));

    // // Ki???m tra xem group c?? t???n t???i hay kh??ng
    // const groupExists = await allGroup.find((data) => {
    //   return data.group.id === idGroup;
    // });

    // N???u t???n t???i th?? x??a group
      await API.delete(endpoints["outGroup"](idGroup), {
        headers: headers.headers_token,
      })
        .then((res) => {
          if (res.status === 200) {
            NotificationToast.fire({
              toast: true,
              position: 'bottom-end',
              icon: 'success',
              title: 'Out group successfully',
            })
            setToggleOutgroupModal(false);
            setIsJoined(false);
            setGroupMember("");
          }
        })
        .catch((error) => {});
  }, [idGroup]);

  // Xo?? nh??m (Quy???n c???a admin)
  const handleDeleteGroup = () => {
    if(infoGroup.id != undefined){
      var data = JSON.stringify({
        group_id: infoGroup.id
      });
        API.delete(endpoints.deleteGroup,{data: data, headers: headers.headers_token})
            .then((response) =>{
                    if(response.data.code == 200) {
                        NotificationToast.fire({
                          toast: true,
                          position: 'top-right',
                          icon: 'success',
                          title: `X??a nh??m th??nh c??ng`,
                      })
                        setTimeout(() => {
                            Router.push("/group/main-group");
                        }, 1000)
                    }
                    else {
                        NotificationToast.fire({
                          toast: true,
                          position: 'top-right',
                          icon: 'success',
                          title: `X??a nh??m th???t b???i`,
                      })
                    }
                }
            )
            .catch((error) => {})
    }
}

  // N???u user click v??o n??t tham gia/tho??t nh??m th?? s??? render l???i to??n b??? Group ????

  const handleOpenModal = () => {
    setToggleOutgroupModal((toggleOutgroupModal) => !toggleOutgroupModal);
  };

  useEffect(() => {
    API.get(endpoints.getGroupPost(idGroup), {
      headers: headers.headers_token,
    })
      .then((res) => {
        setListPost(res.data.data);
      })
      .catch((err) => {});
  }, [idGroup, deletePost, toggleState]);

  // Hi???n ra c??c th??ng tin c???a nh??m ???? khi nh???n tham gia, ???n n???u ch??a tham gia (Cho nh??m c??ng khai)
  useEffect(() => {
    DetailGroup();
    if (idGroup != undefined) {
      API.get(endpoints.getAllMember(idGroup), {
        headers: headers.headers_token,
      })
        .then((res) => {
          if (res.data.success) {
            setGroupMember(res.data.data);
          }
        })
        .catch((err) => {});
    }
  }, [isJoined, hasJoined, removeMember, detailGroup?.member_count, idGroup]);

  const handleHasJoined = () => setHasJoined(!hasJoined)

  const openModal = () => {
    setShowFormCreatePost((prev) => !prev);
  };

  // modal m???i b???n b??
  const openInviteFriends = () => {
    setShowFormInvitedFriend((prev) => !prev);
  };

  const isDeleted = () => setDeletePost(!deletePost)
  // Update post
  const handleShowFormUpdatePost = (post,type) => {
    setShowUpdatePost(showUpdatePost => !showUpdatePost);
    setUpdatePost(post);
  };

  return (
    <Layout page="maingroup">
        <Head>
          <title>DAK - Detail</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          {/* <link
            href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          /> */}
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
            integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
        </Head>
        <ToastContainer />
        <div id="something" className={Styled.main}>
          <div className={Styled["main-Detail"]}>
            <div className={Styled["other-thing"]}>
              <BsSearch
                style={{
                  color: "var(--text-color)",
                  fontSize: "20px",
                  cursor: "pointer",
                  marginRight: "20px",
                }}
              />
              <div>
                  <DropdownGroupForAdmin
                  style={{ fontSize: "24px", color: "var(--text-color)" }}
                  permission={detailGroup?.owner?.id === userLogin?.id}
                  infoGroup={infoGroup}
                  setInfoGroup={setInfoGroup}
                  handleHasJoined={handleHasJoined}
                  handleDeleteGroup={handleDeleteGroup}
                  />
              </div>
            </div>
            <img
              src={infoGroup?.background_img}
              alt="picture-group"
              width={1000}
              height={350}
            ></img>
            <div className={Styled["main-Detail-Content"]}>
              <div className={Styled["name-number-Group"]}>
                  {/* ch??? n??y ????? t??n nh??m */}
                  <h3 className={Styled["name-group"]}>{infoGroup && infoGroup.name}</h3>
                
                  {infoGroup && infoGroup.access === 1 ? (
                    <p>
                      {/* ch??? n??y ????? lo???i nh??m v?? s??? l?????ng th??nh vi??n c???a nh??m */}
                      <IoEarthSharp
                        style={{
                          position: "relative",
                          top: "3",
                          fontSize: "16px",
                          marginRight: "5px",
                        }}
                      />
                      Public group - {detailGroup && detailGroup.member_count} members
                    </p>
                  ) : (
                    <p>
                      {/* ch??? n??y ????? lo???i nh??m v?? s??? l?????ng th??nh vi??n c???a nh??m */}
                      <RiGitRepositoryPrivateLine
                        style={{
                          position: "relative",
                          top: "3",
                          fontSize: "16px",
                          marginRight: "5px",
                        }}
                      />
                      Private group - {detailGroup && detailGroup.member_count} members
                    </p>
                  )}
                <div className={Styled["member-avatar"]}>
                  {groupMember && groupMember.length < 5
                    ? groupMember.map((member, index) => (
                        <PicturePeopleGroup
                          avatar={member.owner.avatar}
                          key={index}
                        />
                      ))
                    : groupMember &&
                      groupMember
                        .slice(0, 11)
                        .map((member, index) => (
                          <PicturePeopleGroup
                            avatar={member.owner.avatar}
                            key={index}
                          />
                        ))}
                  {groupMember && groupMember.length >= 5 && (
                    <span className={Styled["picture-people-Group"]}>
                      <Image
                        src={"/images/istockphoto-1186972006-612x612.jpg"}
                        alt="other-user"
                        width={35}
                        height={35}
                      />
                    </span>
                  )}
                  </div>
              </div>
              <div className={Button["button-Group"]}>
                {detailGroup?.has_joined && (
                  <button className={Button.group_create_post} onClick={openModal}>
                    <span>Create Post</span>
                  </button>
                )}
                {detailGroup?.has_joined && (
                  <button className={Button.group_invite_btn} onClick={openInviteFriends}>
                    <span>Invite</span>
                  </button>
                )}
                <ButtonJoin
                  isJoin={detailGroup?.has_joined}
                  idGroup={idGroup}
                  setIsJoined={setIsJoined}
                  handleOpenModal={handleOpenModal}
                />

                {toggleOutgroupModal && (
                  <ModalOutGroup
                    handleOutGroup={handleOutGroup}
                    handleOpenModal={handleOpenModal}
                  />
                )}
              </div>
            </div>
            {/* Tab links */}
            <GroupTabList 
              toggleTab={toggleTab} 
              toggleState={toggleState} 
              groupMember={groupMember} 
              detailGroup={detailGroup}
            />
          </div>

          <GroupTabs
            groupDetail={DetailGroup}
            listPost={listPost}
            toggleTab={toggleTab}
            groupMember={groupMember}
            detailGroup={detailGroup} 
            toggleState={toggleState} 
            infoGroup={infoGroup}
            currentGroupId={idGroup}
            handleOnRequestPending={handleOnRequestPending}
            listPendingRequest={listPendingRequest}
            userIsExist={userIsExist}
            setRemoveMember={setRemoveMember}
            handleOnKickMember={handleOnKickMember}
            isDeleted={isDeleted}
            setPostContinue={setPostContinue}
            setShowPostContinue={setShowPostContinue}
            listPostReview={listPostReview}
            setListPostReview={setListPostReview}
          />
        </div>

        {showFormInvitedFriend && (
          <Modal
            handleClick={() => setShowFormInvitedFriend(!showFormInvitedFriend)}
            setShowFormInvitedFriend={setShowFormInvitedFriend}
            idGroup={idGroup}
            groupMember={groupMember}
          />
        )}
        {showPostContinue && postContinue && (
          <PopupContinueWatching
            post={postContinue}
            showModal={showPostContinue}
            setShowModal={setShowPostContinue}
          />
        )}
        <FormCreatePostGroup
          language={language}
          showmodal={showFormCreatePost}
          setShowModal={setShowFormCreatePost}
          idGroup={idGroup}
          setListDetailPostGroup={setListPost}
        />
        {showUpdatePost && (
          <FormUpdatePost
            showmodal={showUpdatePost}
            setShowModal={setShowUpdatePost}
            postUpdate={updatePost}
            setListPostProfile={setListPost}
            listPostProfile={listPost}
          />
        )}
      </Layout>
  );
}