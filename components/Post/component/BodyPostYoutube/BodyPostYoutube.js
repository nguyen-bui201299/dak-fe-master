import Styles from "./BodyPostYoutube.module.css";
import { memo } from "react";

function BodyPostYoutube({url = "", id = "",width}) {
  return (
    <>
      <iframe
        
        id={getIdVideoYoutubeByLink(url)}
        style={{marginTop: '14px', width: '100%', height: '300px'}}
        className={Styles.iframe__youtube}
        src={`https://www.youtube.com/embed/${getIdVideoYoutubeByLink(url)}?enablejsapi=1&version=3&playerapiid=ytplayer`}
        title="YouTube video player"
        // frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; full-screen"
        allowFullScreen={true}
        
      ></iframe>
    </>
  );
}

function getIdVideoYoutubeByLink(url = "") {
  var regExp =
    /^https?\:\/\/(?:www\.youtube(?:\-nocookie)?\.com\/|m\.youtube\.com\/|youtube\.com\/)?(?:ytscreeningroom\?vi?=|youtu\.be\/|vi?\/|user\/.+\/u\/\w{1,2}\/|embed\/|watch\?(?:.*\&)?vi?=|\&vi?=|\?(?:.*\&)?vi?=)([^#\&\?\n\/<>"']*)/i;
  var match = url.match(regExp);

  return match && match[1].length == 11 ? match[1] : false;
}

export default memo(BodyPostYoutube);
