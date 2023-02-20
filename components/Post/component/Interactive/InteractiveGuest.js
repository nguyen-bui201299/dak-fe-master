import React from 'react'
import { FaHeart, FaRegCommentDots } from 'react-icons/fa'
import DropdownShare from '../../../Dropdown/Dropdown-Share-Post/Dropdown'
import Styles from './Interactive.module.css'
const InteractiveGuest = ({post}) => {
  const handleClickReaction = () =>{
    location.replace('/login')
  }
  return (
    <>
      <div className={Styles.reaction__title}>
          <label className={Styles.reaction__like} onClick = {handleClickReaction}>{post.like_count} likes</label>
          <label className={Styles.reaction__vote} onClick = {handleClickReaction}>{post.vote_count} votes</label>
          <label className={Styles.reaction__comment} onClick = {handleClickReaction}>{ post.comment_count} comments</label>
          <label className={Styles.reaction__share} onClick = {handleClickReaction}>{post.share_count} share</label>
        </div>
        <div className={Styles.reaction}>
        <div className={Styles.reaction__icon} onClick = {handleClickReaction}>
           <FaHeart />
        </div>
        <div className={`${Styles.reaction__icon} ${Styles.reaction__icon_unvoted}`} onClick = {handleClickReaction}>
          vote
        </div>
        <div className={Styles.reaction__icon} onClick = {handleClickReaction}>
          <FaRegCommentDots />
        </div>
        <div className={Styles.reaction__icon} onClick = {handleClickReaction}>
          <DropdownShare />
        </div>
      </div>
    </>
  )
}

export default InteractiveGuest