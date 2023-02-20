import cookies from 'react-cookies';
import { jwtEncode, jwtDecode } from '../../JWT/JWT'

//Lưu cookies Social List Type
//Mã hoá JWT
export const setCookiesSocialList =(SocialTypeList) => {
    try{
        cookies.save('social_type_list', jwtEncode(SocialTypeList),  { path: '/' , maxAge: 60 * 60 * 24 * 30 });
    }catch(e) {}
};

//Trả về cookies social
export const getCookiesSocialList =() => {
    try{
        return jwtDecode(cookies.load('social_type_list'));
    }catch(e) {}
};


//Xoá cookies của Social
export const deleteCookiesSocialList = (() => {
    try {
        cookies.remove('user', { path: '/'});
        return;
    }catch(err) {
        return;
    }
});
