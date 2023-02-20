import API, {endpoints, headers} from '../API'

export async function getLoginPublicKey (usernameOrEmail) {
    try {
        return await (await API.get(endpoints['getPublicKey'](usernameOrEmail), { headers: headers.headers })).data.data
    } catch (e) {
        throw new Error(e.message)
    }
}