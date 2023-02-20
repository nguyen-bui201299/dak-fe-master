import CryptoJS from 'crypto-js'

//Mã hoá jwt
const key = process.env.NEXT_PUBLIC_KEY_ENCODE;
export const jwtEncode = ((data, type) => {
    try {
        let data_encode
        if(type === 'user') {
            data_encode = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
        } else {
            data_encode = CryptoJS.AES.encrypt(data, key).toString();
        }
        return data_encode;
    }catch (e) {
        console(e);
        return;
    }
})

//giải mã jwt
export const jwtDecode = ((data, type) => {
    try {
        let data_decode
        if(data) {
            const bytes  = CryptoJS.AES.decrypt(data, key);
            if(type === 'user') {
                data_decode = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            } else {
                data_decode = bytes.toString(CryptoJS.enc.Utf8);
            }
            return data_decode;
        }
    }catch (e) {
        console.log(e);
        return;
    }
    
})