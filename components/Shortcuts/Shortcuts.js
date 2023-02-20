import React from "react";
import Link from "next/link";
import Styled from "./Shortcuts.module.css";
import { useEffect, useState } from "react";
import {
  FaGamepad,
  FaHandHoldingHeart,
  FaTicketAlt,
  FaUserFriends,
  FaWallet
} from "react-icons/fa";
import { MdGroups, MdOutlineGeneratingTokens } from "react-icons/md";
import { useRouter } from "next/router";
import { RiAuctionFill } from "react-icons/ri";
import { getCookieUserLogin } from "../../modules/Cookies/Auth/userLogin";

export default function Shortcuts({ page = "", setLoader }) {
  const userLogin = getCookieUserLogin()

  const [content, setContent] = useState({});
  useEffect(() => {
      if (userLogin.language !== undefined) {
        setContent(require(`./languages/${userLogin.language}.json`));
      } else {
        setContent(require(`./languages/en.json`));
      }
  }, [userLogin.language]);

  //   Active tab người dùng click vào
  const route = useRouter();
  const currentPathUrl = route.asPath;
  
  return (
    <>
      <div className={Styled.shortcut}>
        <h3 className={Styled.shortcutTitle}>{content.shortcuts_title}</h3>
        <ul id="wrapActive" className={Styled.shortcutList}>
          {/* Your wallet */}
          <li
            className={`${Styled.shortcutItem} ${
              currentPathUrl === "/wallet" ? Styled.active : ""
            } `}
          >
            <Link href={"/wallet"} passHref>
              <a onClick={() => {
              currentPathUrl === "/wallet" ? setLoader(false) : setLoader(true)
            }} className={Styled.shortcutLink}>
                <FaWallet
                  className={
                    page != "wallet"
                      ? Styled.shortcutIcon
                      : Styled.shortcutIconSelected
                  }
                />
                {content.shortcuts_your_wallet}
              </a>
            </Link>
          </li>
          {/* Friends */}
          <li
            className={`${Styled.shortcutItem} ${
              currentPathUrl === "/listfriend" ? Styled.active : ""
            } `}
          >
            <Link  href="/listfriend" passHref>
              <a onClick={() => {
              currentPathUrl === "/listfriend" ? setLoader(false) : setLoader(true)
            }} className={Styled.shortcutLink}>
                <FaUserFriends
                  className={
                    page != "listfriend"
                      ? Styled.shortcutIcon
                      : Styled.shortcutIconSelected
                  }
                />
                {content.shortcuts_friends}
              </a>
            </Link>
          </li>
          {/* Group */}
          <li
            className={`${Styled.shortcutItem} ${
              currentPathUrl === "/group/main-group"  ? Styled.active : ""
            } `}
          >
            <Link href={"/group/main-group"} passHref>
              <a onClick={() => {
              currentPathUrl === "/group/main-group" ? setLoader(false) : setLoader(true)
            }} className={Styled.shortcutLink}>
                <MdGroups
                  className={
                    page != "maingroup"
                      ? Styled.shortcutIcon
                      : Styled.shortcutIconSelected
                  }
                />
                {content.shortcuts_group}
              </a>
            </Link>
          </li>
          {/* Lottery */}
          <li
            className={`${Styled.shortcutItem} ${
              currentPathUrl === "/lottery/detaillottery" || currentPathUrl === "/lottery" ? Styled.active : ""
            } `}
          >
            <Link href={"/lottery/detaillottery"} passHref>
              <a onClick={() => {
              currentPathUrl === "/lottery/detaillottery" || currentPathUrl === "/lottery" ? setLoader(false) : setLoader(true)
            }} className={Styled.shortcutLink}>
                <FaTicketAlt
                  className={
                    page != "lottery" || "lottery/detaillottery"
                      ? Styled.shortcutIcon
                      : Styled.shortcutIconSelected
                  }
                />
                {content.shortcuts_lottery}
              </a>
            </Link>
          </li>
          <li className={`${Styled.shortcutItem_unav}`}>
          <a href="http://117.2.143.218:9099"className={Styled.shortcutLink}>
              <i className={`${Styled.shortcutIcon} fab fa-battle-net`}></i> 
                DAO
            </a>
           
          </li>
          {/* Link Social */}
          {/* <li
            className={`${Styled.shortcutItem} ${
              currentPathUrl === "/linksocial" ? Styled.active : ""
            } `}
          >
            <Link href={"/linksocial"} passHref>
              <a onClick={() => {
              currentPathUrl === "/linksocial" ? setLoader(false) : setLoader(true)
            }} className={Styled.shortcutLink}>
              <i className={
                    `${page != "linksocial"
                    ? Styled.shortcutIcon
                    : Styled.shortcutIconSelected} fa fa-share-alt` 
                  }></i>
                {content.shortcuts_link_Social}
              </a>
            </Link>
          </li> */}
          {/* Bidding */}
          <li
            className={`${Styled.shortcutItem_unav} ${
              currentPathUrl === "/bidding" ? Styled.active : ""
            } `}
          >
            <Link href={"/bidding"} passHref>
              <a onClick={() => {
              currentPathUrl === "/bidding" ? setLoader(false) : setLoader(true)
            }} className={Styled.shortcutLink}>
                <RiAuctionFill
                  className={
                    page != "bidding"
                      ? Styled.shortcutIcon
                      : Styled.shortcutIconSelected
                  }
                />
                {content.shortcuts_bidding}
              </a>
            </Link>
          </li>
          <li className={Styled.shortcutItem_unav}>
            <Link href={""} passHref>
              <a className={Styled.shortcutLink}>
                <MdOutlineGeneratingTokens className={Styled.shortcutIcon} />
                {content.shortcuts_nft}
              </a>
            </Link>
          </li>
          <li className={Styled.shortcutItem_unav}>
            <Link href={""} passHref>
              <a className={Styled.shortcutLink}>
                <FaGamepad className={Styled.shortcutIcon} />
                {content.shortcuts_game}
              </a>
            </Link>
          </li>

          <li className={Styled.shortcutItem_unav}>
            <Link href={""} passHref>
              <a className={Styled.shortcutLink}>
                <FaHandHoldingHeart className={Styled.shortcutIcon} />
                {content.shortcuts_fundraising}
              </a>
            </Link>
          </li>

        </ul>
      </div>
    </>
  );
}
