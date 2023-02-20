import { useState, useEffect, useRef } from 'react';
import Head from "next/head";
import Styles from "./Interactive.module.css";
import dynamic from 'next/dynamic';
import ModalVote from '../../../Modal/Modal-Voted/ModalVote'
import mapTime from '../../../../modules/Time/mapTime';
import { getCookieUserLogin, getTokenUserLogin } from '../../../../modules/Cookies/Auth/userLogin';
import { ToastContainer } from 'react-toastify';
import { SuccessNotification, ErrorNotification, NotificationToast } from "../../../../modules/Notification/Notification";
import API, { endpoints, headers } from "../../../../API";
import PopupInteractive from '../../../PopupInteractive';
import io from "socket.io-client";
import {AiOutlineClose} from 'react-icons/ai'
import DropdownShare from '../../../Dropdown/Dropdown-Share-Post/Dropdown';
import LibraryAlbum from "../../../LibraryAlbum/LibraryAlbum"

const socket = io.connect(
  "http://chat.dakshow.com", {
  transports: ["websocket"],
  auth: {
    token: getTokenUserLogin(),
  }
})


import {
  FaRegHeart, // Tim
  FaHeart,
  FaRegCommentDots,
  FaVoteYea
} from "react-icons/fa";
import { MdOutlineHowToVote } from "react-icons/md"
import Link from 'next/link';
import DeleteCommentDialog from '../../../DeleteCommentDialog/DeleteCommentDialog';
import DeleteRepCommentDialog from '../../../DeleteRepCommentDialog/DeleteRepCommentDialog';
import FormSharePost from '../../../FormSharePost/FormSharePost';
import { BsFillBookmarkFill } from 'react-icons/bs';

const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });


export default function Interactive({ hide, post, LibraryIds,
  postID,
  showlib,
  open,
  setOpen1,
  HandelshowReadLib,
  HandleToAlbum,
  ShowsetRender,}) {

  // Emoji
  let value = false // showPicker
  let menuRef = useRef();
  let editCmt = useRef();
  let editReplyCmt = useRef()
  const inputRef = useRef();
  const [inputStr, setInputStr] = useState('');
  const [showPicker, setShowPicker] = useState( { 
    comment:{isShow:false},
    editComment:{isShow:false},
    replyComment:{isShow:false},
    editReplyComment:{isShow:false}
  });

  const [Heart, setHeart] = useState(0)
  const [isHeart, setIsHeart] = useState(false)
  const [numHeart, setNumHeart] = useState({
    count: 0,
    isLike: false,
  });

  const [Vote, setVote] = useState(0)
  const [isVote, setIsVote] = useState(false)
  const [showVoteDialog, setShowVoteDialog] = useState(false)

  const [Share, setShare] = useState(0)
  const [showFormSharePost, setShowFormSharePost] = useState(false)
  const [idPost, setIdPost] = useState('')
  const [sharedPost, setSharedPost] = useState('')
  // console.log(post);

  const [popupInteractive, setPopupInteractive] = useState('');
  const [listUser, setListUser] = useState([]);

  //comment function
  const [numCmts, setNumCmts] = useState(0);
  const [addCmt, setAddCmt] = useState(false);
  const [comment, setComment] = useState(0);
  const [comments, setComments] = useState([]);
  const [cId, setCId] = useState('')
  const [showDeleteCommentDialog, setShowDeleteCommentDialog] = useState(false)

  const [editedComment, setEditedComment] = useState({})
  const [editedReplyComment, setEditedReplyComment] = useState({})

  // const [heartComment, setHeartComment] = useState(0)
  // const [isHeartComment, setIsHeartComment] = useState(false)

  const [isReply, setIsReply] = useState(false)               //su dung cho reply comment
  const [idComment, setIdComment] = useState('')              //su dung cho reply comment
  const [usernameComment, setUsernameComment] = useState('')  //su dung cho reply comment
  const [listReply, setListReply] = useState([])              //su dung cho reply comment
  const [temp, setTemp] = useState([])                        //su dung cho reply comment
  const [repCId, setRepCId] = useState('')
  const [showDeleteRepCommentDialog, setShowDeleteRepCommentDialog] = useState(false)

  const pageNumber = useRef(1);
  const loadingComment = useRef(false);
  const isLoadCmt = useRef(false);
  const cmtAfterLoaded = useRef(false);
  const status = useRef(true);
  const limitCurrent = useRef(3);
  const [buttonLoadCmt, setButtonLoadCmt] = useState(false);
  const [connectRealtimeCmt, setConnectRealtimeCmt] = useState(false);
  const [loaderWheel, setLoaderWheel] = useState(false);
  const [typing, setTyping] = useState(false);
  const [lang, setLang] = useState("")

  const [isMoblie, setIsMoblie] = useState(false);

  const [isMessSharing, setIsMessSharing] = useState(false);

  useEffect(() => {
    API.get(endpoints['getDetailPost'](post.post.id), { headers: headers.headers_token })
    .then(res => {
      setNumCmts(res.data.comment_count);
      setNumHeart({count: res.data.like_count, isLike: res.data.has_like});
    })
    .catch(err => {})
  }, [addCmt, isHeart])

  useEffect(() => {
    const handeResize = () =>{
      if(window.innerWidth < 800){
       setIsMoblie(true)
      }
      else{
        setIsMoblie(false)
      }
    }
    handeResize();

    window.addEventListener("resize" , handeResize)

    return () =>{
      window.removeEventListener("resize",handeResize)
    }
  }, []);

  const userLogin = getCookieUserLogin()


    const [content, setContent] = useState({});

    useEffect(() => {
        if(userLogin.language!== undefined) {
            setContent(require(`../../languages/${userLogin.language}.json`));
        }
        if(userLogin.language === "en") {
          setLang("en")
        }
        else if(userLogin.language === "cn") {
          setLang("cn")
        }
        else if(userLogin.language === "id") {
          setLang("id")
        }
        else if(userLogin.language === "in") {
          setLang("in")
        }
        else if(userLogin.language === "phi") {
          setLang("phi")
        }
        else if(userLogin.language === "th") {
          setLang("th")
        }
        else {
          setLang("vn")
        }
    }, [userLogin])

  //get comments
  const findComment = (id, page = 1, limit = 3) => {

    loadingComment.current = true;
    setLoaderWheel(true);

    API.get(endpoints['findComment'](id, page, limit), { headers: headers.headers_token })
      .then((response) => {
        if (response.data.success) {
          if (response.data.data.length > 0) {

            let newCmt = [];
            let index = 0;
            while (newCmt.length < 3 && index < response.data.data.length) {
              let checkCmt = comments.find(comment => comment.comment.id === [...response.data.data][index].comment.id);
              if (!checkCmt) {
                newCmt.push(response.data.data[index]);
              }
              index++;
            }
            setComments(prev => {
              
              if(response.data.data.length >= 3){
                loadingComment.current = false;
              }else{
                loadingComment.current = true;
              }
            
              if(isLoadCmt.current){
                isLoadCmt.current = false;
                return [...prev, ...response.data.data]
              }else{
                cmtAfterLoaded.current = true;
                return response.data.data;
              }
              
            });
            if (index >= response.data.data.length) {
              setButtonLoadCmt(false)
            } else {
              setButtonLoadCmt(true)
            }

          } else {
            setButtonLoadCmt(false)
            isLoadCmt.current = false;
            loadingComment.current = true;
          }
        } else {
          loadingComment.current = false;
        }
        setLoaderWheel(false);
      })
      .catch((error) => {
        loadingComment.current = false;
        setLoaderWheel(false);
      })
  }
  //check comments
  const checkCmt = async (id, page, limit) => {
    try {
      const res = await API.get(endpoints['findComment'](id, page, limit), { headers: headers.headers_token });
      if (res.data.length > 0) {
        return true;
      }
      else {
        return false;
      }
    } catch (error) {}
  }

  //Hien thi 3 binh luan dau tien
  useEffect(() => {
    checkCmt(post.post.id, 2, 3)
      .then(res => {
        status.current = res;
      })
      .catch(err => {});

    findComment(post.post.id, 1, 3);
  }, [post])

  useEffect(() => {
    setIsHeart(post.has_like)
  }, [post])

  // Click outside to close Emoji
  useEffect(() =>{
    let handler = event =>{
      // Nếu menu đang mở và click bên ngoài khu vực container của box emoji thì tắt
      if(menuRef.current && !menuRef.current.contains(event.target)){
        setShowPicker({...showPicker, comment:{isShow:false}});
      }
      if(editCmt.current && !editCmt.current.contains(event.target)){
        setShowPicker({...showPicker, editComment:{isShow:false}});
      }
      if(editReplyCmt.current && !editReplyCmt.current.contains(event.target)){
        setShowPicker({...showPicker, editReplyComment:{isShow:false}});
      }
    };
    document.addEventListener("click", handler);
    return () =>{
      document.removeEventListener("click", handler);
    }
  }, [])

  // Add emoji at any position in the input
  const handleChangeEmoji = e =>{
    handleCommenting(e.target.value)
    setInputStr(e.target.value);
  }
  const [cursorPos, setCursorPos] = useState();
  const onEmojiClick = (event, emojiObject) => {
    
    const ref = inputRef.current;
    const start =  inputStr.substring(0,ref.selectionStart);
    const end =  inputStr.substring(ref.selectionEnd);
    
    const newVal = start + emojiObject.emoji + end;
    ref.focus();
    setInputStr(newVal);
    inputRef.current.selectionEnd = start.length + emojiObject.emoji.length
    setCursorPos(start.length + emojiObject.emoji.length)
  };
useEffect(() => {
  inputRef.current.selectionEnd = cursorPos
}, [cursorPos]);

  //Send comment
  const handleSendComment = async (value) => {
    if (inputStr || value) {
      try {
        const res = await API.post(endpoints["commentPost"], { content: inputStr || value, post_id: post.post.id }, { headers: headers.headers_token });
        if (res) {
          let user = getCookieUserLogin();
          // setComments(prev => {

          //   return [
          //     {
          //       "comment": {
          //         "id": res.data.id,
          //         "updated_at": res.data.updated_at,
          //         "content": res.data.content
          //       },
          //       "owner": {
          //         "id": user.id,
          //         "name": user.name,
          //         "status": user.status,
          //         "avatar": user.avatar,
          //         "sex": user.sex,
          //         "birthday": user.birthday,
          //       },
          //       "reply_comment": [],
          //       "has_more_reply_comment": false
          //     }
          //     , ...prev
          //   ]
            
          // });
          // setComment(prev => prev + 1)
          socket.emit("comment",
            {
              id_comment: res.data.id,  //ID CMT vừa tạo ra
              user_id: user.id,        //Id người cmt
              post_id: post.post.id,        //ID POST 
              comment: res.data.content,        //Nội dung cmt
              created_at: res.data.created_at,  //Thời gian tạo
              reply: false,            //Có phải cmt rep ko => true hoặc false
              id_comment_replied: "" //ID bình luận được trả lời   => reply ? id_comment_replied : ""
            }
          )

          socket.emit("typing",
            {
              post_id: post.post.id,
              typing: false
            }
          )

        }
        setAddCmt(prev => !prev);
        limitCurrent.current += 1;
        setInputStr('');
        status.current = await checkCmt(post.post.id, 2, comments.length + 1);
        // findComment(post.post.id, 1, comments.length + 1);
        findComment(post.post.id, 1, 3);
      } catch (error) {

        limitCurrent.current += 1;
        status.current = await checkCmt(post.post.id, 2, comments.length + 1);
        findComment(post.post.id, 1, comments.length + 1);
      }
    }
  }


  //Nhập thông tin socket gửi về
  useEffect(() => {
    if (connectRealtimeCmt) {
      socket.on("comment", (data) => {
        if (data.post_id === post.post.id) {
          API.get(endpoints['user/profile'](data.user_id), { headers: headers.headers_token })
            .then(res => {
              let usercmt = res;
              if (!data.reply) {
                setComments(prev => {

                  return [
                    {
                      "comment": {
                        "created_at": data.created_at,
                        "id": data.id_comment,
                        "content": data.comment,
                        "updated_at": data.created_at
                      },
                      "owner": {
                        "id": data.user_id,
                        "name": usercmt.data.data.name,
                        "status": usercmt.data.data.status,
                        "avatar": usercmt.data.data.avatar,
                        "sex": usercmt.data.data.sex,
                        "birthday": usercmt.data.data.birthday,
                      },
                      "reply_comment": [],
                      "has_more_reply_comment": false
                    }
                    , ...prev
                  ]
                });
              } else {



                setComments(prev => {
                  let listCommentRep = prev;
                  listCommentRep = listCommentRep.find(comment => comment.comment.id === data.id_comment_replied)?.reply_comment;


                  let indexCmt = -1;
                  prev.map((comment, index) => {
                    if (comment.comment.id == data.id_comment_replied) {
                      indexCmt = index;
                    }
                  })

                })
              }
            })
            .catch(err => {});
        }

      })
    }
  }, [connectRealtimeCmt])

  useEffect(() => {
    socket.on("delete_comment", (data) => {
      setComments(prev => {
        prev = prev.filter(comment => comment?.comment.id !== data.id_comment);
        let indexCmt = 0;
        while (indexCmt < prev.length) {
          prev[indexCmt].reply_comment = prev[indexCmt].reply_comment.filter(comment => comment?.comment.id !== data.id_comment);
          indexCmt++;
        }
        return prev;
      });
    }, [])



    socket.on("update_comment", (data) => {
      if (data.post_id === post.post.id) {
        if (!data.reply) {
          setComments(prev => {
            for (let i = 0; i < prev.length; i++) {
              if (prev[i].comment.id === data.id_comment) {
                prev[i].comment.content = data.content;
                prev[i].comment.updated_at = data.update_at;
                return [...prev]
                break;
              }
            }
          })
        } else {

          setComments((prev) => {
            for (let i = 0; i < prev.length; i++) {
              if (prev[i].comment.id === data.id_comment_replied) {
                for (let j = 0; j < prev[i].reply_comment.length; j++) {
                  if (prev[i].reply_comment[j].comment.id === data.id_comment) {
                    prev[i].reply_comment[j].comment.content = data.content;
                    prev[i].reply_comment[j].comment.updated_at = data.update_at;
                    return [...prev]
                    break;
                  }
                }
              }
            }
          })
        }
      }
    });
  }, [])

  //load more comments
  const handleLoadComment = () => {
    const limitComment = comments.length + 5;
    findComment(post.post.id, 1, limitComment);
    setConnectRealtimeCmt(true);
  }

  const handleHeartComment = (comment, limit) => {
    if (!comment.has_like) {

      API.post(endpoints["likeComment"], { type: 1, comment_id: comment.comment.id }, { headers: headers.headers_token })
        .then((res) => {
          if (res.data.success) {
            findComment(post.post.id, 1, limit);
          } else {}
        })
        .catch((err) => {})

    } else {

      API.post(endpoints["likeComment"], { type: 1, comment_id: comment.comment.id }, { headers: headers.headers_token })
        .then((res) => {

          findComment(post.post.id, 1, limit);

        })
        .catch((err) => {
          findComment(post.post.id, 1, limit);
        })

    }

  }

  //Mở chỉnh sửa bình luận
  const handleEditComment = (id, content) => {
    setEditedReplyComment({})
    setEditedComment({
      id,
      content
    })
  }

  //Hủy chinh sửa binh luan
  const handleCancelEditComment = () => {
    setEditedComment({})
  }

  //xu ly onChange tren input cua binh luan đang duoc chinh sua
  const hanhdleChangeEditedComment = (e) => {
    setEditedComment(prev => {
      prev.content = e.target.value;
      return { ...prev }
    })
  }

  //xu ly emoji tren input cua binh luan dang duoc sua doi
  const onEmojiClickOnEditedComment = (event, emojiObject) => {
    setEditedComment(prev => {
      prev.content += emojiObject.emoji
      return { ...prev }
    })
    setShowPicker({...showPicker, editComment:{isShow:false}});
  };

  //update comment
  const handleSendEditComment = () => {
    if (editedComment.content) {
      API.put(endpoints['updateComment'], { comment_id: editedComment.id , post_id: post.post.id, content: editedComment.content}, { headers: headers.headers_token })
        .then(res => {
          // console.log({
          //   id_comment: editedComment.id,
          //   post_id: post.post.id,
          //   content: editedComment.content,
          //   update_at: res.data.updated_at,
          //   reply: false,
          //   id_comment_replied: "",
          // })
          setEditedComment({})
          for (let i = 0; i < comments.length; i++) {
            if (comments[i].comment.id === editedComment.id) {
              setComments(prev => {
                prev[i].comment.content = editedComment.content
                return [...prev]
              })
              break;
            }
          }
          NotificationToast.fire({
            toast: true,
            position: 'top-right',
            icon: 'success',
            title: `${"Update comment success"}`,
          })
          socket.emit("update_comment",
            {
              id_comment: editedComment.id,
              post_id: post.post.id,
              content: editedComment.content,
              update_at: res.data.updated_at,
              reply: false,
              id_comment_replied: "",
            }
          )
        })
        .catch(err => {
          ErrorNotification('Lỗi')
        })
    } else {
      document.getElementById(id).focus()
    }
  }

  //Mở chỉnh sửa bình luận
  const handleEditReplyComment = (idCmt, content, idRep) => {
    setEditedComment({})
    setEditedReplyComment({
      idCmt,
      content,
      idRep
    })
  }

  //Hủy chinh sửa binh luan
  const handleCancelEditReplyComment = () => {
    setEditedReplyComment({})
  }

  //xu ly onChange tren input cua binh luan đang duoc chinh sua
  const hanhdleChangeEditedReplyComment = (e) => {
    setEditedReplyComment(prev => {
      prev.content = e.target.value;
      return { ...prev }
    })
  }

  //xu ly emoji tren input cua binh luan dang duoc sua doi
  const onEmojiClickOnEditedReplyComment = (event, emojiObject) => {
    setEditedReplyComment(prev => {
      prev.content += emojiObject.emoji
      return { ...prev }
    })
    setShowPicker({...showPicker, editReplyComment:{isShow:false}});
  };

  //update comment
  const handleSendEditReplyComment = (id) => {
    if (editedReplyComment.content) {
      API.put(endpoints['updateReplyComment'], { comment_id: editedReplyComment.idCmt, post_id: post.post.id, content: editedReplyComment.content, reply_comment_id: editedReplyComment.idRep }, { headers: headers.headers_token })
        .then(res => {
          setEditedReplyComment({})
          for (let i = 0; i < comments.length; i++) {
            if (comments[i].comment.id === editedReplyComment.idCmt) {
              for (let j = 0; j < comments[i].reply_comment.length; j++) {
                if (comments[i].reply_comment[j].comment.id === editedReplyComment.idRep) {
                  setComments(prev => {
                    prev[i].reply_comment[j].comment.content = editedReplyComment.content
                    return [...prev]
                  })
                  break;
                }
              }
            }
          }
          SuccessNotification('Sửa phản hồi thành công');
          socket.emit("update_comment",
            {
              id_comment: editedReplyComment.idRep,
              post_id: post.post.id,
              content: editedReplyComment.content,
              update_at: res.data.updated_at,
              reply: true,
              id_comment_replied: editedReplyComment.idCmt,
            }
          )
        })
        .catch(err => {
          ErrorNotification('Lỗi')
        })
    } else {
      document.getElementById(id).focus()
    }
  }

  //reply comment
  const handleReply = (id, name) => {
    setIsReply(true)
    setIdComment(id)
    setUsernameComment(name)
    document.getElementById(post.post.id).placeholder = 'Phản hồi bình luận...'
    document.getElementById(post.post.id).focus()
  }

  //send reply comment
  const handleSendReply = async () => {
    if (inputStr) {
      try {
        let user = getCookieUserLogin();
        const res = await API.post(endpoints["replyComment"], { content: inputStr, comment_id: idComment }, { headers: headers.headers_token });
        let listCommentRep = comments.find(comment => comment.comment.id === idComment)?.reply_comment;
        setComments(prev => {
          let indexCmt = -1;
          prev.map((comment, index) => {
            if (comment.comment.id == idComment) {
              indexCmt = index;
            }
          })
          // if (indexCmt >= 0) {
          //   prev[indexCmt].reply_comment = [{
          //     "comment": {
          //       "id": res.data.id,
          //       "updated_at": res.data.updated_at,
          //       "content": res.data.content
          //     },
          //     "owner": {
          //       "id": user.id,
          //       "name": user.name,
          //       "status": user.status,
          //       "avatar": user.avatar,
          //       "sex": user.sex,
          //       "birthday": user.birthday,
          //     },
          //     "reply_comment": [],
          //     "has_more_reply_comment": false
          //   }, ...listCommentRep]
          //   return [...prev];
          // }
          return [...prev];
        })
        setComment(prev => prev + 1)
        socket.emit("comment",
          {
            id_comment: res.data.id,  //ID CMT vừa tạo ra
            user_id: user.id,        //Id người cmt
            post_id: post.post.id,        //ID POST 
            comment: res.data.content,        //Nội dung cmt
            created_at: res.data.created_at,  //Thời gian tạo
            reply: true,            //Có phải cmt rep ko => true hoặc false
            id_comment_replied: idComment //ID bình luận được trả lời   => reply ? id_comment_replied : ""
          }
        )

        setConnectRealtimeCmt(true);

        setInputStr('');
        
        document.getElementById(post.post.id).placeholder = 'Viết bình luận...'
        setIsReply(false)

        // for(let i=0; i<listReply.length; i++){
        //   if(listReply[i].idCmt === idComment){
        //     if(!listReply[i].loadMore){
        //       API.get(endpoints['FindReplyComment'](idComment, listReply[i].data.length+3, 1), {headers : headers.headers_token})
        //         .then(res => {
        //           setListReply(prev => {
        //             prev[i].data = [...prev[i].data, ...res.data]
        //             return [...prev]
        //           })
        //         })
        //         .catch(err => {
        //           console.log(err)
        //         })
        //       return;
        //     }else{
        //       //truong hop loadMore = true
        //       API.get(endpoints['FindReplyComment'](idComment, 1, 1), {headers : headers.headers_token})
        //         .then(res => {
        //           API.get(endpoints['FindReplyComment'](idComment, res.data.pagination.totalPage, 1), {headers : headers.headers_token})
        //             .then(response => {
        //               setTemp(prev => {
        //                 // console.log([...prev, {idCmt: idComment, data: response.data.data}])
        //                 return [...prev, {idCmt: idComment, data: response.data.data}]
        //               })
        //             })
        //             .catch(err => {
        //               console.log(err)
        //             })
        //         })
        //         .catch(err => {
        //           console.log(err)
        //         })
        //       return;
        //     }
        //   }
        // }
        // for(let i=0; i<comments.length; i++){
        //   if(comments[i].comment.id === idComment){
        //     if(!comments[i].has_more_reply_comment){
        //       if(comments[i].reply_comment.length === 2){
        //         API.get(endpoints['FindReplyComment'](idComment, 3, 1), {headers : headers.headers_token})
        //           .then(res => {
        //             setListReply(prev => {
        //               return [...prev, {idCmt: idComment, data: res.data, loadMore: false}]
        //             })
        //           })
        //           .catch(err => {
        //             console.log(err)
        //           })
        //       }else{
        //         //truong hop co 0 -> 1 reply
        //         findComment(post.post.id, 1, comments.length);
        //       }
        //     }else{
        //       //truong hop co >= 3 reply
        //       API.get(endpoints['FindReplyComment'](idComment, 1, 1), {headers : headers.headers_token})
        //         .then(res => {
        //           API.get(endpoints['FindReplyComment'](idComment, res.data.pagination.totalPage, 1), {headers : headers.headers_token})
        //             .then(response => {
        //               setTemp(prev => {
        //                 return [...prev, {idCmt: idComment, data: response.data.data}]
        //               })
        //             })
        //             .catch(err => {
        //               console.log(err)
        //             })
        //         })
        //         .catch(err => {
        //           console.log(err)
        //         })
        //     }
        //   }
        // }

      } catch (error) {}
    }
  }
  //Huy bo reply comment
  const handleCancelReply = () => {
    document.getElementById(post.post.id).placeholder = 'Viết bình luận...'
    setIsReply(false)
  }

  //kiem tra so luong phan hoi
  const checkReplyToLoadMore = async (id, page, limit) => {
    try {
      const res = await API.get(endpoints['FindReplyComment'](id, page, limit), { headers: headers.headers_token })
      if (res.data.length !== 0) {
        return true
      } else {
        return false
      }
    } catch (err) {}
  }

  //Xem them phan hoi
  const handleLoadMoreReply = (id_comment, page = 2, limit = 2) => {
    API.get(endpoints['FindReplyComment'](id_comment, 1, 1000000), { headers: headers.headers_token })
      .then(response => {
        if (response.data.data.length > 0) {
          response.data.data = response.data.data.reverse()
          let listCommentRep = comments.find(comment => comment.comment.id === id_comment)?.reply_comment;
          let newCmt = [];
          let index = 0;
          while (newCmt.length < 5 && index < response.data.data.length) {
            let checkCmt = listCommentRep.find(comment => comment.comment.id === [...response.data.data][index].comment.id);
            if (!checkCmt) {
              newCmt.push(response.data.data[index]);
            }
            index++;
          }

          setComments(prev => {
            let indexCmt = -1;
            prev.map((comment, index) => {
              if (comment.comment.id == id_comment) {
                indexCmt = index;
              }
            })
            if (indexCmt >= 0) {
              prev[indexCmt].reply_comment = [...listCommentRep, ...newCmt]
            }
            if (index >= response.data.data.length) {
              prev[indexCmt].has_more_reply_comment = false;
            }
            return [...prev];
          })

        } else {}

      })
      .catch(err => {})

    setConnectRealtimeCmt(true);
  }

  //Click xoa comment
  const handleDeleteComment = (commentId) => {
    setShowDeleteCommentDialog(true)
    setCId(commentId)
  }

  //Dong y xoa comment
  const c_yes = (cid) => {
    if (cid !== undefined) {
      API.delete(endpoints["deleteComment"](cid), { headers: headers.headers_token })
        .then((res) => {
          if (res.data.success) {
            const temp = comments.filter(comment => comment?.comment.id !== cid)
            setComments(temp)
            setComment(prev => prev - 1)
            setShowDeleteCommentDialog(false);
            NotificationToast.fire({
              toast: true,
              position: "top-end",
              icon: "success",
              title: `Deleted success`,
            });
            socket.emit("delete_comment",
              {
                id_comment: cid,  //ID CMT vừa tạo ra
              }
            )

          }
        })
        .catch(err => {
          NotificationToast.fire({
            toast: true,
            position: "top-end",
            icon: "error",
            title: "Xoá bình luận thất bại",
          });
        })
    }
  }

  //Khong dong y xoa comment
  const c_cancle = () => {
    setShowDeleteCommentDialog(false)
  }

  //Click xoa reply comment
  const handleDeleteReplyComment = (replyCommentId, commentId) => {
    setShowDeleteRepCommentDialog(true)
    setCId(commentId)
    setRepCId(replyCommentId)
  }

  const rc_yes = (commentId, replyCommentId) => {
    if (commentId !== undefined && replyCommentId !== undefined) {
      API.delete(endpoints["deleteRepComment"](commentId, replyCommentId), { headers: headers.headers_token })
        .then((res) => {
          if (res.data.success) {
            setComment(prev => prev - 1)
            setShowDeleteRepCommentDialog(false)
            NotificationToast.fire({
              toast: true,
              position: "top-end",
              icon: "success",
              title: "Xoá phản hồi thành công",
            });
            setComments(prev => {
              let indexCmt = -1;
              prev.map((comment, index) => {
                if (comment.comment.id == commentId) {
                  indexCmt = index;
                }
              })
              if (indexCmt >= 0) {
                prev[indexCmt].reply_comment = prev[indexCmt].reply_comment.filter(comment => comment?.comment.id !== replyCommentId)
              }
              return [...prev];
            })
            socket.emit("delete_comment",
              {
                id_comment: replyCommentId,  //ID CMT vừa tạo ra
              }
            )
          }
        })
        .catch(err => {})
    }
  }

  const rc_cancle = () => {
    setShowDeleteRepCommentDialog(false)
  }

  const handleHeart = (post) => {
    // console.log(post)
    if (!isHeart) {
      API.post(endpoints["likePost"], { type: 1, post_id: post.post.id }, { headers: headers.headers_token })
        .then((res) => {
          if (res.data.success) {
            setIsHeart(prev => !prev);
            setHeart(prev => prev + 1)
            post.has_like = true
          }
        })
        .catch((err) => {})
    } else {
      API.post(endpoints["likePost"], { type: 1, post_id: post.post.id }, { headers: headers.headers_token })
        .then((res) => {
          if (res.data.success) {
            setHeart(prev => prev - 1)
            setIsHeart(prev => !prev)
            post.has_like = false
          }
        })
        .catch((err) => {})
    }
  }

  const handleVote = (post) => {
    if (post.has_voted || isVote) {
      NotificationToast.fire({
        toast: true,
        position: 'top-right',
        icon: 'error',
        title: content.unvote,
    })
    } else {
      setShowVoteDialog(true)
      setIdPost(post.post.id)
    }
  }


  const v_yes = (id) => {
    API.post(endpoints["votePost"], { post_id: id }, { headers: headers.headers_token })
      .then((res) => {
        if (res.data.success === true) {
          setIsVote(true)
          setVote(prev => prev + 1)
          setShowVoteDialog(false)
          NotificationToast.fire({
            toast: true,
            position: 'top-right',
            icon: 'success',
            title: `${content.votesuccess}`,
        })
        }
        if (res.data.success === false) {
          NotificationToast.fire({
            toast: true,
            position: 'top-right',
            icon: 'error',
            title: `${content.votefail}`,
        })
        }
      })
      .catch((err) => {})
  }

  const v_cancle = () => {
    setShowVoteDialog(false)
  }


  const acceptShare = (caption, post) => {
    // console.log(post.post.id)
    // console.log(post.post.caption)
    setShowFormSharePost(false)
    API.post(endpoints["sharePost"], { caption: 'Đây là bài share #test', post_id: post.post.id, tag_friend: [] }, { headers: headers.headers_token })
      .then((res) => {
        if (res.data.success === true) {
          SuccessNotification('Bạn Đã Share Bài Viết')
          NotificationToast.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: `Shared success`,
          });
          setShare(prev => prev + 1)
        }
        if (res.data.success === false) {
          NotificationToast.fire({
            toast: true,
            position: "top-end",
            icon: "error",
            title: `Share failed`,
          });
        }
      })
      .catch((err) => {
        NotificationToast.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: `Share failed`,
        });
      })
  }

  const handleShowPopupInteractive = (str) => {
    setPopupInteractive(str)
  }

  useEffect(() => {
    if (popupInteractive === 'list-like') {
      API.get(endpoints.getListLikes(post.post.id), { headers: headers.headers_token })
        .then(res => {
          setListUser(res.data)
        })
        .catch(err => {})
    }
    else if (popupInteractive === 'list-vote') {
      API.get(endpoints.getListVotes(post.post.id), { headers: headers.headers_token })
        .then(res => {
          setListUser(res.data)
        })
        .catch(err => {})
    }
  }, [popupInteractive])
  // Event Enter Post Commnet

  // Event Enter Edit
  const KeyEditComment = (e,idEditComment)=>{
        if(e.key === 'Enter'){
            handleSendEditComment()
        }
  }
  var last_clicked
  var clicked
  const handlePostComment = (e)=>{
    clicked = e.timeStamp - last_clicked
    last_clicked = e.timeStamp
    if(e.key === 'Enter'){
      setShowPicker({...showPicker, comment:{isShow:false}});
      if(clicked > 200 || isNaN(clicked) == true){
        if(isReply){
            handleSendReply()
        }else{
            handleSendComment(e)
        }
      }
    }
  }
  
  const handleCommenting = (e) => {
    setInputStr(e)
    let user = getCookieUserLogin();
    socket.emit("typing",
      {
        user_id: user.id,
        post_id: post.post.id,
        typing: e ? true : false
      }
    )
  }

  useEffect(() => {
    if (connectRealtimeCmt) {
      let user = getCookieUserLogin();
      socket.on("typing", (data) => {
        if(data.post_id === post.post.id && data.user_id !== user.id){
          setTyping(data.typing)
        }
      })
    }
  }, [connectRealtimeCmt])

  useEffect(() => {
    // Nhập ký tự đặc biệt và trả về emoji tương ứng
    var map = {
      "<3": "\u2764\uFE0F",
      "</3": "\uD83D\uDC94",
      ":D": "\uD83D\uDE00",
      ":)": "\uD83D\uDE03",
      ";)": "\uD83D\uDE09",
      ":(": "\ud83d\ude1e",
      ":p": "\uD83D\uDE1B",
      ";p": "\uD83D\uDE1C",
      ":'(": "\uD83D\uDE22",
      "T_T": "\ud83d\ude2d",
      "8)": "\ud83d\ude0e",
      "-_-": "\ud83d\ude11",
      ">_<": "\ud83d\ude16",
      ".3.": "\ud83d\ude17",
      "3<3": "\ud83d\ude18",
      "^3^": "\ud83d\ude19",
    };

    function escapeSpecialChars(regex) {
      return regex.replace(/([()[{*+.$^\\|?])/g, '\\$1');
    }
    inputRef.current.oninput = function() {
      for (var i in map) {
        var regex = new RegExp(escapeSpecialChars(i), 'gim');
        this.value = this.value = this.value.replace(regex, map[i]);
        setInputStr(this.value)
      }
    };
  }, [inputStr])

  return (

    <>
      {showDeleteCommentDialog ? <DeleteCommentDialog yes={c_yes} cancle={c_cancle} id={cId} /> : <></>}
      {showDeleteRepCommentDialog ? <DeleteRepCommentDialog yes={rc_yes} cancle={rc_cancle} cid={cId} repcid={repCId} /> : <></>}
      {showVoteDialog ? <ModalVote yes={v_yes} cancle={v_cancle} id={idPost} /> : <></>}
      <Head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </Head>
      <ToastContainer style={{ color: 'green' }} />
      {/* Quảng cáo */}
      {/* {
        post.post.post_url_type !== 'normal' && 
          <div className={Styles.reaction__advertisement}>
            <img src="https://afamilycdn.com/150157425591193600/2021/10/4/phim-kingdom-vuong-trieu-xac-song-phan-1-2-full-hd-vietsub-1-16333243807721978567362-0-0-394-630-crop-1633326547679730083843.jpg" alt=""/>
          </div>
      } */}
      {popupInteractive === 'list-like' && Heart + post.like_count !==0 && <PopupInteractive title='Yêu thích' count={Heart + post.like_count} closePopup={handleShowPopupInteractive} listUser={listUser} />}
      {popupInteractive === 'list-vote' && Vote + post.vote_count !==0 && <PopupInteractive title='Bình chọn' count={Vote + post.vote_count} closePopup={handleShowPopupInteractive} listUser={listUser} />}
      {popupInteractive === 'list-comment' && comment + post.comment_count !==0 &&
        <PopupInteractive title='Bình luận' 
          count={comment + post.comment_count} 
          closePopup={handleShowPopupInteractive}
          hanhdleChangeEditedComment={hanhdleChangeEditedComment}
          KeyEditComment={KeyEditComment}
          onEmojiClickOnEditedComment={onEmojiClickOnEditedComment}
          hanhdleChangeEditedReplyComment={hanhdleChangeEditedReplyComment}
          onEmojiClickOnEditedReplyComment={onEmojiClickOnEditedReplyComment}
          handleReply={handleReply}
          handleHeartComment={handleHeartComment}
          handleSendEditReplyComment={handleSendEditReplyComment}
          handleCancelEditReplyComment={handleCancelEditReplyComment}
          handleEditReplyComment={handleEditReplyComment}
          handleDeleteReplyComment={handleDeleteReplyComment}
          handleLoadMoreReply={handleLoadMoreReply}
          handleLoadComment={handleLoadComment}
          handleCancelReply={handleCancelReply}
          handleChangeEmoji={handleChangeEmoji}
          handlePostComment={handlePostComment}
          handleSendReply={handleSendReply} 
          handleSendComment={handleSendComment}
          onEmojiClick={onEmojiClick}
          comments={comments}
          content={content}
          usernameComment={usernameComment}
          editedComment={editedComment}
          isMoblie={isMoblie}
          loaderWheel={loaderWheel}
          loadingComment={loadingComment}
          buttonLoadCmt={buttonLoadCmt}
          hide={hide}
          post={post}
        />
      }
      <div className={Styles.reaction__title}>
      </div>
      {hide === undefined && hide !== "hide" &&
      <div className={Styles.reaction}>

        <div className={Styles.reaction__wrap}>
          <div className={`${Styles.reaction__icon}`} style={{ color: numHeart.isLike ? '#f9d205' : '' }} onClick={() => handleHeart(post)}>
              {numHeart.isLike
                ? <FaHeart />
                : <FaRegHeart />}
          </div>
          <label className={Styles.reaction__like} onClick={() => { handleShowPopupInteractive('list-like') }}>{ numHeart.count }</label>
        </div>

        <div className={Styles.reaction__wrap}>
          <div className={` ${Styles.reaction__icon}
            ${post.has_voted ? Styles.reaction__icon_voted : `${Styles.reaction__icon} ${Styles.reaction__icon_unvoted}`}
            ${isVote ? Styles.reaction__icon_voted : `${Styles.reaction__icon} ${Styles.reaction__icon_unvoted}`}
            `} onClick={() => handleVote(post)}>
              {isVote ? 'VOTED' : post.has_voted ? 'VOTED' : 'VOTE'}
          </div>
          <label className={Styles.reaction__vote} onClick={() => { handleShowPopupInteractive('list-vote') }}>{Vote + post.vote_count}</label>
        </div>
       <div className={Styles.reaction__wrap}>
          <div className={Styles.reaction__icon}>
            {/* <AiOutlineShareAlt onClick={() => handleShare(post)} /> */}
            <DropdownShare post={post} setSharedPost={setSharedPost} setShowFormSharePost={setShowFormSharePost} setIsMessSharing={setIsMessSharing}/>
          </div>
          <label className={Styles.reaction__share} onClick={() => { handleShowPopupInteractive('list-share') }}>{Share + post.share_count}</label>   
       </div>

        <div className={`${Styles.reaction__wrap} ${Styles.reaction__wrap__cmt}`}>
          <div className={`${Styles.reaction__icon} ${Styles.reaction__icon__cmt}`}>
            <FaRegCommentDots  />
          </div>
            <label className={Styles.reaction__cmt}>{numCmts}</label> 
        </div>
        <div className={Styles.reaction__wrap}>
          <div onClick={HandleToAlbum} className={Styles.reaction__icon}>
            <BsFillBookmarkFill />
          <span className={Styles.reaction__icon__save}>Save</span>
          </div>
          </div>
      </div>
      }
      {LibraryIds && showlib && (
        <LibraryAlbum
          LibraryIds={LibraryIds}
          postID={postID}
          post={post}
          open={open}
          setOpen1={setOpen1}
          HandelshowReadLib={HandelshowReadLib}
          HandleToAlbum={HandleToAlbum}
          ShowsetRender={ShowsetRender}
        />
      )}
      {isReply &&
        <div style={{ fontSize: '13px', padding: '0 0 5px 18px', color: 'var(--text-color)' }}>
          Đang phản hồi
          <span style={{ color: 'var(--main-text)', fontWeight: '700' }}> {usernameComment} </span>
          &#183;
          <span style={{ cursor: 'pointer', fontWeight: '400' }} onClick={handleCancelReply}> Hủy </span>
        </div>
      }

      {hide === undefined && hide !== "hide" &&
      <div className={Styles.reaction__comment__post} style={{position: 'relative'}}>
        <div className={Styles.reaction__comment__avatar}>
          <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={getCookieUserLogin().avatar} alt='' />
        </div>
        <div className={Styles.reaction__comment__input} ref={menuRef} >
          <input
            id={post.post.id}
            type="text"
            value={inputStr}
            ref={inputRef}
            onChange={handleChangeEmoji}
            onKeyDown={e => handlePostComment(e)}
            placeholder={content.comment_input_comment} />
          {!isMoblie && <i className="fa-regular fa-face-grin-wide" onClick={() => setShowPicker({...showPicker, comment:{isShow: !showPicker.comment.isShow}})}></i>}
          <i style={inputStr ? {} : { cursor: 'default' }} className="fa fa-paper-plane" aria-hidden="true" onClick={isReply ? handleSendReply : handleSendComment}></i>
          {showPicker.comment.isShow && 
            <div className={Styles.reaction__box_emoji}>
              <AiOutlineClose 
                type='button' 
                className={Styles.reaction__close_icons}
                onClick={() => setShowPicker({...showPicker, comment:{isShow:false}})} 
              />
              <Picker 
                pickerStyle={{width: '100%',paddingTop : '20px' }}
                onEmojiClick={onEmojiClick} 
              />
            </div>
          }
        </div>
      </div>
      }

      {hide === undefined && hide !== "hide" &&
        <div className={Styles.list_comment_content}>
          {typing && 
          <>
          {lang === "en" && <div className={Styles.waviy}>
              <span style={{'--i':1}}>T</span>
              <span style={{'--i':2}}>y</span>
              <span style={{'--i':3}}>p</span>
              <span style={{'--i':4}}>i</span>
              <span style={{'--i':5}}>n</span>
              <span style={{'--i':6}}>g</span>
              <span style={{'--i':7}}>&nbsp;a</span>
              <span style={{'--i':8}}>&nbsp;c</span>
              <span style={{'--i':9}}>o</span>
              <span style={{'--i':10}}>m</span>
              <span style={{'--i':11}}>m</span>
              <span style={{'--i':12}}>e </span>
              <span style={{'--i':13}}>n</span>
              <span style={{'--i':14}}>t</span>
          </div>}

          {lang === "cn" &&
            <div className={Styles.waviy}>
              <span style={{'--i':1}}>输</span>
              <span style={{'--i':2}}>入</span>
              <span style={{'--i':3}}>评</span>
              <span style={{'--i':4}}>论</span>
            </div>
          }

          {lang === "id" &&
            <div className={Styles.waviy}>
              <span style={{'--i':1}}>M</span>
              <span style={{'--i':2}}>e</span>
              <span style={{'--i':3}}>n</span>
              <span style={{'--i':4}}>g</span>
              <span style={{'--i':5}}>e</span>
              <span style={{'--i':6}}>t</span>
              <span style={{'--i':7}}>i</span>
              <span style={{'--i':8}}>k</span>
              <span style={{'--i':9}}>&nbsp;k</span>
              <span style={{'--i':10}}>o</span>
              <span style={{'--i':11}}>m</span>
              <span style={{'--i':12}}>e</span>
              <span style={{'--i':13}}>n</span>
              <span style={{'--i':14}}>t</span>
              <span style={{'--i':15}}>a</span>
              <span style={{'--i':16}}>r</span>
            </div>
          } 

          {lang === "in" &&
            <div className={Styles.waviy}>
              <span style={{'--i':1}}>ए</span>
              <span style={{'--i':2}}>क</span>
              <span style={{'--i':3}}>&nbsp;टि</span>
              <span style={{'--i':4}}>प्प</span>
              <span style={{'--i':5}}>णी</span>
              <span style={{'--i':6}}>&nbsp;टा</span>
              <span style={{'--i':7}}>इ</span>
              <span style={{'--i':8}}>प</span>
              <span style={{'--i':9}}>&nbsp;क</span>
              <span style={{'--i':10}}>र</span>
              <span style={{'--i':11}}>ना</span>
            </div>
          }

          {lang === "phi" &&
            <div className={Styles.waviy}>
              <span style={{'--i':1}}>N</span>
              <span style={{'--i':2}}>a</span>
              <span style={{'--i':3}}>g</span>
              <span style={{'--i':4}}>t</span>
              <span style={{'--i':5}}>a</span>
              <span style={{'--i':6}}>-</span>
              <span style={{'--i':7}}>t</span>
              <span style={{'--i':8}}>y</span>
              <span style={{'--i':9}}>p</span>
              <span style={{'--i':10}}>e</span>
              <span style={{'--i':11}}>&nbsp;n</span>
              <span style={{'--i':12}}>g</span>
              <span style={{'--i':13}}>&nbsp;k</span>
              <span style={{'--i':14}}>o</span>
              <span style={{'--i':15}}>m</span>
              <span style={{'--i':17}}>e</span>
              <span style={{'--i':18}}>n</span>
              <span style={{'--i':19}}>t</span>
              <span style={{'--i':20}}>o</span>
            </div>
          }

          {lang === "th" &&
            <div className={Styles.waviy}>
              <span style={{'--i':1}}>พิ</span>
              <span style={{'--i':2}}>ม</span>
              <span style={{'--i':3}}>พ์</span>
              <span style={{'--i':4}}>ค</span>
              <span style={{'--i':5}}>ว</span>
              <span style={{'--i':6}}>า</span>
              <span style={{'--i':7}}>ม</span>
              <span style={{'--i':8}}>คิ</span>
              <span style={{'--i':9}}>ด</span>
              <span style={{'--i':10}}>เ</span>
              <span style={{'--i':11}}>ห็</span>
              <span style={{'--i':12}}>น</span>
            </div>
          }

          {lang === "vn" &&
            <div className={Styles.waviy}>
              <span style={{'--i':1}}>Đ</span>
              <span style={{'--i':2}}>a</span>
              <span style={{'--i':3}}>n</span>
              <span style={{'--i':4}}>g</span>
              <span style={{'--i':5}}>&nbsp;n</span>
              <span style={{'--i':6}}>h</span>
              <span style={{'--i':7}}>ậ</span>
              <span style={{'--i':8}}>p </span>
              <span style={{'--i':9}}>&nbsp;b</span>
              <span style={{'--i':10}}>ì</span>
              <span style={{'--i':11}}>n</span>
              <span style={{'--i':12}}>h </span>
              <span style={{'--i':13}}>&nbsp;l</span>
              <span style={{'--i':14}}>u</span>
              <span style={{'--i':15}}>ậ</span>
              <span style={{'--i':16}}>n</span>
            </div>
          }
          </>
          }

          {comments.map((comment, index) => (
            <div key={index}>
              <div className={Styles.profile__comment__heading}>
                <div className={Styles.profile__comment__avatar}>
                  <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={comment.owner.avatar} alt='' />
                </div>
                <div className={Styles.profile__comment__info}>
                  <div className={Styles.profile__comment__infoheading}>
                    {
                      comment.owner.id === getCookieUserLogin().id
                        ? <Link href={`/profile`} passHref>
                          <h2 style={{ cursor: 'pointer' }}>{comment.owner.name}</h2>
                        </Link>
                        : <Link href={`/otherprofile/${comment.owner.id}`} passHref>
                          <h2 style={{ cursor: 'pointer' }}>{comment.owner.name}</h2>
                        </Link>
                    }
                    <div className={Styles.profile__comment__global}>{comment.comment.updated_at === comment.comment.created_at ? mapTime(comment.comment.created_at) : `Đã chỉnh sửa ${mapTime(comment.comment.updated_at)}`}</div>
                  </div>

                  {editedComment.id === comment.comment.id ?
                    <div style={{ marginLeft: '0' }} className={Styles.reaction__comment__input} ref={editCmt}>
                      <input
                        id={comment.comment.id}
                        type="text"
                        value={editedComment.content}
                        onChange={e => hanhdleChangeEditedComment(e)} 
                        onKeyDown={(e) => KeyEditComment(e,comment.comment.id)}
                      />
                      {!isMoblie && <i className="fa-regular fa-face-grin-wide" onClick={() => setShowPicker({...showPicker, editComment:{isShow:!showPicker.editComment.isShow}})}></i>}
                      <i style={editedComment.content ? {} : { cursor: 'default' }} className="fa fa-paper-plane" aria-hidden="true" onClick={() => handleSendEditComment(comment.comment.id)}></i>
                      {showPicker.editComment.isShow &&
                            
                            <div className={Styles.reaction__box_emoji_reply}>
                              <AiOutlineClose 
                                type='button' 
                                className={Styles.reaction__close_icons}
                                onClick={() => setShowPicker({...showPicker, editComment:{isShow:false}})} 
                              />
                              <Picker
                                pickerStyle={{paddingTop: '22px', width: '100%' }}
                                onEmojiClick={onEmojiClickOnEditedReplyComment} />
                            </div>
                      }
                    </div> :
                    <p>{comment.comment.content}</p>
                  }
                  <div className={Styles.profile__comment__actions_container}>
                    <div className={Styles.profile__comment__actions} onClick={() => handleReply(comment.comment.id, comment.owner.name)}>{content.comment_reply}</div>
                    {getCookieUserLogin().id === comment.owner.id &&
                      <>
                        {editedComment.id === comment.comment.id  ?
                          <div style={{ color: '#746e6e', fontSize: '12px', fontWeight: '500', cursor: 'pointer', margin: '3px 0 0 20px' }} onClick={() => handleCancelEditComment()}>{content.comment_stop_edit}</div> 
                          :
                          <div style={{ color: '#746e6e', fontSize: '12px', fontWeight: '500', cursor: 'pointer', margin: '3px 0 0 20px' }} onClick={() => handleEditComment(comment.comment.id, comment.comment.content)}>{content.comment_edit}</div>
                        }

                        <div style={{ color: '#746e6e', fontSize: '12px', fontWeight: '500', cursor: 'pointer', margin: '3px 0 0 20px' }} onClick={() => handleDeleteComment(comment.comment.id)}>{content.comment_delete}</div>
                      </>
                    }
                  </div>
                </div>
                {editedComment.id !== comment.comment.id ?
                  <div className={Styles.reaction__icon}>
                    <div style={{ color: comment.has_like ? '#f9d205' : '' }} onClick={() => { handleHeartComment(comment, comments.length) }}>
                      {comment.has_like
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
                        {editedReplyComment.idRep === reply.comment.id ?
                          <div style={{ marginLeft: '0' }} className={Styles.reaction__comment__input} ref={editReplyCmt}>
                            <input
                              id={reply.comment.id}
                              type="text"
                              value={editedReplyComment.content}
                              onChange={e => hanhdleChangeEditedReplyComment(e)}></input>
                          {!isMoblie && <i className="fa-regular fa-face-grin-wide" onClick={() => setShowPicker({...showPicker, editReplyComment:{isShow:!showPicker.editReplyComment.isShow}})}></i>}
                            <i style={editedReplyComment.content ? {} : { cursor: 'default' }} className="fa fa-paper-plane" aria-hidden="true" onClick={() => handleSendEditReplyComment(reply.comment.id)}></i>
                            {showPicker.editReplyComment.isShow &&
                            
                            <div className={Styles.reaction__box_emoji_reply_cmt}>
                              <AiOutlineClose 
                                type='button' 
                                className={Styles.reaction__close_icons}
                                onClick={() => setShowPicker({...showPicker, editReplyComment:{isShow:false}})} 
                              />
                              <Picker
                                pickerStyle={{paddingTop: '22px', width: '100%' }}
                                onEmojiClick={onEmojiClickOnEditedReplyComment} />
                            </div>
                            }
                          </div> :
                          <p>{reply.comment.content}</p>
                        }
                      </div>
                      <div style={{ display: 'flex' }}>
                        <div className={Styles.profile__comment__actions} onClick={() => handleReply(comment.comment.id, comment.owner.name)}>{content.comment_reply}</div>
                        {getCookieUserLogin().id === reply.owner.id &&
                              <>
                                {editedReplyComment.idRep === reply.comment.id ?
                                  <div className={Styles.profile__comment__actions} onClick={() => handleCancelEditReplyComment()}>{content.comment_stop_edit}</div> 
                                  :
                                  <div className={Styles.profile__comment__actions} onClick={() => handleEditReplyComment(comment.comment.id, reply.comment.content, reply.comment.id)}>{content.comment_edit}</div>
                                }
                                <div className={Styles.profile__comment__actions} onClick={() => handleDeleteReplyComment(reply.comment.id, comment.comment.id)}>{content.comment_delete}</div>
                              </>
                        }
                      </div>
                    </div>
                  </div>
                ))
              }

              {comment.has_more_reply_comment && !listReply.find(rep => rep.idCmt === comment.comment.id) &&
                <div style={{ padding: '0px 20px 10px 62px', fontSize: '13px', color: 'var(--main-color)' }}>
                  <span style={{ cursor: 'pointer' }} onClick={() => handleLoadMoreReply(comment.comment.id)}>{content.comment_more_comments}</span>
                </div>
              }
            </div>
          ))
          }

        </div>
    }

      {(loaderWheel) &&
        <div className={Styles.loader}>
          <div className={Styles.loader_wheel}></div>
          <p>
            <span>{content.comment_loading}</span>
            <span className={Styles.dotload}></span>
          </p>
        </div>
      }

      {/* {(buttonLoadCmt && !loadingComment.current) ? */}
      {
        numCmts - comments.length !== 0 ? 
          <div className={Styles.reaction__comment__load} onClick={handleLoadComment}>
            <span style={{ cursor: 'pointer' }}>{content.comment_more_comments}</span>
          </div> 
          : ""
      }
        {/* : null} */}

      {showFormSharePost ?
        <FormSharePost
          showModal={showFormSharePost}
          setShowModal={setShowFormSharePost}
          handleShare={(caption, post) => acceptShare(caption, post)}
          post={sharedPost}
          isMessSharing={isMessSharing}
        /> : <></>}

    </>
  );
}