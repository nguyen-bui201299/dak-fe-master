import API, {endpoints, headers} from '../../API';
import { deleteChatToken, deleteCookieUserLogin, deleteRefreshToken, deleteTokenUserLogin, deleteXsrfToken } from '../Cookies/Auth/userLogin';

export const getListIdPost = (data) => {
    return new Promise((resolve, reject) => {
            API.post(endpoints['getAllPostIds'] ,  data , { headers : headers.headers_token } )
                .then(function (response) {
                    resolve (response.data);
                })
                .catch(function (error) {
                    reject (error);
                });
    });
    
}


