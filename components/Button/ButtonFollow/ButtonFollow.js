import React, { useEffect, useState } from "react";
import Button from "../ButtonFollow/ButtonFollow.module.css";
import API, { endpoints, headers } from "../../../API";
import { getCookieUserLogin } from "../../../modules/Cookies/Auth/userLogin";

function ButtonFollow(props) {
  const userLogin = getCookieUserLogin()
  const { handleFollow } = props

  const [content, setContent] = useState({});

  useEffect(() => {
    if (userLogin.language !== undefined) {
      setContent(require(`../languages/${userLogin.language}.json`));
    } else {
      setContent(require(`../languages/en.json`));
    }
  }, [userLogin]);

  const [isJoin, setIsJoin] = useState(false);
  const [buttons, setButtons] = useState(true);
 

  const [params, setParams] = useState(props.isFollow ? "unfollow" : "follow");

  const handleClick = async (id) => {
    const idUser = props.id
    try {
      setIsJoin(!isJoin);
      setButtons(!buttons); 

      props.isFollow
        ? !isJoin
          ? setParams("follow")
          : setParams("unfollow")
        : isJoin
        ? setParams("follow")
        : setParams("unfollow");

      const response = await API.post(
        endpoints[`${params}`],
        { user_id: idUser },
        { headers: headers.headers_token }
      );
    } catch (error) {};
  };

  return (
    <div className={Button["button-join"]}>
      <button
        className={
          buttons ? `${Button.user_follow}` : `${Button.user_followed}`
        }
        onClick={() => { handleClick(props.id)}}
      >
        {/* {props.isFollow ? content.button_follow_following : content.button_follow_follow } */}
        {
        props.isFollow
          ? !isJoin
            ? content.button_follow_following
            : content.button_follow_follow
          : isJoin
          ? content.button_follow_following
          : content.button_follow_follow
        }
      </button>
    </div>
  );
}

export default ButtonFollow;
