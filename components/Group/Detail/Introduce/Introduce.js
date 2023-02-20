import { AiFillClockCircle, AiOutlineUser } from "react-icons/ai"
import { IoEarthSharp, IoEyeSharp } from "react-icons/io5"
import Styled from "../../Detail/DetailContentGroup.module.css"
import formatDate from "../../../../modules/Time/formatDate"
import { RiGitRepositoryPrivateLine } from "react-icons/ri"
import { useEffect, useState } from 'react'
import { getCookieUserLogin } from "../../../../modules/Cookies/Auth/userLogin"

const Introduce = (props) => {
    const { detailGroup } = props

    const userLogin = getCookieUserLogin();

    const [showBioGroup, setShowBioGroup] = useState(false)

    const [content, setContent] = useState({});

    useEffect(() => {
        if(userLogin.language!== undefined) {
            setContent(require(`../../languages/${userLogin.language}.json`));
        }else{
            setContent(require(`../../languages/en.json`));
        }
    }, [userLogin])

    useEffect(() => {
        if(props.desc?.length >= 500) {
          setShowBioGroup(true)
        } else {
          setShowBioGroup(false)
        }
      },[])
    
      const handleShowBioGroup = () => setShowBioGroup(false)

    return (
        <div className={`${Styled.container}`}>
            <div className={`${Styled.content} ${showBioGroup && Styled.active}`} data-state={``}>
                {showBioGroup ? props.desc.slice(0, 230) : props.desc}
                {showBioGroup && <span>...<span className={Styled.readmore__caption} onClick={handleShowBioGroup}>{content.introduce_read_more}</span></span>}
            </div>
            <div className={Styled['status-Group']}>
                {
                    props.access === 1
                    ? <span><IoEarthSharp style={{ position: 'relative', top: '4', fontSize: '20px' }} /> {content.introduce_public_group}<br /> <small style={{ color: 'grey', position: 'relative', left: '25px' }}>{content.introduce_everyone_can_see}</small></span>
                    : <span><RiGitRepositoryPrivateLine style={{ position: 'relative', top: '4', fontSize: '20px' }} /> {content.introduce_private_group}<br /> <small style={{ color: 'grey', position: 'relative', left: '25px' }}>{content.introduce_noone_can_see}</small></span>
                }
            </div>
            <div className={Styled['status-Group']}>
                <span><IoEyeSharp style={{ position: 'relative', top: '4', fontSize: '20px' }} /> {content.introduce_visible}<br /> <small style={{ color: 'grey', position: 'relative', left: '25px' }}>{content.introduce_everyone_can_find}</small></span>
            </div>
            <div className={Styled['status-Group']}>
                <span><AiFillClockCircle style={{ position: 'relative', top: '4', fontSize: '20px' }} /> {content.introduce_created_at}<br /> <small style={{ color: 'grey', position: 'relative', left: '25px' }}>{content.introduce_created_from} {formatDate(props.dayCreate)}</small></span>
            </div>
            <div className={Styled['status-Group']}>
                <span><AiOutlineUser style={{ position: 'relative', top: '4', fontSize: '20px' }} /> {props.memberCount} {content.introduce_new_members}<br /> <small style={{ color: 'grey', position: 'relative', left: '25px' }}>+ {props.weeklyJoinedMember} {content.introduce_compare_last_week}</small></span>
            </div>
        </div>
    )
}

export default Introduce