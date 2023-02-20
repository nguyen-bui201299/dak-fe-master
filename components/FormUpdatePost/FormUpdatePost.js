import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import {
  AiFillCaretDown, AiOutlineCloseCircle, AiOutlineGlobal, AiOutlineLink
} from "react-icons/ai";
import { FaAngleLeft, FaPaste, FaRegGrinBeam, FaSearch, FaUserPlus } from "react-icons/fa";
import { IoClose, IoEarth } from "react-icons/io5";
import { RiGitRepositoryPrivateLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { animated, useSpring } from "react-spring";
import API, { endpoints, headers } from "../../API";
import { getCookieUserLogin } from "../../modules/Cookies/Auth/userLogin";
import { NotificationToast } from "../../modules/Notification/Notification";
import { updatePostThunk } from "../../redux/slices/postSlice";
import Styled from "./FormUpdatePost.module.css";
import InputContentPost from "./InputContentPost/InputContentPost";


const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });

export default function FormUpdatePost({
  showmodal,
  setShowModal,
  postUpdate,
  isDeletePost,
  setIsDeletePost,
  listPostProfile,
  setListPostProfile,
}) {
  const modalRef = useRef();
  const closeButton = useRef();
  const [titlePopup, setTitlePopup] = useState("");
  const [openInputLink, setOpenInputLink] = useState(false); //false
  const [openFormUpdatePost, setOpenFormUpdatePost] = useState(true); //true
  const [openFormTagUsers, setOpenFormTagUsers] = useState(false); //false
  const [openFormChangePermission, setOpenFormChangePermission] = useState(false);

  // Sate bài viết, tìm bạn bè, link bài viết, quyền riêng tư,...
  const [permission, setPermission] = useState(postUpdate.post.post_access);
  const [previewStatus, setPreviewStatus] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [link, setLink] = useState("");
  const [debounced, setDebouncedValue] = useState("");

  const [searchResult, setSearchResult] = useState([]);
  const [taged, setTaged] = useState([]);
  // Change post_access 
  const [valuePostAccess, setValuePostAccess] = useState(false);
  const [valueToChange, setValueToChange] = useState(permission);
  //Dùng cho việc chọn icon lần đầu hay lần sau
  const selectIcon = useRef(true)
  //start select icon on form 
  const [showPicker, setShowPicker] = useState(false);

  let menuRef = useRef();
 
  const [holderIcon, setHolderIcon] = useState();
  const [isTyping, setIsTyping] = useState(false);

  // Redux Toolkit section
  const dispatch = useDispatch();

  const onEmojiClick = (event, emojiObject) => {
    const editor = document.getElementById("editor")
        
    pasteHtmlAtCaret(`${emojiObject.emoji}`,editor)
    setHolderIcon(false)
  };


  function pasteHtmlAtCaret(html,editor) {
    editor.focus();
    let sel = window.getSelection();
    if (window.getSelection) {
      // IE9 and non-IE
      if (sel.getRangeAt && sel.rangeCount) {
        var range = sel.getRangeAt(0);
        // 
        if(selectIcon.current === true){
            range.selectNodeContents(editor);
            range.collapse(false);
        }
        const el = document.createElement("div");
        el.innerHTML = html;
        let frag = document.createDocumentFragment(),
          node,
          lastNode;
        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node);
        }
        range.insertNode(frag);
        if (lastNode) {
          range = range.cloneRange();
          range.setStartAfter(lastNode);
          if(selectIcon.current === false){
            range.collapse(true);
          }
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    } else if (document.selection && document.selection.type != "Control") {
      // IE < 9
      document.selection.createRange().pasteHTML(html);
    }
    selectIcon.current = false;
  }
  //restart selectIcon
  useEffect(() => {
    if(showPicker === false){
        selectIcon.current = true
    }
}, [showPicker]);
  // Add emoji at any position in the input
  const handleChangeLink = e =>{
    setLink(e.target.value);
  }
   // Click outside to close Emoji
   useEffect(() =>{
    let handler = event =>{
        // Nếu menu đang mở và click bên ngoài khu vực container của box emoji thì tắt
        if(menuRef.current && !menuRef.current.contains(event.target)){
            setShowPicker(false);
        }
    };
    document.addEventListener("click", handler);
    return () =>{
        document.removeEventListener("click", handler);
    }
}, [])

//end select icon on form

  const userLogin = getCookieUserLogin()

  const [content, setContent] = useState({});

  useEffect(() => {
    if (userLogin.language !== undefined) {
      setContent(require(`./languages/${userLogin.language}.json`));
    }
  }, [userLogin])

  // Debounce search value
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchValue]);

  

  useEffect(()=>{
    // console.log({postUpdate});
    setPreviewStatus(postUpdate.post.caption)
    setLink(postUpdate.post.post_url)
    setTaged(postUpdate.tag_users)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  // Search friends
  const handleFindFriends = () => {
    API.get(endpoints.findFriends(10, 1, debounced), {
      headers: headers.headers_token,
    })
      .then((res) => {
        const data = res.data.data;
        // console.log("search", data);
        setSearchResult(data);
        if (taged?.length > 0) {
          for (var i = 0; i < taged?.length; i++) {
            for (var j = 0; j < data?.length; j++) {
              if (data[j].user.id === taged[i]?.id) {
                setSearchResult((prev) => [...prev], (data[j].user.check = true));
              }
            }
          }
        }
        setSearchResult(data);
      })
      .catch((err) => console.log("err", err));
  }

  useEffect(() => {
    handleFindFriends();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const animation = useSpring({
    config: {
      duration: 200,
    },
    opacity: showmodal ? 1 : 0,
    transform: showmodal ? "translateY(0%)" : `translateY(100%)`,
  });

  const closeModal = (e) => {
    if (
      modalRef.current === e.target ||
      e.currentTarget === closeButton.current
    ) {
      setShowModal(false);
      setTaged([]);
      setSearchResult([]);
      setSearchValue("");
      setOpenInputLink(false);
      setOpenFormChangePermission(false);
      setTitlePopup("Chỉnh sửa bài viết");
      setOpenFormUpdatePost(false);
      setOpenFormTagUsers(false);
    }
  };

  const handleShowInputLink = () => {
    setOpenInputLink(!openInputLink);
  };

  const handleShowFormTagUsers = () => {
    setTitlePopup("Tags bạn bè");
    setOpenFormUpdatePost(!openFormUpdatePost);
    setOpenFormTagUsers(!openFormTagUsers);
    handleFindFriends();
  };

  //prev = 1 là form update post
  const handlePassPreForm = () => {
    setTitlePopup("Chỉnh sửa bài viết");
    setOpenFormUpdatePost(true);
    setOpenFormTagUsers(false);
    setOpenFormChangePermission(false);
  };

  const handleAddUserTag = (event, id, action) => {
    for (var i = 0; i < searchResult.length; i++) {
      if (searchResult[i].user.id === id) {
        // Add check to checked item
        setSearchResult((prev) => [...prev], (searchResult[i].user.check = action));
        const index = taged?.findIndex(item => item.id === id);
        // add friend taged
        if (action) {
          if (index >= 0) return;
          if (index < 0) setTaged((prev) => [...prev, searchResult[i].user]);
        }

        //remove taged
        if (!action) {
          const tagedSlice = taged?.splice(index, 1);
          const newTaged = taged?.filter((prev) => prev.id !== tagedSlice.id);
          // console.log("newTaged", newTaged);
          setTaged(newTaged);
        }
        break;
      }
    }
    setDebouncedValue("");
    setSearchValue("");
  };

  const handleShowFormChangePermission = () => {
    setTitlePopup("Thay đổi quyền riêng tư");
    setOpenFormChangePermission(true);
    setOpenFormUpdatePost(false);
    setOpenFormTagUsers(false);
  };

  const handleUpdatePost = () => {
    //validate content form
    let validate;
    let statusInput = document.getElementById("editor").innerHTML;
    if(statusInput.includes("<br>")){
      const temp = statusInput.split("<br>").filter((item) => item.replaceAll("&nbsp;"," ").trim() !== "")
      validate = temp.length > 0
      statusInput = temp.join("/n")
    }
    else{
      if(statusInput.trim() === ""){
        validate = false
      }
      else{
        validate = true
      }
    }
    if(statusInput.includes("&nbsp;")){
      statusInput = statusInput.replaceAll("&nbsp;"," ")
    }
    const data = {
      "post_id": postUpdate.post.id,
      "caption": statusInput,
      // "friends": taged.map(prev => prev.id)
      "friends": [],
      "post_access": permission,
      "post_url": link,
    }
    if (!validate) {
      NotificationToast.fire({
        toast: true,
        position: 'top-end',
        icon: 'warning',
        title: `${content.empty_content}`,
      })
    }
    else{
      // API.put(endpoints['updatePost'], data, { headers: headers.headers_token })
      dispatch(updatePostThunk({ data })).unwrap()
        .then(res => {
          if (res.data.success) {
            setListPostProfile(listPostProfile.map(
              item => item.post.id == res.data.data.id ? {...item, post :res.data.data } : item
            ))
            NotificationToast.fire({
              toast: true,
              position: 'bottom-end',
              icon: 'success',
              title: `${content.success}`,
            })
          }
        })
        .catch(err => {
          // ErrorNotification(content.error)
            NotificationToast.fire({
              toast: true,
              position: 'bottom-end',
              icon: 'error',
              title: `${content.error}`,
            })
        })
        .finally(() => {
          setShowModal(false);
          setSearchResult([]);
          setSearchValue("");
          setOpenInputLink(false);
          setOpenFormChangePermission(false);
          setTitlePopup("Chỉnh sửa bài viết");
          setOpenFormUpdatePost(false);
          setOpenFormTagUsers(false);
        })
    }
  }

  const handleSave = (e) => {
    setPermission(valueToChange);
    handlePassPreForm(e);
    setValuePostAccess(true);
  }

  return (
    <>
      <div
        className={Styled.overlayFormCreatePost}
        ref={modalRef}
        onClick={closeModal}
      >
        <animated.div style={animation}>
          <div className={Styled.formCreatePost}>
            <div className={Styled.formHeader}>
              <h2 className={Styled.formTitle}>{content.titlePopup}</h2>
              <button
                className={Styled.btnGetOut}
                onClick={closeModal}
                ref={closeButton}
              >
                <AiOutlineCloseCircle />
              </button>
            </div>
            <div className={Styled.formBody}>
              {openFormUpdatePost && (
                <div className={Styled.createPost}>
                  <div className={Styled.avtAndName}>
                    <img
                      className={Styled.avt}
                      src={userLogin.avatar}
                      alt="avatar"
                    />
                    <h2 className={Styled.name}>{userLogin.name}</h2>
                    <div
                      className={Styled.viewingRights}
                      onClick={handleShowFormChangePermission}
                    >
                      { permission === 1 ?
                          <IoEarth className={Styled.iconViewingRights} /> :
                          <RiGitRepositoryPrivateLine className={Styled.iconViewingRights} />
                      } 
                      <AiFillCaretDown className={Styled.iconDown} />
                    </div>
                  </div>
                  <div className={Styled.inputLinkAndContent} ref ={menuRef}>
                    <InputContentPost holderIcon={holderIcon} setHolderIcon={setHolderIcon} setIsTyping = {setIsTyping} previewStatus={previewStatus} setShowPicker = {setShowPicker} />
                    {openInputLink && (
                      <div className={Styled.boxInputLink}>
                        <input
                          onChange={handleChangeLink}
                          className={Styled.inputLink}
                          value={link ? link : ""}
                          placeholder={content.inputLink}
                        />
                        <button className={Styled.btnPasteLink}>
                          <FaPaste className={Styled.iconPasteLink} />
                        </button>
                      </div>
                    )}
                    <div className={Styled.boxFunctionAndBtnPost}>
                      <div className={Styled.boxFunction}>
                        <AiOutlineLink
                          className={Styled.iconFunction}
                          onClick={handleShowInputLink}
                        />
                        <FaRegGrinBeam
                              className={`${Styled.iconFunction} ${Styled.buttonIcon}`}
                              type='button'
                              onClick={() => setShowPicker(val => !val)}
                          />
                          {showPicker && <Picker
                          pickerStyle={{ width: '40%', position: 'absolute', bottom: '0', left: '15%', zIndex: 200}}
                          onEmojiClick={onEmojiClick} />}
                        {/* <FaUserPlus
                          className={Styled.iconFunction}
                          onClick={handleShowFormTagUsers}
                        /> */}
                      </div>
                      <div className={Styled.boxBtnPost}>
                        {isTyping || link || valuePostAccess ?
                          <button
                            className={Styled.btnPost}
                            onClick={handleUpdatePost}
                          >
                            {content.btnPost}
                          </button> : ""
                        }
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {openFormChangePermission && (
                <div className={Styled.formChoosePermission}>
                  <div
                    className={Styled.pass}
                    onClick={(event) => handlePassPreForm(event)}
                  >
                    <FaAngleLeft className={Styled.iconPass} />
                    <h4 className={Styled.titleFormPost}>{content.titleFormPost}</h4>
                  </div>
                  <div className={Styled.save}>
                    <h4 style={{color: "var(--main-color)"}} onClick={(e) => handleSave(e)}>Save</h4>
                  </div>
                  <form className={Styled.areaChoosePermission}>
                    <div
                      className={Styled.areaPress}
                      onClick={() => setValueToChange(Number(1))}
                    >
                      <AiOutlineGlobal className={Styled.iconPermission} />
                      <label className={Styled.choosePermission}>
                        {content.public}
                        <input
                          className={Styled.inputChoose}
                          type="radio"
                          value="1"
                          name="permission"
                          checked={valueToChange === 1 ? true : false }
                        />
                      </label>
                    </div>
                    <div 
                      className={Styled.areaPress}
                      onClick={() => setValueToChange(Number(2))}
                    >
                      <RiGitRepositoryPrivateLine />
                      <label className={Styled.choosePermission}>
                        {content.private}
                        <input
                          className={Styled.inputChoose}
                          type="radio"
                          value="2"
                          name="permission"
                          checked={valueToChange === 2 ? true : false }
                        />
                      </label>
                    </div>
                    {/* <button className={Styled.btnSavePermission}> Lưu </button> */}
                  </form>
                </div>
              )}

              {openFormTagUsers && (
                <div className={Styled.formTagsUser}>
                  <div
                    className={Styled.pass}
                    onClick={(event) => handlePassPreForm(event)}
                  >
                    <FaAngleLeft className={Styled.iconPass} />
                    <h4 className={Styled.titleFormPost}>{content.titlePopup}</h4>
                  </div>
                  <div className={Styled.boxInputSearch}>
                    <input
                      className={Styled.inputSearch}
                      placeholder={content.findFriends}
                      onChange={(e) => setSearchValue(e.target.value)}
                      value={searchValue}
                    />
                    <FaSearch className={Styled.buttonSearch} />
                  </div>

                  <div className={Styled.taggedUserList}>
                    <p className={Styled.title}>{content.tags} </p>
                    {taged?.length > 0 &&
                      taged.map(
                        (user) =>
                        (
                          <div
                            className={Styled.user}
                            key={user.id}
                            onClick={(event) =>
                              handleAddUserTag(event, user.id, false)
                            }
                          >
                            <h2 className={Styled.name}>
                              {user.name}
                            </h2>
                            <IoClose
                              className={Styled.close}
                            />
                          </div>
                        )
                      )}
                  </div>

                  <div className={Styled.usersSearchResults}>
                    {searchResult.map((user) => (
                      <div className={Styled.user} key={user.user.id}>
                        <img className={Styled.avt} src={user.user.avatar} alt="avatar"/>
                        <h2
                          className={Styled.name}
                          onClick={(event) =>
                            handleAddUserTag(
                              event,
                              user.user.id,
                              !user.user.check
                            )
                          }
                        >
                          {user.user.name}
                        </h2>
                        <div
                          className={`${user.user.check && Styled.checkBox}
                             ${user.user.check && Styled.checkBox2} 
                             ${!user.user.check && Styled.checkBox3}`}
                          onClick={(event) =>
                            handleAddUserTag(
                              event,
                              user.user.id,
                              !user.user.check
                            )
                          }
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </animated.div>
      </div>
    </>
  );
}
