import axios from 'axios';
const api = require('../../config.json');


export default function handleSetDate (day, month, year){
    return day+"-"+(month+1)+"-"+year;
}

export const formatDate = (date) => {
    try {
        const formattedDate = date.split('-');
        var day = formattedDate[0];
        var month = formattedDate[1];
        var year = formattedDate[2];

        if (formattedDate[1].length == 1) month = "0"+formattedDate[1];
        if (formattedDate[0].length == 1) day = "0"+formattedDate[0];
        return year+"-"+month+"-"+day;
    }catch(err){
        return "0000-00-00"
    }
}


export const sendToLoginByRegister = (username, password) => {
    var data = JSON.stringify({
        "usernameOrEmail": username,
        "password": password,
        "remember_me": false
    });

    var config = {
        method: 'post',
        url: `${api}/auth/login?locale=en`,
        headers: { 
            'Content-Type': 'application/json'
        },
        data : data
    };

    axios(config)
    .then(function (response) {})
    .catch(function (error) {});
}
