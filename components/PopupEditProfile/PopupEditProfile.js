import Styles from './PopupEditProfile.module.css';
import {
  FaRegTimesCircle,
  FaUserCircle,
  FaEnvelope,
  FaCalendarAlt,
  FaUser,
  FaAngleLeft,
  FaUpload,
  FaPlus,
  FaSearch,
  FaPlusCircle,
} from 'react-icons/fa';
import Image from 'next/image';
import Background from '../../public/images/bg.png';
import { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import { getCookieUserLogin, setCookieUserLogin } from '../../modules/Cookies/Auth/userLogin';
import API, { endpoints, headers } from '../../API';
import { useDispatch } from 'react-redux';
import {
  updateReduxProfileUser,
  updateReduxUser,
} from '../../redux/slices/loginSlice';
import { NotificationToast } from '../../modules/Notification/Notification';
import PopupDelete from '../PopupDelete/PopupDelete';
import AvatarEditor from 'react-avatar-editor'
import Loader from '../LoaderTab/LoaderTab';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function PopupEditProfile({
  handleClick,
  setShowEditProfile,
  setUserLogin,
  language,
}) {
  const [showPopup, setShowPopup] = useState(1);
  const [popupDelete, setPopupDelete] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [showPopupRelationship, setShowPopupRelationship] = useState(false);
  const [showPopupFamily, setShowPopupFamily] = useState(false);
  const [content, setContent] = useState({});
  const popupEditProfileRef = useRef();
  const dispatch = useDispatch();
  const editor = useRef(null);
  const [scale, setScale] = useState(1)
  const [isUpdate, setIsUpdate] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)

  useEffect(() => {
    if (language) {
      setContent(require(`./languages/${language}.json`));
    }
  }, [language]);

  const closePopupChat = e => {
    if (popupEditProfileRef.current === e.target) {
      setShowEditProfile(false);
    }
  };

  const userLogin = getCookieUserLogin()
  const [userInfo, setUserInfo] = useState(userLogin);
  const [FileImg, setFileImg] = useState();

  const handelOnChange = (id, value, e) => {
    if(id === "bio") {  
      if(e.key === "Enter") {
        value += "\n"
      }
      let checkBreak = value.split("\n")
      if(checkBreak.length > 10) return;
    }
    setUserInfo({
      ...userInfo,
      [id]: value,
    });

  };

  useEffect(() => {
    if(showPopup == 4) {
      // Nhập ký tự đặc biệt và trả về emoji tương ứng
      var map = {
        "<3": "\u2764\uFE0F",
        "</3": "\uD83D\uDC94",
        ":D": "\uD83D\uDE00",
        ":)": "\uD83D\uDE03",
        ";)": "\uD83D\uDE09",
        ":(": "\ud83d\ude1e",
        ":p": "\uD83D\uDE1B",
        ";p": "\uD83D\uDE1C",
        ":'(": "\uD83D\uDE22",
        "T_T": "\ud83d\ude2d",
        "8)": "\ud83d\ude0e",
        "-_-": "\ud83d\ude11",
        ">_<": "\ud83d\ude16",
        ".3.": "\ud83d\ude17",
        "3<3": "\ud83d\ude18",
        "^3^": "\ud83d\ude19",
      };

      function escapeSpecialChars(regex) {
        return regex.replace(/([()[{*+.$^\\|?])/g, '\\$1');
      }
      document.getElementById("textarea").oninput = function() {
        for (var i in map) {
          var regex = new RegExp(escapeSpecialChars(i), 'gim');
          this.value = this.value = this.value.replace(regex, map[i]);
          setUserInfo({...userInfo, bio: this.value})
        }
      };
    }
  }, [])

  // Delete account
  const handleOnDelete = e => {
    API.post("/auth/delete-account/send-code",{email : user.email} , {headers : headers.headers_token})
    .then(res => {
      NotificationToast.fire({
          toast: true,
          position: 'top-right',
          icon: 'success',
          title: `Verify Delete Account ${user.name} In Email!!!`,
        })
        setPopupDelete(true)
      
    })
    .catch(err => console.log(err))
  };

  const handleClickUpdateProfile = () => {
    var data = {
      birthday: userInfo.birthday,
      sex: userInfo.sex,
      name: userInfo.name,
      email: userInfo.email,
    };

    if(data.name.length > 30) {
      NotificationToast.fire({
        toast: true,
        position: 'top-right',
        icon: 'warning',
        title: `${content.popup_edit_profile_input_fullname_length}`,
      })
      return;
    }

    if(data.name.length < 1 ) {
      NotificationToast.fire({
        toast: true,
        position: 'top-right',
        icon: 'warning',
        title: `${content.popup_edit_profile_input_empty_name}`,
      })
      return;
    } else if (data.email.length < 1 ) {
      NotificationToast.fire({
        toast: true,
        position: 'top-right',
        icon: 'warning',
        title: `${content.popup_edit_profile_input_empty_email}`,
      })
      return;
    }
    
    if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
      NotificationToast.fire({
        toast: true,
        position: 'top-right',
        icon: 'warning',
        title: `${content.popup_edit_profile_input_empty_email_invalid}`,
      })
      return;
    }

    if(data.birthday.includes('0000') || data.birthday === "Invalid date") {
      NotificationToast.fire({
        toast: true,
        position: 'top-right',
        icon: 'warning',
        title: `${content.popup_edit_profile_input_empty_birthday_invalid}`,
      })
      return;
    }
    return new Promise((resolve, reject) => {
      API.put(endpoints['updateprofile'], data, {
        headers: headers.headers_token,
      })
        .then(function (response) {
          // console.log(response);
          if(!response.data.success) {
            NotificationToast.fire({
              toast: true,
              position: 'top-right',
              icon: 'warning',
              title: `${content.popup_edit_profile_input_fullname_symbol}`,
            })
            return;
          } else {
            resolve(response.data);
            setCookieUserLogin(userInfo);
            setUserLogin({ ...userInfo });
            NotificationToast.fire({
              toast: true,
              position: 'top-right',
              icon: 'success',
              title: `${content.popup_edit_profile_save_text}`,
            })
            dispatch(updateReduxProfileUser(response.data.data));
            setShowEditProfile(false)
          }
        })
        .catch(function (error) {
          console.log(error);
          resolve(error);
        });
    });
  };
  const handleUpdateBioProfile = () => {
    var data = {
      bio: userInfo.bio,
    };

    if(data.bio.length > 200) return;


    return new Promise((resolve, reject) => {
      API.put(endpoints['updateprofile'], data, {
        headers: headers.headers_token,
      })
        .then(function (response) {
          if (response.data.success) {
            resolve(response.data);
            setCookieUserLogin(userInfo);
            setUserLogin({ ...userInfo });
            NotificationToast.fire({
              toast: true,
              position: 'top-right',
              icon: 'success',
              title: `${content.popup_edit_profile_save_text}`,
            })
            dispatch(updateReduxUser({ type: 'bio', data: response.data.data.bio }));
            setShowEditProfile(false)
          }
        })
        .catch(function (error) {
          console.log(error);
          resolve(error);
        });
    });
  };

  const onScaleChange = (scaleChangeEvent) => {
    const scaleValue =  parseFloat(scaleChangeEvent.target.value);
    setScale(scaleValue)
  };

  // Convert base64 to file img
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

    if (type == 'avata') setShowPopup(22);
    if (type == 'background') setShowPopup(32);
  };

  const handleClickUpdateImage = (type, img) => {
    let newCanvas = DataURLtoFile(img)

    var data = new FormData();
    data.append('files', newCanvas);
    setIsUpdate(true)

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
            setUserInfo({
              ...userInfo,
              [type]: response.data.data.img,
            });
            var srcImg = {
              [type]: response.data.data.img,
            };
            API.put(endpoints['updateprofile'], srcImg, {
              headers: headers.headers_token,
            })
            .then(function (response) {
              if (response.data.success) {
                handleClick();
                dispatch(updateReduxUser({ type, data: imgRes }));
                NotificationToast.fire({
                  toast: true,
                  position: 'top-right',
                  icon: 'success',
                  title: `${content.popup_edit_profile_changeImg_success}`,
                })
                setIsUpdate(false)
                } else {
                  NotificationToast.fire({
                    toast: true,
                    position: 'top-right',
                    icon: 'warning',
                    title: `${"Update failed"}`,
                  })
                }
                setShowEditProfile(false)
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        })
        .catch(function (error) {
          console.log({error});
        });
      }
    })
    .catch((err) => {console.log({err});})
  };

  useEffect(() => {
    setCookieUserLogin(userInfo);
    setUserLogin({ ...userInfo });
  }, [userInfo]);

  const [showLoading, setShowLoading] = useState(true);
    useEffect(() => {
        var links = document.getElementsByClassName("Header_social__link__N7reX ");
        for (var i = 0; i < links.length; i++)
        {
            links[i].onClick = function()
            {
                setShowLoading(true);
            };
        }
  },[])

  const refCalendar = useRef(false);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (refCalendar.current && !refCalendar.current.contains(event.target)) {
        setShowCalendar(false)
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return (() => {
      document.removeEventListener("mousedown", handleClickOutside)
    })
  }, [refCalendar, setShowCalendar]);

  return (
    <div>
      <div
        className={Styles['overlayPopupEditProfile']}
        ref={popupEditProfileRef}
        onClick={closePopupChat}
      >
        <div className={Styles['editprofile']}>
          <div className={Styles['editprofile__heading']}>
            <h3 className={Styles['editprofile__title']}>
              {content && content.popup_edit_profile_tile}
            </h3>
            <FaRegTimesCircle
              className={Styles['editprofile__icon-close']}
              onClick={handleClick}
            />
          </div>

          {/* Main Popup */}
          {showPopup == 1 && (
            <div className={Styles['editprofile__list']}>
              {/* Avatar */}
              <div className={Styles['editprofile__item']}>
                <div className={Styles['editprofile__item-heading']}>
                  <h4 className={Styles['editprofile__item-heading-title']}>
                    {content && content.popup_edit_profile_avatar}
                  </h4>
                  <span
                    className={Styles['editprofile__item-heading-edit']}
                    onClick={() => setShowPopup(2)}
                  >
                    {content && content.popup_edit_profile_edit_text}
                  </span>
                </div>
                <div className={Styles['editprofile__item-avatar']}>
                  <img
                    src={userInfo.avatar}
                    width='100%'
                    height='100%'
                    style={{ objectFit: 'cover' }}
                    alt='Image'
                  />
                  {/* <Image src={Picture1} alt="Image"/> */}
                </div>
              </div>
              {/* Background Image */}
              <div className={Styles['editprofile__item']}>
                <div className={Styles['editprofile__item-heading']}>
                  <h4 className={Styles['editprofile__item-heading-title']}>
                    {content && content.popup_edit_profile_background}
                  </h4>
                  <span
                    className={Styles['editprofile__item-heading-edit']}
                    onClick={() => setShowPopup(3)}
                  >
                    {content && content.popup_edit_profile_edit_text}
                  </span>
                </div>
                <div className={Styles['editprofile__item-background']}>
                  <img
                    src={userInfo.background_img}
                    width='100%'
                    height='100%'
                    style={{ objectFit: 'cover' }}
                    alt='Background'
                  />
                  {/* <Image src={Picture1} alt="Image"/> */}
                </div>
              </div>
              {/* Description */}
              <div className={Styles['editprofile__item']}>
                <div className={Styles['editprofile__item-heading']}>
                  <h4 className={Styles['editprofile__item-heading-title']}>
                    {content && content.popup_edit_profile_bio}
                  </h4>
                  <span
                    className={Styles['editprofile__item-heading-edit']}
                    onClick={() => setShowPopup(4)}
                  >
                    {content && content.popup_edit_profile_edit_text}
                  </span>
                </div>
                <p className={Styles['editprofile__item-des']}>
                  {userInfo.bio
                    ? userInfo.bio
                    : content && content.popup_edit_profile_bio_not}
                </p>
              </div>
              {/* Info */}
              <div className={Styles['editprofile__item']}>
                <div className={Styles['editprofile__item-heading']}>
                  <h4 className={Styles['editprofile__item-heading-title']}>
                    {content && content.popup_edit_profile_setting_basic}
                  </h4>
                  <span
                    className={Styles['editprofile__item-heading-edit']}
                    onClick={() => {
                      setShowPopup(5);
                    }}
                  >
                    {content && content.popup_edit_profile_edit_text}
                  </span>
                </div>
                <ul className={Styles['editprofile__list-info']}>
                  <li className={Styles['editprofile__item-info']}>
                    <FaUserCircle
                      className={Styles['editprofile__item-info-icon']}
                    />
                    <span className={Styles['editprofile__item-info-title']}>
                      {userInfo.name}
                    </span>
                  </li>
                  <li className={Styles['editprofile__item-info']}>
                    <FaEnvelope
                      className={Styles['editprofile__item-info-icon']}
                    />
                    <span className={Styles['editprofile__item-info-title']}>
                      {userInfo.email}
                    </span>
                  </li>
                  <li className={Styles['editprofile__item-info']}>
                    <FaCalendarAlt
                      className={Styles['editprofile__item-info-icon']}
                    />
                    <span className={Styles['editprofile__item-info-title']}>
                      {userInfo.birthday}
                    </span>
                  </li>
                  <li className={Styles['editprofile__item-info']}>
                    <FaUser className={Styles['editprofile__item-info-icon']} />
                    <span className={Styles['editprofile__item-info-title']}>
                      {userInfo.sex === 1 && content.popup_edit_profile_male}
                      {userInfo.sex === 2 && content.popup_edit_profile_female}
                      {userInfo.sex === 3 && content.popup_edit_profile_others}
                    </span>
                  </li>
                </ul>
              </div>
              {/* Delete Acount */}
              <div className={Styles['editprofile__item']}>
                <div className={Styles['editprofile__item-heading']}>
                  <h4 className={Styles['editprofile__item-heading-title']}>
                    {content && content.popup_edit_profile_delete_your_account}
                  </h4>
                  <span
                    className={Styles['editprofile__item-heading-edit']}
                    onClick={() => setShowPopup(7)}
                  >
                    {content && content.popup_edit_profile_delete_text}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Popup Upload Image */}
          {showPopup == 2 && (
            <div className={Styles['editprofile__upload-image']}>
              <div className={Styles['editprofile__upload-heading']}>
                <FaAngleLeft
                  className={Styles['editprofile__upload-heading-icon']}
                  onClick={() => setShowPopup(1)}
                />
                <h4 className={Styles['editprofile__upload-heading-title']}>
                  {content && content.popup_edit_profile_avatar}
                </h4>
              </div>
              <div className={Styles['editprofile__upload-box']}>
                <div
                  className={Styles['editprofile__upload-left']}
                  onClick={() => setShowPopup(21)}
                >
                  <FaPlus className={Styles['editprofile__upload-icon']} />
                  <span className={Styles['editprofile__upload-title']}>
                    {content &&
                      content.popup_edit_profile_chooses_files_from_system}
                  </span>
                </div>
                <label htmlFor='imageAvata'>
                  <div className={Styles['editprofile__upload-right']}>
                    <FaUpload className={Styles['editprofile__upload-icon']} />
                    <span className={Styles['editprofile__upload-title']}>
                      {content &&
                        content.popup_edit_profile_chooses_files_from_computer}
                    </span>
                  </div>
                </label>
                <input
                  id='imageAvata'
                  type='file'
                  accept='image/*'
                  hidden
                  onChange={e =>
                    handleChoosesetFileImg(e.target.files[0], 'avata')
                  }
                />
              </div>
            </div>
          )}

          {/* Popup ảnh từ hệ thống */}
          {showPopup == 21 && (
            <div className={Styles['editprofile__upload-image']}>
              <div className={Styles['editprofile__upload-heading']}>
                <FaAngleLeft
                  className={Styles['editprofile__upload-heading-icon']}
                  onClick={() => setShowPopup(2)}
                />
                <h4 className={Styles['editprofile__upload-heading-title']}>
                  {content && content.popup_edit_profile_avatar_from_system}
                </h4>
              </div>
            </div>
          )}

          {/* Popup Selected Image */}
          {showPopup == 22 && (
            <div className={Styles['editprofile__upload-image']}>
             {
              isUpdate &&  
                <div className={Styles.wrap__loader}>
                  <div className={Styles.loader}></div>
                </div>
             }
              <div className={Styles['editprofile__upload-heading']}>
                <FaAngleLeft
                  className={Styles['editprofile__upload-heading-icon']}
                  onClick={() => setShowPopup(2)}
                />
                <h4 className={Styles['editprofile__upload-heading-title']}>
                  {content && content.popup_edit_profile_update_avatar_img}
                </h4>
              </div>
              <div className={Styles['editprofile__image-selected']}>
                <AvatarEditor
                  ref={editor}
                  scale={scale}
                  image={FileImg?.file}
                  style={{ objectFit: 'cover' }}
                  borderRadius={999}
                  width={300}
                  height={300}
                />
              </div>
              
              <div className={Styles.editprofile__scale__avatar}>
                <input style={{ width: '20%' }} type="range" value={scale} name="points" min="1" max="10" step="0.2" onChange={onScaleChange} />
              </div>
              <button
                className={Styles['btn-submit']}
                onClick={() => handleClickUpdateImage('avatar', editor.current?.getImage().toDataURL())}
              >
                {content && content.popup_edit_profile_save_text}
              </button>
            </div>
          )}

          {/* Popup Upload Image Background */}
          {showPopup == 3 && (
            <div className={Styles['editprofile__upload-image']}>
              <div className={Styles['editprofile__upload-heading']}>
                <FaAngleLeft
                  className={Styles['editprofile__upload-heading-icon']}
                  onClick={() => setShowPopup(1)}
                />
                <h4 className={Styles['editprofile__upload-heading-title']}>
                  {content && content.popup_edit_profile_update_background_img}
                </h4>
              </div>
              <div className={Styles['editprofile__upload-box']}>
                <div
                  className={Styles['editprofile__upload-left']}
                  onClick={() => setShowPopup(31)}
                >
                  <FaPlus className={Styles['editprofile__upload-icon']} />
                  <span className={Styles['editprofile__upload-title']}>
                    {content &&
                      content.popup_edit_profile_chooses_files_from_system}
                  </span>
                </div>
                <label htmlFor='imgBg'>
                  <div className={Styles['editprofile__upload-right']}>
                    <FaUpload className={Styles['editprofile__upload-icon']} />
                    <span className={Styles['editprofile__upload-title']}>
                      {content &&
                        content.popup_edit_profile_chooses_files_from_computer}
                    </span>
                  </div>
                </label>
                <input
                  id='imgBg'
                  name='imgBg'
                  type='file'
                  accept='image/*'
                  hidden
                  onChange={e =>
                    handleChoosesetFileImg(e.target.files[0], 'background')
                  }
                />
              </div>
            </div>
          )}

          {/* Popup ảnh từ hệ thống */}
          {showPopup == 31 && (
            <div className={Styles['editprofile__upload-image']}>
              <div className={`${Styles['editprofile__upload-heading']}`}>
                <FaAngleLeft
                  className={Styles['editprofile__upload-heading-icon']}
                  onClick={() => setShowPopup(3)}
                />
                <h4 className={Styles['editprofile__upload-heading-title']}>
                  {content && content.popup_edit_profile_background_from_system}
                </h4>
              </div>
              <div
                className={`${Styles['editprofile__image-list']} ${Styles['background']}`}
              >
                <div
                  className={Styles['editprofile__image-item']}
                  onClick={() => setShowPopup(32)}
                >
                  <Image src={Background} alt='Image' />
                </div>
                <div
                  className={Styles['editprofile__image-item']}
                  onClick={() => setShowPopup(32)}
                >
                  <Image src={Background} alt='Image' />
                </div>
                <div
                  className={Styles['editprofile__image-item']}
                  onClick={() => setShowPopup(32)}
                >
                  <Image src={Background} alt='Image' />
                </div>
                <div
                  className={Styles['editprofile__image-item']}
                  onClick={() => setShowPopup(32)}
                >
                  <Image src={Background} alt='Image' />
                </div>
                <div
                  className={Styles['editprofile__image-item']}
                  onClick={() => setShowPopup(32)}
                >
                  <Image src={Background} alt='Image' />
                </div>
                <div
                  className={Styles['editprofile__image-item']}
                  onClick={() => setShowPopup(32)}
                >
                  <Image src={Background} alt='Image' />
                </div>
                <div
                  className={Styles['editprofile__image-item']}
                  onClick={() => setShowPopup(32)}
                >
                  <Image src={Background} alt='Image' />
                </div>
              </div>
            </div>
          )}

          {/* Popup Selected Image Background */}
          {showPopup == 32 && (
            <div className={`${Styles['editprofile__upload-image']}`}>
              {
              isUpdate &&  
                <div className={Styles.wrap__loader}>
                  <div className={Styles.loader}></div>
                </div>
              }
              <div className={Styles['editprofile__upload-heading']}>
                <FaAngleLeft
                  className={Styles['editprofile__upload-heading-icon']}
                  onClick={() => setShowPopup(3)}
                />
                <h4 className={Styles['editprofile__upload-heading-title']}>
                  {content && content.popup_edit_profile_update_background_img}
                </h4>
              </div>
              <div
                className={`${Styles['editprofile__image-selected']} ${Styles['background']}`}
              >
                <AvatarEditor
                  ref={editor}
                  scale={scale}
                  image={FileImg?.file}
                  style={{ objectFit: 'cover' }}
                  width={500}
                  height={250}
                />
              </div>
              <div className={Styles.editprofile__scale__bg__img}>
                <input style={{ width: '20%' }} type="range" value={scale} name="points" min="0.2" max="10" step="0.2" onChange={onScaleChange} />
              </div>
              <button
                className={Styles['btn-submit']}
                onClick={() => handleClickUpdateImage('background_img', editor.current?.getImage().toDataURL())}
              >
                {content && content.popup_edit_profile_save_text}
              </button>
            </div>
          )}

          {/* Popup Desciption */}
          {showPopup == 4 && (
            <div csName={`${Styles['editprofile__upload-image']}`}>
              <div className={Styles['editprofile__upload-heading']}>
                <FaAngleLeft
                  className={Styles['editprofile__upload-heading-icon']}
                  onClick={() => setShowPopup(1)}
                />
                <h4 className={Styles['editprofile__upload-heading-title']}>
                  {content && content.popup_edit_profile_update_bio}
                </h4>
              </div>
              <div className={Styles['editprofile__box-des']}>
                <textarea
                  id="textarea"
                  placeholder={
                    content && content.popup_edit_profile_update_bio_placeholder
                  }
                  type='text'
                  className={Styles['editprofile__des']}
                  value={userInfo.bio}
                  maxLength='200'
                  onChange={e => handelOnChange('bio', e.target.value, e)}
                ></textarea>
                <span className={Styles['editprofile__length-of-bio']}>{200 - userInfo?.bio?.length}/200</span>
              </div>
              <button
                className={Styles['btn-submit']}
                onClick={() => handleUpdateBioProfile()}
              >
                {content && content.popup_edit_profile_save_text}
              </button>
            </div>
          )}

          {/* Popup Info */}
          {showPopup == 5 && (
            <div className={`${Styles['editprofile__upload-image']}`}>
              <div className={Styles['editprofile__upload-heading']}>
                <FaAngleLeft
                  className={Styles['editprofile__upload-heading-icon']}
                  onClick={() => setShowPopup(1)}
                />
                <h4 className={Styles['editprofile__upload-heading-title']}>
                  {content && content.popup_edit_profile_edit_your_profile}
                </h4>
              </div>
              <div className={Styles['editprofile__info']}>
                <div className={`${Styles['editprofile__form-control']} ${Styles['form-name']}`}>
                  <label className={Styles['editprofile__info-title']}>
                    {content &&
                      content.popup_edit_profile_edit_your_profile_name}
                  </label>
                  <input
                    className={Styles['editprofile__form-input']}
                    placeholder={content.popup_edit_profile_input_fullname}
                    type='text'
                    onChange={e => handelOnChange('name', e.target.value)}
                    value={userInfo.name}
                    maxLength='30'
                  />
                  <span className={Styles['editprofile__length-of-name']}>{30 - userInfo.name.length}/30</span>
                </div>
                <div className={Styles['editprofile__form-control']}>
                  <label className={Styles['editprofile__info-title']}>
                    {content &&
                      content.popup_edit_profile_edit_your_profile_email}
                  </label>
                  <input
                    className={Styles['editprofile__form-input']}
                    placeholder={content.popup_edit_profile_input_email}
                    type='text'
                    onChange={e => handelOnChange('email', e.target.value)}
                    value={userInfo.email}
                  />
                </div>
                <div ref={refCalendar}
                  className={Styles['editprofile__form-control']}
                >
                  <label className={Styles['editprofile__info-title']}>
                    {content &&
                      content.popup_edit_profile_edit_your_profile_birth}
                  </label>
                  <div className={`${Styles['editprofile__form-input']} ${Styles['dateTime']}`}>
                    <span onClick={() => setShowCalendar(!showCalendar)} > <FaCalendarAlt color='#ffdd00' /> </span>
                    <span> {userInfo.birthday} </span>
                    {
                      showCalendar && <Calendar className={Styles.calendar} onChange={date => handelOnChange('birthday', moment(date).format("YYYY-MM-DD") )}
                       />
                    }
                  </div>
                </div>
                <div className={Styles['editprofile__form-control']}>
                  <label className={Styles['editprofile__info-title']}>
                    {content &&
                      content.popup_edit_profile_edit_your_profile_genger}
                  </label>
                  <ul className={Styles['editprofile__info-gender']}>
                    <li className={Styles['editprofile__info-gender-item']}>
                      <input
                        type='radio'
                        id='male'
                        className={Styles['editprofile__info-item-radio']}
                        name='gender'
                        onChange={() => handelOnChange('sex', 1)}
                        checked={userInfo.sex === 1}
                      />
                      <label
                        className={Styles['editprofile__info-item-title']}
                        htmlFor='male'
                      >
                        {content &&
                          content.popup_edit_profile_edit_your_profile_genger_male}
                      </label>
                    </li>
                    <li className={Styles['editprofile__info-gender-item']}>
                      <input
                        type='radio'
                        id='famale'
                        className={Styles['editprofile__info-item-radio']}
                        name='gender'
                        onChange={() => handelOnChange('sex', 2)}
                        checked={userInfo.sex === 2}
                      />
                      <label
                        className={Styles['editprofile__info-item-title']}
                        htmlFor='famale'
                      >
                        {content &&
                          content.popup_edit_profile_edit_your_profile_genger_female}
                      </label>
                    </li>
                    <li className={Styles['editprofile__info-gender-item']}>
                      <input
                        type='radio'
                        id='other'
                        className={Styles['editprofile__info-item-radio']}
                        name='gender'
                        onChange={() => handelOnChange('sex', 3)}
                        checked={userInfo.sex === 3}
                      />
                      <label
                        className={Styles['editprofile__info-item-title']}
                        htmlFor='other'
                      >
                        {content &&
                          content.popup_edit_profile_edit_your_profile_genger_other}
                      </label>
                    </li>
                  </ul>
                </div>
              </div>
              <button
                className={Styles['btn-submit']}
                onClick={handleClickUpdateProfile}
              >
                {content && content.popup_edit_profile_save_text}
              </button>
            </div>
          )}

          {/* Popup delete account */}
          {showPopup == 7 && (
            <div className={Styles['editprofile__upload-image']}>
              <div className={Styles['editprofile__upload-heading']}>
                <FaAngleLeft
                  className={Styles['editprofile__upload-heading-icon']}
                  onClick={() => setShowPopup(1)}
                />
                <h4 className={Styles['editprofile__upload-heading-title']}>
                  {content && content.popup_edit_profile_delete_your_account}
                </h4>
              </div>
              <div className={Styles['editprofile__delete']}>
                <div className={Styles['editprofile__delete-btn']}>
                  {content && content.popup_edit_profile_back_text}
                </div>
                <div
                  className={`${Styles['editprofile__delete-btn']} ${Styles['delete']}`}
                  type='button'
                  onClick={e => handleOnDelete(e)}
                >
                  {content && content.popup_edit_profile_delete_text}
                </div>
              </div>
            </div>
          )}

          {/* Popup Family */}
          {showPopup == 8 && (
            <div className={`${Styles['editprofile__upload-image']}`}>
              <div className={Styles['editprofile__upload-heading']}>
                <FaAngleLeft
                  className={Styles['editprofile__upload-heading-icon']}
                  onClick={() => setShowPopup(1)}
                />
                <h4 className={Styles['editprofile__upload-heading-title']}>
                  {content &&
                    content.popup_edit_profile_family_and_relationships}
                </h4>
              </div>
              <div className={Styles['editprofile__relationship-list']}>
                <div className={Styles['editprofile__relationship-item']}>
                  <h5
                    className={Styles['editprofile__relationship-item-title']}
                  >
                    {content && content.popup_edit_profile_relationships}
                  </h5>
                  <div
                    className={Styles['editprofile__relationship-item-body']}
                    onClick={() =>
                      setShowPopupRelationship(!showPopupRelationship)
                    }
                  >
                    <FaPlusCircle
                      className={Styles['editprofile__relationship-item-icon']}
                    />
                    <p
                      className={
                        Styles['editprofile__relationship-item-content']
                      }
                    >
                      {content && content.popup_edit_profile_add_relationships}
                    </p>
                  </div>
                  {showPopupRelationship && (
                    <div
                      className={
                        Styles['editprofile__relationship-selected-box']
                      }
                    >
                      <select
                        className={Styles['editprofile__relationship-selected']}
                        name='relationship'
                        id='relationship'
                      >
                        <option
                          className={Styles['editprofile__relationship-option']}
                          value='0'
                        >
                          {content && content.popup_edit_profile_relationships}
                        </option>
                        <option
                          className={Styles['editprofile__relationship-option']}
                          value='1'
                        >
                          {content &&
                            content.popup_edit_profile_add_relationships_single}
                        </option>
                        <option
                          className={Styles['editprofile__relationship-option']}
                          value='2'
                        >
                          {content &&
                            content.popup_edit_profile_add_relationships_get_married}
                        </option>
                        <option
                          className={Styles['editprofile__relationship-option']}
                          value='3'
                        >
                          {content &&
                            content.popup_edit_profile_add_relationships_in_a_relationship}
                        </option>
                        <option
                          className={Styles['editprofile__relationship-option']}
                          value='4'
                        >
                          {content &&
                            content.popup_edit_profile_add_relationships_divorced}
                        </option>
                        <option
                          className={Styles['editprofile__relationship-option']}
                          value='5'
                        >
                          {content &&
                            content.popup_edit_profile_add_relationships_widow}
                        </option>
                      </select>
                      <label
                        htmlFor='private'
                        className={Styles['editprofile__relationship-title']}
                      >
                        {content &&
                          content.popup_edit_profile_private_permissions}
                      </label>
                      <select
                        className={Styles['editprofile__relationship-selected']}
                        name='private'
                        id='private'
                      >
                        <option
                          className={Styles['editprofile__relationship-option']}
                          value='0'
                        >
                          ...
                        </option>
                        <option
                          className={Styles['editprofile__relationship-option']}
                          value='1'
                        >
                          {content && content.popup_edit_profile_public}
                        </option>
                        <option
                          className={Styles['editprofile__relationship-option']}
                          value='2'
                        >
                          {content && content.popup_edit_profile_private}
                        </option>
                      </select>
                    </div>
                  )}
                </div>
                <div className={Styles['editprofile__relationship-item']}>
                  <h5
                    className={Styles['editprofile__relationship-item-title']}
                  >
                    {content && content.popup_edit_profile_family}
                  </h5>
                  <div
                    className={Styles['editprofile__relationship-item-body']}
                    onClick={() => setShowPopupFamily(!showPopupFamily)}
                  >
                    <FaPlusCircle
                      className={Styles['editprofile__relationship-item-icon']}
                    />
                    <p
                      className={
                        Styles['editprofile__relationship-item-content']
                      }
                    >
                      {content &&
                        content.popup_edit_profile_add_a_family_member}
                    </p>
                  </div>
                  {showPopupFamily && (
                    <div
                      className={
                        Styles['editprofile__relationship-selected-box']
                      }
                    >
                      <div
                        className={
                          Styles['editprofile__relationship-search-box']
                        }
                      >
                        <input
                          type='text'
                          className={
                            Styles['editprofile__relationship-search-input']
                          }
                          placeholder={
                            content && content.popup_edit_profile_search_text
                          }
                        />
                        <FaSearch
                          className={
                            Styles['editprofile__relationship-search-icon']
                          }
                        />
                      </div>
                      <label
                        htmlFor='private'
                        className={Styles['editprofile__relationship-title']}
                      >
                        {content && content.popup_edit_profile_family_role}
                      </label>
                      <select
                        className={Styles['editprofile__relationship-selected']}
                        name='relationship'
                        id='relationship'
                      >
                        <option
                          className={Styles['editprofile__relationship-option']}
                          value='0'
                        >
                          {content &&
                            content.popup_edit_profile_family_role_parent}
                        </option>
                        <option
                          className={Styles['editprofile__relationship-option']}
                          value='1'
                        >
                          {content &&
                            content.popup_edit_profile_family_role_grandparent}
                        </option>
                        <option
                          className={Styles['editprofile__relationship-option']}
                          value='2'
                        >
                          {content &&
                            content.popup_edit_profile_family_role_children}
                        </option>
                        <option
                          className={Styles['editprofile__relationship-option']}
                          value='3'
                        >
                          {content &&
                            content.popup_edit_profile_family_role_uncle_aunt}
                        </option>
                        <option
                          className={Styles['editprofile__relationship-option']}
                          value='4'
                        >
                          {content &&
                            content.popup_edit_profile_family_role_cousin}
                        </option>
                      </select>
                      <label
                        htmlFor='private'
                        className={Styles['editprofile__relationship-title']}
                      >
                        {content &&
                          content.popup_edit_profile_private_permissions}
                      </label>
                      <select
                        className={Styles['editprofile__relationship-selected']}
                        name='private'
                        id='private'
                      >
                        <option
                          className={Styles['editprofile__relationship-option']}
                          value='0'
                        >
                          ...
                        </option>
                        <option
                          className={Styles['editprofile__relationship-option']}
                          value='1'
                        >
                          {content && content.popup_edit_profile_public}
                        </option>
                        <option
                          className={Styles['editprofile__relationship-option']}
                          value='2'
                        >
                          {content && content.popup_edit_profile_private}
                        </option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
              <button className={Styles['btn-submit']}>
                {content && content.popup_edit_profile_save_text}
              </button>
            </div>
          )}
          {popupDelete && <PopupDelete setPopupDelete = {setPopupDelete }/>}
        </div>
      </div>
    </div>
  );
}
