import React, { useEffect, useState } from 'react'
import Styles from './GroupTabs.module.css'
import Masonry from "react-masonry-css";

import Introduce from "../../../../components/Group/Detail/Introduce/Introduce";
import Post from "../../../../components/Post/Post";
import People from './People/People'
import Pending from './Pending/Pending'
import { getCookieUserLogin } from '../../../../modules/Cookies/Auth/userLogin';

const breakpointColumnsObj = {
    default: 2,
    1100: 2,
    700: 1,
  };

export default function GroupTabs ({
    groupMember,
    toggleTab,
    detailGroup,
    toggleState,
    infoGroup,
    handleOnRequestPending,
    userIsExist,
    listPendingRequest,
    currentGroupId,
    setRemoveMember,
    handleOnKickMember,
    listPost,
    isDeleted,
    setPostContinue,
    setShowPostContinue,
    listPostReview,
    setListPostReview,
    groupDetail
}){


    const userLogin = getCookieUserLogin();

    // const [postReviewInfo, setPostReviewInfo] = useState([])

    // useEffect(() => {
        const postReviewInfo = listPostReview?.map(obj => {
            return { 
                post: obj.article, 
                owner: obj.owner,
                group_name: obj.group_name
            };
        });
        // setPostReviewInfo(postReviewInfo)
    // },[listPostReview])




    return (
        <>
            <div>
                {/* About Tabs */}
                <div
                className={
                    toggleState === 1
                    ? `${Styles.content_active} ${Styles.content}`
                    : `${Styles.content}`
                }
                onClick={() => toggleTab(1)}
                >
                {toggleState === 1 ? <Introduce
                    memberCount={detailGroup?.member_count}
                    weeklyJoinedMember={detailGroup?.weekly_joined_member}
                    dayCreate={detailGroup?.group.created_at}
                    access={infoGroup?.access}
                    desc={infoGroup?.desc}
                    detailGroup={detailGroup}
                /> : ""}
                </div>

                {/* Posts Tabs */}
                <div
                className={
                    toggleState === 2
                    ? `${Styles.content_active} ${Styles.content}`
                    : `${Styles.content}`
                }
                onClick={() => toggleTab(2)}
                >
                    {detailGroup?.group?.access == "private" ? (
                        detailGroup?.has_joined ? (
                        toggleState === 2 && 
                        <div className={`${Styles.post_container}`}>
                            <Masonry
                                breakpointCols={breakpointColumnsObj}
                                className="my-masonry-grid"
                                columnClassName="my_masonry_grid_column"
                                >
                                {listPost &&
                                    listPost.map((item, index) => (
                                    <Post
                                        isDeleted={isDeleted}
                                        typepost={item.post.post_url_type}
                                        url={item.post.post_url}
                                        key={index}
                                        postid={item.post.id}
                                        post={item}
                                        updatePost={() => handleShowFormUpdatePost(item,'postNormal')}
                                        setPostContinue={setPostContinue}
                                        setShowPostContinue={setShowPostContinue}
                                    />
                                    ))}
                            </Masonry>
                        </div>
                        ) : (
                        ""
                        )
                    ) : (
                    toggleState === 2 &&  
                        <div className={Styles.post_container}>
                            {toggleState === 2 ? (
                            <Masonry
                                breakpointCols={breakpointColumnsObj}
                                className="my-masonry-grid"
                                columnClassName="my_masonry_grid_column"
                            >
                                {listPost &&
                                listPost.map((item, index) => (
                                    <Post
                                    isDeleted={isDeleted}
                                    typepost={item.post.post_url_type}
                                    url={item.post.post_url}
                                    key={index}
                                    postid={item.post.id}
                                    post={item}
                                    updatePost={() => handleShowFormUpdatePost(item,'postNormal')}
                                    />
                                ))}
                            </Masonry>
                            ) : null}
                        </div>

                    )}
                </div>

                {/* Pending Tabs - Require Access Authorize */}
                <div
                    className={
                        toggleState === 4
                        ? `${Styles.content_active} ${Styles.content}`
                        : `${Styles.content}`
                    }
                    onClick={() => toggleTab(4)}
                    >
                    {toggleState === 4 ? <Pending userLogin={userLogin} handleOnRequestPending={handleOnRequestPending} userIsExist={userIsExist} listPendingRequest={listPendingRequest} currentGroupId={currentGroupId}/> : ""}
                </div>

                {/* People Tabs */}
                <div
                    className={
                        toggleState === 5
                        ? `${Styles.content_active} ${Styles.content}`
                        : `${Styles.content}`
                    }
                    onClick={() => toggleTab(5)}
                    >
                    {toggleState === 5 ? <People 
                        setRemoveMember={setRemoveMember} 
                        handleOnKickMember={handleOnKickMember} 
                        groupMember={groupMember} 
                        currentGroupId={currentGroupId}
                        groupDetail={groupDetail}
                    /> : ""}
                </div>

                {/* People Tabs */}
                <div
                    className={
                        toggleState === 6
                        ? `${Styles.content_active} ${Styles.content}`
                        : `${Styles.content}`
                    }
                    onClick={() => toggleTab(6)}
                    >
                    {toggleState === 6 ? 
                            <Masonry
                                breakpointCols={breakpointColumnsObj}
                                className="my-masonry-grid"
                                columnClassName="my_masonry_grid_column"
                                style={{marginTop: "20px"}}
                            >
                                {listPostReview &&
                                postReviewInfo.map((item, index) => (
                                    <Post
                                    isDeleted={isDeleted}
                                    typepost={item.post.post_url_type}
                                    url={item.post.post_url}
                                    key={index}
                                    postid={item.post.id}
                                    post={item}
                                    updatePost={() => handleShowFormUpdatePost(item,'postNormal')}
                                    setListPostReview={setListPostReview}
                                    postReviewInfo={postReviewInfo}
                                    infoGroup={infoGroup}
                                    />
                                ))}
                            </Masonry> 
                        : ""
                    }
                </div>
            </div>
        </>
    )
}