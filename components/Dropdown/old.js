import { state, useState, useRef, useEffect } from "react";
import Styled from "./Menu.module.css";
import { HiDotsHorizontal } from "react-icons/hi";
import { BsPencil, BsNodePlus, BsBookmark } from "react-icons/bs";
import { RiPictureInPictureLine } from "react-icons/ri";
import {
  AiOutlineDelete,
  AiFillExclamationCircle,
  AiOutlineCopy,
} from "react-icons/ai";
import API, { endpoints, headers } from "../../API";
import LibraryAlbum from "../../components/LibraryAlbum/LibraryAlbum";
import FormReportPost from "../FormReportPost/FormReportPost";
import { nothing } from "immer";
import PopupContinueWatching from "../PopupContinueWatching/PopupContinueWatching";
import { SuccessNotification } from "../../modules/Notification/Notification";

export default function Dropdown(props) {
  // test-render-web
  // useEffect(() => {
  //   console.log("render Dropdown");
  // }, []);
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
          />
        </DropIcon>
      </div>
    </>
  );
}

export function DropdownMenu(user) {
  const [LibraryIds, setlibraryiId] = useState();
  const [showFormReport, setShowFormReport] = useState(false);
  const [showPopupContinueWatching, setShowPopupContinueWatching] =
    useState(false);
  const [showlib, setShowLib] = useState(false);
  const [HandCLickCloss, setHandCLickCloss] = useState(false);
  const [postId, setPostId] = useState();
  const [showReadLib, setShowReadLib] = useState(false);
  const [open, setOpen] = useState(false);
  const [reRender, setRender] = useState(false);
  const [close, setClose] = useState(false);
  // console.log("props menu", user);
  const ShowsetRender = () => {
    setRender(!reRender);
  };
  useEffect(() => {
    API.get(endpoints["ListAlbum"](30, 1), { headers: headers.headers_token })
      .then(function (res) {
        // console.log(LibraryIds)
        setlibraryiId(res.data.data);
      })
      .catch(function (error) {
        console.log("Error");
      });
  }, [reRender]);
  const handleCopy = (id) => {
    let urlCopy = window.location.origin;
    urlCopy = urlCopy + /post/ + id;
    navigator.clipboard.writeText(urlCopy);
    SuccessNotification("Đã sao chép đường dẫn");
  };
  const HandelshowReadLib = () => {
    setShowReadLib(!showReadLib);
  };
  const HandleToAlbum = () => {
    setShowLib(!showlib);
  };

  function DropdownItems(props) {
    // console.log("props item", props);
    const handleOption = () => {
      if (props.value === "report") {
        console.log(props.value);
        setShowFormReport(true);
        // setOpen(!open)
      } else if (props.value === "edit") {
        setOpen(!open);
        console.log("edit");
        props.updatePost(props.post)
      } else if (props.value === "delete") {
        // Nếu props.value = 'delete' thì xóa khỏi pót trong bài viết
        console.log("delete");
        // setOpen(!open)
        props.handleDelete(props.postId); // Truyen id bai post len parent de xoa
      } else if (props.value === "library") {
        // setShowLib(!showlib)
        // setOpen(!open)
        HandleToAlbum();
      } else if (props.value === "copy") {
        handleCopy(props.postID);
      } else {
        // console.log('continue watching')

        // setShowPopupContinueWatching(true)
        props?.setShowPostContinue(true);
        props?.setPostContinue(props?.post);
        console.log(props.postID);
        // setOpen(!open)
      }
    };
    // console.log(open)
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
  return (
    <>

      {/* Form báo cáo bài viết */}
      {showFormReport && (
        <FormReportPost
          showModal={showFormReport}
          setShowModal={setShowFormReport}
        />
      )}


      <div className={Styled.dropdown} style={open ? { display: "none" } : { display: "block" }}>
        <DropdownItems
          leftIcon={<BsBookmark />}
          value="library"
          postId={user.Id}
        >
          <p>Thêm vào thư viện</p>
        </DropdownItems>
      </div>
      {/* menu dropdown dùng chung */}


      
      {user.user ? (
        <>
          {user.showDelToLib ? (
            <>
              <div
                className={Styled.dropdown}
                style={open ? { display: "none" } : { display: "block" }}
              >
                <DropdownItems
                  postId={user.Id}
                  handleDelete={user.delete}
                  value="delete"
                  leftIcon={<AiOutlineDelete />}
                >
                  <p>Delete</p>
                </DropdownItems>
              </div>
            </>
          ) : (
            <>
              <div
                className={Styled.dropdown}
                style={open ? { display: "none" } : { display: "block" }}
              >
                <DropdownItems
                  leftIcon={<BsPencil />}
                  value="edit"
                  updatePost={user.updatePost}
                  post={user.post}
                >
                  <p>Edit</p>
                </DropdownItems>
                <DropdownItems
                  postId={user.Id}
                  handleDelete={user.delete}
                  leftIcon={<AiOutlineDelete />}
                  value="delete"
                >
                  <p>Delete</p>
                </DropdownItems>
                <DropdownItems
                  leftIcon={<BsBookmark />}
                  value="library"
                  postId={user.Id}
                >
                  <p>Thêm vào thư viện</p>
                </DropdownItems>
                {/* { LibraryIds ? (showlib && <LibraryAlbum LibraryIds={LibraryIds} postID={user.Id} HandelshowReadLib={HandelshowReadLib} HandleToAlbum={HandleToAlbum}  post={user.post}  />) : ""} */}
                {LibraryIds
                  ? showlib && (
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
                  )
                  : ""}
                <DropdownItems
                  setShowPostContinue={user.setShowPostContinue}
                  setPostContinue={user.setPostContinue}
                  post={user.post}
                  leftIcon={<RiPictureInPictureLine />}
                >
                  <p>Continue watching</p>
                </DropdownItems>
                <DropdownItems
                  leftIcon={<AiOutlineCopy />}
                  value="copy"
                  postID={user.Id}
                >
                  <p>Copy URL</p>
                </DropdownItems>
              </div>
              <div className={Styled.dropdown} style={{ display: "none" }}>
                <DropdownItems
                  value="report"
                  leftIcon={<AiFillExclamationCircle />}
                >
                  <p>Report</p>
                </DropdownItems>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className={Styled.dropdown} style={{ display: "none" }}>
            <DropdownItems
              leftIcon={<BsPencil />}
              value="edit"
              updatePost={user.updatePost}
              post={user.post}
            >
              <p>Edit</p>
            </DropdownItems>

            <DropdownItems leftIcon={<AiOutlineDelete />}>
              <p>Delete</p>
            </DropdownItems>
          </div>
          <div
            className={Styled.dropdown}
            style={open ? { display: "none" } : { display: "block" }}
          >
            <DropdownItems
              leftIcon={<AiFillExclamationCircle />}
              value="report"
            >
              <p>Report</p>
            </DropdownItems>
            <DropdownItems leftIcon={<BsBookmark />} value="library">
              <p>Thêm vào thư viện</p>
            </DropdownItems>
            {LibraryIds
              ? showlib && (
                <LibraryAlbum
                  LibraryIds={LibraryIds}
                  postID={user.Id}
                  ShowsetRender={ShowsetRender}
                  HandelshowReadLib={HandelshowReadLib}
                  HandleToAlbum={HandleToAlbum}
                  post={user.post}
                />
              )
              : ""}
            <DropdownItems
              leftIcon={<RiPictureInPictureLine />}
              value="watching"
              setPostContinue={user.setPostContinue}
              post={user.post}
              setShowPostContinue={user.setShowPostContinue}
            >
              <p>Continue watching</p>
            </DropdownItems>
            <DropdownItems
              leftIcon={<AiOutlineCopy />}
              value="copy"
              postID={user.Id}
            >
              <p>Copy URL</p>
            </DropdownItems>
          </div>
        </>
      )}
    </>
  );
}

export function DropIcon(props) {
  // test-render-web
  // useEffect(() => {
  //   console.log("render DropIcon");
  // }, []);
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
