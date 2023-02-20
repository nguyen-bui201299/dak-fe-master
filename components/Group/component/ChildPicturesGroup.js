import Link from 'next/link'
import Image from 'next/image'
import { BiLockAlt,BiWorld } from "react-icons/bi"
import { AiOutlineRight, AiOutlineArrowLeft } from "react-icons/ai"
import Styled from "../Main/MainContent.module.css"
import { useEffect, useState } from 'react'
import { getCookieUserLogin } from '../../../modules/Cookies/Auth/userLogin'

function ChildPicturesGroup(props) {
    const { joinGroup, group, filterGroup } = props
    const userLogin = getCookieUserLogin()

    const [content, setContent] = useState({});

    useEffect(() => {
        if(userLogin.language!== undefined) {
            setContent(require(`../languages/${userLogin.language}.json`));
        }else{
            setContent(require(`../languages/en.json`));
        }
    }, [userLogin])

    // Các group mà user hiện tại đang login đã tham gia
    if (joinGroup) {
        return (
            <Link href={`/group/detail-group/${joinGroup.id}`} passHref>
                <div className={Styled["childPictures-group"]}>
                    <img src={joinGroup?.background_img} alt='picture-group' width={220} height={200} />
                    {/* <p>{joinGroup.background_img} {content.introduce_new_members}</p> */}
                        <div className={Styled["contentPictures"]}>
                            <div className={Styled["main-contentGroup"]}>
                                <span className={Styled["name-main-group"]}>{joinGroup.group_name.substr(0, 25)} {joinGroup.group_name.length > 25 &&<span> ...</span>}  </span><br />
                                {joinGroup.access === 1 ? <BiWorld style={{ position: 'relative', top: '3' }} /> : <BiLockAlt style={{ position: 'relative', top: '3' }} />}
                                <span className={Styled["pr-or-pub"]}>
                                    {joinGroup.access === 1 ? "Public" : "Private" }
                                    <span className={Styled["number-member"]}>{joinGroup.quantity}</span>{" "}
                                    {content.child_pictures_group_member} 
                                </span>
                            </div>
                            <div className={Styled["main-seeMore"]}>
                                <a><AiOutlineRight /></a>
                            </div>
                        </div>
                </div>
            </Link>
        );
    }

    // Render tất cả các group có trên dakshow
    if (group) {
        return (
            <Link href={`/group/detail-group/${group.group.id}`} passHref>
                <div className={Styled["childPictures-group"]}>
                    <Image src={group.group.background_img} alt='picture-group' width={220} height={200} />
                        <div className={Styled["contentPictures"]}>
                            <div className={Styled["main-contentGroup"]}>
                                <span className={Styled["name-main-group"]}>{group.group.name.substr(0, 25)} {group.group.name.length > 25 &&<span> ...</span>}  </span><br />
                                {group.group.access === 1 ? <BiWorld style={{ position: 'relative', top: '3' }} /> : <BiLockAlt style={{ position: 'relative', top: '3' }} />}
                                <span className={Styled["pr-or-pub"]}>{group.group.access === 1 ? "Public" : "Private" }<span className={Styled["number-member"]}>{group.member_count}</span> {content.child_pictures_group_member} </span>
                            </div>
                            <div className={Styled["main-seeMore"]}>
                                <a><AiOutlineRight /></a>
                            </div>
                        </div>
                </div>
            </Link>
        );
    }
    
    if (filterGroup) {
        return (
            <Link href={`/group/detail-group/${filterGroup.id}`} passHref>
                <div className={Styled["childPictures-group"]}>
                    <Image src={filterGroup.background_img} alt='picture-group' width={220} height={200} />
                        <div className={Styled["contentPictures"]}>
                            <div className={Styled["main-contentGroup"]}>
                                <span className={Styled["name-main-group"]}>{filterGroup.name}</span><br />
                                {filterGroup.access === 1 ? <BiWorld style={{ position: 'relative', top: '3' }} /> : <BiLockAlt style={{ position: 'relative', top: '3' }} />}
                                <span className={Styled["pr-or-pub"]}>{filterGroup.access}<span className={Styled["number-member"]}>{filterGroup.member_count}</span> {content.child_pictures_group_member} </span>
                            </div>
                            <div className={Styled["main-seeMore"]}>
                                <a><AiOutlineRight /></a>
                            </div>
                        </div>
                </div>
            </Link>
        );
    }
}

export default ChildPicturesGroup;