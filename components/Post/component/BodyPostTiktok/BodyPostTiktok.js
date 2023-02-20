import Styles from "./BodyPostTiktok.module.css";
import { TikTokEmbed } from 'react-social-media-embed';
import { useEffect, memo } from "react";


function BodyPostTiktok({url = "", id = ""}) {
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '14px' }} id={id == undefined ? '' : id}>
                <TikTokEmbed url={url} width={324}/>
            </div>
        </>
    )
}

export default memo(BodyPostTiktok);