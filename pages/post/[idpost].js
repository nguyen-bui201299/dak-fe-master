import style from '../../styles/ViewPost.module.css'
import Post from '../../components/Post/Post'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getDetailPost } from "../../modules/Posts/get-detail-post";
import API, { endpoints, headers } from '../../API';
import Layout from "../../components/Layout/Layout";
import { NotificationToast } from '../../modules/Notification/Notification';

export default function ViewPost({post}) {

    const handleDeletePost = (id) => {
        const isDeleted = window.confirm('Do you want to delete this post?')
        if (isDeleted) {
            API.delete(endpoints.deletePost, { data: { post_id: id }, headers: headers.headers_token })
                .then(res => {
                    setIsDeletePost(!isDeletePost);
                    console.log('Deleted successfully')
                    NotificationToast.fire({
                        toast: true,
                        position: 'top-right',
                        icon: 'success',
                        title: `Deleted post success`,
                    })
                })
                .catch(err => {
                    NotificationToast.fire({
                        toast: true,
                        position: 'top-right',
                        icon: 'error',
                        title: `Error`,
                    })
                })
        }
    }

    return (
        <Layout>
            <div className={style["wrap__view__post"]}>
                <div className={style["wrap__post"]}>
                    {
                        post?.map((item, index) => (
                            <Post
                                key={index}
                                typepost={item.post.post_url_type}
                                url={item.post.post_url}
                                post={item}
                                postid={item.post.id}
                                deletePost={handleDeletePost}
                            />
                        ))
                    }
                </div>
            </div>
        </Layout>
    );
}

export async function getServerSideProps(ctx) {
    const { params } = ctx
    const res = await API.post(endpoints.getPostId, { list_post_id: [params.idpost]})
    const post = res.data.data
    return {
        props: {
            post
        },
    }
}
