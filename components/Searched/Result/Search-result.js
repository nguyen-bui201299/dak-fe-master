import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getCookieUserLogin } from "../../../modules/Cookies/Auth/userLogin";
import ListAll from "../List/ListFind/List-All";
import ListGroup from "../List/ListFind/List-Group";
import ListPeople from "../List/ListFind/List-People";
import ListPicture from "../List/ListFind/List-Picture";
import Styled from "../Result/Search-result.module.css";

Searched.propTypes = {};


function Searched(props) {
  const userLogin = getCookieUserLogin();


  const router = useRouter();

  const [menuIndex, setMenuIndex] = useState(1);

  const [content, setContent] = useState({});

  useEffect(() => {
      if(userLogin.language!== undefined) {
          setContent(require(`../languages/${userLogin.language}.json`));
      }else{
          setContent(require(`../languages/en.json`));
      }
  }, [userLogin])

  const listMenu = [
    {
      menuItem: content.search_people,
    },

    {
      menuItem: content.search_group,
    },

    {
      menuItem: content.search_post,
    },
    
    {
      menuItem: content.search_picture,
    },
  ];

  const handleMenuClick = (index) => {
    setMenuIndex(index);
  };

  return (
    <>
      <div id="some" className={Styled.result}>
        <div className={Styled["result-content"]}>
          <h2>{content.search_result}: <span style={{display: 'block', color: '#f9ca24', fontSize: '30px'}}>{router.query.keyword}</span></h2>
        </div>
        <div className={Styled["result-everybody"]}>
          {/* <h2>{params.keyword}</h2> */}
        </div>
        <hr />
        <ul className="list-menu">
          {listMenu.map((menu, index) => (
            <li onClick={() => handleMenuClick(index + 1)} key={index} className={menuIndex===(index+1) ? Styled["menu-items"] : ''}>
              {menu.menuItem}
            </li>
          ))}
        </ul>

        {menuIndex === 3 && (
          <ListAll />
        )}

        {menuIndex === 4 && (
          <div className={Styled["all-content"]}>
            <ListPicture />
          </div>
        )}

        {menuIndex === 2 && (
          <div className={Styled["all-content"]}>
            <ListGroup />
          </div>
        )}

        {menuIndex === 1 && (
          <div className={Styled["all-content"]}>
            <ListPeople />
          </div>
        )}
        <hr />
      </div>
    </>
  );
}

export default Searched;
