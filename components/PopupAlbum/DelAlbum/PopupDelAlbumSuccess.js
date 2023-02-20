import { useEffect } from "react";
import Styles from "./PopupDelAlbum.module.css";

import Image from "next/image";
import checkSuccess from "../../../public/images/check-circle.svg";
import { getCookieUserLogin } from "../../../modules/Cookies/Auth/userLogin";
function PopupDelAlbumSuccess(){

        const userLogin = getCookieUserLogin()

            const [content, setContent] = useState({});
          
            useEffect(() => {
                if(userLogin.language!== undefined) {
                    setContent(require(`../languages/${userLogin.language}.json`));
                }else{
                    setContent(require(`../languages/en.json`));
                }
            }, [userLogin])

    return (
        <div className={Styles.AlbumCreate}>
                <div className={Styles.Album_del}>
                    <div className={Styles.Album_del_tc}>
                        <Image src={checkSuccess} alt={'Xóa thành công'} className={Styles.Album_del_tc_img} />
                        <h3>{content.delAlbumSuccess_success}</h3>
                    </div>
                </div>
            </div>
    )
}
export default PopupDelAlbumSuccess