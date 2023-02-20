import React, { useEffect, useState,useRef } from 'react';
import Styles from './QuickLottery.module.css';
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { BoxrulelotteryQuick } from "../../pages/lottery/detaillottery/index";
import API, { endpoints, headers } from '../../API';
import { NotificationToast } from '../../modules/Notification/Notification';
import { getCookieUserLogin } from '../../modules/Cookies/Auth/userLogin';

export default function QuickLottery({language, handleIsTransfer}) {
    //Lấy thông thôngtin người dùng từ redux
    const userLogin = getCookieUserLogin()

    // Đây là nút nhấn show ra notification
    const [ShowRule, HideRule] = useState(false);
    const [priceJackpot, setPriceJactpot] = useState(0);

    // Check input lottery-number
    const [NumberOne, setNumberOne] = useState();
    const [NumberTwo, setNumberTwo] = useState();
    const [NumberThree, setNumberThree] = useState();
    const [NumberFour, setNumberFour] = useState();
    const [NumberFive, setNumberFive] = useState();
    const [NumberSix, setNumberSix] = useState();
    const arrcheck = [NumberOne, NumberTwo, NumberThree, NumberFour, NumberFive, NumberSix]
    const CheckFocusI = useRef(null)
    const CheckFocusII = useRef(null)
    const CheckFocusIII = useRef(null)
    const CheckFocusIV = useRef(null)
    const CheckFocusV = useRef(null)
    const CheckFocusVI = useRef(null)

    function chooseNumberI(e) {
      setNumberOne(e.target.value.slice(0,2));
    }
    function chooseNumberII(e) {
      setNumberTwo(e.target.value.slice(0,2));
    }
    function chooseNumberIII(e) {
      setNumberThree(e.target.value.slice(0,2));
    }
    function chooseNumberIV(e) {
      setNumberFour(e.target.value.slice(0,2));
    }
    function chooseNumberV(e) {
      setNumberFive(e.target.value.slice(0,2));
    }
    function chooseNumberVI(e) {
      setNumberSix(e.target.value.slice(0,2));
    }

    const checkDuplicate = () => {
        for (var i = 0; i < arrcheck.length; i++) {
            for (var j = 1; j < arrcheck.length; j++)
                if (arrcheck[i] == arrcheck[j] && i != j) {
                    return true;
                }
        }
        return false;
    }
    const checkLimitNum = () => {
        for (var i = 0; i < arrcheck.length; i++) {
            var val = arrcheck[i];
            if (val > 45 || val < 1) {
                return true;
            }
        }
        return false;
    }
    const checkWord = () => {
        for (var i = 0; i < arrcheck.length; i++) {
            if (typeof (arrcheck[i] / 1) == 'string') {
                return true;
            }
        }
        return false;
    }

    
    const checkEmNum = () => {
        for (var i = 0; i < arrcheck.length; i++) {
            if (arrcheck[i] == '') {
                return true;
            }
        }
        return false;
    }
    const addNum = () => {
        if (NumberOne < 10 && NumberOne.length < 2) {
            String(NumberOne);
            NumberOne = '0' + NumberOne;
        }
        if (NumberTwo < 10 && NumberTwo.length < 2) {
            String(NumberTwo);
            NumberTwo = '0' + NumberTwo;
        }
        if (NumberThree < 10 && NumberThree.length < 2) {
            String(NumberThree);
            NumberThree = '0' + NumberThree;
        }
        if (NumberFour < 10 && NumberFour.length < 2) {
            String(NumberFour);
            NumberFour = '0' + NumberFour;
        }
        if (NumberFive < 10 && NumberFive.length < 2) {
            String(NumberFive);
            NumberFive = '0' + NumberFive;
        }
        if (NumberSix < 10 && NumberSix.length < 2) {
            String(NumberSix);
            NumberSix = '0' + NumberSix;
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (NumberOne || NumberTwo || NumberThree || NumberFour || NumberFive || NumberSix) {
            if (checkDuplicate() == false && checkLimitNum() == false && checkWord() == false && checkEmNum() == false) {
                addNum()
                const data = JSON.stringify({
                    full_slot: NumberOne + NumberTwo + NumberThree + NumberFour + NumberFive + NumberSix,
                    slot1: NumberOne,
                    slot2: NumberTwo,
                    slot3: NumberThree,
                    slot4: NumberFour,
                    slot5: NumberFive,
                    slot6: NumberSix,
                })
                API.post(endpoints["postlottery"], data, { headers: headers.headers_token })
                    .then(res => {
                        if (res.data.success) {
                            setNumberOne("")
                            setNumberTwo("")
                            setNumberThree("")
                            setNumberFour("")
                            setNumberFive("")
                            setNumberSix("")
                            setArrCheck("")
                            NotificationToast.fire({
                              toast: true,
                              position: 'bottom-end',
                              icon: 'success',
                              title: `${content.quick_lottery_success}`,
                            })
                            handleIsTransfer()
                            // setListHistory({
                            //     list: [
                            //         [
                            //             res.data.data.slot1,
                            //             res.data.data.slot2,
                            //             res.data.data.slot3,
                            //             res.data.data.slot4,
                            //             res.data.data.slot5,
                            //             res.data.data.slot6,
                            //             res.data.data.date
                            //         ],
                            //         ...listHistory.list
                            //     ]
                            // })
                        } else {
                            NotificationToast.fire({
                              toast: true,
                              position: 'bottom-end',
                              icon: 'error',
                              title: `Error`,
                            })
                        }
                    })
                    .catch((er) => {
                      if (er.response) {
                        if(er.response.data.message === "Số lượng DAK Point không đủ !!") {
                          NotificationToast.fire({
                            toast: true,
                            position: 'bottom-end',
                            icon: 'error',
                            title: `${content.quick_lottery_warn_not_enough_point}`,
                          })
                        }
                      }
                    })
            } else {
                // seteInput(true)
                if (checkEmNum() == true) {
                    NotificationToast.fire({
                      toast: true,
                      position: 'bottom-end',
                      icon: 'error',
                      title: `${content.quick_lottery_error_blank}`,
                    })
                    return
                }
                if (NumberOne || NumberTwo ||NumberThree ||NumberFour ||NumberFive ||NumberSix === "") {
                    NotificationToast.fire({
                      toast: true,
                      position: 'bottom-end',
                      icon: 'error',
                      title: `${content.detail_lottery_warn_blank}`,
                    })
                    return;
                }
                if (checkDuplicate() == true) {
                    NotificationToast.fire({
                      toast: true,
                      position: 'bottom-end',
                      icon: 'warning',
                      title: `${content.quick_lottery_error_duplicate}`,
                    })
                    return
                }
                if (checkLimitNum() == true) {
                    NotificationToast.fire({
                      toast: true,
                      position: 'bottom-end',
                      icon: 'warning',
                      title: `${content.quick_lottery_error_limitnum}`,
                    })
                    return
                }
                if (checkWord() == true) {
                    NotificationToast.fire({
                      toast: true,
                      position: 'bottom-end',
                      icon: 'warning',
                      title: `${content.quick_lottery_erorr_word}`,
                    })
                    return
                }
            }
        } else {
            NotificationToast.fire({
              toast: true,
              position: 'bottom-end',
              icon: 'error',
              title: `${content.quick_lottery_error_tryagain}`,
            })
        }

    }

    const [content, setContent] = useState({});

    useEffect(() => {
        if(userLogin?.language!== undefined) {
            setContent(require(`./languages/${userLogin.language}.json`));
        }else{
            setContent(require(`./languages/en.json`));
        }
    }, [userLogin])

    const arrLotter = [CheckFocusI,CheckFocusII,CheckFocusIII,CheckFocusIV,CheckFocusV,CheckFocusVI]
    const [arrSoXo,setArrCheck] = useState([])
    const [lotteryReward, setLotteryReward] = useState([])
    
    const CheckKey = (e)=>{
        if(parseInt(e.target.value) >= 1 && parseInt(e.target.value)<=45){
          if(!arrSoXo.includes(e.target.value)){
            setArrCheck([...arrSoXo,e.target.value]);
          }else{
            e.target.focus()
            NotificationToast.fire({
              toast: true,
              position: 'bottom-end',
              icon: 'warning',
              title: `${content.quick_lottery_error_enterduplicate}`,
            })
          }
        }else{
          e.target.value = ''
          e.target.focus()
          NotificationToast.fire({
            toast: true,
            position: 'bottom-end',
            icon: 'warning',
            title: `${content.quick_lottery_error_enterlimitnum}`,
          })
        }
    }
    const checknumberIDown = (e)=>{
      if(e.key === 'Backspace'){ 
        if(e.target.value.length >= 2){
          const index = arrSoXo.indexOf(e.target.value)
          arrSoXo.splice(index,1)
        }
      }
    }
    const checknumberI = (e)=>{
      if(e.target.value.length >= 2){
        CheckFocusII.current.focus()
        CheckKey(e)
      }
    }
    const checknumberII = (e)=>{
      if(e.target.value.length >= 2){
        CheckFocusIII.current.focus()
        CheckKey(e)
      }
      if(e.key === 'Backspace'){
        if(e.target.value.length === 0){
          CheckFocusI.current.focus()
        }
      }
    }
    const checknumberIII = (e)=>{
      if(e.target.value.length >= 2){
        CheckFocusIV.current.focus()
        CheckKey(e)
      }
      if(e.key === 'Backspace'){
        if(e.target.value.length === 0){
          CheckFocusII.current.focus()
        }
      }
    }
    const checknumberIV = (e)=>{
      if(e.target.value.length >= 2){
        CheckFocusV.current.focus()
        CheckKey(e)
      }
      if(e.key === 'Backspace'){
        if(e.target.value.length === 0){
          CheckFocusIII.current.focus()
        }
      }
    }
    const checknumberV = (e)=>{
      if(e.target.value.length >= 2){
        CheckFocusVI.current.focus()
        CheckKey(e)
      }
      if(e.key === 'Backspace'){
        if(e.target.value.length === 0){
          CheckFocusIV.current.focus()
        }
      }
    }
    const checknumberVI = (e)=>{
      if(e.target.value.length >= 2){
        CheckFocusVI.current.blur()
        CheckKey(e)
      }
      if(e.key === 'Backspace'){
        if(e.target.value.length === 0){
          CheckFocusV.current.focus()
        }
      }
    }

    useEffect(() => {
        API.get(endpoints["getlottery"], { headers: headers.headers_token })
            .then((res) => {
                setLotteryReward(res.data.data)
    })
            .catch((err) => {
                console.log(err);
            });
    },[])
    
    useEffect(() => {
        API.get(endpoints["getPriceJackpot"], { headers: headers.headers_token })
            .then(function (res) {         
                if(res.data.code == 200 && res.data.success){
                setPriceJactpot(res.data.data)
                }else{
                setPriceJactpot(0)
                }
            })
            .catch(function (error) {
                setPriceJactpot(0)
                console.log(error)
            });
    }, [])

    const numberWithDot = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const ref = useRef(false);
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          HideRule(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return (() => {
        document.removeEventListener("mousedown", handleClickOutside)
      })
    }, [ref, HideRule]);

    // Shuffle thứ tự trong mảng
  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));

      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  const getLotteryRandom = () => {
    // Lấy random 6 số từ 1 - 45
    const random1 = Math.floor(Math.random() * (Math.floor(8) - Math.ceil(1)) + Math.ceil(1))
    const random2 = Math.floor(Math.random() * (Math.floor(16) - Math.ceil(9)) + Math.ceil(9))
    const random3 = Math.floor(Math.random() * (Math.floor(24) - Math.ceil(17)) + Math.ceil(17))
    const random4 = Math.floor(Math.random() * (Math.floor(30) - Math.ceil(25)) + Math.ceil(25))
    const random5 = Math.floor(Math.random() * (Math.floor(36) - Math.ceil(31)) + Math.ceil(31))
    const random6 = Math.floor(Math.random() * (Math.floor(46) - Math.ceil(37)) + Math.ceil(37))
    
    const arrRandom = []
    arrRandom.push(random1, random2, random3, random4, random5, random6)

    // add number 0 for number < 10, push into array & convert to string
    const newArr = []
    arrRandom.map(number => {
      if(number < 10) {
        String(number)
        number = "0" + number
        newArr.push(number)
      } else {
        newArr.push(number.toString())
      }
    })
    // shuffle array
    shuffle(newArr)

    setNumberOne(newArr[0])
    setNumberTwo(newArr[1])
    setNumberThree(newArr[2])
    setNumberFour(newArr[3])
    setNumberFive(newArr[4])
    setNumberSix(newArr[5])
 
  }

    return(
        <>
        <div className={Styles.quick__lottery}>
            <h3 className={Styles.quick__lottery__title}> {content.lottery_header} </h3>
            {/* code ở đây */}
            <div className={Styles.Box__Popup__Lottery}>
                <div className={Styles.Box__Popup__Lottery__Title}>
                    <h3 className={Styles.Box__Popup__Lottery__Title__h4}> DAK 
                        <span className={Styles.Box__Popup__Lottery__Title__span}> {content.lottery_title} </span>  
                    </h3> 
                </div>

                <h2 className={Styles.Box__Popup__Lottery__Title__h5}> 
                    JACKPOT 
                    <span className={Styles.Box__Popup__Lottery__Title__h5__span}> {numberWithDot(parseInt(priceJackpot))} </span>  
                </h2>

                <span 
                    className={Styles.Rule__Lottery}
                    onClick={() => HideRule(true)}
                    ref={ref}
                > 
                    <AiOutlineExclamationCircle className={Styles.Icon__rule} />
                </span>
                {ShowRule && (
                    <BoxrulelotteryQuick content={content} trigger={ShowRule} setTrigger={HideRule} />
                )}

                {/* Phần xổ số máy dò */}
                <div className={Styles.Computer__Lottery}>
                    <ul className={Styles.Computer__Lottery__ul}>
                        <li className={Styles.Computer__Lottery__li}>
                            <h2 className={Styles.Computer__Lottery__li__number}> {lotteryReward[0]?.slot1}  </h2>
                        </li>
                        <li className={Styles.Computer__Lottery__li}>
                            <h2 className={Styles.Computer__Lottery__li__number}> {lotteryReward[0]?.slot2} </h2>
                        </li>
                        <li className={Styles.Computer__Lottery__li}>
                            <h2 className={Styles.Computer__Lottery__li__number}> {lotteryReward[0]?.slot3} </h2>
                        </li>
                        <li className={Styles.Computer__Lottery__li}>
                            <h2 className={Styles.Computer__Lottery__li__number}> {lotteryReward[0]?.slot4} </h2>
                        </li>
                        <li className={Styles.Computer__Lottery__li}>
                            <h2 className={Styles.Computer__Lottery__li__number}> {lotteryReward[0]?.slot5} </h2>
                        </li>
                        <li className={Styles.Computer__Lottery__li}>
                            <h2 className={Styles.Computer__Lottery__li__number}> {lotteryReward[0]?.slot6} </h2>
                        </li>
                    </ul>
                </div>

                <hr className={Styles.Hr__Lottery} />

                {/* Phần xổ số người chơi mua */}
                <div className={Styles.Player__Lottery}>
                    <ul className={Styles.Player__Lottery__ul}>
                        <li className={Styles.Player__Lottery__li}>
                            <input 
                                className={Styles.Player__Lottery__li__number__input} 
                                value={NumberOne} 
                                onChange={chooseNumberI}
                                maxLength="2"
                                placeholder="00"
                                onKeyUp={(e)=>(checknumberI(e))}
                                onKeyDown={(e)=>(checknumberIDown(e))}
                                ref={CheckFocusI}
                                type="number"
                            />
                        </li>
                        <li className={Styles.Player__Lottery__li}>
                            <input 
                                className={Styles.Player__Lottery__li__number__input} 
                                value={NumberTwo} 
                                onChange={chooseNumberII}
                                maxLength="2"
                                placeholder="00"
                                ref={CheckFocusII}
                                onKeyUp={(e)=>(checknumberII(e))}
                                onKeyDown={(e)=>(checknumberIDown(e))}
                                type="number"
                            />
                        </li>
                        <li className={Styles.Player__Lottery__li}>
                            <input 
                                className={Styles.Player__Lottery__li__number__input} 
                                value={NumberThree} 
                                onChange={chooseNumberIII}
                                maxLength="2"
                                placeholder="00"
                                onKeyUp={(e)=>(checknumberIII(e))}
                                ref={CheckFocusIII}
                                onKeyDown={(e)=>(checknumberIDown(e))}
                                type="number"
                            />
                        </li>
                        <li className={Styles.Player__Lottery__li}>
                            <input 
                                className={Styles.Player__Lottery__li__number__input} 
                                value={NumberFour} 
                                onChange={chooseNumberIV}
                                maxLength="2"
                                placeholder="00"
                                ref={CheckFocusIV}
                                onKeyUp={(e)=>(checknumberIV(e))}
                                onKeyDown={(e)=>(checknumberIDown(e))}
                                type="number"
                
                            />
                        </li>
                        <li className={Styles.Player__Lottery__li}>
                            <input 
                                className={Styles.Player__Lottery__li__number__input} 
                                value={NumberFive} 
                                onChange={chooseNumberV}
                                maxLength="2"
                                placeholder="00"
                                ref={CheckFocusV}
                                onKeyUp={(e)=>(checknumberV(e))}
                                onKeyDown={(e)=>(checknumberIDown(e))}
                                type="number"
                            />
                        </li>
                        <li className={Styles.Player__Lottery__li}>
                            <input 
                                className={Styles.Player__Lottery__li__number__input} 
                                value={NumberSix} 
                                onChange={chooseNumberVI}
                                maxLength="2"
                                placeholder="00"
                                ref={CheckFocusVI}
                                onKeyUp={(e)=>(checknumberVI(e))}
                                onKeyDown={(e)=>(checknumberIDown(e))}
                                type="number"
                            />
                        </li>
                    </ul>
                </div>
                
                <button className={Styles.Button__Check__Lottery} onClick={handleSubmit}>
                    {content.quick_lottery_button}
                </button>
                <br/>
                <button className={Styles.Button__Check__Lottery} onClick={getLotteryRandom} >
                    {content.quick_lottery_quick_lottery}
                </button>

            </div> 
            
        </div>
        </>
    )
}