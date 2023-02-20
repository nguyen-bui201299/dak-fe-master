import styles from "../Modal.module.css";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { RiArrowDownSFill } from "react-icons/ri";
import { FaAngleLeft, FaGlobeAmericas, FaLock } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import API, { endpoints, headers } from "../../../API";
import {
  NotificationToast,
} from '../../../modules/Notification/Notification';
import axios from 'axios';
import { createGroup } from "../../../redux/slices/groupSlice";
import AvatarEditor from 'react-avatar-editor'
import { getCookieUserLogin } from "../../../modules/Cookies/Auth/userLogin";

export default function PopupCreateGroup({ handleClose, setIsOpenCreate, setChange }) {

  const userLogin = getCookieUserLogin()

  const [content, setContent] = useState({});

  // redux
  const dispatch = useDispatch()

  useEffect(() => {
      if(userLogin.language!== undefined) {
          setContent(require(`./languages/${userLogin.language}.json`));
      }else{
          setContent(require(`./languages/en.json`));
      }
  }, [userLogin])

  const [showPopup, setShowPopUp] = useState(1);
  const [picture, setPicture] = useState('');
  const [imgData, setImgData] = useState(null);
  const [bgImg, setBgImg] = useState(null);
  const [valueOption, setValueOption] = useState(1);
  const [nameGroup, setNameGroup] = useState('');
  const [desc, setDesc] = useState('');
  const [success, setSuccess] = useState(false)
  const editor = useRef(null);
  const [scale, setScale] = useState(1)
  const [FileImg, setFileImg] = useState();
  

  const handleExit = () => {
    setIsOpenCreate(false)
    handleClose
  }

  const onScaleChange = (scaleChangeEvent) => {
    const scaleValue =  parseFloat(scaleChangeEvent.target.value);
    setScale(scaleValue)
  };

  const DataURLtoFile = (dataurl, filename) => {
    let arr = dataurl?.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleChoosesetFileImg = (file) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function (e) {
      setFileImg({
        file: file,
        imgSrc: [reader.result],
      });
    };
  };

  const onChangePicture = (img) => {
    let newCanvas;
    if(img) {
      newCanvas = DataURLtoFile(img);
    } else {
      newCanvas = null;
    }

    const data = new FormData();
    data.append('files', newCanvas);
    
    API.get(endpoints.getTokenUpload, {
      headers: headers.headers_token,
    })
    .then((res) => {
      if(res.data.success) {
        var config = {
          method: 'post',
          url: 'https://storage.dakshow.com/api/upload',
          headers: { 
            'Authorization': `Bearer ${res.data.token} `
          },
          data : data
        };

        axios(config)
        .then(response => {
          if (response.data.success) {
            const imgRes = response.data.data.img;
            setBgImg(imgRes)
          }
        })
        .catch(function (error) {});
      }
    })
    .catch((err) => {console.log({err});})

  };
  const onChangeOption = e => {
    setValueOption(e.target.value);
  };


  const handleCancelImg = () => {
    setImgData(null);
    setPicture('');
  };

  const handleCreateGroup = () => {
    const formUpload = new FormData();
    formUpload.append('files', picture);

    const imgBgData = new FormData();
    imgBgData.append('files', bgImg);

    const formGroup = new FormData();
    formGroup.append('name', nameGroup);
    formGroup.append('access', valueOption);
    formGroup.append('desc', desc);

    if(picture !== "") {
        if (nameGroup !== "") {
            // API.post(endpoints['createGroup'], {name: nameGroup, access: valueOption, desc: desc, avatar: "", background_img: imgBgData.get('files')},
            // {headers: headers.headers_token})
            dispatch(createGroup({name: nameGroup, access: valueOption, desc: desc, avatar: "", background_img: imgBgData.get('files')})).unwrap()
                .then(res => {
                    if(res.data.success) {
                        NotificationToast.fire({
                          toast: true,
                          position: 'bottom-end',
                          icon: 'success',
                          title: `${content.create_group_success}`,
                        })
                        handleClose();
                        setChange(true)
                        setIsOpenCreate(false)
                    } else {
                      NotificationToast.fire({
                        toast: true,
                        position: 'bottom-end',
                        icon: 'error',
                        title: `${content.create_group_fail}`,
                      })
                    }
                })
                .catch(err => console.log(err))
        }
        else {
            NotificationToast.fire({
              toast: true,
              position: 'bottom-end',
              icon: 'error',
              title: `${content.create_group_groupname_require}`,
            })
        }
    }
    else {
        if (nameGroup !== "") {
              // API.post(endpoints['createGroup'], {name: nameGroup, access: valueOption, desc: desc, avatar: "", background_img: ""},
              // {headers: headers.headers_token})
            dispatch(createGroup({name: nameGroup, access: valueOption, desc: desc, avatar: "", background_img: imgBgData.get('files')})).unwrap()
                .then(res => {
                    console.log(res)
                    if(res.data.success) {
                      NotificationToast.fire({
                        toast: true,
                        position: 'bottom-end',
                        icon: 'success',
                        title: `${content.create_group_success}`,
                      })
                        if(setChange) {
                            setIsOpenCreate(false)
                            setChange(true)
                        } else {
                            handleClose();
                        }
                    } else {
                        NotificationToast.fire({
                          toast: true,
                          position: 'bottom-end',
                          icon: 'error',
                          title: `${content.create_group_fail}`,
                        })
                    }
                })
                .catch(err => console.log(err))
        }
        else {
            NotificationToast.fire({
              toast: true,
              position: 'bottom-end',
              icon: 'error',
              title: `${content.create_group_groupname_require}`,
            })
        }
    }
  };

  // console.log(picture);
  return (
    <div>
      <div className={styles.darkBG} onClick={handleClose}/>
      <div className={styles.centered}>
        <div className={styles.modal__ShowAlbums}>
          <div className={styles.modalHeader}>

            <h5 className={styles.heading_Show}>{content.create_group}</h5>
          </div>
          <button className={styles.closeBtn} onClick={handleClose}>
            <AiOutlineCloseCircle />
          </button>
          {showPopup === 1 && (
            <div className={styles["modalCreate__body"]}>
              <div className={styles.modalTitle}>
                <p>
                  {content.create_group_cover_photo} <i>({content.create_group_optional})</i>
                </p>
              </div>
              <div className={styles.modalContent__ShowBackground}>
              <input
                  id='imageAvata'
                  type='file'
                  accept='image/*'
                  hidden
                  onChange={e =>
                    handleChoosesetFileImg(e.target.files[0])
                  }
                />
                {
                FileImg && 
                <>
                  <AvatarEditor
                    ref={editor}
                    scale={scale}
                    image={FileImg?.file}
                    style={{ objectFit: 'cover' }}
                    width={500}
                    height={250}
                  />
                </>
               }

              </div>
              <div className={styles.content__UploadBackground}>
                {!FileImg ? (
                  <>
                    <FiUpload className={styles.icon__upload} />
                    <p style={{ fontSize: "18px", color: "grey" }}>
                      {content.create_group_load_photo}
                    </p>
                  </>
                ) : (
                  <div className={styles.scale__bg__img}>
                    <input style={{ opacity: '1' }} type="range" value={scale} name="points" min="0.2" max="10" step="0.2" onChange={onScaleChange} />
                  </div>
                )}
              </div>
              {/* <div className={styles['background__Group']}>
                                    <img type='file' src={imgData} />
                              </div> */}
              <div className={styles.modalActions_Add}>
                {picture && (
                  <button
                    className={styles.AddBtn}
                    onClick={() => handleCancelImg()}
                  >
                    {content.create_group_cancel_photo}
                  </button>
                )}
                <button
                  className={styles.AddBtn}
                  onClick={() => {setShowPopUp(2); onChangePicture( editor.current?.getImage().toDataURL())}}
                >
                  {content.create_group_next}
                </button>
              </div>
            </div>
          )}
          {showPopup === 2 && (
            <div className={styles["modalCreate__body"]}>
              <div className={styles.group_admin_title}>
                <div className={styles["icon__back"]} 
                    onClick={() => setShowPopUp(1)}>
                  <FaAngleLeft
                    className={styles["back-icon"]}
                  />
                  <span>{content.create_group_back}</span>
                </div>
                <label>{content.create_group_name}</label>
                <input
                  type="text"
                  maxLength={72}
                  placeholder={content.create_group_name_placeholder}
                  onChange={(e) => {
                    setNameGroup(e.target.value);
                  }}
                />
              </div>
              <div className={styles.group_admin_title}>
                <label>{content.create_group_about_group}</label>
                <textarea
                  type="text"
                  placeholder={content.create_group_about_group_placeholder}
                  className="introduceGroup"
                  onChange={(e) => {
                    setDesc(e.target.value);
                  }}
                />
              </div>
              <div className={styles.group_admin_title}>
                <label>{content.create_group_privacy}</label>
                <div className={styles.privacy_container}>
                  <div className={styles.selected}>
                    <select
                      className={styles.select_mode}
                      onChange={onChangeOption}
                    >
                      <option className={styles.select_option} value={1} >
                        {content.create_group_public}
                      </option>
                      <option className={styles.select_option} value={2} >
                        {content.create_group_private}
                      </option>
                    </select>
                    <RiArrowDownSFill
                      style={{
                        fontSize: "26px",
                        color: "var(--text-color)",
                      }}
                    />
                  </div>
                  <div className={styles["selected__icon"]}>
                    <span>
                      {valueOption == 1 ? (
                        <FaGlobeAmericas />
                      ) : (
                        <FaLock />
                      )}
                    </span>
                  </div>
                  <div className={styles["selected__Description"]}>
                    <p>
                      {valueOption == 1
                        ? content.create_group_see_content
                        : content.create_group_not_see_content}
                    </p>
                  </div>
                </div>
              </div>
              <div className={styles.modalActions_Add}>
                <button
                  className={styles.AddBtn_Group}
                  onClick={handleCreateGroup}
                >
                  {content.create_group}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
