import React from "react";
import { FaGoogle } from "react-icons/fa";
import Styles from '../../styles/LoginRegister.module.css';
import { useGoogleLogin } from '@react-oauth/google';
import axios from "axios";
import { setTokenUserLogin } from "../../modules/Cookies/Auth/userLogin";
const GoogleLogin = () => {
    const handleLoginWithGoogle = useGoogleLogin({
        onSuccess: async (response) => {
            console.log(response)
            // setToken(response.access_token)
            setTokenUserLogin(response.access_token);
            const resGoogle = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${response.access_token}`)
            console.log(resGoogle)
        },
    })
  return (
    <li
      className={Styles["form__control-social-item"]}
      onClick={handleLoginWithGoogle}
    >
      <FaGoogle className={Styles["form__control-social-item-icon"]} />
    </li>
  );
};

export default GoogleLogin;
