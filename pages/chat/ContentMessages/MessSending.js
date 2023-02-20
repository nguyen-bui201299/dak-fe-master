import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useRef, useState, Suspense, lazy, useMemo, useContext } from "react";
import {
    FaAngleDown, FaAngleLeft, FaAngleUp, FaBrush, FaCheckCircle, FaEllipsisH, FaExclamationTriangle, FaEyeSlash, FaHeart, FaImages, FaInfoCircle, FaLink, FaPhoneAlt, FaQuoteRight, FaRegBellSlash, FaRegCheckCircle, FaRegFileAlt, FaRegFileImage, FaRegGrinBeam, FaRegLaugh, FaRegPaperPlane, FaRegTimesCircle, FaRegUserCircle, FaSearch, FaSpellCheck, FaUserFriends, FaUserLock, FaUserPlus,
    FaUsers, FaVideo
} from "react-icons/fa";
import API, { endpoints, headers } from "../../../API";
import Header from "../../../components/Header/Header";
import PopupBackground from "../../../components/SettingPageChat/PopupBackground/PopupBackground";
import PopupBlockChat from "../../../components/SettingPageChat/PopupBlockChat/PopupBlockChat";
import PopupCreateGroup from "../../../components/SettingPageChat/PopupCreateGroup/PopupCreateGroup";
import PopupHideChat from "../../../components/SettingPageChat/PopupHideChat/PopupHideChat";
import PopupImageFile from "../../../components/SettingPageChat/PopupImageFile/PopupImageFile";
import PopupLink from "../../../components/SettingPageChat/PopupLink/PopupLink";
import PopupRename from "../../../components/SettingPageChat/PopupRename/PopupRename";
import PopupAddUser from "../../../components/SettingPageChat/PopupAddUser/PopupAddUser";

import PopupEditNameGroup from "../../../components/SettingPageChat/PopupEditNameGroup/PopupEditNameGroup";
import PopupOutGroup from "../../../components/SettingPageChat/PopupOutGroup/PopupOutGroup";
import { FiLogOut } from "react-icons/fi";
import {  TiDeleteOutline} from "react-icons/ti";

import PopupReport from "../../../components/SettingPageChat/PopupReport/PopupReport";
import PopupDisplayMembers from "../../../components/SettingPageChat/PopupDisplayMembers/PopupDisplayMembers";
import PopupTurnOffNoti from "../../../components/SettingPageChat/PopupTurnOffNoti/PopupTurnOffNoti";
import { deleteCookieUserLogin, getCookieUserLogin, getTokenUserLogin } from "../../../modules/Cookies/Auth/userLogin";
import { getCookiesSocialList } from "../../../modules/Cookies/TypeSocial/social";
import mapTime from "../../../modules/Time/mapTime";
import Avatar from "../../../public/images/bgAvatar.jpg";
import logo from "../../../public/images/Logo.png"
import Styles from "../../../styles/Chat.module.css";
import Image from "next/image";
import dynamic from 'next/dynamic';

import PopupNewMessUser from "../../../components/PopupNewMessUser/PopupNewMessUser";

import BodyPostFacebook from "../../../components/Post/component/BodyPostFacebook/BodyPostFacebook";
import BodyPostTiktok from "../../../components/Post/component/BodyPostTiktok/BodyPostTiktok";
import BodyPostTwitch from "../../../components/Post/component/BodyPostTwitch/BodyPostTwitch";
import BodyPostTwitter from "../../../components/Post/component/BodyPostTwitter/BodyPostTwitter";
import BodyPostYoutube from "../../../components/Post/component/BodyPostYoutube/BodyPostYoutube";
import BodyPostInstagram from "../../../components/Post/component/BodyPostInstagram/BodyPostInstagram";
import { BsPlusCircle } from "react-icons/bs";
import { useBoxChatContext } from "../../../components/BoxChat/BoxChatContext";
import { ConversationList } from '../ConversationList';
import CONSTANTS from '../../../utils/chatConstant';
import { getUrlType } from '../../../utils/chatUrl';
import { RESPONSE_LIMIT_DEFAULT } from "next/dist/server/api-utils";

const MessSending = () => {
    return (
        <>
            <div className={Styles['message-sent']}>
                <div className={Styles['message-sent-text']}>
                    Việc chăm sóc khách hàng cũ cũng là một phần không thể thiếu trong chiến dịch marketing của các doanh nghiệp, của hàng.
                    <ul className={Styles['message-list-icon']}>
                        <li className={Styles['message-item-icon']}>
                            <FaQuoteRight className={Styles['message-icon']} />
                            <span className={Styles['message-icon-tooltip']}>Trả lời</span>
                        </li>
                        <li className={Styles['message-item-icon']}>
                            <FaRegLaugh className={Styles['message-icon']} />
                            <span className={Styles['message-icon-tooltip']}>Bày tỏ cảm xúc</span>
                        </li>
                    </ul>
                </div>
                <div className={Styles['message-sent-status']}>
                    <FaRegCheckCircle className={Styles['message-status-icon']} />
                </div>
            </div>
        </>
    );
}

export default MessSending;