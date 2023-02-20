import API, {endpoints, headers} from '../../API';
import { getLoginPublicKey } from '../../utils/getLoginPublicKey.ulti'
import { hashLoginPublicKey } from '../../utils/hashLoginPublicKey.util'


export const sendToLogin = async (dataLogin) => {
    const usernameOrEmail = dataLogin[0].value.includes('@') ? dataLogin[0].value.toLowerCase() : dataLogin[0].value

    // Get Public Key
    const publicKey = await getLoginPublicKey(usernameOrEmail)

    // Hash Public Key
    const hashPublicKey = await hashLoginPublicKey(dataLogin[1].value, publicKey)

    var data = {
        "usernameOrEmail": usernameOrEmail,
        "password":  hashPublicKey,
        "remember_me": dataLogin[2]?.checked
    };

    return new Promise(async (resolve, reject) => {
        // Product
        await API.post(endpoints['auth/login']('en'), data,{headers: headers.headers_token})
            .then(function (response) {
                resolve (response.data)
            })
            .catch(function (error) {
                reject (error);
            });
    });
}