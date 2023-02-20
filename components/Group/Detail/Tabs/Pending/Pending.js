import React from 'react';
import Styles from './Pending.module.css'
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai'
import { TbMoodEmpty } from 'react-icons/tb'
import Link from 'next/link'
import API, { endpoints, headers } from "../../../../../API";
import { useEffect, useRef, useState } from "react";

export default function Pending ({ listPendingRequest, userIsExist, handleOnRequestPending, userLogin }) {

  const [language, setLanguage] = useState({});

  useEffect(() => {
      if(userLogin.language!== undefined) {
        setLanguage(require(`../../../languages/${userLogin.language}.json`));
      }else{
        setLanguage(require(`../../../languages/en.json`));
      }
  }, [userLogin])

  return (
      <>
          <div className={`${Styles.tab_group_container}`}>
            <div className={`${Styles.tab_group_title}`}>
              <span>{language.pending_title}</span>
            </div>
            {listPendingRequest &&
                listPendingRequest.map((req, index) => (
                  <div key={index} className={`${Styles.list_container}`}>
                      <div className={`${Styles.item_user_container}`}>
                        <a href={`/otherprofile/${req.user_request.id}`} passHref>
                            <span className={Styles.item_user_avatar}>
                                {/* <Image src={'/images/fpcyKuIW_400x400.jpg'} alt='picture-user' width={35} height={35}/> */}
                                <img src={req.user_request.avatar} alt='picture-user'></img>
                            </span>
                            <span className={Styles.item_user_name}>{req.user_request.name}</span>
                        </a>
                      </div>
                      <div className={`${Styles.item_action_container}`}>
                        <button
                          className={Styles.item_btn}
                          onClick={() => {
                            if (userIsExist(req.user_request.id)) {
                              handleOnRequestPending(
                                req.Join_request.id,
                                req.user_request.id,
                                true
                              );
                            }
                          }}
                          >
                            <AiOutlineCheck />
                        </button>
                        <button
                          className={Styles.item_btn}
                          onClick={(e) => {
                              if (userIsExist(req.user_request.id)) {
                                handleOnRequestPending(
                                  req.Join_request.id,
                                  req.user_request.id,
                                  false
                                );
                              }
                            }}
                          >
                          <AiOutlineClose />
                        </button>
                      </div>
                  </div>
                ))}

                {listPendingRequest.length === 0 && 
                <span className={`${Styles.tab_group_empty}`}>
                  {language.pending_empty}
                  <span><TbMoodEmpty /></span>
                </span>}
          </div>
      </>
  )
}