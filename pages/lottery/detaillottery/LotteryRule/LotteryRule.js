import React from 'react';
import Image from "next/image";
import Styles from "../../../../styles/Lottery.module.css";
import Cross from "../../../../public/Icon SVG - Update/X.svg";

export default function LotteryRule(props) {
    return (
        props.trigger && (
          <div className={Styles.Box__Rule__Show}>
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
              <ul className={Styles.Box__Rule__Main__ul}>
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
      )
}