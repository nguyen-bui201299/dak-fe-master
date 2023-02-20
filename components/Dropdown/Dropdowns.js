import { useState, useRef, useEffect } from "react";
import Styled from "./Menu.module.css";
import { HiDotsHorizontal } from "react-icons/hi";
import { BsPencil, BsBookmark, BsCheckCircle } from "react-icons/bs";
import { RiPictureInPictureLine } from "react-icons/ri";
import {
  AiOutlineDelete,
  AiFillExclamationCircle,
  AiOutlineCopy,
} from "react-icons/ai";
import API, { endpoints, headers } from "../../API";
import LibraryAlbum from "../../components/LibraryAlbum/LibraryAlbum";
import FormReportPost from "../FormReportPost/FormReportPost";
import { NotificationToast } from "../../modules/Notification/Notification";
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { getCookieUserLogin } from "../../modules/Cookies/Auth/userLogin";

export default function Dropdown(props) {

  return (
    <>
      <div>
        <DropIcon icon={<HiDotsHorizontal />}>
          <DropdownMenu
            Id={props.postId}
            delete={props.deletePost}
            user={props.isUser}
            post={props.post}
            showDelToLib={props.showDelToLib}
            setPostContinue={props.setPostContinue}
            setShowPostContinue={props.setShowPostContinue}
            updatePost={props.updatePost}
            typepost={props.typepost}
            handleDeletePost={props.handleDeletePost}
          />
        </DropIcon>
      </div>
    </>
  );
}

export function DropdownMenu(user) {
  const [LibraryIds, setlibraryiId] = useState();
  const [showFormReport, setShowFormReport] = useState(false);
  const [showlib, setShowLib] = useState(false);
  const [showReadLib, setShowReadLib] = useState(false);
  const [open, setOpen] = useState(false);
  const [reRender, setRender] = useState(false);

  const ShowsetRender = () => {
    setRender(!reRender);
  };

  const userLogin = getCookieUserLogin()

  const [content, setContent] = useState({});

  useEffect(() => {
        if(userLogin.language!== undefined) {
            setContent(require(`./languages/${userLogin.language}.json`));
        }else{
            setContent(require(`./languages/en.json`));
        }
    }, [userLogin])

  
  useEffect(() => {
    API.get(endpoints["ListAlbum"](30, 1), { headers: headers.headers_token })
      .then(function (res) {
        setlibraryiId(res.data.data);
      })
      .catch(function (error) {});
  }, [reRender]);
  
  const HandelshowReadLib = () => {
    setShowReadLib(!showReadLib);
  };
  const HandleToAlbum = () => {
    setShowLib(!showlib);
  };

  const [copied, setCopied] = useState(false)
  const onCopy = () => setCopied(true)
  let urlCopy = window.location.origin;
  urlCopy = urlCopy + /post/ + user.post.post.id;

  return (
    <>
      {/* Form báo cáo bài viết */}
      {showFormReport && (
        <FormReportPost
          showModal={showFormReport}
          setShowModal={setShowFormReport}
        />
      )}

      {/* form thêm bài viết vào thư viên */}
      {LibraryIds && showlib && (
        <LibraryAlbum
          LibraryIds={LibraryIds}
          postID={user.Id}
          open={open}
          setOpen1={setOpen}
          HandelshowReadLib={HandelshowReadLib}
          HandleToAlbum={HandleToAlbum}
          ShowsetRender={ShowsetRender}
          post={user.post}
        />
      )}

      {/* menu dropdown dùng chung cho bài viết */}
      <div
        className={Styled.dropdown}
        style={open ? { display: "none" } : { display: "block" }}
      >
        <DropdownItems
          setShowPostContinue={user.setShowPostContinue}
          setPostContinue={user.setPostContinue}
          post={user.post}
          leftIcon={<RiPictureInPictureLine />}
        >
          <p>{content.continueWatching}</p>
        </DropdownItems>

        <DropdownItems
          leftIcon={<BsBookmark />}
          value="library"
          postId={user.Id}
          HandleToAlbum={HandleToAlbum}
        >
          <p>{content.addGallery}</p>
        </DropdownItems>

        <DropdownItems
          leftIcon={<AiOutlineCopy />}
          value="copy"
          postID={user.Id}
        >
          <CopyToClipboard onCopy={onCopy} text={urlCopy}>
            <p>{content.copyUrl}</p>
          </CopyToClipboard>
        </DropdownItems>

        {user.user ? (
          // menu dropdown dành cho chủ bài viết
          <>
            <DropdownItems
              leftIcon={<BsPencil />}
              value="edit"
              updatePost={user.updatePost}
              post={user.post}
            >
              <p>{content.edit}</p>
            </DropdownItems>

            <DropdownItems
              postId={user.Id}
              leftIcon={<AiOutlineDelete />}
              value="delete"
              handleDeletePost={user.handleDeletePost}
            >
              <p>{content.delete}</p>
            </DropdownItems>

            <DropdownItems
              postId={user.Id}
              leftIcon={<BsCheckCircle />}
              value="owner-authentication"
            >
              <p>{content.confirmOwner}</p>
            </DropdownItems>
          </>
        ) : (
          // menu dropdown dành cho bạn bè xem bài viết
          <>
            <DropdownItems
              value="report"
              leftIcon={<AiFillExclamationCircle />}
              setShowFormReport={setShowFormReport}
            >
              <p>{content.report}</p>
            </DropdownItems>
          </>
        )}

        {/* menu khi bài viết hiện trong thư viện */}
        {user.showDelToLib && (
          <DropdownItems
            postId={user.Id}
            value="delete post album"
            leftIcon={<AiOutlineDelete />}
            deletePost={user.delete}
          >
            <p>{content.deletePostFromGallery}</p>
          </DropdownItems>
        )}
      </div>
    </>
  );
}

function DropdownItems(props) {
  const userLogin = getCookieUserLogin()

  const [content, setContent] = useState({});

  useEffect(() => {
        if(userLogin.language!== undefined) {
            setContent(require(`./languages/${userLogin.language}.json`));
        }else{
            setContent(require(`./languages/en.json`));
        }
    }, [userLogin])

  const handleCopy = (id) => {
    let urlCopy = window.location.origin;
    urlCopy = urlCopy + /post/ + id;
    NotificationToast.fire({
      toast: true,
      position: 'top-right',
      icon: 'success',
      title: `${content.copyUrl}`,
  })
  };

  const ownerAuthenticationPost = (postId) => {
    API.post(endpoints["verifyPost"], {post_id : postId}, { headers: headers.headers_token })
      .then(function (res) {
        if(res.data.message == "POST.VERIFY.LINK_PROFILE_HAS_VERIFICATION"){
          NotificationToast.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: `${content.authenticationPost_succeed_before}`,
          })
        }else if(res.data.message == "POST.VERIFY.SUCCESS"){
          NotificationToast.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: `${content.authenticationPost_succeed_before}`,
          })
        }else{
          NotificationToast.fire({
            toast: true,
            position: 'top-end',
            icon: 'warning',
            title: `${content.authenticationPost_error}`,
          })
        }
      })
      .catch(function (error) {});
  }

  const handleOption = () => {
    if (props.value === "report") {
      props.setShowFormReport(true);
      // setOpen(!open)
    } else if (props.value === "edit") {
      // setOpen(!open);
      props.updatePost(props.post);
    } else if (props.value === "delete") {
      // Nếu props.value = 'delete' thì xóa khỏi pót trong bài viết
      // setOpen(!open)
      props.handleDeletePost(props.postId); // Truyen id bai post len parent de xoa
    } else if (props.value === "library") {
      // setShowLib(!showlib)
      // setOpen(!open)
      props.HandleToAlbum();
    } else if (props.value === "copy") {
      handleCopy(props.postID);
    } else if (props.value === "owner-authentication"){
      ownerAuthenticationPost(props.postId)
    }else if(props.value === 'delete post album') {
      props.deletePost(props.postId)
    }else{

      // setShowPopupContinueWatching(true)
      props?.setShowPostContinue(true);
      props?.setPostContinue(props?.post);
      // setOpen(!open)
    }
  };
  return (
    <>
      <div
        onClick={handleOption}
        style={{ cursor: "pointer" }}
        className={Styled.menu__items}
      >
        <span className={Styled.icon__items}>{props.leftIcon}</span>
        {props.children}
      </div>
    </>
  );
}

function DropIcon(props) {
  const [showBoxDropdown, setShowBoxDropdown] = useState(false);
  const ref = useRef(false);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowBoxDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, setShowBoxDropdown]);
  return (
    <>
      <li className={Styled.button__dropdown__items} ref={ref}>
        <span
          className={Styled.icon__button}
          onClick={() => setShowBoxDropdown(!showBoxDropdown)}
        >
          {props.icon}
        </span>
        {showBoxDropdown && props.children}
      </li>
    </>
  );
}
