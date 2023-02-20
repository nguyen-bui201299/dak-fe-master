import { memo, useEffect } from "react";
import { TwitterTweetEmbed } from 'react-twitter-embed';

function BodyPostTwitter({url = "", id = ""}) {
    // test-render-web
    useEffect(() => {
        console.log('render BodyPostTwitter');
        }, [])

    return (
        <>
             <div style={{width: '100%', marginTop: '14px'}} id={id == undefined ? '' : id}>
                    <TwitterTweetEmbed
                        tweetId={getIdVideoTwitterByLink(url)}
                    />
            </div>
        </>
    )
}

function getIdVideoTwitterByLink(link = ""){
    try{
        if(link.includes("?")){
            return(link.split("?")[0].split("/")[5]);
        }else{
            return(link.split("/")[5]);
        }
    }catch(e){
        return "";
    }
}

export default memo(BodyPostTwitter);