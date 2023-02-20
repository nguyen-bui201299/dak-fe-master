import { useState, useRef, useEffect } from 'react';
import Styled from '../../Dropdown/Menu.module.css';
import { FiEdit } from 'react-icons/fi'
import { AiOutlineShareAlt, AiOutlineMessage } from 'react-icons/ai'

export default function DropdownShare({post, setSharedPost, setShowFormSharePost, setIsMessSharing}) {
    return (
        <>
            <div>
                <DropIcon icon={<AiOutlineShareAlt/>} >
                    <DropdownMenu post={post} setSharedPost={setSharedPost} setShowFormSharePost={setShowFormSharePost} setIsMessSharing={setIsMessSharing}/>
                </DropIcon>
            </div>
        </>
    )
}

export function DropdownMenu({post, setSharedPost, setShowFormSharePost, setIsMessSharing}) {

    const handleShareFeed = () => {
        setSharedPost(post)
        setShowFormSharePost(true)
        setIsMessSharing(false)
    }

    const handleShareMess = () => {
        setSharedPost(post)
        setShowFormSharePost(true)
        setIsMessSharing(true)
    }

    
    return (
        <>
            <div className={`${Styled.dropdown_Group} ${Styled.dropdown__share}`}>
                    <div
                        onClick={handleShareFeed}
                        className={Styled.menu__items__Group}
                        >
                        <span className={Styled.icon__items}><FiEdit/></span>
                        <p style={{transform: 'translateY(-2.5px)'}} >Chia sẻ lên bảng Feed</p>
                    </div>

                    <div
                        onClick={handleShareMess}
                        className={Styled.menu__items__Group}
                        >
                        <span className={Styled.icon__items}><AiOutlineMessage/></span>
                        <p style={{transform: 'translateY(-2.5px)'}} >Chia sẻ qua tin nhắn</p>
                    </div>

            </div>
        </>
    )
}

export function DropIcon(props) {
    const [showBoxDropdown, setShowBoxDropdown] = useState(false);
    const ref = useRef(false);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setShowBoxDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return ( () => {
            document.removeEventListener("mousedown", handleClickOutside)
        })

    }, [ref, setShowBoxDropdown]);
    return (
        <>
            <li className={Styled.button__dropdown__items} ref={ref}>
                <span className={Styled.icon__button} onClick={() => setShowBoxDropdown(!showBoxDropdown)}>
                    {props.icon}
                </span>
                {showBoxDropdown && props.children}
            </li>
        </>
    )
}

