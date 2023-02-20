
import { jwtEncode, jwtDecode} from '../../JWT/JWT'
import cookies from 'react-cookies'
//Lưu cookies của người dùng login vào hệ thống
//Mã hoá JWT
export const setCookieUserLogin = ((infoUserLogin) => {
    try {
        cookies.save('LOGIN_INFO', jwtEncode(infoUserLogin, 'user'));
        return;
    }catch(err) {
        return;
    }
});

//Trả về cookies của người dùng login vào hệ thống
export const getCookieUserLogin = (() => {
    try {
        return jwtDecode(cookies.load('LOGIN_INFO'), 'user') ;
    }catch(err) {
        return {};
    }
});

//Xoá cookies của người dùng login vào hệ thống
export const deleteCookieUserLogin = (() => {
    try {
        cookies.remove('LOGIN_INFO');
        return;
    }catch(err) {
        return;
    }
});


export const setTokenUserLogin = ((token) => {
    try {
        cookies.save('token', jwtEncode(token, 'token'));
        return
    }catch(err) {
        return {};
    }
});
//Trả về token của người dùng login vào hệ thống
export const getTokenUserLogin = (() => {
    try {
        return jwtDecode(cookies.load('token'), 'token') ;
    }catch(err) {
        return;
    }
});

export const deleteTokenUserLogin = (() => {
    try {
        return cookies.remove('token') ;
    }catch(err) {
        return;
    }
});


export const setCookieRefreshToken = ((tokenRefresh) => {
    try {
        cookies.save('REFRESH_TOKEN', jwtEncode(tokenRefresh, 'refresh'));
        return;
    }catch(err) {
        return;
    }
});

export const setCookieChatToken = ((chatToken) => {
    try {
        cookies.save('CHAT_TOKEN', jwtEncode(chatToken, 'chatToken'));
        return;
    }catch(err) {
        return;
    }
});

export const setCookieXSRFToken = ((xsrfToken) => {
    try {
        cookies.save('XSRF_TOKEN', jwtEncode(xsrfToken, 'xsrfToken'));
        return;
    }catch(err) {
        return;
    }
});

export const getCookieRefreshToken = (() => {
    try {
        return jwtDecode(cookies.load('REFRESH_TOKEN'), 'refresh') ;
    }catch(err) {
        return {};
    }
});

export const getCookieXSRFToken = (() => {
    try {
        return jwtDecode(cookies.load('XSRF_TOKEN'), 'xsrfToken') ;
    }catch(err) {
        return {};
    }
});

export const getCookieChatToken = (() => {
    try {
        return jwtDecode(cookies.load('CHAT_TOKEN'), 'chatToken') ;
    }catch(err) {
        return {};
    }
});

export const deleteRefreshToken = (() => {
    try {
        return cookies.remove('REFRESH_TOKEN') ;
    }catch(err) {
        return;
    }
});

export const deleteChatToken = (() => {
    try {
        return cookies.remove('CHAT_TOKEN') ;
    }catch(err) {
        return;
    }
});

export const deleteXsrfToken = (() => {
    try {
        return cookies.remove('XSRF_TOKEN') ;
    }catch(err) {
        return;
    }
});
