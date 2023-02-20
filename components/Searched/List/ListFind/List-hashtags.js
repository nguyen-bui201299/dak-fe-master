import Post from "../../../Post/Post";
import Styled from '../../Result/Search-result.module.css';


const ListHashtags = ({listPost}) => {
    return (
        <div style={{width: '60%'}} className={Styled["all-content"]}>
            {listPost &&
                listPost.map((post, index) => (
                    <>
                        {post.post_type == "normal"    && <Post typepost={"normal"}  key={index} postid={post.post.id} post={post}/>}
                        {post.post_type == "youtube"   && <Post typepost={'youtube'}     url={post.post.post_url} key={index} postid={post.post.id} post={post}/>}
                        {post.post_type == "facebook"  && <Post typepost={'facebook'}    url={post.post.post_url} key={index} postid={post.post.id} post={post}/>}
                        {post.post_type == "tiktok"    && <Post typepost={'tiktok'}      url={post.post.post_url} key={index} postid={post.post.id} post={post}/>}
                        {post.post_type == "twitter"   && <Post typepost={'twitter'}     url={post.post.post_url} key={index} postid={post.post.id} post={post}/>}
                        {post.post_type == "twitch"    && <Post typepost={'twitch'}      url={post.post.post_url} key={index} postid={post.post.id} post={post}/>}
                        {post.post_type == "instagram" && <Post typepost={'instagram'}   url={post.post.post_url} key={index} postid={post.post.id} post={post}/>} 
                    </>
                ))
            }
        </div>
    );
};

export default ListHashtags