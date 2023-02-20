import Head from 'next/head';
import Styles from '../../styles/LoginRegister.module.css';
import LogoDak from '../../public/images/dak.png'
import ImageGif from '../../public/images/1280720-black-br.265bb309.gif'
import iconDak from '../../public/images/Logo.png'
import {
  FaEye,
  FaFacebookF,
  FaAngleLeft,
  FaEyeSlash,
  FaCalendarAlt
} from 'react-icons/fa';
import { IoCalendar } from 'react-icons/io'

import { GoogleOAuthProvider } from '@react-oauth/google';
import { useState, useEffect, useRef, useCallback } from 'react';
import PopupForgetPassword from '../../components/PopupLogin/PopupForgetPassword/PopupForgetPassword';
import { getCookieUserLogin, setCookieChatToken, setCookieRefreshToken, setCookieXSRFToken, setTokenUserLogin } from '../../modules/Cookies/Auth/userLogin';
import {
  getRememberMeCookie,
  setRememberMeCookie,
  deleteRememberMeCookie,
} from '../../modules/Cookies/Auth/account';
import API, { endpoints, headers } from '../../API';

import { NotificationToast } from '../../modules/Notification/Notification';
import Particles from "react-particles";
import { loadFull } from "tsparticles";
import Image from 'next/image';
import { sendEmail } from '../../modules/send-email';
import GoogleLogin from '../../components/GoogleLogin/GoogleLogin';
import { sendToLogin } from '../../modules/Auth/handle-login';
import { signInWithFaceBook } from '../../modules/Auth/firebase';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import localStorage from 'local-storage';

const bcrytp = require('bcryptjs')

export default function Login() {
  const [showPopup, setShowPopup] = useState(1);
  const [showPopupForget, setShowPopupForget] = useState(false);
  const [seePass, setSeePass] = useState([]);
  const [gender, setGender] = useState(1);
  const [licenseCheckBox, setCheckBox] = useState(false);
  const [checkRemPass, setCheckRemPass] = useState(false);
  const [invalidValidate, setInvalidValidate] = useState(false);
  const [errorRegister, setErrorRegister] = useState({field:"",message:""});
  const [language, setLanguage] = useState("en");
  const [content, setContent] = useState({});
  const [showLanguage, setShowLanguage] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dob, setDob] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false)

  useEffect(() => {
    let auth = window.document.querySelectorAll(`.login`);
    // axios.post('./api/auth/get-save-account').then(res => {
    //   if (res.data.token != undefined && auth.length != 0) {
    //     auth[0].value = jwt_decode(res.data.token).user.username;
    //     auth[1].value = jwt_decode(res.data.token).user.password;
    //   }
    // });

    // Default dark mode
    document.documentElement.setAttribute('data-theme', 'dark');
    window.localStorage.setItem('theme', 'dark');

    // Nếu user đã đăng nhập rồi thì ko cho back lại trang login
    if(getCookieUserLogin()) {
      location.replace('/')
    }
  }, []);

  useEffect(() => {
    if (language) {
      setContent(require(`./languages/${language}.json`));
      } else {
      setContent(require(`./languages/en.json`));
    }
  }, [language]);

  const handleChangeLanguage = () => {}
  const handleShowLanguage = () => setShowLanguage(!showLanguage)

  useEffect(() => {
    if (showPopup === 1) {
      setCheckBox(false);
    }
    setErrorRegister({
      field:"",message:""
    })
    setInvalidValidate(false)
  }, [showPopup]);

  const handleEventSeePass = index => {
    if (seePass.includes(index)) {
      setSeePass(
        seePass.filter(function (value) {
          return value != index;
        })
      );
    } else {
      setSeePass([...seePass, index]);
    }
  };

  const handleCheckBox = () => {
    setCheckBox(!licenseCheckBox);
  };
  const validate = (string) =>{
    const regex = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return regex.test(string)
  }

  const sendToRegister = (e, gender) => {
    e.preventDefault()
    const auth = window.document.querySelectorAll(`.register`);
    const hashedPassword = bcrytp.hashSync(auth[3].value, 10)
    var data = ({
      name: auth[0].value,
      username: auth[1].value,
      email: auth[2].value,
      password: hashedPassword,
      account_type: 1,
      phone_number: phoneNumber,
      birthday: moment(dob).format("YYYY-MM-DD"),
      sex: gender,
    });
    if(data.name == ""){
      setErrorRegister({
        field : "name",
        message:"Please Enter Name!"
      })
    }
    else if(validate(data.name)){
      setErrorRegister({
        field : 'name',
        message : "Please Do Not Enter Special Characters!"
      })
    }
    else if(data.phone_number == ''){
      setErrorRegister({
        field : 'phoneNumber',
        message : "Please Enter Phone Number!"
      })
    }
    else if(data.username == ''){
      setErrorRegister({
        field:'username',
        message:'Please Enter Username!'
      })
    }
    else if(validate(data.username)){
      setErrorRegister({
        field : 'username',
        message : "Please Do Not Enter Special Characters!"
      })
    } else if (data.birthday === "") {
      setErrorRegister({
        field:'dob',
        message:'Please Enter DOB!'
      })
    }
    else{

      API.post(endpoints['auth/register']('en'), data, {
        headers: headers.headers_token,
      })
        .then(function (response) {
          if (response.data.success) {
            //Lưu lại email
            NotificationToast.fire({
              toast: true,
              position: 'top-right',
              icon: 'success',
              title:"Register Successfully!!! Please Verify In Your Mail!!!",
            })
            setShowPopup(1);
          }
          else if(response.data.errors[0].message === "Email AUTH.REGISTER.EXISTS") {
            setErrorRegister({
              field:'email',
              message:'Email is already exits'
            })
          } else if (response.data.errors[0].message === "Username AUTH.REGISTER.EXISTS") {
            setErrorRegister({
              field:'username',
              message:'Username is already exits'
            })
          }
        })
        .catch(function (error) {});
    }
  };

  const handleLogin = async (e) => {
    let account = window.document.querySelectorAll(`.login`);
    await sendToLogin(account)
      .then(res => {
        if (res.success) {
          if (checkRemPass) {
            if (account[0].value != '' && account[1].value != '') {
              const objRem = {
                email: account[0].value,
                password: account[1].value,
              };
              setRememberMeCookie(objRem);
            }
          } else {
            deleteRememberMeCookie();
          }
          //Tài khoản chưa đc xác thực
          if (res.data.user.active === 0) {
            //Lưu lại email để truyền sang compoment nhập mã xác thực
            sendEmail(res.data.token, res.data.xsrfToken, res.data.refreshToken)
            NotificationToast.fire({
              toast: true,
              position: 'top-end',
              icon: 'warning',
              title: 'Your Account Not Verify!!! Check Your Mail!!!',
            })
          } else {
            //Tài khoản đã xác thực thì thực hiện lưu cookie, lưu tài khoản đăng nhập nếu có, chuyển hướng sang trang login
            //Lưu thông tin user login (token và thông tin chi tiết)
            setTokenUserLogin(res.data.token);
            setCookieRefreshToken(res.data.refreshToken)
            setCookieXSRFToken(res.data.xsrfToken)
            setCookieChatToken(res.data.chatToken)
            localStorage.set('expiredTime', res.data.expiredAt)

            // axios({
            //   method: "post",
            //   url: "http://117.2.143.218:9000/api/dashboard/count-access",
            //   headers: {
            //     headers: {  Authorization: `Bearer ${res.data.token}`,
            //                 'Content-Type': 'application/json',
            //     }
            //   }
            // })
            // .then((res) => {})
            // .catch((err) => {});

            //Chuyển hướng sang trang home

            location.replace('/');
          }
        } else {
          setInvalidValidate(true)
        }
      })
      .catch(err => {console.log({err});});
  };

  const handleRememeberCheckbox = () => {
    setCheckRemPass(prev => !prev);
  };

  useEffect(() => {
    if (getRememberMeCookie()) {
      setCheckRemPass(true);
    }
  }, []);

  const ref = useRef(false);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowLanguage(false)
        setShowCalendar(false)
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return (() => {
      document.removeEventListener("mousedown", handleClickOutside)
    })
  }, [ref, setShowLanguage]);

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {}, []);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
      const handleMobile = () => {
          if(window.innerWidth <= 720) {
              setIsMobile(true);
          }
          else {
              setIsMobile(false);
          }
      }
      handleMobile();
      window.addEventListener("resize", handleMobile);
      return () => {
          window.removeEventListener("resize", handleMobile);
      }
  }, [])

  var patternNumber = /^([0-9]){0,10}$/
  const handlePhoneNumber = e =>{
    if(patternNumber.test(e.target.value)){
      setPhoneNumber(e.target.value)
    }
  }
  return (
    // clientID : API ID Google 
    <GoogleOAuthProvider clientId='425457697842-kbfejiaf5nrhuo8qgpd7nchifvh221t5.apps.googleusercontent.com'>
      <Head>
        <title>DAK - {content.home_login} </title>
        <link rel="shortcut icon" href={iconDak.src} />
        <link rel='stylesheet' href='/css/global.css' />
      </Head> 
      {getCookieUserLogin() === undefined &&
        <div className={Styles['form__group']}>
          <div className={Styles['form__group-left']}>
            {showPopup === 1 && (
              <form onSubmit={() => handleLogin(gender)} className={Styles['form__control']}>
                <div className={Styles['form__control-heading']}>
                  <h2 className={Styles['form__control-title']}>
                    {content.home_welcome}
                  </h2>
                </div>
                <div className={Styles['form__control-main']}>
                  <div className={
                    `${invalidValidate ? Styles['form__control-box-invalid'] : Styles['form__control-box']}`
                    }>
                    <input
                      key='email'
                      type='text'
                      // onChange={e => {setEmail(e)}}
                      defaultValue={
                        getRememberMeCookie() !== undefined
                          ? getRememberMeCookie().email
                          : ''
                      }
                      className={`${Styles['form__control-input']} login`}
                      placeholder={content.home_username}
                    />
                  </div>
                  <div className={
                    `${invalidValidate ? Styles['form__control-box-invalid'] : Styles['form__control-box']}`
                  }>
                    <input
                      key='pass'
                      type={seePass.includes(1) ? 'text' : 'password'}
                      // onChange={e => {setPassword(e)}}
                      defaultValue={
                        getRememberMeCookie() !== undefined
                          ? getRememberMeCookie().password
                          : ''
                      }
                      className={`${Styles['form__control-input']} login`}
                      placeholder={content.home_pass}
                    />
                    <span
                      onClick={() => {
                        handleEventSeePass(1);
                      }}
                    >
                      {seePass.includes(1) ? (
                        <FaEyeSlash
                          className={Styles['form__control-icon-eye']}
                        />
                      ) : (
                        <FaEye className={Styles['form__control-icon-eye']} />
                      )}
                    </span>
                  </div>
                  
                  {/* <div className={`${Styles['form__control-invalid']} ${invalidValidate && Styles.active}`}>
                    <label
                      className={Styles['form__control-invalid-title']}
                    >
                      <span> {content.home_error_login} </span>
                      <GoAlert className={Styles['form__control-invalid-icon']} />
                    </label>
                  </div> */}
                  <div className={Styles['form__control-remember']}>
                      <input
                        id='remember'
                        className={`${Styles['form__control-remember-checkbox']} login`}
                        type='checkbox'
                        onChange={() => handleRememeberCheckbox()}
                        checked={checkRemPass == true ? true : false}
                      />
                      <label
                        onClick={() => handleRememeberCheckbox()}
                        htmlFor='remember'
                        className={Styles['form__control-remember-title']}
                      >
                        {content.home_remember}
                      </label>
                     
                    </div>
                  <div className={Styles['form__control-option']}>
                  <div className={Styles.form__control__language}>
                        <span>Change language: </span>
                        <label onClick={handleShowLanguage} >
                          {
                            language === 'en' ? "English" :
                              language === 'vn' ? "Vietnamese" : 
                                language === 'th' ? "Thai" :
                                  language === 'phi' ? "Phillipinese" :
                                    language === 'id' ? "Indonesian" :
                                      language === 'in' ? "Indian" : "Chinese" 
                          }
                        </label>
                        {showLanguage && 
                          <ul ref={ref}>
                            <li onClick={() => handleChangeLanguage(
                              setLanguage('en'),
                              setShowLanguage(false)
                            )} >English</li>
                            <li onClick={() => handleChangeLanguage(
                              setLanguage('vn'),
                              setShowLanguage(false))}>Vietnamese</li>
                            <li onClick={() => handleChangeLanguage(
                              setLanguage('th'),
                              setShowLanguage(false))}>Thai</li>
                            <li onClick={() => handleChangeLanguage(
                              setLanguage('phi'),
                              setShowLanguage(false))}>Phillipinese</li>
                            <li onClick={() => handleChangeLanguage(
                              setLanguage('id'),
                              setShowLanguage(false))}>Indonesian</li>
                            <li onClick={() => handleChangeLanguage(
                              setLanguage('in'),
                              setShowLanguage(false))}>Indian</li>
                            <li onClick={() => handleChangeLanguage(
                              setLanguage('cn'),
                              setShowLanguage(false))}>Chinese</li>
                          </ul>
                        }
                      </div>
                    
                    
                    <div className={Styles['form__control-forget']}>
                      <label
                        className={Styles['form__control-forget-title']}
                        onClick={() => setShowPopupForget(!showPopupForget)}
                      >
                        {content.home_forget_pass} ? 
                      </label>
                    </div>
                  </div>
                  <button
                    className={Styles['form__control-btn']}
                    onClick={(e) => handleLogin(e.preventDefault())}
                  >
                    {content.home_login}
                  </button>
                  <ul className={Styles['form__control-social-list']}>
                    <GoogleLogin />
                    <li
                      className={Styles['form__control-social-item']}
                      onClick={signInWithFaceBook}
                    >
                      <FaFacebookF
                        className={Styles['form__control-social-item-icon']}
                      />
                    </li>
                    {/* <li className={Styles['form__control-social-item']}>
                      <FaTwitter
                        className={Styles['form__control-social-item-icon']}
                      />
                    </li>
                    <li className={Styles['form__control-social-item']}>
                      <FaYoutube
                        className={Styles['form__control-social-item-icon']}
                      />
                    </li>
                    <li className={Styles['form__control-social-item']}>
                      <FaTiktok
                        className={Styles['form__control-social-item-icon']}
                      />
                    </li> */}
                  </ul>
                  <p className={Styles['form__control-register-title']}>
                  {content.home_no_acccount} ?
                    <span
                      className={Styles['form__control-register']}
                      onClick={() => setShowPopup(2)}
                    >
                      {content.home_register}
                    </span>
                  </p>
                </div>
              </form>
            )}
            {showPopupForget && (
              <PopupForgetPassword
                handleClick={() => setShowPopupForget(!showPopupForget)}
              />
            )}
            {showPopup === 2 && (
              <form onSubmit={(e) => sendToRegister(e, gender)} className={Styles['form__control']}>
                <div className={Styles['form__control-heading']}>
                  <h2 className={Styles['form__control-title']}>
                    {content.home_welcome}
                  </h2>
                  <p
                    className={Styles['form__control-login']}
                    onClick={() => setShowPopup(1)}
                  >
                    <FaAngleLeft className={Styles['form__control-login-icon']} />
                    {content.home_login}
                  </p>
                </div>
                <div className={Styles['form__control-main']}>
                  <div className={Styles[`${errorRegister.field === "name" ? 'form__control-box-invalid':'form__control-box'}`]}>
                    <input
                      type='text'
                      className={`${Styles['form__control-input']} register`}
                      placeholder={content.home_fullname}
                    />
                  </div>
                  <div className={Styles[`${errorRegister.field === "username" ? 'form__control-box-invalid':'form__control-box'}`]}>
                    <input
                      type='text'
                      className={`${Styles['form__control-input']} register`}
                      placeholder={content.home_userlogin}
                    />
                  </div>
                  <div className={Styles[`${errorRegister.field === "email" ? 'form__control-box-invalid':'form__control-box'}`]}>
                    <input
                      type='text'
                      className={`${Styles['form__control-input']} register`}
                      placeholder={content.home_email}
                    />
                  </div>
                  <div className={Styles[`${errorRegister.field === "password" ? 'form__control-box-invalid':'form__control-box'}`]}>
                    <input
                      type={seePass.includes(2) ? 'text' : 'password'}
                      className={`${Styles['form__control-input']} register`}
                      placeholder={content.home_pass}
                    />
  
                    <div
                      onClick={() => {
                        handleEventSeePass(2);
                      }}
                    >
                      {seePass.includes(2) ? (
                        <FaEyeSlash
                          className={Styles['form__control-icon-eye']}
                        />
                      ) : (
                        <FaEye className={Styles['form__control-icon-eye']} />
                      )}
                    </div>
                  </div>
                  <div className={Styles[`${errorRegister.field === "phoneNumber" ? 'form__control-box-invalid':'form__control-box'}`]}>
                    <input
                      type='text'
                      className={`${Styles['form__control-input']} register`}
                      placeholder={content.home_phonenumber}
                      value = {phoneNumber}
                      onChange = {(e) => handlePhoneNumber(e)}
                    />
                  </div>
                  <div ref={ref} className={Styles[`${errorRegister.field === "dob" ? 'form__control-box-invalid':'form__control-box'}`]}>
                    <span style={{display: 'flex', flexDirection: "row", justifyContent: "end"}} onClick={() => setShowCalendar(!showCalendar)} > <FaCalendarAlt color='#ffdd00' /> </span>
                    <span> {moment(dob).format("YYYY-MM-DD")} </span>
                    {
                      showCalendar && <Calendar className={Styles.calendar} onChange={setDob}
                      value={dob}
                       />
                    }
                  </div>
                  <div
                    className={`${Styles['form__control-box']} register`}
                    id={Styles['gender']}
                  >
                    <div className={Styles['label-gender']}>
                      <label style={{ color: 'var(--main-text)' }}>
                        {content.home_sex}
                      </label>
                    </div>
                    <div className={Styles['form__control-box-gender']}>
                      <span
                        onClick={() => setGender(1)}
                        className={
                          gender === 1 ? Styles['bordered'] : Styles['un-bordered']
                        }
                      >
                        {content.home_male}
                      </span>
                      <span
                        onClick={() => setGender(2)}
                        className={
                          gender === 2 ? Styles['bordered'] : Styles['un-bordered']
                        }
                      >
                        {content.home_female}
                      </span>
                      <span
                        onClick={() => setGender(3)}
                        className={
                          gender === 3 ? Styles['bordered'] : Styles['un-bordered']
                        }
                      >
                        {content.home_other}
                      </span>
                    </div>
                  </div>
                  <div className={Styles['form__control-policy']}>
                    <div className={`${Styles[`form__control-errorRegister`]} ${errorRegister.message !== "" && Styles.active}`}>
                      {errorRegister.message }
                    </div>
                    <input
                      onClick={() => {
                        handleCheckBox();
                      }}
                      id='policy'
                      className={`register ${Styles['form__control-policy-checkbox']}`}
                      type='checkbox'
                    />
                    <label
                      htmlFor='policy'
                      className={Styles['form__control-policy-title']}
                    >
                      {content.home_policy.content1}
                      <span className={Styles['form__control-policy-condition']}>
                      {content.home_policy.content2}
                      </span>
                      {'&'}
                      <span className={Styles['form__control-policy-condition']}>
                      {content.home_policy.content3}
                      </span>
                    </label>
                  </div>
                  
                  {licenseCheckBox && (
                    <button
                      className={Styles['form__control-btn']}
                      onClick={(e) => {
                        sendToRegister(e, gender);
                      }}
                    >
                      {content.home_register}
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
          <div className={Styles['form__group-right']}>
            <Image src={ImageGif} alt='ImageGif' />
          </div>
          {/* <div className={Styles['form__group-right-res']}>
            <Image src={ImageGifRes} alt='ImageGif' />
          </div> */}
        
        </div>
    }
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        fpsLimit: 144,
        fullScreen: {
          enable: true,
          zIndex: -10
        },
        interactivity: {
          events: {
            onClick: {
              enable: false,
              mode: "push",
            },
            onHover: {
              enable: true,
              mode: ["grab", "connect"],
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 200,
              duration: 0.7,
            },
          },
        },
        particles: {
          color: {
            value: "#fff",
          },
          links: {
            color: "#ffdd00",
            distance: 120,
            enable: true,
            opacity: 1,
            width: 1,
          },
          collisions: {
            enable: false,
          },
          move: {
            directions: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 3,
            straight: false,
          },
          number: {
            density: {
              enable: false,
              area: 1700,
            },
            value: isMobile ? 20 : 50,
          },
          opacity: {
            value: 1,
          },
          shape: {
            type: "image",
            image: {
              src: LogoDak.src,
              width: 300,
              height: 300
            }
          },
          size: {
            value: { min: 1, max: 12 },
          },
        },
        detectRetina: true,
      }}
    />
    </GoogleOAuthProvider>
  );
}
