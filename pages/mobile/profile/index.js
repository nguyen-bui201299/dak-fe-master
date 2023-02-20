import Styles from "../../../styles/mobile/Profile.module.css"
import Image from 'next/image'
import bgAvatar from '/public/images/bgAvatar.jpg'
import avatar from '/public/images/avatar.jpg'
import Layout from "../../../components/Mobile/Layout/Layout"
import PostList from "../../../components/Mobile/PostList/PostList"
import { useEffect } from "react"

export default function Profile() {
    // test-render-web
    useEffect(() => {
        console.log('render Profile');
        }, [])

    return (
        <>
        <Layout>
            <div className={Styles.profile}>
                {/* Thông tin User */}
                <div className={Styles.backgroundImg}>
                    <Image className={Styles.backgroundBgAvatar} 
                        src={bgAvatar} alt="background"
                        width="200px" height="200px"
                    />  
                    <div className={Styles.avatarUser}>
                        <Image src={avatar} alt="avatar"
                            width="100px" height="100px"
                        />       
                    </div>  
                </div>  
                <div className={Styles.infoUser}>
                    <p className={Styles.nameUser}>Nguyễn Thiên Phúc</p>
                    <p className={Styles.gmailUser}>
                        ntp@gmail.com
                    </p>
                </div> 

                {/* Danh sách thống kê */}
                <div className={Styles.statistic}>
                    <ul className={Styles.listStatistic}>
                        <li className={Styles.itemStatistic}>
                            Bình chọn
                            <p className={Styles.quantityStatistic}>500</p>
                        </li>
                        <li className={Styles.itemStatistic}>
                            NFT
                            <p className={Styles.quantityStatistic}>500</p>
                        </li>
                        <li className={Styles.itemStatistic}>
                            Người theo dõi
                            <p className={Styles.quantityStatistic}>500</p>
                        </li>
                        <li className={Styles.itemStatistic}>
                            Đang theo dõi 
                            <p className={Styles.quantityStatistic}>500</p>
                        </li>
                    </ul>
                </div>

                {/* 2 nút tính năng */}
                <div className={Styles.btnFeature}>
                    <ul className={Styles.listBtnFeature}>
                        <li className={Styles.itemBtnFeature}>Library</li>
                        <li className={Styles.itemBtnFeature}>Statistic</li>
                    </ul>
                </div>
            </div>

            {/* List post */}
            <div className={Styles.post_list}>
                <PostList />
            </div>
        </Layout>
        </>
    )
}