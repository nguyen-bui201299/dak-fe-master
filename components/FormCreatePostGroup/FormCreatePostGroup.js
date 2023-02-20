import { useEffect, useRef, useState } from "react";
import { AiOutlineCloseCircle, AiOutlineGlobal, AiOutlineLink } from "react-icons/ai";
import { FaAngleLeft, FaPaste, FaRegGrinBeam } from "react-icons/fa";
import { RiGitRepositoryPrivateLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { animated, useSpring } from "react-spring";
import API, { endpoints, headers } from "../../API";
import Styled from "./FormCreatePostGroup.module.css";
import InputContentPost from "./InputContentPost/InputContentPost";

import { GroupActionToast } from "../../modules/Notification/Notification";
import { createPostGroupThunk } from "../../redux/slices/postSlice";
import dynamic from "next/dynamic";
import { getCookieUserLogin } from "../../modules/Cookies/Auth/userLogin";

const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });
export default function FormCreatePost({
  language,
  setShowModal,
  setListDetailPostGroup,
  showmodal,
  idGroup
}) {
  const modalRef = useRef();
  const closeButton = useRef();
  const [titlePopup, setTitlePopup] = useState("Đăng bài");
  const [openInputLink, setOpenInputLink] = useState(false); //false
  const [openFormCreatePost, setOpenFormCreatePost] = useState(true); //true
  const [openFormChangePermission, setOpenFormChangePermission] = useState(false);


  //dispatch
  const dispatch = useDispatch();


  // Sate bài viết, tìm bạn bè, link bài viết, quyền riêng tư,...
  const [permission, setPermission] = useState("public");
  const [link, setLink] = useState("");

   //Dùng cho việc chọn icon lần đầu hay lần sau
   const selectIcon = useRef(true)
   const [isTyping, setIsTyping] = useState(false);
  //Lấy thông thôngtin người dùng từ redux
  const userLogin = getCookieUserLogin()

  const [content, setContent] = useState({});
  const inputRef = useRef()
    useEffect(() => {
      if(language!== undefined) {
        setContent(require(`./languages/${language}.json`));
    }
    }, [language])

    useEffect(() => {
      setTitlePopup(content.form_create_post_title1);
    }, [content])

    //set showpicker
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
            if(inputRef.current && !inputRef.current.contains(event.target)){
                setShowPicker(false);
            }
        };
        document.addEventListener("click", handler);
        return () =>{
            document.removeEventListener("click", handler);
        }
    }, [])

  // Send post to API
  const createPost = () => {
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
    if(link.includes('twitch.tv') && !link.includes('videos'))  {
      GroupActionToast.fire({
        toast: true,
        position: 'top-end',
        icon: 'warning',
        title: `${content.form_create_post_link_url}`,
      })
      return;
    }

    if (!validate) {
      setLink(link)
      GroupActionToast.fire({
        toast: true,
        position: 'top-end',
        icon: 'warning',
        title: `${content.form_create_post_errorStatus}`,
      })
    }else{
      let friends = [];
      dispatch(createPostGroupThunk({link, status, permission, friends ,id : idGroup})).unwrap()
          .then((res) => {
          if (res.message === "POST.INVALID_URL") {
            GroupActionToast.fire({
              toast: true,
              position: 'top-end',
              icon: 'warning',
              title: `${content.form_create_post_errorLink}`,
            })
            return;
          }
          if (res.success) {
            const data = res.data;
            API.get(`/group/${idGroup}/post/${data.id}`, { headers: headers.headers_token })
            .then((res)=>{
              if(res.data){
                // setListPostProfile((prev) => [res.data, ...prev]);
                setListDetailPostGroup((prev) => [res.data,, ...prev]);
              }
              setShowModal(false);
            })
            .catch((err)=> {});
            
            setOpenInputLink(false)
            setLink("")
            GroupActionToast.fire({
                toast: true,
                position: 'bottom-end',
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
      setOpenInputLink(false);
      setOpenFormChangePermission(false);
      setTitlePopup(content.form_create_post_title1);
      setOpenFormCreatePost(true);
    } 
  };

  const handleShowInputLink = () => {
    setOpenInputLink(!openInputLink);
  };

  //prev = 1 là form create post
  const handlePassPreForm = () => {
    setTitlePopup(content.form_create_post_title1);
    setOpenFormCreatePost(true);
    setOpenFormChangePermission(false);
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
            <div className={Styled.formCreatePost} showModal={showmodal}>
              <div className={Styled.formHeader}>
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
                      </div>
                    </div>
                    <div className={Styled.inputLinkAndContent} ref={inputRef}>
                      <InputContentPost setIsTyping= {setIsTyping} holderIcon={holderIcon} setHolderIcon={setHolderIcon} setShowPicker = {setShowPicker}/>
                      {openInputLink && (
                        <div className={Styled.boxInputLink}>
                          <input
                            onChange={(e) => setLink(e.target.value)}
                            className={Styled.inputLink}
                            // value={link ? link : ""}
                            placeholder={content.form_create_post_link_content}
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
                            onClick={() => setPermission("public")}
                            className={Styled.inputChoose}
                            type="radio"
                            value="all"
                            checked={permission === "public" ? true : false}
                            name="permission"
                          /></label>
                      </div>
                      <div className={Styled.areaPress}>
                        <RiGitRepositoryPrivateLine />
                        <label className={Styled.choosePermission} >
                          {content.form_create_post_privicy}
                          <input
                            onClick={() => setPermission("private")}
                            className={Styled.inputChoose}
                            type="radio"
                            checked={permission === "private" ? true : false}
                            value="alone"
                            name="permission"
                          /></label>
                      </div>
                      {/* <button className={Styled.btnSavePermission}> Lưu </button> */}
                    </form>
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
