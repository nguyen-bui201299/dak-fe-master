
import API, {endpoints, headers} from "../../../API";
import { EncryptTransaction } from "../../../utils/encrypt_transaction";
// import { WalletAddressHasher } from '../../../utils/wallet_address_hashed'

export const Transfer = async (data, hash) => {
    console.log({hash})
    const encryptedData = await EncryptTransaction(data, hash.publicKey)
    // console.log({a})
    const dataTransfer = {
        data,
        encrypted: encryptedData
    }
    return new Promise((resolve, reject) => {
        // Hashed data section
        // if(WalletAddressHasher(data)) {
        //     API.post(endpoints['walletTransfer'] , data, {headers : headers.headers_token})
        //     .then(function (response) {
        //         console.log(response);
        //         if(response.data.success){
        //             resolve(response.data.message);
        //         } else {
        //             reject(response.data.errors[0].message)
        //         }
        //     })
        //     .catch(function (error) {
        //         reject("Loi he thong: ", error);
        //     })
        // }
        API.post(endpoints['walletTransfer'] , dataTransfer, {headers : headers.headers_token})
            .then(function (response) {
                console.log({response})
                if(response.data.success){
                    resolve(response.data.message);
                } else {
                    reject(response.data.errors[0].message)
                }
            })
            .catch(function (error) {
                reject("Loi he thong: ", error);
            })
    })
}