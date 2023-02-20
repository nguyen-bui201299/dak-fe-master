import API, { endpoints, headers } from "../../API";
import { useState, useEffect } from 'react'
import Post from './Post'
import Masonry from "react-masonry-css";

export default function ListRankPost({setPostContinue, setShowPostContinue}) {
    const [listRankPosts, setListRankPosts] = useState()

    const getListRankPost = async() => {
        await API.get(endpoints['getRankPost'](100), { headers: headers.headers_token })
            .then(res => {
                if (res.data.code == 200) {
                    setListRankPosts(res.data.data)
                }
            })
            .catch(e => console.log(e))
    }

    useEffect(() => {
        getListRankPost()
    }, [])

    return (
        <>
            {listRankPosts?.map((post) => (
                <Post
                    typepost={post.post_type}
                    url={post.post.post_url}
                    key={post.post.id}
                    postid={post.post.id}
                    post={post}
                    setPostContinue={setPostContinue}
                    setShowPostContinue={setShowPostContinue}
                />
            ))}
        </>
    )
}
