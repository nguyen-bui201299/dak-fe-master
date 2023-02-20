import React, { useState, useRef, useEffect } from 'react'
import Styled from './PopupStatistic.module.css'
import { useSpring, animated } from 'react-spring';
import { 
  FaSearch, FaEllipsisH, FaUserPlus, 
  FaUsers, FaRegUserCircle, FaSpellCheck, 
  FaRegGrinBeam, FaRegFileImage, FaRegFileAlt, 
  FaLink, FaRegBellSlash, FaUserLock, 
  FaExclamationTriangle, FaPhoneAlt, FaBrush, 
  FaEyeSlash, FaVideo, FaInfoCircle, FaCheckCircle, 
  FaRegCheckCircle, FaImages, FaHeart, 
  FaRegPaperPlane, FaQuoteRight, FaRegLaugh 
} from "react-icons/fa";
import { AiOutlineClose } from 'react-icons/ai'

import Image from "next/image"
import Avatar from "/public/images/avatar.jpg"

export default function PopupStatistic({showModal, setShowModal}) {
        // test-render-web
        useEffect(() => {
            console.log('render Modal')
            }, [])

  // Handle show popup statistic
  const modalRef = useRef();

  const animation = useSpring({
      config: {
          duration: 200
      }, opacity: showModal ? 1 : 0, 
      transform: showModal ? 'translateY(0%)' : `translateY(100%)`
  })

  const closeModal = e => {
      if (modalRef.current === e.target) {
          setShowModal(false)
      }
  };

  return (
    <>
    {showModal ?      
      <div className={Styled.overlayStatistic} ref={modalRef} onClick={closeModal}>
          <animated.div style={animation}>                   
          <div className={Styled.statistic}>
              <div className={Styled.statisticHeader}>
                  <h2 className={Styled.statisticTitle}>Following</h2>
                  <button className={Styled.statisticBtnClose} 
                          onClick={() => setShowModal(prev => !prev)}
                  >
                      <AiOutlineClose className={Styled.fixIcon}/>
                  </button>
              </div>
              <div className={Styled.statisticContent}>
                  <input className={Styled.statisticSearch} placeholder="Tìm kiếm" /> 
                  <ul className={Styled.listStatisticed}>
                      <li className={Styled.itemStatisticed}>
                          <div className={Styled.itemImage}>
                              <Image src={Avatar} alt=""/>    
                          </div>
                          <div className={Styled.itemInfo}>
                              <p className={Styled.itemInfo_Name}>Thiên Phúc</p>
                              <p className={Styled.itemInfo_Tag}>phucntp@2000</p>
                          </div>
                          <button className={Styled.itemBtn}>
                              Following
                          </button>
                      </li>
                      <li className={Styled.itemStatisticed}>
                          <div className={Styled.itemImage}>
                              <Image src={Avatar} alt=""/>    
                          </div>
                          <div className={Styled.itemInfo}>
                              <p className={Styled.itemInfo_Name}>Thiên Phúc</p>
                              <p className={Styled.itemInfo_Tag}>phucntp@2000</p>
                          </div>
                          <button className={Styled.itemBtn}>
                              Following
                          </button>
                      </li>
                      <li className={Styled.itemStatisticed}>
                          <div className={Styled.itemImage}>
                              <Image src={Avatar} alt=""/>    
                          </div>
                          <div className={Styled.itemInfo}>
                              <p className={Styled.itemInfo_Name}>Thiên Phúc</p>
                              <p className={Styled.itemInfo_Tag}>phucntp@2000</p>
                          </div>
                          <button className={Styled.itemBtn}>
                              Following
                          </button>
                      </li>
                      <li className={Styled.itemStatisticed}>
                          <div className={Styled.itemImage}>
                              <Image src={Avatar} alt=""/>    
                          </div>
                          <div className={Styled.itemInfo}>
                              <p className={Styled.itemInfo_Name}>Thiên Phúc</p>
                              <p className={Styled.itemInfo_Tag}>phucntp@2000</p>
                          </div>
                          <button className={Styled.itemBtn}>
                              Following
                          </button>
                      </li>
                      <li className={Styled.itemStatisticed}>
                          <div className={Styled.itemImage}>
                              <Image src={Avatar} alt=""/>    
                          </div>
                          <div className={Styled.itemInfo}>
                              <p className={Styled.itemInfo_Name}>Thiên Phúc</p>
                              <p className={Styled.itemInfo_Tag}>phucntp@2000</p>
                          </div>
                          <button className={Styled.itemBtn}>
                              Following
                          </button>
                      </li>
                      <li className={Styled.itemStatisticed}>
                          <div className={Styled.itemImage}>
                              <Image src={Avatar} alt=""/>    
                          </div>
                          <div className={Styled.itemInfo}>
                              <p className={Styled.itemInfo_Name}>Thiên Phúc</p>
                              <p className={Styled.itemInfo_Tag}>phucntp@2000</p>
                          </div>
                          <button className={Styled.itemBtn}>
                              Following
                          </button>
                      </li>
                  </ul>
              </div>       
          </div>
          </animated.div>
      </div> 
  : null 
  }
  </>
  );
}