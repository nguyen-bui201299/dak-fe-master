import Styles from "./PostShare.module.css";
import { FaGlobeAsia } from "react-icons/fa";
import Polygon2 from "../../../../public/Icon SVG - Update/Polygon2.svg";
import Image from "next/image";



import { memo, useState, useEffect } from "react";

function PostShare(post) {
  // test-render-web
  useEffect(() => {
    console.log('render PostShare');
    }, [])

  const [hoverIcons, setStyle] = useState({ display: "none" });
  const [hoverTimes, setStyleTime] = useState({ display: "none" });

  return (
    <></>
    // <div className={Styles.profile__post_share__item}>
    //   <div className={Styles.profile__post_share__item_img}>
    //     <Image src={Picture1} alt=""/>
    //   </div>

    //   <div className={Styles.profile__post_share__item_info}>
    //     <div className={Styles.profile__post_share__heading}>
    //       <div className={Styles.profile__post_share__infoheading}>
    //         <h2>Chien Nguyen</h2>
    //         <div className={Styles.profile__post_share__global}>
    //           <FaGlobeAsia
    //             className={Styles.global__private_postshare}
    //             onMouseEnter={(e) => {
    //               setStyle({ display: "block" });
    //             }}
    //             onMouseLeave={(e) => {
    //               setStyle({ display: "none" });
    //             }}
    //           />
    //           <span
    //             className={Styles.public__private_postshare}
    //             style={hoverIcons}
    //           >
    //             Công khai
    //           </span>
    //           <Image src={Polygon2} alt="Icon Dropdown" />
    //         </div>
    //       </div>
    //       <p style={{margin: "4px 0", fontSize: "13px"}}
    //         onMouseEnter={(e) => {
    //           setStyleTime({ display: "block" });
    //         }}
    //         onMouseLeave={(e) => {
    //           setStyleTime({ display: "none" });
    //         }}
    //       >
    //         Đã chia sẻ bài viết mới
    //       </p>
    //       <span className={Styles.time__post_share} style={hoverTimes}>
    //         7 giờ trước
    //       </span>
    //     </div>
    //     <div className={Styles.profile__post_share__text}>hbhb</div>
    //   </div>
      
    // </div>
  );
}

export default memo(PostShare);
