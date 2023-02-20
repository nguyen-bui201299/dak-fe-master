import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { ToastContainer } from "react-toastify";
import API, { endpoints, headers } from "../../../API";
import Layout from "../../../components/Layout/Layout";
import formatDate from "../../../modules/Time/formatDate";
import Cross from "../../../public/Icon SVG - Update/X.svg";
import Styles from "../../../styles/Lottery.module.css";
import { NotificationToast } from "../../../modules/Notification/Notification";
import StylesNotify from "../../../modules/Notification/Notification.module.css"
import LotteryRule from "./LotteryRule/LotteryRule";
import { getCookieUserLogin } from "../../../modules/Cookies/Auth/userLogin";

export default function Detaillottery() {
  const [listHistory, setListHistory] = useState({ list: [] });
  return (
    <Layout>
      <Head>
        <title>Lottery </title>
        <link rel="stylesheet" href="/css/style.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <LotteryTable
        setListHistory={setListHistory}
        listHistory={listHistory.list}
      />

      <LotteryHistory listHistory={listHistory} />
    </Layout>
  );
}

export function LotteryTable({ datashowlottery, setListHistory, listHistory,  }) {
  // Đây là nút nhấn show ra notification
  const [ShowRule, HideRule] = useState(false);
  const [priceJackpot, setPriceJactpot] = useState(0);

  const re = /^[0-9\b]+$/;
  const [list, setList] = useState([]);

  // const dispatch = useDispatch();

  // Check input lottery-number
  const [NumberOne, setNumberOne] = useState();
  const [NumberTwo, setNumberTwo] = useState();
  const [NumberThree, setNumberThree] = useState();
  const [NumberFour, setNumberFour] = useState();
  const [NumberFive, setNumberFive] = useState();
  const [NumberSix, setNumberSix] = useState();
  const CheckFocusI = useRef(null);
  const CheckFocusII = useRef(null);
  const CheckFocusIII = useRef(null);
  const CheckFocusIV = useRef(null);
  const CheckFocusV = useRef(null);
  const CheckFocusVI = useRef(null);

  const [arrSoXo, setArrCheck] = useState([]);
  //Check error input
  const [eInput, seteInput] = useState(false);
  const [errMesage, setErrMesage] = useState(false);
  const arrcheck = [
    NumberOne,
    NumberTwo,
    NumberThree,
    NumberFour,
    NumberFive,
    NumberSix
  ];

  const userLogin = getCookieUserLogin() 

  const [content, setContent] = useState({});

  useEffect(() => {
    if (userLogin.language !== undefined) {
      setContent(
        require(`../../../languages/lottery/${userLogin.language}.json`)
      );
    } else {
      setContent(require(`../../../languages/lottery/en.json`));
    }
  }, [userLogin]);

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
  };
  const checkLimitNum = () => {
    for (var i = 0; i < arrcheck.length; i++) {
      var val = arrcheck[i];
      if (val > 45 || val < 1) {
        return true;
      }
    }
    return false;
  };
  const checkWord = () => {
    for (var i = 0; i < arrcheck.length; i++) {
      if (typeof (arrcheck[i] / 1) == "string") {
        return true;
      }
    }
    return false;
  };

  const checkEmNum = () => {
    for (var i = 0; i < arrcheck.length; i++) {
      if (arrcheck[i] == "") {
        return true;
      }
    }
    return false;
  };
  const addNum = () => {
    if (NumberOne < 10 && NumberOne.length < 2) {
      String(NumberOne);
      NumberOne = "0" + NumberOne;
    }
    if (NumberTwo < 10 && NumberTwo.length < 2) {
      String(NumberTwo);
      NumberTwo = "0" + NumberTwo;
    }
    if (NumberThree < 10 && NumberThree.length < 2) {
      String(NumberThree);
      NumberThree = "0" + NumberThree;
    }
    if (NumberFour < 10 && NumberFour.length < 2) {
      String(NumberFour);
      NumberFour = "0" + NumberFour;
    }
    if (NumberFive < 10 && NumberFive.length < 2) {
      String(NumberFive);
      NumberFive = "0" + NumberFive;
    }
    if (NumberSix < 10 && NumberSix.length < 2) {
      String(NumberSix);
      NumberSix = "0" + NumberSix;
    }
  };

  useEffect(() => {
    getDataHistoryTicket();
  }, []);

  function getDataHistoryTicket() {
    API.get(endpoints["getlottery"], { headers: headers.headers_token })
      .then((res) => {
        setListHistory({
          list: res.data.data
        })
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (
      NumberOne ||
      NumberTwo ||
      NumberThree ||
      NumberFour ||
      NumberFive ||
      NumberSix
    ) {
      if (
        checkDuplicate() == false &&
        checkLimitNum() == false &&
        checkWord() == false &&
        checkEmNum() == false
      ) {
        addNum();
        const data = JSON.stringify({
          full_slot:
            NumberOne +
            NumberTwo +
            NumberThree +
            NumberFour +
            NumberFive +
            NumberSix,
          slot1: NumberOne,
          slot2: NumberTwo,
          slot3: NumberThree,
          slot4: NumberFour,
          slot5: NumberFive,
          slot6: NumberSix
        });
        API.post(endpoints["postlottery"], data, {
          headers: headers.headers_token
        })
          .then((res) => {
            console.log({res});
            if (res.data.success) {
              setNumberOne("");
              setNumberTwo("");
              setNumberThree("");
              setNumberFour("");
              setNumberFive("");
              setNumberSix("");
              setArrCheck("");
              NotificationToast.fire({
                toast: true,
                position: 'bottom-end',
                icon: 'success',
                title: `${content.detail_lottery_buy_success}`,
              })
              getDataHistoryTicket();
            } else {
              NotificationToast.fire({
                toast: true,
                position: 'bottom-end',
                icon: 'error',
                title: `${content.detail_lottery_warn_error}`,
              })
            }
          })
          .catch((er) => {
            console.log({er});
            if(er.response?.data.message === "Số lượng DAK Point không đủ !!") {
              NotificationToast.fire({
                toast: true,
                position: 'bottom-end',
                icon: 'warning',
                title: `${content.detail_lottery_warn_not_enough_point}`,
                customClass: {
                  icon: `${StylesNotify.swal_icon_warning}`
                }
              })
            }
          });
      } else {
        // seteInput(true)
        if (checkEmNum() == true) {
          NotificationToast.fire({
            toast: true,
            position: 'bottom-end',
            icon: 'error',
            title: `${content.detail_lottery_warn_blank}`,
          })
          return;
        }
        if(NumberOne || NumberTwo ||NumberThree ||NumberFour ||NumberFive ||NumberSix === "") {
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
            title: `${content.detail_lottery_warn_duplicate}`,
            customClass: {
              icon: `${StylesNotify.swal_icon_warning}`
            }
          })
          return;
        }
        if (checkWord() == true) {
          NotificationToast.fire({
            toast: true,
            position: 'bottom-end',
            icon: 'warning',
            title: `${content.detail_lottery_warn_character}`,
            customClass: {
              icon: `${StylesNotify.swal_icon_warning}`
            }
          })
          return;
        }
        if (checkLimitNum() == true) {
          NotificationToast.fire({
            toast: true,
            position: 'bottom-end',
            icon: 'warning',
            title: `${content.detail_lottery_warn_limit}`,
            customClass: {
              icon: `${StylesNotify.swal_icon_warning}`
            }
          })
          return;
        }
      }
    } else {
      NotificationToast.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'error',
        title: `${content.detail_lottery_warn_blank}`,
      })
    }
  }
  

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
          title: `${content.detail_lottery_warn_duplicate}`,
          customClass: {
            icon: `${StylesNotify.swal_icon_warning}`
          }
        })
      }
    }
    else{
      e.target.value = ''
      e.target.focus()
      NotificationToast.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'warning',
        title: `${content.detail_lottery_warn_limit}`,
        customClass: {
          icon: `${StylesNotify.swal_icon_warning}`
        }
      })
    }
  };
  const checknumberIDown = (e) => {
    if (e.key === "Backspace") {
      if (e.target.value.length >= 2) {
        const index = arrSoXo.indexOf(e.target.value);
        arrSoXo.splice(index, 1);
      }
    }
  };
  const checknumberI = (e) => {
    if (e.target.value.length >= 2) {
      CheckFocusII.current.focus();
      CheckKey(e);
    }
  };
  const checknumberII = (e) => {
    if (e.target.value.length >= 2) {
      CheckFocusIII.current.focus();
      CheckKey(e);
    }
    if (e.key === "Backspace") {
      if (e.target.value.length === 0) {
        CheckFocusI.current.focus();
      }
    }
  };
  const checknumberIII = (e) => {
    if (e.target.value.length >= 2) {
      CheckFocusIV.current.focus();
      CheckKey(e);
    }
    if (e.key === "Backspace") {
      if (e.target.value.length === 0) {
        CheckFocusII.current.focus();
      }
    }
  };
  const checknumberIV = (e) => {
    if (e.target.value.length >= 2) {
      CheckFocusV.current.focus();
      CheckKey(e);
    }
    if (e.key === "Backspace") {
      if (e.target.value.length === 0) {
        CheckFocusIII.current.focus();
      }
    }
  };
  const checknumberV = (e) => {
    if (e.target.value.length >= 2) {
      CheckFocusVI.current.focus();
      CheckKey(e);
    }
    if (e.key === "Backspace") {
      if (e.target.value.length === 0) {
        CheckFocusIV.current.focus();
      }
    }
  };
  const checknumberVI = (e) => {
    if (e.target.value.length >= 2) {
      CheckFocusVI.current.blur();
      CheckKey(e);
    }
    if (e.key === "Backspace") {
      if (e.target.value.length === 0) {
        CheckFocusV.current.focus();
      }
    }
  };

  const numberWithDot = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  useEffect(() => {
    API.get(endpoints["getPriceJackpot"], { headers: headers.headers_token })
      .then(function (res) {
        if (res.data.code == 200 && res.data.success) {
          setPriceJactpot(res.data.data);
        } else {
          setPriceJactpot(0);
        }
      })
      .catch(function (error) {
        setPriceJactpot(0);
        console.log(error);
      });
  }, []);

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
  }, [ref, ShowRule]);

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

  return (
    <div className={Styles.Detaillottery__Container__Box} >
      <ToastContainer />
      <div className={Styles.Detaillottery__Container__Box__Mega} >
        <h1 className={Styles.Text__Box__Mega}> MEGA </h1>

        <hr className={Styles.Hr__Lottery} />
        <h2>
          JACKPOT: 
          <span> {numberWithDot(parseInt(priceJackpot))} </span>
          Dak-Point
        </h2>

        <span
          ref={ref}
          className={Styles.Rule__Lottery}
          onClick={() => HideRule(!ShowRule)}
        >
          <AiOutlineExclamationCircle className={Styles.Icon__rule} />
          {content.rule_lottery}
        </span>
        {ShowRule && (
          <LotteryRule trigger={ShowRule} setTrigger={HideRule} content={content} />
        )}

        {/* Phần xổ số máy dò */}
        <div className={Styles.Computer__Lottery}>
          <ul className={Styles.Computer__Lottery__ul}>
            <li className={Styles.Computer__Lottery__li}>
              <h2 className={Styles.Computer__Lottery__li__number}> {listHistory[0]?.slot1}  </h2>
            </li>
            <li className={Styles.Computer__Lottery__li}>
              <h2 className={Styles.Computer__Lottery__li__number}> {listHistory[0]?.slot2} </h2>
            </li>
            <li className={Styles.Computer__Lottery__li}>
              <h2 className={Styles.Computer__Lottery__li__number}> {listHistory[0]?.slot3} </h2>
            </li>
            <li className={Styles.Computer__Lottery__li}>
              <h2 className={Styles.Computer__Lottery__li__number}> {listHistory[0]?.slot4} </h2>
            </li>
            <li className={Styles.Computer__Lottery__li}>
              <h2 className={Styles.Computer__Lottery__li__number}> {listHistory[0]?.slot5} </h2>
            </li>
            <li className={Styles.Computer__Lottery__li}>
              <h2 className={Styles.Computer__Lottery__li__number}> {listHistory[0]?.slot6} </h2>
            </li>
          </ul>
        </div>

        {/* Phần xổ số người chơi mua */}
        <div className={Styles.Player__Lottery}>
          <ul className={Styles.Player__Lottery__ul}>
            <li className={Styles.Player__Lottery__li}>
              <input
                type="number"
                className={Styles.Player__Lottery__li__number__input}
                value={NumberOne}
                onKeyUp={(e) => checknumberI(e)}
                onKeyDown={(e) => checknumberIDown(e)}
                onChange={chooseNumberI}
                maxLength="2"
                placeholder="00"
                ref={CheckFocusI}
              />
            </li>
            <li className={Styles.Player__Lottery__li}>
              <input
                type="number"
                className={Styles.Player__Lottery__li__number__input}
                value={NumberTwo}
                onChange={chooseNumberII}
                ref={CheckFocusII}
                onKeyUp={(e) => checknumberII(e)}
                onKeyDown={(e) => checknumberIDown(e)}
                maxLength="2"
                placeholder="00"
              />
            </li>
            <li className={Styles.Player__Lottery__li}>
              <input
                type="number"
                className={Styles.Player__Lottery__li__number__input}
                value={NumberThree}
                onKeyUp={(e) => checknumberIII(e)}
                ref={CheckFocusIII}
                onKeyDown={(e) => checknumberIDown(e)}
                onChange={chooseNumberIII}
                maxLength="2"
                placeholder="00"
              />
            </li>
            <li className={Styles.Player__Lottery__li}>
              <input
                type="number"
                className={Styles.Player__Lottery__li__number__input}
                value={NumberFour}
                ref={CheckFocusIV}
                onKeyUp={(e) => checknumberIV(e)}
                onKeyDown={(e) => checknumberIDown(e)}
                onChange={chooseNumberIV}
                maxLength="2"
                placeholder="00"
              />
            </li>
            <li className={Styles.Player__Lottery__li}>
              <input
                type="number"
                className={Styles.Player__Lottery__li__number__input}
                value={NumberFive}
                ref={CheckFocusV}
                onKeyUp={(e) => checknumberV(e)}
                onKeyDown={(e) => checknumberIDown(e)}
                onChange={chooseNumberV}
                maxLength="2"
                placeholder="00"
              />
            </li>
            <li className={Styles.Player__Lottery__li}>
              <input
                type="number"
                className={Styles.Player__Lottery__li__number__input}
                value={NumberSix}
                ref={CheckFocusVI}
                onKeyUp={(e) => checknumberVI(e)}
                onKeyDown={(e) => checknumberIDown(e)}
                onChange={chooseNumberVI}
                maxLength="2"
                placeholder="00"
              />
            </li>
          </ul>
        </div>
        {eInput && (
          <div>
            <a style={{ color: "red" }}>{errMesage}</a>
          </div>
        )}
        <div className={Styles.Button}>
          <button
            className={Styles.Button__Check__Lottery}
            onClick={handleSubmit}
          >
            <h2> {content.button_check_lottery} </h2>
          </button>
          <button
            className={Styles.Button__Check__Lottery}
            onClick={getLotteryRandom}
          >
            <h2>{content.detail_lottery_quick_lottery}</h2>
          </button>
        </div>
      </div>
    </div>
  );
}

export function LotteryHistory(listHistory = []) {
  const [lh, setLh] = useState({ l: [] });
  const [historyReward, setHistoryReward] = useState([])
  const [lists, setLists] = useState({ list: [] });
  const [claim, setClaim] = useState(false)

  const userLogin = getCookieUserLogin();

  const [content, setContent] = useState({});

  useEffect(() => {
    if (userLogin.language !== undefined) {
      setContent(
        require(`../../../languages/lottery/${userLogin.language}.json`)
      );
    } else {
      setContent(require(`../../../languages/lottery/en.json`));
    }
  }, [userLogin]);

  useEffect(() => {
    setLists({ list: listHistory.listHistory.list });
  }, [listHistory]);

  useEffect(() => {
    getBuyTicketHistory();

    API.get(endpoints["getlotteryhistory"](100, 1, ([3, 1])), {
      headers: headers.headers_token
    }).then((res) => {
      if(res.data.success) {
        setHistoryReward(res.data.data)
      }
    }).catch((err) => console.log(err))
  }, [lists, claim]);

  const getBuyTicketHistory = () => {
    API.get(endpoints["getlotteryhistory"](100, 1, ([0, 2, 4])), {
      headers: headers.headers_token
    }).then((res) => {
      if(res.data.success) {
        setLh({
          l: res.data.data
        })
      }
    }).catch((err) => console.log(err))
  };

  const handleClaimAllReward = () => {
    const data = {
      "ticket_id": null
    }
    
    API.post(endpoints["claimReward"], data , {
      headers: headers.headers_token
    })
    .then((res) => {
      if(res.data.success) {
        setClaim(!claim)
        NotificationToast.fire({
          toast: true,
          position: 'bottom-end',
          icon: 'success',
          title: "Claim all successfully",
        })
      } else {
        NotificationToast.fire({
          toast: true,
          position: 'bottom-end',
          icon: 'error',
          title: "No reward here!",
        })
      }
    })
    .catch((err) => {
      console.log(err)
    }) 
  }

  // Xử dụng lại chuyển của profile tương lai có thể mở rộng
  const [active, setActive] = useState(0);
  const filters = [`${content.history}`, "Jackpot", `${content.history_reward}`];

  return (
    <>
      <div className={Styles.Box__Detail}>
        <ul className={Styles.Box__Detail__ul}>
          {filters.map((filter, index) => (
            <li
              className={`${Styles["Box__Detail__li"]} ${Styles["hover"]} 
                            ${active === index ? Styles["active"] : ""}`}
              onClick={(e) => {
                setActive(index);
              }}
              key={index}
            >
              <a
                className={Styles.Box__Detail__link}
                style={{ cursor: "pointer" }}
              >
                {filter}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {active === 0 && 
          <div className={Styles.Box__Table__Jackpot}>
            <table className={Styles.Table__Jackpot}>
              <thead className={Styles.Table__Jackpot__thead}>
                <tr className={Styles.Table__Jackpot__tr}>
                  <th className={Styles.Table__Jackpot__th}>
                    {content.lottery_date}
                  </th>
                  <th className={Styles.Table__Jackpot__th}>
                    {content.your_lottery}
                  </th>
                  <th className={Styles.Table__Jackpot__th}>
                    {/* {content.total_match} */}
                    Giá vé
                  </th>
                  <th className={Styles.Table__Jackpot__th}>
                    {/* {content.prize_value} */}
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody>
                {lh.l.map((history, index) => (
                  <tr key={index} className={Styles.Table__Jackpot__tr}>
                    {
                      <td key={index} className={Styles.Table__Jackpot__td}>
                        {formatDate(history.date)}
                      </td>
                    }
                    {
                      <td className={Styles.Table__Jackpot__td}>
                        {history.slot1 +
                          " " +
                          history.slot2 +
                          " " +
                          history.slot3 +
                          " " +
                          history.slot4 +
                          " " +
                          history.slot5 +
                          " " +
                          history.slot6}
                      </td>
                    }
                    <td className={Styles.Table__Jackpot__td}>
                     {history.price}
                    </td>
                    <td className={Styles.Table__Jackpot__td__special}>
                      {history.status === 0 ? <span style={{color: "#F7CB73"}}>{content.lottery_status_waiting}</span> :
                      history.status === 2 ? <span style={{color: "#df4759"}}>{content.lottery_status_block}</span> :
                      history.status === 4 ? <span style={{color: "#467fd0"}}>{content.lottery_status_lost}</span> : ""
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      }
      {active === 1 &&
        <div className={`${Styles.Box__Table__Jackpot} ${Styles.Box__Table__Jackpot_2}`}>
          <table className={Styles.Table__Jackpot}>
            <thead className={Styles.Table__Jackpot__thead}>
              <tr className={Styles.Table__Jackpot__tr}>
                <th className={Styles.Table__Jackpot__th}>
                  {content.lottery_date}
                </th>
                <th className={Styles.Table__Jackpot__th}> 
                  {content.result_lotterry} 
                </th>
                <th className={Styles.Table__Jackpot__th}>
                  {content.number_of_1stprize}
                </th>
                <th className={Styles.Table__Jackpot__th}>
                  {content.number_of_otherprize}
                </th>
                <th className={Styles.Table__Jackpot__th}>
                  {content.jackpot_value}
                </th>
              </tr>
            </thead>

            <tbody>
              {lists.list
                .map((history, index) => (
                  <tr key={index} className={Styles.Table__Jackpot__tr}>
                    {
                      <td key={index} className={Styles.Table__Jackpot__td}>
                        {formatDate(history.date)}
                      </td>
                    }
                    {
                      <td className={Styles.Table__Jackpot__td}>
                        {history.slot1 +
                          " " +
                          history.slot2 +
                          " " +
                          history.slot3 +
                          " " +
                          history.slot4 +
                          " " +
                          history.slot5 +
                          " " +
                          history.slot6}
                      </td>
                    }
                    <td className={Styles.Table__Jackpot__td}>
                     {history.total_jackpot_winner}
                    </td>
                    <td className={Styles.Table__Jackpot__td}>
                      {history.total_winner}
                    </td>
                    <td className={Styles.Table__Jackpot__td__special}> 
                      {history.reward}
                    </td>
                  </tr>
                ))
                .sort()}
            </tbody>
          </table>
        </div>
      }

      {active === 2 &&
         (
          <div className={Styles.Box__Table__Jackpot}>
            <table className={Styles.Table__Jackpot}>
              <thead className={Styles.Table__Jackpot__thead}>
                <tr className={Styles.Table__Jackpot__tr}>
                  <th className={Styles.Table__Jackpot__th}>
                    
                    {content.lottery_date}
                  </th>
                  <th className={Styles.Table__Jackpot__th}>
                    
                    {content.your_lottery}
                  </th>
                  <th className={Styles.Table__Jackpot__th}>
                    
                    {content.total_match}
                  </th>
                  <th className={Styles.Table__Jackpot__th}>
                    <span>{content.prize_value}</span>
                    <p onClick={handleClaimAllReward}>Claim all</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {historyReward.filter(item => item.reward !== 0).map((history, index) => (
                  <tr key={index} className={Styles.Table__Jackpot__tr}>
                    {
                      <td key={index} className={Styles.Table__Jackpot__td}>
                        {formatDate(history.date)}
                      </td>
                    }
                    {
                      <td className={Styles.Table__Jackpot__td}>
                        {history.slot1 +
                          " " +
                          history.slot2 +
                          " " +
                          history.slot3 +
                          " " +
                          history.slot4 +
                          " " +
                          history.slot5 +
                          " " +
                          history.slot6}
                      </td>
                    }
                    <td className={Styles.Table__Jackpot__td}>
                      {history.match_count === 0 ? "-" : history.match_count}
                    </td>
                    <td className={Styles.Table__Jackpot__td__special}>
                      {/* {history.reward === 0 ? "-" : history.reward} */}
                      {
                        history.status === 1 ? <ButtonClaimReward setClaim={setClaim} claim={claim} history={history}/> : <p className={Styles.has__claim} >Claimed {history.reward} </p>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
      
    </>
  );
}

export function BoxrulelotteryQuick(props) {
  return (
    props.trigger && (
      <div className={Styles.Box__Rule__Show__Quick}>
        <div className={Styles.Box__Rule__Header}>
          <h3 className={Styles.Box__Rule__Header__h3}> {props.content.rule_lottery} </h3>
          <div className={Styles.Box__Rule__Header__Mini}>
            <Image
              src={Cross}
              onClick={() => props.setTrigger(false)}
              alt={Cross}
            />
          </div>
        </div>

        <hr className={Styles.Hr__Box__Rule} />

        <div className={Styles.Box__Rule__Main}>
          <ul className={Styles.Box__Rule__Main__Quick__ul}>
            <li className={Styles.Box__Rule__Main__li}>
              <h3>
                {props.content.rule_lottery_1}
              </h3>
            </li>
            <li className={Styles.Box__Rule__Main__li}>
              <h3> {props.content.rule_lottery_2} </h3>
            </li>
            <li className={Styles.Box__Rule__Main__li}>
              <h3>
              {props.content.rule_lottery_3}
              </h3>
            </li>
          </ul>
        </div>
        {props.children}
      </div>
    )
  );
}

export function ButtonClaimReward ({ history, claim, setClaim  }) {
  // handle Claim reward
  const handleClaimReward = () => {
    // Chưa sử dụng API
    // setClickClaim(true);

    // api fix xong thì mở comment
    
    const data = JSON.stringify({
      "ticket_id": history.id
    });
    API.post(endpoints["claimReward"], data, {
      headers: headers.headers_token
    })
    .then((res) => {
      if(res.data.success) {
        setClaim(!claim)
        NotificationToast.fire({
          toast: true,
          position: 'bottom-end',
          icon: 'success',
          title: "Claim successfully",
        })
      } else {
        NotificationToast.fire({
          toast: true,
          position: 'bottom-end',
          icon: 'error',
          title: "No reward here!",
        })
      }
    })
    .catch((err) => {
      console.log(err)
    }) 
  }
  
  return (
    <div className={Styles.btn_claim_reward}>
      <button  onClick={handleClaimReward}>Claim {history.reward} </button>
    </div>
  )
}