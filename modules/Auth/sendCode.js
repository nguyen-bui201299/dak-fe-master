import API, {endpoints, headers} from "../../API";

export const sendCode = (data = "") => {

    return new Promise((resolve, reject) => {
        API.post(endpoints["sendCodeVerifiAccount"], data, {headers : headers.headers_token})
        .then(res => {
            resolve(res.data);
        })
        .catch(err => reject(err));
    })
    

}