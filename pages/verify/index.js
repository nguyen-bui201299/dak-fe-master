import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {AiFillEye,AiFillEyeInvisible} from 'react-icons/ai'
import { NotificationToast } from "../../modules/Notification/Notification";


import Styles  from '../../styles/ActiveAcc.module.css'
import API , { headers } from '../../API'
const bcrytp = require('bcryptjs')
const ActiveAcc = () => {
    const router = useRouter()
    const [formData, setFormData] = useState({
        newPw : "",
        reNewPw : ""
    });
    useEffect(() => {
        if(router.query.code){
            const query = router.query
            const {type,code,token} = query;
            const data = {code,token}
            if( type === "active-account" ){
                API.post('/auth/active-account',data)
                .then(data => {
                    if(data.data.success){
                        NotificationToast.fire({
                            toast: true,
                            position: 'top-end',
                            icon: 'success',
                            title: 'Verification Successfully!!!',
                          })
                        router.push('/login')
                    }
                    else{
                        NotificationToast.fire({
                            toast: true,
                            position: 'top-end',
                            icon: 'error',
                            title: 'Verification Failed!!!',
                          })
                    }
                })
                .catch(err => console.log(err))
            }
            else if (type === "delete-account") {}
            else if (type === "confirm-transfer") {
                API.post('/wallet/sendMail/verify',data, {
                    headers: headers.headers_token,
                })
                .then(data => {
                    if(data.data.success){
                        NotificationToast.fire({
                            toast: true,
                            position: 'top-end',
                            icon: 'success',
                            title: 'Verification Successfully!!!',
                          })
                        // router.push('/login')
                    }
                    else{
                        NotificationToast.fire({
                            toast: true,
                            position: 'top-end',
                            icon: 'error',
                            title: 'Verification Failed, Please Try Again!',
                          })
                    }
                })
                .catch(err => console.log(err))
            }
        }
    }, [router]);
    //forget password
    const [error, setError] = useState();
    const [seePw, setSeePw] = useState({
        newPw : false,
        rePw : false
    });
    var re =  new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])")
    const handleSubmit = () =>{
        if(!formData.newPw){
            setError({newPw : 'New Password Can Not Empty!!!' , rePw : ""})
        }
        else if(!re.test(formData.newPw)){
            setError({newPw : 'Password Must Be Contains UpperCase,LowerCase And Least 1 Special Charecter!!!' , rePw : ""})
        }
        else if(!formData.reNewPw){
            setError({rePw : 'Confirm Password Can Not Empty!!!',newPw:""})
        }
        else if(formData.newPw !== formData.reNewPw){
            setError({validate : "Confirm Password InCorrect!!!"})
        }
        else{
            setError();
            const {token,code} = router.query
            console.log(token);
            console.log(code);
            const data = {password : bcrytp.hashSync(formData.reNewPw) , code,token}
            API.post('/auth/forgot-password/change-password',data)
            .then(res => {
                console.log(res)
                if(res.data.success){
                    NotificationToast.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: 'Change Password Successfully!!!',
                      })
                    router.push('/login')
                }
                else{
                    NotificationToast.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'error',
                        title: 'Change Password  Failed!!!',
                      })
                }
            })
            .catch(err => console.log(err))
        }
    }
    //end forget password

  return (
    <div className={Styles.activeAcc}>
        {router.query.type === "active-account" && <h1>Verify in progress</h1>}
        {router.query.type === "delete-account" && <h1>Delete in progress</h1>}
        {router.query.type === "forgot-password" && <div className={Styles.forgetPassword}>
            <h1>Forget Password</h1>
            <div className={`${Styles.input} ${error?.newPw && Styles.activeError} ${error?.validate && Styles.activeError}`}>
                <label htmlFor="newPw">New Password</label>
                <input  
                value={formData.newPw} 
                onChange={(e) => setFormData(prev => ({...prev,newPw : e.target.value}) )} 
                id='newPw' 
                type={seePw.newPw ? "text" : "password"} 
                placeholder='Please Enter New Password!!!'/> 
                {seePw.newPw ? 
                <AiFillEyeInvisible onClick={() => setSeePw(prev => ({...prev,newPw : !prev.newPw}))}/> :  
                <AiFillEye onClick={() => setSeePw(prev => ({...prev,newPw : !prev.newPw}))}/>}
            </div>
            <div  className={`${Styles.input} ${error?.rePw && Styles.activeError} ${error?.validate && Styles.activeError}`}>
                <label htmlFor="rePw">Confirm New Password</label>
                <input 
                value={formData.reNewPw} 
                onChange={(e) => setFormData(prev => ({...prev,reNewPw : e.target.value}) )} 
                id='rePw' 
                type={seePw.rePw ? "text" : "password"} 
                placeholder='Please Confirm Password!!!'/> 
                {seePw.rePw ? 
                <AiFillEyeInvisible onClick={() => setSeePw(prev => ({...prev,rePw : !prev.rePw}))}/> :  
                <AiFillEye onClick={() => setSeePw(prev => ({...prev,rePw : !prev.rePw}))}/>}
            </div>
            <button onClick={handleSubmit}>Submit</button>
            <span className={Styles.error}>{error?.newPw ? error?.newPw : error?.rePw ? error?.rePw : error?.validate ? error?.validate :""}</span>
        </div>}
        {router.query.type !== "forgot-password" && <div className={Styles.dotFlashing}></div>}
    </div>
  )
}

export default ActiveAcc