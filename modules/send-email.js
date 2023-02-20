import API, {endpoints} from "../API.js";


export const sendEmail = (token, xsrfToken, refreshToken) => {
    ``
    return new Promise((resolve, reject) => {
        API.post(endpoints["sendEmailVerifiAccount"], {}, 
        {headers : 
            {   Authorization : `Bearer ${token}`,
                'Refresh-Token': `${refreshToken}`,
                'Xsrf-Token': `${xsrfToken}`,
                'Content-Type': 'application/json'
            }})
                .then(function (response) {
                    //console.log(response);
                    if(response.data.success){
                        resolve (response.data);
                    }
                })
                .catch(function (error) {
                    reject (error);
                });
    });
}