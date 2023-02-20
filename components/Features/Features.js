import { useEffect, useState } from "react";
import { BsCloudSun, BsMoonStars, BsSun } from "react-icons/bs";
import Styled from "./Features.module.css";

export default function Features({walletPoint, numberWithDot}) {
  // const [time, setTime] = useState(new Date());
  // var dateISO = new Date();
  // var year = dateISO.getFullYear();
  // var month = dateISO.getMonth() + 1;
  // var date = dateISO.getDate();
  
  // const getDate = () => {
  //   setTime(new Date());
  // };

  // useEffect(() => {
  //   let timerID = setInterval(() => getDate(), 1000);

  //   return () => {
  //     clearInterval(timerID);
  //   };
  // }, []);

  return (
    <>
      <div className={Styled.features}>
        <h3 className={Styled.features__title}>DAK</h3>
        <div className={Styled.features__coin}>
          <div className={Styled.features__coin__left}>
          </div>
          <div className={Styled.features__coin__right}>

          </div>
        </div>
      </div>
    </>
  );
}
