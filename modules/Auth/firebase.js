import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';
import axios from 'axios';
import { SuccessNotification } from "../Notification/Notification";
import { setCookieUserLogin } from "../Cookies/Auth/userLogin";

const fireBaseConfig = {
    "apiKey": "AIzaSyA8dUNq2xBNmUMh2QmZMfEICxRvWXYDpDE",
    "authDomain": "dak-firebase.firebaseapp.com",
    "databaseURL": "https://dak-firebase-default-rtdb.asia-southeast1.firebasedatabase.app",
    "projectId": "dak-firebase",
    "storageBucket": "dak-firebase.appspot.com",
    "messagingSenderId": "879997427318",
    "appId": "1:879997427318:web:176e45206116cb51a28957",
    "measurementId": "G-LK581K96LC"
}

const app = initializeApp(fireBaseConfig);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
googleProvider.addScope("email");


async function setCookie(data) {
    const credentials = data;

    axios.post("./api/auth/set-info-user-login", credentials);

}

// Google login
export const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
        .then((result) => {
            if (result != null) {
                var data = {
                    "name": result.user.displayName,
                    "avatar": result.user.photoURL,
                    "username": (result.user.displayName.split(' ')[result.user.displayName.split(' ').length - 1] + result.user.displayName.split(' ')[0]).toLowerCase(),
                    "identity": result.user.uid.toString(),
                    "account_type": 3,
                    "email": result.user.providerData[0].email,
                    "phone_number": result.user.providerData[0].phoneNumber != null ? result.user.providerData[0].phoneNumber : '',
                    "birthday": "0000-00-00",
                }

                var config = {
                    method: 'post',
                    url: 'https://dakshow.vn/api/auth/login-social',
                    headers: {
                        'Authorization': `Bearer ${result.user.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: data
                };

                axios(config)
                    .then(function (response) {
                        if (response.data.success) {
                            setCookieUserLogin(response.data.data)
                            SuccessNotification(response.data.message)
                            window.location.href = '/'
                        }
                    })
                    .catch(function (error) {});
            }
        }).catch((error) => {
            if (error.message.search ( 'transaction' || 'IDBDatabase') > -1) {window.location.reload () }
        })
}



// Facebook login
export const signInWithFaceBook = () => {
    signInWithPopup(auth, facebookProvider)
        .then((result) => {
            var data = {
                "name": result.user.displayName,
                "avatar": result.user.photoURL,
                "username": (result.user.displayName.split(' ')[result.user.displayName.split(' ').length - 1] + result.user.displayName.split(' ')[0]).toLowerCase(),
                "identity": result.user.uid.toString(),
                "account_type": 3,
                "email": result.user.providerData[0].email != null ? result.user.providerData[0].email : '',
                "phone_number": result.user.phoneNumber != null ? result.user.phoneNumber : '',
                "birthday": "0000-00-00",
            };

            var config = {
                method: 'post',
                url: 'https://dakshow.vn/api/auth/login-social',
                headers: {
                    'Authorization': `Bearer ${result.user.accessToken}`,
                    'Content-Type': 'application/json'
                },
                data: data
            };
            axios(config)
                .then(function (response) {
                    if (response.data.success) {
                        setCookieUserLogin(response.data.data)
                        SuccessNotification(response.data.message)
                        window.location.href = '/'
                    }
                })
                .catch(function (error) {});

        }).catch((error) => {})
}

export default function Fix(){}
