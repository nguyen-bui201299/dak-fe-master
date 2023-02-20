import React from 'react'
import Link from 'next/link'
import Styles from "../Header.module.css";
import queryString from "query-string";
import { BrowserRouter as Router } from "react-router-dom";

export default function HeaderSearchBar({ 
    content, 
    textSearch, 
    searchMock,
    hashtag, 
    selectActive,
    acticeHasTag, 
    listUser, 
    valueResult, 
    inputSearch 
  }) {
    return (
      <div className={Styles.search__history}>
        <Router>
          <Link
            passHref
            href={{
              pathname: "/searched/history",
              query: {
                history: queryString.stringify(
                  textSearch,
                  null,
                  null,
                  { encodeURIComponent }
                ),
              },
            }}
          >
            <h3 className={Styles.search__history__heading}>
              {content.header_search_history}
            </h3>
          </Link>
        </Router>
        <ul className={Styles.search__history__list}>
          {
            searchMock.trim().substring(0,1) === '#' ?
            hashtag.list.map((hastag,index)=>{
              // {console.log(hashtag)}
              if(index <  5){
                return (
                  <li key={index}  className={`${Styles.history_hastag} ${(index === acticeHasTag ? Styles.history_hastag_option : '')}`}>
                      <Link href={{
                          pathname: "/searched/hastag",
                          query: {
                            keyword: `#${hastag.name}`,
                          },
                        }} passHref>
                          <a>#{hastag.name}</a>
                      </Link>
                  </li>
              )
              }
            })
            :
            listUser.list.map((user, key) => (
              <li className={` ${Styles.search__history__item} ${(key === selectActive) ? Styles.search__history__item_active: ''}`}  key={key}>
                <Link href={`/otherprofile/${user.user.id}`} passHref>
                  <a className={Styles.search__history__link}>
                    <div className={Styles.search__history__avatar}>
                      <img
                        src={user.user.avatar}
                        className={Styles.search__history__image}
                        alt="Avatar"
                      />
                    </div>
                    <h3 className={Styles.search__history__name}>
                      {user.user.name}
                    </h3>
                  </a>
                </Link>
              </li>
            ))                        
          }
          {valueResult != '' &&
            <div className={Styles.more__details}>
              <Link
                href={inputSearch && inputSearch.trim().substring(0, 1) === "#" ?
                  {
                    pathname: "/searched/hastag",
                    query: {
                      keyword: inputSearch,
                    },
                  }
                  :
                  {
                    pathname: "/searched/result/",
                    query: {
                      keyword: inputSearch,
                    },
                  }}
                  passHref
              >
                <a>
                  {/* Look the result for {`"`} {inputSearch} {`"`} */}
                  Look the result for 
                  <span className={Styles.shortcut_search}>{` " ${inputSearch.substr(0,35)} ${inputSearch.length > 35 ? "..." : ""}"`}</span>
                </a>
              </Link>
            </div>
          }
        </ul>
      </div>
    )
  }