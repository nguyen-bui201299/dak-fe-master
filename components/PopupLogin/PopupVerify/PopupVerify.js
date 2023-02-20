import { useEffect, useRef, useState } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';
import { sendCode } from '../../../modules/Auth/sendCode';
import { ErrorNotification } from '../../../modules/Notification/Notification';
import { sendEmail } from '../../../modules/send-email';
import Styles from './PopupVerify.module.css';

export default function PopupVerify({
  handleClick,
  setShowPopupVerify,
  email,
  setNofiErrorLogin,
  setResultVerification,
  setShowPopup
}) {
  // const userInfo = useSelector((state) => state.infoUserLogin);

  //   const [content, setContent] = useState({});

  //   useEffect(() => {
  //       if (userInfo.language !== undefined) {
  //       setContent(require(`../languages/${userInfo.language}.json`));
  //       } else {
  //       setContent(require(`../languages/en.json`));
  //       }
  //   }, [userInfo]);

  const popupVerify = useRef();
  const inputNumber1 = useRef(null);
  const inputNumber2 = useRef(null);
  const inputNumber3 = useRef(null);
  const inputNumber4 = useRef(null);
  const inputNumber5 = useRef(null);
  const inputNumber6 = useRef(null);

  const [token, setToken] = useState('');
  const [indexSendCode, setIndexSendCode] = useState(1);

  const closePopupVerify = e => {
    if (popupVerify.current === e.target) {
      setShowPopupVerify(false);
    }
  };

  useEffect(() => {
    inputNumber1.current.focus();
    sendEmail({ email })
      .then(res => {
        if (res.success) {
          setToken(res.token);
        }
      })
      .catch(err => {
        ErrorNotification(err);
        setToken('');
      });
  }, [indexSendCode]);

  // Prevent input more than 2 numbers
  const limitInputNumber = value => {
    if (value.length >= 2) {
      value = value[0];
      return value;
    }
  };

  // Prevent input '+', '-' in input
  const handleKeydown = e => {
    console.log(e.key);
    if (e.key === '+' || e.key === '-' || e.key === '.') {
      e.preventDefault();
    }
  };

  const handleInputNumber = (e, index) => {
    const value = e.target.value;
    if (index == 1) {
      if (value.length >= 2) {
        inputNumber1.current.value = limitInputNumber(value);
      }
      inputNumber2.current.focus();
    }
    if (index == 2) {
      if (value.length >= 2) {
        inputNumber2.current.value = limitInputNumber(value);
      }
      inputNumber3.current.focus();
    }
    if (index == 3) {
      if (value.length >= 2) {
        inputNumber3.current.value = limitInputNumber(value);
      }
      inputNumber4.current.focus();
    }
    if (index == 4) {
      if (value.length >= 2) {
        inputNumber4.current.value = limitInputNumber(value);
      }
      inputNumber5.current.focus();
    }
    if (index == 5) {
      if (value.length >= 2) {
        inputNumber5.current.value = limitInputNumber(value);
      }
      inputNumber6.current.focus();
    }
    if (index == 6) {
      if (value.length >= 2) {
        inputNumber6.current.value = limitInputNumber(value);
      }
      handleSendVerification();
    }
  };

  const handleSendVerification = () => {
    var data = {
      token: token,
      code: getCode(),
    };

    sendCode(data)
      .then(response => {
        if (response.success) {
          setShowPopupVerify(false);
          setShowPopup(1)
          setResultVerification(response.success);
        } else {
          ErrorNotification(response.message);
          resetInputCode();
        }
      })
      .catch(function (error) {
        ErrorNotification("Error");
      });
  };

  //Lấy mã người dùng nhập từ giao diện, và trả về string mã
  const getCode = () => {
    try {
      const listCode = [
        ...window.document.querySelectorAll(`.verify__body-form-input`),
      ];
      var listcode = '';
      listCode.map((code, index) => {
        listcode += code.value.toString();
      });

      return listcode;
    } catch (err) {
      ErrorNotification(err);
      return '000000';
    }
  };

  //Xoá mã đã nhập và forcus vài ô input thứ nhất (dũng khi người dùng nhập mã sai)
  const resetInputCode = () => {
    try {
      const listCode = [
        ...window.document.querySelectorAll(`.verify__body-form-input`),
      ];
      listCode.map((code, index) => {
        code.value = '';
      });
      inputNumber1.current.focus();
    } catch (err) {
      ErrorNotification(err);
    }
  };

  return (
    <>
      <ToastContainer />
      <div
        className={Styles['overlayPopupVerify']}
        ref={popupVerify}
        onClick={closePopupVerify}
      >
        <div className={Styles['verify']}>
          <div className={Styles['verify__heading']}>
            <h3 className={Styles['verify__title']}>Verify Account</h3>
            <FaRegTimesCircle
              className={Styles['verify__icon-close']}
              onClick={handleClick}
            />
          </div>
          <div className={Styles['verify__body']}>
            <p className={Styles['verify__body-heading']}>
              Verification Code Is Sent To Email <br />
              <span className={Styles['verify__body-heading-email']}>
                {email}
              </span>
            </p>
            <div className={Styles['verify__body-form']}>
              <input
                ref={inputNumber1}
                onKeyDown={e => handleKeydown(e)}
                className={`${Styles['verify__body-form-input']} verify__body-form-input`}
                onChange={event => handleInputNumber(event, 1)}
                type='number'
              />
              <input
                ref={inputNumber2}
                onKeyDown={e => handleKeydown(e)}
                className={`${Styles['verify__body-form-input']} verify__body-form-input`}
                onChange={event => handleInputNumber(event, 2)}
                type='number'
              />
              <input
                ref={inputNumber3}
                onKeyDown={e => handleKeydown(e)}
                className={`${Styles['verify__body-form-input']} verify__body-form-input`}
                onChange={event => handleInputNumber(event, 3)}
                type='number'
              />
              <input
                ref={inputNumber4}
                onKeyDown={e => handleKeydown(e)}
                className={`${Styles['verify__body-form-input']} verify__body-form-input`}
                onChange={event => handleInputNumber(event, 4)}
                type='number'
              />
              <input
                ref={inputNumber5}
                onKeyDown={e => handleKeydown(e)}
                className={`${Styles['verify__body-form-input']} verify__body-form-input`}
                onChange={event => handleInputNumber(event, 5)}
                type='number'
              />
              <input
                ref={inputNumber6}
                onKeyDown={e => handleKeydown(e)}
                className={`${Styles['verify__body-form-input']} verify__body-form-input`}
                onChange={event => handleInputNumber(event, 6)}
                type='number'
              />
            </div>
            <p className={Styles['verify__body-resend-box']}>
              Haven`t Received The Verification Code?
              <span
                className={Styles['verify__body-resend']}
                onClick={event => {
                  setIndexSendCode(indexSendCode + 1);
                }}
              >
                Resend
              </span>
            </p>
            <button
              className={Styles['btn-submit']}
              onClick={handleSendVerification}
            >
              Verify
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
