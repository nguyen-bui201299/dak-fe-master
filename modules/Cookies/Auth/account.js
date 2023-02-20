
import { jwtEncode, jwtDecode } from '../../JWT/JWT'
import cookies from 'react-cookies'

export const setRememberMeCookie = ((data) => {
    try {
        cookies.save('remember_me', jwtEncode(data), { path: '/' , maxAge: 60 * 60 * 24 });
        return;
    }catch(err) {
        return;
    }
});


export const getRememberMeCookie= (() => {
    try {
        return jwtDecode(cookies.load('remember_me'));
    }catch(err) {
        return;
    }
});


export const deleteRememberMeCookie = (() => {
    try {
        cookies.remove('remember_me', { path: '/'});
        return;
    }catch(err) {
        return;
    }
});

