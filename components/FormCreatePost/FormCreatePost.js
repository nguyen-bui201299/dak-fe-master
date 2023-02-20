import Styled from "./FormCreatePost.module.css";
import API, { endpoints, headers } from "../../API";
import InputContentPost from "./InputContentPost/InputContentPost";
import React, { useEffect, useRef, useState } from "react";
import { useSpring, animated } from "react-spring";
import { IoEarth, IoClose } from "react-icons/io5";
import {
  AiFillCaretDown,
  AiOutlineLink,
  AiOutlineGlobal,
  AiOutlineCloseCircle
} from "react-icons/ai";
import { FaPaste, FaUserPlus, FaAngleLeft, FaSearch, FaRegGrinBeam } from "react-icons/fa";
import { RiGitRepositoryPrivateLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import { createPostThunk } from '../../redux/slices/postSlice'
import { NotificationToast } from "../../modules/Notification/Notification";
import { getCookieUserLogin } from "../../modules/Cookies/Auth/userLogin";

const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });

export default function FormCreatePost({
  language,
  showmodal,
  setShowModal,
  setListPostProfile,
  setShowFormCreatePost,
}) {
    
  const modalRef = useRef();
  const closeButton = useRef();
  const [titlePopup, setTitlePopup] = useState("Đăng bài");
  const [openInputLink, setOpenInputLink] = useState(false); //false
  const [openFormCreatePost, setOpenFormCreatePost] = useState(true); //true
  const [openFormTagUsers, setOpenFormTagUsers] = useState(false); //false
  const [openFormChangePermission, setOpenFormChangePermission] = useState(false);

  // Sate bài viết, tìm bạn bè, link bài viết, quyền riêng tư,...
  const [permission, setPermission] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [link, setLink] = useState("");
  const [debounced, setDebouncedValue] = useState("");

  const [searchResult, setSearchResult] = useState([]);
  const [taged, setTaged] = useState([]);
  //Dùng cho việc chọn icon lần đầu hay lần sau
  const selectIcon = useRef(true)
  const [isTyping, setIsTyping] = useState(false);
  
  const userLogin = getCookieUserLogin()

  // Redux
  const dispatch = useDispatch()

  // render emoji
  let menuRef = useRef();
  const [showPicker, setShowPicker] = useState(false);
  
  const [holderIcon, setHolderIcon] = useState(true);

  const onEmojiClick = (event, emojiObject) => {
    const editor = document.getElementById("editor")
        
    pasteHtmlAtCaret(`${emojiObject.emoji}`,editor)
    
    setHolderIcon(false)
    setIsTyping(true)
  };
  //Chon vi tri tro chuot de add icon
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


  const [content, setContent] = useState({});

    useEffect(() => {
      if(language!== undefined) {
        setContent(require(`./languages/${language}.json`));
    }
    }, [language])

    useEffect(() => {
      setTitlePopup(content.form_create_post_title1);
    }, [content])

  // Debounce search value
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchValue]);

  // Search friends
  const handleFindFriends =()=>{
    API.get(endpoints.findFriends(50, 1, debounced), {
      headers: headers.headers_token,
    })
      .then((res) => {
        const data = res.data.data;
        setSearchResult(data);
        if(taged.length>0){
          for (var i = 0; i < taged.length; i++) {
            for (var j = 0; j < data.length; j++) {
              if (data[j].user.id === taged[i].user.id) {
                setSearchResult((prev) => [...prev], (data[j].user.check = true));
              }
          }}
        }
        setSearchResult(data);
      })
      .catch((err) => {});
  }

  useEffect(() => {
    handleFindFriends();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  // Send post to API
  const createPost = async () => {
    
    //validate content form
    let validate;
    let status = document.getElementById("editor").innerHTML;
    if(status.includes("<br>")){

      const temp = status.split("<br>").filter((item) => item.replaceAll("&nbsp;"," ").trim() !== "")
      validate = temp.length > 0
      status = temp.join("/n")
    }
    else{
      if(status.trim() === ""){
        validate = false
      }
      else{
        validate = true
      }
    }
    if(status.includes("&nbsp;") || status.includes("<div>") || status.includes("</div>")){
      status = status.replaceAll("&nbsp;"," ")
      status = status.replaceAll("</div>","")
      status = status.replaceAll("<div>","/n")
    }
    //end validate
    if(link.includes('clip'))  {
      NotificationToast.fire({
        toast: true,
        position: 'top-end',
        icon: 'warning',
        title: `${content.form_create_post_link_url}`,
      })
      return;
    }
    if (!validate) {
      setLink(link)
      NotificationToast.fire({
        toast: true,
        position: 'top-end',
        icon: 'warning',
        title: `${content.form_create_post_errorStatus}`,
      })
    }else{
      let friends = taged.map((user) => user.user.id);
      dispatch(createPostThunk({link, status, permission, friends})).unwrap()
          .then((res) => {
          if (res.message === "POST.INVALID_URL") {
            NotificationToast.fire({
              toast: true,
              position: 'top-end',
              icon: 'error',
              title: `${content.form_create_post_errorLink}`,
            })
            return;
          }
          if (res.success) {
            const data = res.data;
            API.get(
              `/post/${data.id}`, { headers: headers.headers_token })
            .then((res2)=>{
              if(res2.data){
                setListPostProfile((prev) => [res2.data, ...prev]);
              }
              setShowFormCreatePost(false);
            })
            .catch((err)=> {});

            
            setOpenInputLink(false)
            setLink("")
            NotificationToast.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: `${content.form_create_post_noti_success}`,
            })
          }
        })
        .catch((err) => {})
        .finally(()=>{
          setLink("");
          setShowModal(false);
          setOpenInputLink(!openInputLink);
          setTaged([]);
          setSearchResult([]);
        }
      )
    }
  };

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
      setLink("");
      setTaged([]);
      setSearchResult([]);
      setSearchValue("");
      setOpenInputLink(false);
      setOpenFormChangePermission(false);
      setTitlePopup(content.form_create_post_title1);
      setOpenFormCreatePost(true);
      setOpenFormTagUsers(false);
    } 
  };

  const handleShowInputLink = () => {
    setOpenInputLink(!openInputLink);
  };

  const handleShowFormTagUsers = () => {
    setTitlePopup(content.form_create_post_title2);
    setOpenFormCreatePost(!openFormCreatePost);
    setOpenFormTagUsers(!openFormTagUsers);
    handleFindFriends();
  };

  //prev = 1 là form create post
  const handlePassPreForm = () => {
    setTitlePopup(content.form_create_post_title1);
    setOpenFormCreatePost(true);
    setOpenFormTagUsers(false);
    setOpenFormChangePermission(false);
  };

  const handleAddUserTag = (event, id, action) => {
    for (var i = 0; i < searchResult.length; i++) {
      if (searchResult[i].user.id === id) {
        // Add check to checked item
        setSearchResult((prev) => [...prev], (searchResult[i].user.check = action));
        const index = taged.findIndex(item => item.user.id === id);
        // add friend taged
        if(action){
          if(index >=0) return;
          if(index < 0) setTaged((prev) => [...prev, searchResult[i]]);
        }

        //remove taged
        if(!action){
          const tagedSlice = taged.splice(index, 1);
          const newTaged = taged.filter((prev) => prev.user !== tagedSlice.user);
          setTaged(newTaged);
        }
        break;
      }
    }
    setDebouncedValue("");
    setSearchValue("");
  };

  const handleShowFormChangePermission = () => {
    setTitlePopup(content.form_create_post_title3);
    setOpenFormChangePermission(true);
    setOpenFormCreatePost(false);
    setOpenFormTagUsers(false);
  };

  const pasteClipboard = () =>{
    var cb = navigator.clipboard.readText();
    cb.then(res => setLink(res));
  }

  return (
    <>
      {showmodal && (
        <div
          className={Styled.overlayFormCreatePost}
          ref={modalRef}
          onClick={closeModal}
        >
          <animated.div style={animation}>
            <div className={Styled.formCreatePost} style={{position:'relative'}}>
              <button
                className={Styled.btnGetOut}
                onClick={closeModal}
                ref={closeButton}
              >
                <AiOutlineCloseCircle />
              </button>
              <div className={Styled.formHeader}>
                <h2 className={Styled.formTitle}>{titlePopup}</h2>
                <div className={Styled.section_line}></div>
              </div>
              <div className={Styled.formBody}>
                {openFormCreatePost && (
                  <div className={Styled.createPost}>
                    <div className={Styled.avtAndName}>
                      <img
                        className={Styled.avt}
                        src={userLogin.avatar}
                        alt="Avatar"
                      />
                      <div className={Styled.user_post_info}>
                        <span className={Styled.name}>{userLogin.name}</span>
                        <div
                          className={Styled.viewingRights}
                          onClick={handleShowFormChangePermission}
                        >
                          {permission === 1 && <IoEarth className={Styled.iconViewingRights} />}
                          {permission === 2 && <RiGitRepositoryPrivateLine className={Styled.iconViewingRights}/>}
                          <AiFillCaretDown className={Styled.iconDown} />
                        </div>
                      </div>
                    </div>
                    <div className={Styled.inputLinkAndContent} ref={menuRef}>
                      <InputContentPost setIsTyping= {setIsTyping} holderIcon={holderIcon} setHolderIcon={setHolderIcon} setShowPicker = {setShowPicker}/>
                      {openInputLink && (
                        <div className={Styled.boxInputLink} >
                          <input
                            onChange={(e) => setLink(e.target.value)}
                            className={Styled.inputLink}
                            value={link ? link : ""}
                            placeholder={content.form_create_post_link_content}
                            
                          />
                          <button className={Styled.btnPasteLink} onClick={pasteClipboard}>
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
                          <FaUserPlus
                            className={Styled.iconFunction}
                            onClick={handleShowFormTagUsers}
                          />
                          <FaRegGrinBeam
                              className={`${Styled.iconFunction} ${Styled.buttonIcon}`}
                              type='button'
                              onClick={() => setShowPicker(val => !val)}
                          />
                          {showPicker && <Picker
                          pickerStyle={{ width: '40%', position: 'absolute', bottom: '0', left: '20%', zIndex: 200}}
                          onEmojiClick={onEmojiClick} />}
                        </div>
                        <div className={Styled.boxBtnPost}>
                          {(isTyping || link) &&
                            <button
                              className={Styled.btnPost}
                              onClick={createPost}
                            >
                              {content.form_create_post_button_name}
                            </button>
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
                      <h4 className={Styled.titleFormPost}>{content.form_create_post_title1}</h4>
                    </div>
                    <form className={Styled.areaChoosePermission}>
                      <div className={Styled.areaPress}>
                        <AiOutlineGlobal className={Styled.iconPermission} />
                        <label className={Styled.choosePermission}>
                        {content.form_create_post_public}
                          <input
                            onClick={() => setPermission(1)}
                            className={Styled.inputChoose}
                            type="radio"
                            value="all"
                            checked={permission === 1 ? true : false}
                            name="permission"
                          /></label>
                      </div>
                      <div className={Styled.areaPress}>
                        <RiGitRepositoryPrivateLine />
                        <label className={Styled.choosePermission} >
                          {content.form_create_post_privicy}
                          <input
                            onClick={() => setPermission(2)}
                            className={Styled.inputChoose}
                            type="radio"
                            checked={permission === 2 ? true : false}
                            value="alone"
                            name="permission"
                          /></label>
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
                      <h4 className={Styled.titleFormPost}>{content.form_create_post_title1}</h4>
                    </div>
                    <div className={Styled.boxInputSearch}>
                      <input
                        className={Styled.inputSearch}
                        placeholder={content.form_create_post_search_placeholder}
                        onChange={(e) => setSearchValue(e.target.value)}
                        value={searchValue}
                      />
                      <FaSearch className={Styled.buttonSearch} />
                    </div>

                    <div className={Styled.taggedUserList}>
                      <p className={Styled.title}>Tags: </p>
                      {taged.length > 0 &&
                        taged.map(
                          (user) =>
                           (
                              <div
                                className={Styled.userTag}
                                key={user.user.id}
                                onClick={(event) =>
                                  handleAddUserTag(event, user.user.id, false)
                                }
                              >
                                <h2 className={Styled.name}>
                                  {user.user.name}
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
                          <img className={Styled.avt} src={user.user.avatar} alt="Avatar"/>
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
      )}
    </>
  );
}