import Styled from './MainContent.module.css';
import { Tab } from 'semantic-ui-react';
import {  AiOutlineArrowLeft } from 'react-icons/ai';
import ListGroup from '../List/ListGroup';
import Modal from '../../Modal/Modal-CreateGroup/Modal';
import ChildPicturesGroup from '../component/ChildPicturesGroup';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchGroup, fetchJoinedGroup } from '../../../redux/slices/groupSlice';
import NoGroupContent from './NoGroupContent'
import { FaUsers } from 'react-icons/fa';
import { getCookieUserLogin } from '../../../modules/Cookies/Auth/userLogin';

export function MainContent () {

  const userLogin = getCookieUserLogin();


  const [content, setContent] = useState({});

  // redux
  const dispatch = useDispatch();

  useEffect(() => {
      if(userLogin.language!== undefined) {
          setContent(require(`../languages/${userLogin.language}.json`));
      }else{
          setContent(require(`../languages/en.json`));
      }
  }, [userLogin])

//   const handleTabChange = (e, { activeIndex }) => setActiveIndex(activeIndex);
  const handleItemClick = id => {
    setActiveIndex(id)
  };

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0)
  const [groups, setGroups] = useState(null)
  const [joinGroup, setJoinGroup] = useState(null)
  const [notJoin, setNotJoin] = useState()

  const getMultipleRandom = (arr, num) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  }

  // Lấy các group người dùng hiện tại đang tham gia
  useEffect(() => {
    const limit = 30;
    const page = 1;
    // API.get(endpoints['listJoinGroup'](30, 1), {headers: headers.headers_token})
    dispatch(fetchJoinedGroup({limit, page})).unwrap()
    .then(json => {
        if(json.data) {
            setJoinGroup(json.data)
            setNotJoin(json.data.length)
        }
    })
    .catch(error => console.log(error))
  }, [open])

  // Lấy hết tất cả các group
  useEffect(() => {
    const limit = 20;
    const page = 1;
    const keyword = '';
    // API.get(endpoints['findGroup'](20, 1, ''), {headers: headers.headers_token})
    dispatch(fetchGroup({limit, page, keyword})).unwrap()
    .then(data => {
      setGroups(data)
    })
    .catch(error => {})
  }, [dispatch])

  const panes = [
      {
        render: () => (
          <div>
            <div className={Styled.main_content}>
              <div className={Styled['main-content']}>
                <h2>{content.main_content_recommend} </h2>
                <p>{content.main_content_recommend_group} </p>
              </div>
              <div className={Styled['main-everygroup']}>
                <a onClick={() => handleItemClick(1)}>{content.main_content_view_recommend}</a>
              </div>
            </div>
            <div className={Styled['main-groupPictures']}>
            {groups && getMultipleRandom(groups, 3).map((group, index) => (<ChildPicturesGroup key={index} group={group}/>))}
            </div>
            <hr />

            {
              notJoin === undefined || notJoin < 1 ? <NoGroupContent handleShow = { handleShow} /> : (
                <>
                  <div className={Styled.main_content}>
                    <div className={Styled['main-content']}>
                      <h2>{content.main_content_your_groups} </h2>
                      <p>{content.main_content_your_joined_groups} </p>
                    </div>
                  <div className={Styled['main-everygroup']}>
                    <a onClick={() => handleItemClick(2)}>
                      {content.main_content_view_your_joined_groups}
                    </a>
                  </div>
                  </div>
                  <div className={Styled['main-groupPictures']}>
                    {joinGroup && getMultipleRandom(joinGroup, 3).map((group, index) => (<ChildPicturesGroup key={index} joinGroup={group}/>))}
                  </div>
                </>
              )
            }
            
            {open && (
              <Modal handleClose={() => handleCLose()} />
            )}
            
              
          </div>
        ),
      },

      // Render tạo nhóm bên trang gợi ý
      {
        render: () => (
          <div>
            <div className={Styled['group-header']}>
              <div
                className={Styled.Turn}
                onClick={() => handleItemClick(0)}
              >
                <AiOutlineArrowLeft
                  style={{ position: 'relative', top: '3' }}
                />{' '}
                {content.main_content_back_btn}
              </div>
              <button
                className={Styled['btn-createGroup']}
                onClick={() => handleShow()}
              >
                <FaUsers fontSize={20} />
                <span> {content.main_content_create_group_btn}</span>
              </button>
            </div>
            <ListGroup activeIndex={activeIndex} joinGroup={joinGroup} groups={groups}/>
            {open && (
              <Modal handleClose={() => handleCLose()} />
            )}
          </div>
        ),
      },
      // Render tạo nhóm bên trang nhóm cá nhân đã tham gia
      {
        render: () => (
          <div>
            <div className={Styled['group-header']}>
              <div
                className={Styled.Turn}
                onClick={() => handleItemClick(0)}
              >
                <AiOutlineArrowLeft
                  style={{ position: 'relative', top: '3' }}
                />{' '}
                {content.main_content_back_btn}
              </div>
              <button
                className={Styled['btn-createGroup']}
                onClick={() => handleShow()}
              >
                <span>
                  <FaUsers fontSize={20} />
                </span>
                <span>
                  {content.main_content_create_group_btn}
                </span>
              </button>
            </div>
            <ListGroup activeIndex={activeIndex} joinGroup={joinGroup}/>
            {open && (
              <Modal handleClose={() => handleCLose()} />
            )}
          </div>
        ),
      },
      {
        render: () => <div className={Styled['all-content']}></div>,
      },
    ];


  const handleShow = () => {
    setOpen(true);
  };

  const handleCLose = () => {
    setOpen(false);
  };
  
  return (
    <div id='something' className={Styled.main}>
      <Tab
        className='mainGroups'
        panes={panes}
        activeIndex={activeIndex}
        onTabChange={e => handleTabChange(e)}
      />
    </div>
  );
}

export default MainContent;
