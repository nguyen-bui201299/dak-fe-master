
import API, {endpoints, headers} from "../../../API";
import { WalletAddressHasher } from '../../../utils/wallet_address_hashed'

export const Request = (data) => {
    let jsonTransferData = {}
    return new Promise((resolve, reject) => {
        // Hashed data section
        // if (WalletAddressHasher(data)) {
        //     API.post(endpoints['walletRequest'], data, {headers : headers.headers_token})
        //     .then(function (response) {
        //         console.log(response);
        //         if(response.data.success){
        //             resolve(response.data.message);
        //         } else {
        //             reject(response.data.errors[0].message)
        //         }
        //     })
        //     .catch(function (error) {
        //         reject("Loi he thong");
        //     })
        // }
        API.post(endpoints['walletRequest'], data, {headers : headers.headers_token})
            .then(function (response) {
                console.log(response);
                if(response.data.success){
                    resolve(response.data.message);
                } else {
                    reject(response.data.errors[0].message)
                }
            })
            .catch(function (error) {
                reject("Loi he thong");
            })
    })
}