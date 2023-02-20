import Styles from './PostList.module.css';
import { FaYoutube, FaFacebookF, FaTwitter, FaTiktok, FaTwitch, FaUserFriends } from 'react-icons/fa';
import { AiFillInstagram } from 'react-icons/ai';
import {useState, useEffect} from "react";
import Post from '../../../components/Mobile/Post/Post';



export default function PostList({typePost = "youtube"}) {
    // test-render-web
    useEffect(() => {
        console.log('render PostList')
        }, [])
    const links = {
        facebook: [
                {
                    url: "https://www.facebook.com/watch?v=969118340405598"
                },{
                    url: "https://www.facebook.com/watch?v=1079734576218336"
                },{
                    url: "https://www.facebook.com/watch?v=472343528010354"
                },{
                    url: "https://www.facebook.com/watch?v=472343528010354"
                },{
                    url: "https://www.facebook.com/watch?v=891579961793507"
                },{
                    url: "https://www.facebook.com/watch?v=646109859579848"
                },{
                    url: "https://www.facebook.com/FAPtivi/videos/333397514871043"
                },{
                    url: "https://www.facebook.com/watch?v=1110437103130817"
                },{
                    url: "https://www.facebook.com/watch?v=354621293133338"
                },{
                    url: "https://www.facebook.com/watch?v=354621293133338"
                }   
            ],
        youtube: [
                {
                    url: "https://www.youtube.com/watch?v=drPKxqfFDms"
                },{
                    url: "https://www.youtube.com/watch?v=f-CXu-YWep8"
                },{
                    url: "https://www.youtube.com/watch?v=KI1XSlkMgx8"
                },{
                    url: "https://www.youtube.com/watch?v=1jx-BcAu5i4"
                },{
                    url: "https://www.youtube.com/watch?v=HsMFcQlxwKs"
                },{
                    url: "https://www.youtube.com/watch?v=037ysh7z3jg"
                },{
                    url: "https://www.youtube.com/watch?v=AiD1a2fFFLw"
                },{
                    url: "https://www.youtube.com/watch?v=AmvA-XJF0j8"
                },{
                    url: "https://www.youtube.com/watch?v=2MZ_oQOGC24"
                },{
                    url: "https://www.youtube.com/watch?v=TjZ18Rg0f9Q"
                }   
            ],
        tiktok: [
                {
                    url: "https://www.tiktok.com/@ngocccdieuuu/video/7083345344586714395"
                },{
                    url: "https://www.tiktok.com/@lovevietnam036/video/7078915092380732699"
                },{
                    url: "https://www.tiktok.com/@caocuongvu/video/7086031910660541723"
                },{
                    url: "https://www.tiktok.com/@coupleblogvn/video/7085902323091787050"
                },{
                    url: "https://www.tiktok.com/@van0705_1806/video/7069769794693631258"
                },{
                    url: "https://www.tiktok.com/@ngocnghinee/video/7084564952224173339"
                },{
                    url: "https://www.tiktok.com/@dudeep1/video/7066062842604145947"
                },{
                    url: "https://www.tiktok.com/@ume_nvg_ume_lykio/video/7070682938429459738"
                },{
                    url: "https://www.tiktok.com/@huyseoul_idol/video/7057452962976697627"
                },{
                    url: "https://www.tiktok.com/@huyseoul_idol/video/7066732566098758938"
                }   
            ],
        instagram: [
                {
                    url: "https://www.instagram.com/reel/CbZFxoQpaeP/?utm_source=ig_web_copy_link"
                },{
                    url: "https://www.instagram.com/p/CcW_SBmPHu5/?utm_source=ig_web_copy_link"
                },{
                    url: "https://www.instagram.com/p/CcRvHr3vuQy/?utm_source=ig_web_copy_link"
                },{
                    url: "https://www.instagram.com/p/CcPgaYUlGVd/?utm_source=ig_web_copy_link"
                },{
                    url: "https://www.instagram.com/p/CcW_Iy3r6rO/?utm_source=ig_web_copy_link"
                },{
                    url: "https://www.instagram.com/p/CbKRlv_P5wE/?utm_source=ig_web_copy_link"
                },{
                    url: "https://www.instagram.com/p/CSB3loghEgA/?utm_source=ig_web_copy_link"
                }
            ],
        twitch: [
                {
                    url: "https://www.twitch.tv/raeyei"
                },{
                    url: "https://www.twitch.tv/robcdee"
                },{
                    url: "https://www.twitch.tv/greekgodx"
                },{
                    url: "https://www.twitch.tv/ranger"
                },{
                    url: "https://www.twitch.tv/sypherpk"
                },{
                    url: "https://www.twitch.tv/pestily"
                },{
                    url: "https://www.twitch.tv/pestily"
                }
            ],
        twitter: [
                {
                    url: "https://twitter.com/vsbg_asia/status/1514589567847841794?s=20&t=01XD1-nsqbNgWAVjJfWK6g"
                },{
                    url: "https://twitter.com/SpaceX/status/1512728385901903873?s=20&t=LSoE8i-2aJa2dYmCoUEogQ"
                },{
                    url: "https://twitter.com/heydave7/status/1514675952802017282?s=20&t=LSoE8i-2aJa2dYmCoUEogQ"
                },{
                    url: "https://twitter.com/Tesla/status/1500386369683832833?s=20&t=LSoE8i-2aJa2dYmCoUEogQ"
                },{
                    url: "https://twitter.com/TeslaSolar/status/1499088648637063168?s=20&t=LSoE8i-2aJa2dYmCoUEogQ"
                },{
                    url: "https://twitter.com/elonmusk/status/1503186160524439557?s=20&t=LSoE8i-2aJa2dYmCoUEogQ"
                },{
                    url: "https://twitter.com/latestinspace/status/1514761898478215170?s=20&t=LSoE8i-2aJa2dYmCoUEogQ"
                }
            ],
    
    }

    const [postList, setPostList] = useState({post: []});

    useEffect(() => {
        // console.log(typePost);
        typePost == "youtube" && setPostList({post: links.youtube});
        typePost == "facebook" && setPostList({post: links.facebook});
        typePost == "tiktok" && setPostList({post: links.tiktok});
        typePost == "twitter" && setPostList({post: links.twitter});
        typePost == "twitch" && setPostList({post: links.twitch});
        typePost == "instagram" && setPostList({post: links.instagram});

        // console.log(postList.post);
    }, [typePost, links])

    return (
        <>
        <div className={Styles.box_post_list}>
            {
                postList.post.map((post, index) => (
                    <Post typepost={typePost} url={post.url} key={index}/>   
                ))
            }
        </div>
        </>
    )
}