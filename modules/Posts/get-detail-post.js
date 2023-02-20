import API, {endpoints, headers} from '../../API';
import axios from 'axios';
//Truyền vào 1 mảng id bài viết
export const getDetailPost = (data) => {
    return new Promise((resolve, reject) => {
            API.post(endpoints['getdetailpostbyid'],  {list_post_id : data} , { headers : headers.headers_token })
                .then(function (response) {
                    resolve (response.data);
                })
                .catch(function (error) {
                    reject (error);
                });
    });
}