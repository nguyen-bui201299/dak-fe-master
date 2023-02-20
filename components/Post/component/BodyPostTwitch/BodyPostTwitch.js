import { memo } from "react";
import { TwitchPlayer } from "react-twitch-embed";

function BodyPostTwitch({post, url, id}) {
    const getIdVideoTwitch= (url = "")=>{
        if(url.includes("videos")) {
            const idVideo = url.split('/');
            return (idVideo ? idVideo[4] : false)
        } else {
            const channel = url.split('/');
            return (channel ? channel[3] : false)
        }
    }

    return (
        <div className='player-wrapper' style={{ height: "420px", marginTop: '14px'}} id={id == undefined ? '' : id}>
            {
                url.includes("videos") ? 
                    <TwitchPlayer
                        id={post.post?.id}
                        video= {getIdVideoTwitch(url)}
                        width='100%'
                        height='100%'
                        autoplay={false}
                        time="0h0m0s"
                        // parent={["117.2.143.218:82"]}
                    />     
                    : 
                    <TwitchPlayer
                        id={post.post?.id}
                        channel={getIdVideoTwitch(url)}
                        width='100%'
                        height='100%'
                        autoplay={false}
                        time="0h0m0s"
                        // parent={["117.2.143.218:82"]}
                    />
            }

            {/* <ReactPlayer
            className='react-player'
            url='https://www.twitch.tv/videos/1488823274'
            width='100%'
            height='100%'
            autoplay={false}
            /> */}
        </div>
    )
}

export default memo(BodyPostTwitch);