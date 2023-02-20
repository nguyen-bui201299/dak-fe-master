import Link from "next/link";
import ButtonFollow from "../Button/ButtonFollow/ButtonFollow";
import Styles from "./PopupInteractive.module.css";
import { useState } from "react";
import mapTime from '../../modules/Time/mapTime';

import {
  FaRegHeart, // Tim
  FaHeart,
} from "react-icons/fa";
import { getCookieUserLogin } from "../../modules/Cookies/Auth/userLogin";


export default function PopupInteractive(props) {
  const userLogin = getCookieUserLogin();
  return (
    <div className={Styles.container}>
      <div className={Styles.overlay}
        onClick={() => {
          props.closePopup("");
        }}
      >

      </div>
      <div className={Styles.container__popup}>
        <div className={Styles.container__popup__icon}>
          <i
            className="fa fa-times"
            aria-hidden="true"
            onClick={() => {
              props.closePopup("");
            }}
          ></i>
        </div>
        <div className={Styles.container__popup__title}>
          {props.title} &#183; {props.count}
        </div>
        <div className={Styles.container__popup__list}>
          {props.title === "Follower" ? (
            <ul>
              {props.follower &&
                props.follower.map((user, index) => (
                  <li key={index}>
                    <div className={Styles["actual-people"]}>
                      <div className={Styles["people-items"]}>
                        <div className={Styles["people-images"]}>
                          <img
                            className={Styles["people-avatar"]}
                            src={user.avatar}
                            alt="Avatar"
                          />
                        </div>
                        <div className={Styles["people-name-follow"]}>
                          <div className={Styles["people-name"]}>
                            <Link href={`/otherprofile/${user.id}`} passHref>
                              <span>{user.name}</span>
                            </Link>
                          </div>
                          {/* <div className={Styles["people-follow"]}>
                            <span>1 Followers</span>
                          </div> */}
                        </div>
                      </div>
                      <div className={Styles['button-follow']}>
                      {props.currentLoginIdUser !== user.id ? <ButtonFollow
                        isFollow={user.has_follow}
                        id={user.id}
                        idx={index}
                      /> : ''}
                      
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          ) : props.title === "Following" ? (
            <ul>
              {props.following &&
                props.following.map((user, index) => (
                  <li key={index}>
                    <div className={Styles["actual-people"]}>
                      <div className={Styles["people-items"]}>
                        <div className={Styles["people-images"]}>
                          <img
                            className={Styles["people-avatar"]}
                            src={user.avatar}
                            alt="Avatar"
                          />
                        </div>
                        <div className={Styles["people-name-follow"]}>
                          <div className={Styles["people-name"]}>
                            <Link
                              passHref
                              href={`/otherprofile/${user.id}`}
                            >
                              <span>
                                {user.name}
                              </span>
                            </Link>
                          </div>
                          {/* <div className={Styles["people-follow"]}>
                            <span>1 Followers</span>
                          </div> */}
                        </div>
                      </div>
                      {/* <ButtonFollow isFollow={user.has_follow} id={user.user != undefined ? user.user.id : user.list_user_like.id} idx={index} /> */}
                      <div className={Styles['button-follow']}>
                      {user !== undefined &&
                        user.id !== userLogin.id && (
                          <ButtonFollow
                            isFollow={user.has_follow}
                            id={user.id}
                            idx={index}
                          />
                        )}
                      {user === undefined &&
                        user.id !== userLogin.id && (
                          <ButtonFollow
                            isFollow={user.has_follow}
                            id={user.id}
                            idx={index}
                          />
                        )}
                        </div>
                    </div>
                  </li>
                ))}
            </ul>
          ) : props.title === "Yêu thích" ? (
            <ul>
              {props.listUser &&
                props.listUser.data?.map((user, index) => (
                  <li key={index}>
                    <div className={Styles["actual-people"]}>
                      <div className={Styles["people-items"]}>
                        <div className={Styles["people-images"]}>
                          <img
                            className={Styles["people-avatar"]}
                            src={user.list_user_like?.avatar}
                            alt="Avatar"
                          />
                        </div>
                        <div className={Styles["people-name-follow"]}>
                          <div className={Styles["people-name"]}>
                            <Link
                              passHref
                              href={`/otherprofile/${user.list_user_like?.id}`}
                            >
                              <span>
                                {user.list_user_like?.name}
                              </span>
                            </Link>
                          </div>
                          {/* <div className={Styles["people-follow"]}>
                            <span>1 Followers</span>
                          </div> */}
                        </div>
                      </div>
                      {/* <ButtonFollow isFollow={user.has_follow} id={user.user != undefined ? user.user.id : user.list_user_like?.id} idx={index} /> */}
                      <div className={Styles['button-follow']}>
                      {user.list_user_like !== undefined &&
                        user.list_user_like?.id !== userLogin.id && (
                          <ButtonFollow
                            isFollow={user.list_user_like?.has_follow}
                            id={user.list_user_like?.id}
                            idx={index}
                          />
                        )}
                        </div>
                    </div>
                  </li>
                ))}
            </ul>
          ) : props.title === "Bình chọn" ? (
            <ul>
              {props.listUser &&
                props.listUser.data?.map((user, index) => (
                  <li key={index}>
                    <div className={Styles["actual-people"]}>
                      <div className={Styles["people-items"]}>
                        <div className={Styles["people-images"]}>
                          <img
                            className={Styles["people-avatar"]}
                            src={user.user?.avatar}
                            alt="Avatar"
                          />
                        </div>
                        <div className={Styles["people-name-follow"]}>
                          <div className={Styles["people-name"]}>
                            <Link
                              passHref
                              href={`/otherprofile/${user.user?.id}`}
                            >
                              <span>
                                {user.user?.name}
                              </span>
                            </Link>
                          </div>
                          {/* <div className={Styles["people-follow"]}>
                            <span>1 Followers</span>
                          </div> */}
                        </div>
                      </div>

                      <div className={Styles['button-follow']}>
                      {user.user !== undefined &&
                        user.user?.id !== userLogin.id && (
                          <ButtonFollow
                            isFollow={user.user?.has_follow}
                            id={user.user?.id}
                            idx={index}
                          />
                        )}
                        </div>
                    </div>
                  </li>
                ))}
            </ul>
          ) : props.title === "Chia sẻ" ? (
            <ul>
              {props.listUser &&
                props.listUser.data?.map((user, index) => (
                  <li key={index}>
                    <div className={Styles["actual-people"]}>
                      <div className={Styles["people-items"]}>
                        <div className={Styles["people-images"]}>
                          <img
                            className={Styles["people-avatar"]}
                            src={user.list_user_like?.avatar}
                            alt="Avatar"
                          />
                        </div>
                        <div className={Styles["people-name-follow"]}>
                          <div className={Styles["people-name"]}>
                            <Link
                              passHref
                              href={`/otherprofile/${user.list_user_like?.id}`}
                            >
                              <span>
                                {user.list_user_like?.name}
                              </span>
                            </Link>
                          </div>
                          <div className={Styles["people-follow"]}>
                            <span>1 Followers</span>
                          </div>
                        </div>
                      </div>
                      {/* <ButtonFollow isFollow={user.has_follow} id={user.user != undefined ? user.user.id : user.list_user_like?.id} idx={index} /> */}
                      <div className={Styles['button-follow']}>
                      {user.list_user_like !== undefined &&
                        user.list_user_like?.id !== userLogin.id && (
                          <ButtonFollow
                            isFollow={user.list_user_like?.has_follow}
                            id={user.list_user_like?.id}
                            idx={index}
                          />
                        )}
                        </div>
                    </div>
                  </li>
                ))}
            </ul>
          ) : props.title === "Bình luận" ? (
            // <ul>
            //   {props.listUser &&
            //     props.listUser.data?.map((user, index) => (
            //       <li key={index}>
            //         <div className={Styles["actual-people"]}>
            //           <div className={Styles["people-items"]}>
            //             <div className={Styles["people-images"]}>
            //               <img
            //                 className={Styles["people-avatar"]}
            //                 src={user.list_user_like?.avatar}
            //                 alt="Avatar"
            //               />
            //             </div>
            //             <div className={Styles["people-name-follow"]}>
            //               <div className={Styles["people-name"]}>
            //                 <Link
            //                   passHref
            //                   href={`/otherprofile/${user.list_user_like?.id}`}
            //                 >
            //                   <span>
            //                     {user.list_user_like?.name}
            //                   </span>
            //                 </Link>
            //               </div>
            //               <div className={Styles["people-follow"]}>
            //                 <span>1 Followers</span>
            //               </div>
            //             </div>
            //           </div>
            //           {/* <ButtonFollow isFollow={user.has_follow} id={user.user != undefined ? user.user.id : user.list_user_like?.id} idx={index} /> */}
            //           <div className={Styles['button-follow']}>
            //           {user.list_user_like !== undefined &&
            //             user.list_user_like?.id !== userLogin.id && (
            //               <ButtonFollow
            //                 isFollow={user.list_user_like?.has_follow}
            //                 id={user.list_user_like?.id}
            //                 idx={index}
            //               />
            //             )}
            //             </div>
            //         </div>
            //       </li>
            //     ))}
            // </ul>
            <>

              {/* {props.isReply &&
                <div style={{ fontSize: '13px', padding: '0 0 5px 18px', color: 'var(--text-color)' }}>
                  Đang phản hồi
                  <span style={{ color: 'var(--main-text)', fontWeight: '700' }}> {props.usernameComment} </span>
                  &#183;
                  <span style={{ cursor: 'pointer', fontWeight: '400' }} onClick={props.handleCancelReply}> Hủy </span>
                </div>
              } */}

              {/* {props.hide === undefined && props.hide !== "hide" &&
                <div className={Styles.reaction__comment__post} style={{position: 'relative'}}>
                  <div className={Styles.reaction__comment__avatar}>
                    <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={props.myAvatar} alt='' />
                  </div>
                  <div className={Styles.reaction__comment__input} ref={props.menuRef} >
                    <input
                      id={props.post.post.id}
                      type="text"
                      value={props.inputStr}
                      ref={props.inputRef}
                      onChange={props.handleChangeEmoji}
                      onKeyDown={e => props.handlePostComment(e)}
                      placeholder={props.content.comment_input_comment} />
                    {!props.isMoblie && <i className="fa-regular fa-face-grin-wide" onClick={() => setShowPicker(val => !val)}></i>}
                    <i style={props.inputStr ? {} : { cursor: 'default' }} className="fa fa-paper-plane" aria-hidden="true" onClick={props.isReply ? props.handleSendReply : props.handleSendComment}></i>
                    {showPicker && 
                      <div className={Styles.reaction__box_emoji}>
                        <AiOutlineClose 
                          type='button' 
                          className={Styles.reaction__close_icons}
                          onClick={() => setShowPicker(val => !val)} 
                        />
                        <Picker 
                          pickerStyle={{width: '100%',paddingTop : '20px' }}
                          onEmojiClick={props.onEmojiClick} 
                        />
                      </div>
                    }
                  </div>
                </div>
              } */}

              {props.comments.map((comment, index) => (
                <div key={index}>
                  <div className={Styles.profile__comment__heading}>
                    <div className={Styles.profile__comment__avatar}>
                      {/* <Image src={Logo} alt="Avatar" /> */}
                      <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={comment.owner.avatar} alt='' />
                    </div>
                    <div className={Styles.profile__comment__info}>
                      <div className={Styles.profile__comment__infoheading}>
                        {
                          comment.owner.id === userLogin.id
                            ? <Link href={`/profile`} passHref>
                              <h2 style={{ cursor: 'pointer' }}>{comment.owner.name}</h2>
                            </Link>
                            : <Link href={`/otherprofile/${comment.owner.id}`} passHref>
                              <h2 style={{ cursor: 'pointer' }}>{comment.owner.name}</h2>
                            </Link>
                        }
                        <div className={Styles.profile__comment__global}>{comment.comment.updated_at === comment.comment.created_at ? mapTime(comment.comment.created_at) : `Đã chỉnh sửa ${mapTime(comment.comment.updated_at)}`}</div>
                      </div>

                      {/* {props.editedComment.id === comment.comment.id ?
                        <div style={{ marginLeft: '0' }} className={Styles.reaction__comment__input} ref={editCmt}>
                          <input
                            id={comment.comment.id}
                            type="text"
                            value={props.editedComment.content}
                            onChange={e => props.hanhdleChangeEditedComment(e)} 
                            onKeyDown={(e) => props.KeyEditComment(e,comment.comment.id)}
                          />
                          {!props.isMoblie && <i className="fa-regular fa-face-grin-wide" onClick={() => props.setShowPicker(val => !val)}></i>}
                          <i style={props.editedComment.content ? {} : { cursor: 'default' }} className="fa fa-paper-plane" aria-hidden="true" onClick={() => handleSendEditComment(comment.comment.id)}></i>
                          {props.showPickerReply && 
                          <div className={Styles.reaction__box_emoji_reply}>
                            <AiOutlineClose 
                              type='button' 
                              className={Styles.reaction__close_icons}
                              onClick={() => props.setShowPickerReply(val => !val)} 
                            />
                            <Picker
                              pickerStyle={{paddingTop: '25px', width: '100%' }}
                              onEmojiClick={props.onEmojiClickOnEditedComment} />
                          </div>
                            }
                        </div> :
                        <p>{comment.comment.content}</p>
                      } */}
                      <p>{comment.comment.content}</p>

                      {/* <div className={Styles.profile__comment__actions_container}>
                        <div className={Styles.profile__comment__actions} onClick={() => props.handleReply(comment.comment.id, comment.owner.name)}>{props.content.comment_reply}</div>
                        {getCookieUserLogin().id === comment.owner.id &&
                          <>
                            {props.editedComment.id === comment.comment.id  ?
                              <div style={{ color: '#746e6e', fontSize: '12px', fontWeight: '500', cursor: 'pointer', margin: '3px 0 0 20px' }} onClick={() => handleCancelEditComment()}>{props.content.comment_stop_edit}</div> 
                              :
                              <div style={{ color: '#746e6e', fontSize: '12px', fontWeight: '500', cursor: 'pointer', margin: '3px 0 0 20px' }} onClick={() => handleEditComment(comment.comment.id, comment.comment.content)}>{props.content.comment_edit}</div>
                            }

                            <div style={{ color: '#746e6e', fontSize: '12px', fontWeight: '500', cursor: 'pointer', margin: '3px 0 0 20px' }} onClick={() => handleDeleteComment(comment.comment.id)}>{props.content.comment_delete}</div>
                          </>
                        }
                      </div> */}
                    </div>
                    {props.editedComment.id !== comment.comment.id ?
                      <div className={Styles.reaction__icon}>
                        <div style={{ color: comment.has_like ? '#f9d205' : 'white' }} onClick={() => { props.handleHeartComment(comment, props.comments.length) }}>
                          {comment?.has_like
                            ? <FaHeart />
                            : <FaRegHeart />
                          }
                        </div>
                        <label style={{ color: 'var(--text-color)', fontSize: '10px', padding: '0 0 20px 5px' }}>{comment.has_like ? 1 : 0}</label>
                      </div> :
                      null
                    }
                  </div>
                  {comment.reply_comment.length !== 0 &&
                    comment.reply_comment.map((reply, index) => (
                      <div key={index} className={Styles.profile__reply__heading}>
                        <div className={Styles.profile__comment__avatar}>
                          <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={reply.owner.avatar} alt='' />
                        </div>
                        <div className={Styles.profile__comment__info}>
                            <div className={Styles.profile__comment__infoheading}>
                            <h2 style={{ cursor: 'pointer' }}>{reply.owner.name}</h2>
                            <div className={Styles.profile__comment__global}>{mapTime(reply.comment.created_at)}</div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            {/* {props.editedReplyComment.idRep === reply.comment.id ?
                              <div style={{ marginLeft: '0' }} className={Styles.reaction__comment__input}>
                                <textarea
                                  id={reply.comment.id}
                                  type="text"
                                  value={props.editedReplyComment.content}
                                  onChange={e => props.hanhdleChangeEditedReplyComment(e)}></textarea>
                              {!props.isMoblie && <i className="fa-regular fa-face-grin-wide" onClick={() => props.setShowPicker(val => !val)}></i>}
                                <i style={props.editedReplyComment.content ? {} : { cursor: 'default' }} className="fa fa-paper-plane" aria-hidden="true" onClick={() => props.handleSendEditReplyComment(reply.comment.id)}></i>
                                {props.showPicker && <Picker
                                  pickerStyle={{ width: '40%', position: 'absolute', zIndex: 1 }}
                                  onEmojiClick={props.onEmojiClickOnEditedReplyComment} />}
                              </div> :
                              <p>{reply.comment.content}</p>
                            } */}

                            <p>{reply.comment.content}</p>

                            {/* {editedReplyComment.idRep !== reply.comment.id ?
                              <div className={Styles.reaction__icon} onClick={() => handleDeleteReplyComment(reply.comment.id, comment.comment.id)}>
                                {idUser === post.owner.id
                                  ? <i style={{ cursor: 'pointer', fontSize: '15px' }} className="fa fa-trash" aria-hidden="true"></i>
                                  : (idUser === comment.owner.id ? <i style={{ cursor: 'pointer', fontSize: '15px' }} className="fa fa-trash" aria-hidden="true"></i> : null)}
                              </div> :
                              null
                            } */}
                          </div>
                          {/* <div style={{ display: 'flex' }}>
                            <div className={Styles.profile__comment__actions} onClick={() => props.handleReply(comment.comment.id, comment.owner.name)}>{props.content.comment_reply}</div>
                            {getCookieUserLogin().id === reply.owner.id &&
                                  <>
                                    {props.editedReplyComment.idRep === reply.comment.id ?
                                      <div className={Styles.profile__comment__actions} onClick={() => props.handleCancelEditReplyComment()}>{props.content.comment_stop_edit}</div> 
                                      :
                                      <div className={Styles.profile__comment__actions} onClick={() => props.handleEditReplyComment(comment.comment.id, reply.comment.content, reply.comment.id)}>{props.content.comment_edit}</div>
                                    }
                                    <div className={Styles.profile__comment__actions} onClick={() => props.handleDeleteReplyComment(reply.comment.id, comment.comment.id)}>{props.content.comment_delete}</div>
                                  </>
                            }
                          </div> */}
                        </div>
                      </div>
                    ))
                  }

                  {comment.has_more_reply_comment && !props.listReply.find(rep => rep.idCmt === comment.comment.id) &&
                    <div style={{ padding: '0px 20px 10px 62px', fontSize: '13px', color: 'var(--main-color)' }}>
                      <span style={{ cursor: 'pointer' }} onClick={() => props.handleLoadMoreReply(comment.comment.id)}>{content.comment_more_comments}</span>
                    </div>
                  }
                </div>
              ))
              }

              
            </>
          )
          : ''
          
          
          }

        </div>
              {(props.loaderWheel) &&
                  <div className={Styles.loader}>
                    <div className={Styles.loader_wheel}></div>
                    <p>
                      <span>{props.content.comment_loading}</span>
                      <span className={Styles.dotload}></span>
                    </p>
                  </div>
              }


              {(props.buttonLoadCmt && !props.loadingComment.current) ?
                  <div className={Styles.reaction__comment__load} onClick={props.handleLoadComment}>
                    <span style={{ cursor: 'pointer' }}>{props.content.comment_more_comments}</span>
                  </div>
                  : null
              }
      </div>
    </div>
  );
}
