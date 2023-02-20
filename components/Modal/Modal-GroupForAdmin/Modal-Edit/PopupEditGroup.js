import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
    FaAngleLeft, FaGlobeAmericas,
    FaLock, FaRegTimesCircle, FaUpload, FaUsers
} from "react-icons/fa";
import Styles from "../../../PopupEditProfile/PopupEditProfile.module.css";
import API, {endpoints, headers} from '../../../../API'
import axios from "axios";
import { ToastContainer } from 'react-toastify';
import { NotificationToast } from "../../../../modules/Notification/Notification";
import AvatarEditor from "react-avatar-editor";
import { getCookieUserLogin } from "../../../../modules/Cookies/Auth/userLogin";


export default function PopupEditGroup(props) {
    const userLogin = getCookieUserLogin()

    const [content, setContent] = useState({});

    // redux toolkit
    const dispatch = useDispatch();

    useEffect(() => {
        if (userLogin.language !== undefined) {
        setContent(require(`../languages/${userLogin.language}.json`));
        } else {
        setContent(require(`../languages/en.json`));
        }
    }, [userLogin]);

    const [showPopup, setShowPopup] = useState(1);
    const popupEditProfileRef = useRef();
    const [infoGroup, setInfoGroup] = useState(props.infoGroup)
    const editor = useRef(null);
    const [scale, setScale] = useState(1)
    const [FileImg, setFileImg] = useState();

    const handelOnChange = (name, value) => {
        setInfoGroup(
            {
                ...infoGroup,
                [name]: name === 'access' ? Number(value) : value
            });
    }

    
  const onScaleChange = (scaleChangeEvent) => {
    const scaleValue =  parseFloat(scaleChangeEvent.target.value);
    setScale(scaleValue)
  };

    const DataURLtoFile = (dataurl, filename) => {
        let arr = dataurl.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
      };
    
    const handleChoosesetFileImg = (file, type) => {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function (e) {
          setFileImg({
            file: file,
            imgSrc: [reader.result],
          });
        };

        if(type === 'background_img') {
            setShowPopup(31)
        }
      };

    const handleClickUpdateImage = (type, img) => {
        let newCanvas = DataURLtoFile(img)

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
              .then((response) => {
                if (response.data.success) {
                    const imgRes = response.data.data.img;
                    props.setInfoGroup({
                        ...infoGroup,
                        [type]: imgRes
                    })
                    let srcImg = {
                        [type]: imgRes
                    }
                    API.put(endpoints.getDetailGroup(infoGroup.id), srcImg, { headers: headers.headers_token })
                        .then(function (response) {
                            if (response.data.success) {
                                props.setIsOpenEdit(false)
                                NotificationToast.fire({
                                    toast: true,
                                    position: 'top-right',
                                    icon: 'success',
                                    title: `${content.popup_edit_group_image_success}`,
                                  }) 
                            } else {
                                NotificationToast.fire({
                                  toast: true,
                                  position: 'top-right',
                                  icon: 'warning',
                                  title: `${"Update failed"}`,
                                })
                              }
                        })
                        .catch(function (error) {})
                }
            })
            .catch(function (error) {});
            }
          })
          .catch((err) => {})

           
    }

    const handleUpdateInfoGroup = () => {
        let data = {
            id: infoGroup.id,
            name: infoGroup.name,
            access: infoGroup.access,
            desc: infoGroup.desc,
            backgroundImg: 'http://117.2.143.218:85/api/image/5ddaa3ea-1477-11ed-a41b-5f56d3fac8dc.jpeg'
        }
        API.put(endpoints.getDetailGroup(infoGroup.id), data, {headers: headers.headers_token})
            .then(res => {
                if(res.data.success){
                    console.log(res);
                    props.setInfoGroup(res.data.data)
                    props.setIsOpenEdit(false)
                    NotificationToast.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: `${content.popup_edit_group_update_information_success}`,
                      })

                }
            })
            .catch(err => {})
    }

    const closePopup = e => {
        if (popupEditProfileRef.current === e.target) {
            props.setIsOpenEdit(false);
        }
    }

    return (
        <div>
            <ToastContainer />
            <div className={Styles["overlayPopupEditProfile"]} ref={popupEditProfileRef} onClick={closePopup}>
                <div className={Styles["editprofile"]}>
                    <div className={Styles["editprofile__heading"]}>
                        <h3 className={Styles["editprofile__title"]}>{content.popup_edit_group_edit_group_information}</h3>
                        <FaRegTimesCircle className={Styles["editprofile__icon-close"]} onClick={() => props.setIsOpenEdit(false)}/>
                    </div>

                    {/* Main Popup */}
                    {showPopup == 1 &&
                        <div className={Styles["editprofile__list"]}>
                            {/* Background Image */}
                            <div className={Styles["editprofile__item"]}>
                                <div className={Styles["editprofile__item-heading"]}>
                                    <h4 className={Styles["editprofile__item-heading-title"]}>{content.popup_edit_bg_group}</h4>
                                    <span className={Styles["editprofile__item-heading-edit"]} onClick={() => setShowPopup(3)}>{content.popup_edit_group_edit}</span>
                                </div>
                                <div className={Styles["editprofile__item-background"]}>
                                    <img src={infoGroup.background_img} width="100%" height="100%" style={{ objectFit: "cover" }} alt="Background" />
                                    {/* <Image src={Picture1} alt="Image"/> */}
                                </div>
                            </div>

                            {/* Info */}
                            <div className={Styles["editprofile__item"]}>
                                <div className={Styles["editprofile__item-heading"]}>
                                    <h4 className={Styles["editprofile__item-heading-title"]}>{content.popup_edit_group_info_group}</h4>
                                    <span className={Styles["editprofile__item-heading-edit"]}
                                        onClick={() => {
                                            setShowPopup(5);

                                        }}>{content.popup_edit_group_edit}</span>
                                </div>
                                <ul className={Styles["editprofile__list-info"]}>
                                    <li className={Styles["editprofile__item-info"]}>
                                        <FaUsers className={Styles["editprofile__item-info-icon"]} />
                                        <span className={Styles["editprofile__item-info-title"]}>{infoGroup.name}</span>
                                    </li>
                                    {
                                        infoGroup.access === 1
                                            ? <li className={Styles["editprofile__item-info"]}>
                                                <FaGlobeAmericas className={Styles["editprofile__item-info-icon"]} />
                                                <span className={Styles["editprofile__item-info-title"]}>{content.popup_edit_group_public_group}</span>
                                            </li>
                                            : <li className={Styles["editprofile__item-info"]}>
                                                <FaLock className={Styles["editprofile__item-info-icon"]} />
                                                <span className={Styles["editprofile__item-info-title"]}>{content.popup_edit_group_private_group}</span>
                                            </li>

                                    }
                                </ul>
                            </div>
                        </div>
                    }

                    {/* Popup Upload Image */}
                    {showPopup == 2 &&
                        <div className={Styles["editprofile__upload-image"]}>
                            <div className={Styles["editprofile__upload-heading"]} onClick={() => setShowPopup(1)}>
                                <FaAngleLeft className={Styles["editprofile__upload-heading-icon"]} />
                                <h4 className={Styles["editprofile__upload-heading-title"]}>
                                    {content.popup_edit_group_avatar}
                                </h4>
                            </div>
                            <div className={Styles["editprofile__upload-box"]}>
                                <label htmlFor="imageAvata">
                                    <div className={Styles["editprofile__upload-right"]}>
                                        <FaUpload className={Styles["editprofile__upload-icon"]} />
                                        <span className={Styles["editprofile__upload-title"]}>
                                            {content.popup_edit_group_select_image}
                                        </span>
                                    </div>
                                </label>
                                <input id="imageAvata" type='file'  hidden onChange={(e) => handleChoosesetFileImg(e.target.files[0], 'avatar')} />
                            </div>
                        </div>
                    }

                    {/* Popup Selected Image */}
                    {showPopup == 21 &&
                        <div className={Styles["editprofile__upload-image"]}>
                            <div className={Styles["editprofile__upload-heading"]} onClick={() => setShowPopup(2)}>
                                <FaAngleLeft className={Styles["editprofile__upload-heading-icon"]}  />
                                <h4 className={Styles["editprofile__upload-heading-title"]}>
                                    {content.popup_edit_group_update_avatar}
                                </h4>
                            </div>
                            <div className={Styles["editprofile__image-selected"]}>
                                <img src={FileImg.imgSrc} height='100%' width='100%' style={{ objectFit: "cover" }} alt="Image" />
                            </div>
                            <button className={Styles["btn-submit"]} onClick={() => handleClickUpdateImage('avatar', editor.current?.getImage().toDataURL())}>{content.popup_edit_group_save_btn}</button>
                        </div>
                    }

                    {/* Popup Upload Image Background */}
                    {showPopup == 3 &&
                        <div className={Styles["editprofile__upload-image"]}>
                            <div className={Styles["editprofile__upload-heading"]} onClick={() => setShowPopup(1)}>
                                <FaAngleLeft className={Styles["editprofile__upload-heading-icon"]} />
                                <h4 className={Styles["editprofile__upload-heading-title"]}>
                                    {content.popup_edit_group_background}
                                </h4>
                            </div>
                            <div className={Styles["editprofile__upload-box"]}>
                                <label htmlFor="imgBg">
                                    <div className={Styles["editprofile__upload-right"]}>
                                        <FaUpload className={Styles["editprofile__upload-icon"]} />
                                        <span className={Styles["editprofile__upload-title"]}>{content.popup_edit_group_select_image}</span>
                                    </div>
                                </label>
                                <input id="imgBg" name="imgBg" type='file' accept="image/*" hidden onChange={(e) => handleChoosesetFileImg(e.target.files[0], 'background_img')} />
                            </div>
                        </div>
                    }

                    {/* Popup Selected Image Background */}
                    {showPopup == 31 &&
                        <div className={`${Styles["editprofile__upload-image"]}`}>
                            <div className={Styles["editprofile__upload-heading"]} onClick={() => setShowPopup(3)}>
                                <FaAngleLeft className={Styles["editprofile__upload-heading-icon"]}  />
                                <h4 className={Styles["editprofile__upload-heading-title"]}>
                                    {content.popup_edit_group_update_cover_photo}
                                </h4>
                            </div>
                            <div className={`${Styles["editprofile__image-selected"]} ${Styles["background"]}`}>
                                <AvatarEditor
                                    ref={editor}
                                    scale={scale}
                                    image={FileImg?.file}
                                    style={{ objectFit: 'cover' }}
                                    width={600}
                                    height={250}
                                />
                            </div>

                            <div className={Styles.editprofile__scale__bg__img }>
                                <input style={{ width: '20%' }} type="range" value={scale} name="points" min="0.2" max="10" step="0.2" onChange={onScaleChange} />
                            </div>
                            <button className={Styles["btn-submit"]} onClick={() => handleClickUpdateImage('background_img', editor.current?.getImage().toDataURL())} >{content.popup_edit_group_save_btn}</button>
                        </div>
                    }

                    {/* Popup Info */}
                    {showPopup == 5 &&
                        <div className={`${Styles["editprofile__upload-image"]}`}>
                            <div className={Styles["editprofile__upload-heading"]} onClick={() => setShowPopup(1)}>
                                <FaAngleLeft className={Styles["editprofile__upload-heading-icon"]}  />
                                <h4 className={Styles["editprofile__upload-heading-title"]}>{content.popup_edit_group_edit_group_information}</h4>
                            </div>
                            <div className={Styles["editprofile__info"]}>
                                <div className={Styles["editprofile__form-control"]}>
                                    <label className={Styles["editprofile__info-title"]}>{content.popup_edit_group_group_name}</label>
                                    <input className={Styles["editprofile__form-input"]} placeholder={content.popup_edit_group_input_group_name} type="text" maxLength={72} onChange={(e) => handelOnChange('name', e.target.value)} defaultValue={infoGroup.name} />
                                </div>
                                <div className={Styles["editprofile__form-control"]}>
                                    <label className={Styles["editprofile__info-title"]}>{content.popup_edit_group_group_access}</label>
                                    <select className={Styles["editprofile__form-input"]} defaultValue={infoGroup.access === 1 ? 1 : 2} onChange={(e) => handelOnChange('access', e.target.value)}>
                                        <option value={1}>{content.popup_edit_group_public_group}</option>
                                        <option value={2}>{content.popup_edit_group_private_group}</option>
                                    </select>
                                </div>
                                <div className={Styles["editprofile__form-control"]}>
                                    <label className={Styles["editprofile__info-title"]}>{content.popup_edit_group_edit_group_information}</label>
                                    <textarea className={Styles["editprofile__form-input"]} placeholder={content.popup_edit_group_intro_group} type="text" onChange={(e) => handelOnChange('desc', e.target.value)} value={infoGroup.desc} />
                                </div>
                            </div>
                            <button className={Styles["btn-submit"]} onClick={handleUpdateInfoGroup}>
                                {content.popup_edit_group_save_btn}
                            </button>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}