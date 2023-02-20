import axios from 'axios'

const api = require('../../config.json');

export const sendEmail = (email = "") => {
    return new Promise((resolve, reject) => {
        var config = {
            method: 'post',
            url: `${api.url}/auth/active-acount/send-code`,
            headers: { 
                'Content-Type': 'application/json'
            },
            data : {"email": email}
        };
        axios(config)
        .then(function (response) {
            if(response.data.success){
                resolve (response.data);
            }
        })
        .catch(function (error) {
            resolve (error);
        });
    });
    
}

export default function ac(){}
