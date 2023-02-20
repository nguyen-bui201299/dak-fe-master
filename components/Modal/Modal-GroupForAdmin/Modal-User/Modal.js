import styles from "../../Modal.module.css";
import Admin from "../Modal.module.css";
import { useState, useEffect } from 'react';
import { RiCloseLine, RiShieldUserFill } from "react-icons/ri";
import { BsThreeDotsVertical } from 'react-icons/bs'
import Follow from '../../../Button/ButtonFollow/ButtonFollow'
import Button from '../../../Button/ButtonFollow/ButtonFollow.module.css'
import DropdownOption from '../../../Dropdown/DropdownGroup-ForAdmin/Dropdown-Option/Dropdown'
import API, { endpoints, headers } from "../../../../API"
import { getCookieUserLogin } from "../../../../modules/Cookies/Auth/userLogin";

const Modal = ({ setIsOpenUser, history, infoGroup }) => {
    const [groupDetail, setGroupDetail] = useState([]) 
    const userLogin = getCookieUserLogin()
    const [isAdmin, setIsAdmin] = useState(false)
    const [kick, setKick] = useState(false)
    const [showModalMembers, setShowModalMembers] = useState(false)

    useEffect(() => {
        API.get(endpoints["getAllMember"](infoGroup.id), {headers: headers.headers_token})
            .then(res => {
                if(res.data.success) {
                    setGroupDetail(res.data.data)
                    setShowModalMembers(true)
                }
            })
            .catch(err => console.log(err))
    }, [infoGroup.id, kick])

        useEffect(() => {
            groupDetail.map((admin, index) => (
                admin.role === "ROLE_GROUP_SUPER_ADMIN"
                ? 
                    userLogin.id === admin.owner.id 
                    ?
                        setIsAdmin(true)
                    :
                        <></>
                :
                <></>
            ))
        }, [groupDetail])

    return (
        <>
            {showModalMembers && 
                <>
                    <div className={styles.darkBG} onClick={() => setIsOpenUser(false)}></div>
                    {/* <div
                    className={`alert alert-success ${isShowingAlert ? 'alert-shown' : 'alert-hidden'}`}
                    onTransitionEnd={() => setShowingAlert(false)}
                    >
                    <strong onClick={() => setShowingAlert(true)}>Success!</strong> Thank you for subscribing!
                    </div> */}
                    <div className={styles.centered}>
                        <div className={Admin.modal__ShowUser}>
                            <div className={styles.modalHeader}>
                                <h5 className={styles.heading_Show}>Group members</h5>
                            </div>
                            <button className={styles.closeBtn} onClick={() => setIsOpenUser(false)}>
                                <RiCloseLine style={{ marginBottom: "-3px" }} />
                            </button>
                                <div className={Admin.group_admin_title}>
                                    <label>Administrators & Moderators</label>
                                </div>
                                {groupDetail && groupDetail.map((admin, index) => (
                                    admin.role==="ROLE_GROUP_SUPER_ADMIN" ?
                                        <div className={Admin.user_Admin} key={index}>
                                            <div className={Admin.name}>
                                                <span className={Admin.picture}>
                                                    {/* <Image src={'/images/fpcyKuIW_400x400.jpg'} alt='picture-user' width={35} height={35}/> */}
                                                    <img src={admin.owner.avatar} alt='picture-user' className={Admin.ava}></img>
                                                </span>
                                                <span className={Admin.Username}>
                                                    <strong>{admin.owner.name}</strong>                                                    
                                                    <small>{admin.number_followers} Followers</small>
                                                </span>
                                            </div>
                                            <div className={Button.button}>
                                                <RiShieldUserFill  style={{fontSize: '24px', margin: '20px 10px'}}/>
                                                {userLogin.id !== admin.owner.id ? <Follow/> 
                                                :
                                                    <p 
                                                style={{margin: '0 0 12px 0', display: 'flex', alignItems: 'center', padding: '0 37px', width: '100px'}}>
                                                    You
                                                    </p>
                                                }
                                                <BsThreeDotsVertical style={{fontSize: '18px', margin: '20px 5px'}}/>
                                            </div>
                                        </div>
                                    :
                                    <></>
                                ))}
                                <div className={Admin.group_admin_title}>
                                    <label>Other members</label>
                                </div>
                                {groupDetail && groupDetail.map((admin, index) => (
                                        admin.role == 'ROLE_GROUP_MEMBER' ?
                                            <div className={Admin.user_Admin}>
                                                <div className={Admin.name}>
                                                    <span className={Admin.picture}>
                                                        {/* <Image src={'/images/fpcyKuIW_400x400.jpg'} alt='picture-user' width={35} height={35}/> */}
                                                        <img src={admin.owner.avatar} alt='picture-user' className={Admin.ava}></img>
                                                    </span>
                                                    <span className={Admin.Username}>
                                                        <strong>{admin.owner.name}</strong>
                                                        <small>{admin.number_followers} Followers</small>
                                                    </span>
                                                </div>
                                                <div className={Button.button}>
                                                    {/* <FiUsers style={{ margin: '20px 10px'}}/> */}
                                                    {userLogin.id !== admin.owner.id ? <Follow/> 
                                                    : 
                                                    <p 
                                                        style={{margin: '0 0 12px 0', display: 'flex', alignItems: 'center', padding: '0 37px', width: '100px'}}>
                                                            Bạn
                                                    </p>}
                                                    {isAdmin ? <DropdownOption groupId={infoGroup.id} userId={admin.owner.id} setKick={setKick} setIsOpenUser={setIsOpenUser} style={{fontSize: '18px', margin: '20px 5px'}}/> : <div className={Button.isNotAdmin}></div>}
                                                </div>
                                            </div>
                                        :
                                        <></>
                                    ))}
                            <div className={styles.modalActions_Add}>
                                <button className={styles.AddBtn_Group} onClick={() => setIsOpenUser(false)}>
                                        Lưu
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            }
        </>
    );
};
export default Modal;