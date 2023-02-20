// import Document, { Html, Head, Main, NextScript } from 'next/document'
import Styled from '../Main/MainContent.module.css';
import {

  AiOutlineUsergroupAdd,
} from 'react-icons/ai';
import ButtonCreate from '../../Button/ButtonCreateGroup/Button';
import ListGroup from '../List/ListGroup';
import React, { useState } from 'react';


export function NoGroupContent ({ handleShow }) {

  return (
          <div className={Styled.main_nogroup}>
            <div className={Styled.main_content}>
              <div className={Styled['main-content']}>
                <h2>Bạn chưa có nhóm </h2>
              </div>
              <div className={Styled['main-everygroup']}>
                <span className={Styled.main_nogroup_create_btn} onClick={() => handleShow()} > Tạo nhóm </span> 
              </div>
            </div>
            <div className={Styled['main-NoGroup']}>
              <AiOutlineUsergroupAdd
                style={{ fontSize: '12em', margin: '0 auto' }}
              />
              <p style={{ textAlign: 'center' }}>
                Hiện tại bạn không có nhóm nào, bạn muốn tạo một nhóm cho riêng
                bạn?
                <br /> Hãy click phần tạo nhóm ngay!
              </p>
            </div>
          </div>
  )
}

export default NoGroupContent;
