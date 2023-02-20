import Styles from './Story.module.css';
import { useEffect } from 'react'

export default function Story() {
    // test-render-web
    useEffect(() => {
        console.log('render Story')
        }, [])

    return (
        <>
            <div className={Styles.box_story}>
                <div className={Styles.item_story}>
                    <div className={Styles.box_image_story}>
                        <img className={Styles.image_story} src="https://static-images.vnncdn.net/files/publish/hoc-sinh-tieu-hoc-ha-noi-trong-ngay-tro-lai-truong-vao-64-anh-thanh-hung-5c8591492fab495e812b11a0cf1d2299.jpg" alt="image_story" ></img>
                    </div>
                    <div className={Styles.box_title_story}>
                        <h4 className={Styles.title_story}>Học sinh Hà Nội có thể nghỉ hè muộn hơn mọi năm</h4>
                    </div>
                </div>

                <div className={Styles.item_story}>
                    <div className={Styles.box_image_story}>
                        <img className={Styles.image_story} src="https://static-images.vnncdn.net/files/publish/hoc-sinh-tieu-hoc-ha-noi-trong-ngay-tro-lai-truong-vao-64-anh-thanh-hung-5c8591492fab495e812b11a0cf1d2299.jpg" alt="image_story"></img>
                    </div>
                    <div className={Styles.box_title_story}>
                        <h4 className={Styles.title_story}>Học sinh Hà Nội có thể nghỉ hè muộn hơn mọi năm</h4>
                    </div>
                </div>

                <div className={Styles.item_story}>
                    <div className={Styles.box_image_story}>
                        <img className={Styles.image_story} src="https://static-images.vnncdn.net/files/publish/hoc-sinh-tieu-hoc-ha-noi-trong-ngay-tro-lai-truong-vao-64-anh-thanh-hung-5c8591492fab495e812b11a0cf1d2299.jpg" alt="image_story"></img>
                    </div>
                    <div className={Styles.box_title_story}>
                        <h4 className={Styles.title_story}>Học sinh Hà Nội có thể nghỉ hè muộn hơn mọi năm</h4>
                    </div>
                </div>

                <div className={Styles.item_story}>
                    <div className={Styles.box_image_story}>
                        <img className={Styles.image_story} src="https://static-images.vnncdn.net/files/publish/hoc-sinh-tieu-hoc-ha-noi-trong-ngay-tro-lai-truong-vao-64-anh-thanh-hung-5c8591492fab495e812b11a0cf1d2299.jpg" alt="image_story"></img>
                    </div>
                    <div className={Styles.box_title_story}>
                        <h4 className={Styles.title_story}>Học sinh Hà Nội có thể nghỉ hè muộn hơn mọi năm</h4>
                    </div>
                </div>


                <div className={Styles.item_story}>
                    <div className={Styles.box_image_story}>
                        <img className={Styles.image_story} src="https://static-images.vnncdn.net/files/publish/hoc-sinh-tieu-hoc-ha-noi-trong-ngay-tro-lai-truong-vao-64-anh-thanh-hung-5c8591492fab495e812b11a0cf1d2299.jpg" alt="image_story"></img>
                    </div>
                    <div className={Styles.box_title_story}>
                        <h4 className={Styles.title_story}>Học sinh Hà Nội có thể nghỉ hè muộn hơn mọi năm</h4>
                    </div>
                </div>

                <div className={Styles.item_story}>
                    <div className={Styles.box_image_story}>
                        <img className={Styles.image_story} src="https://static-images.vnncdn.net/files/publish/hoc-sinh-tieu-hoc-ha-noi-trong-ngay-tro-lai-truong-vao-64-anh-thanh-hung-5c8591492fab495e812b11a0cf1d2299.jpg" alt="image_story"></img>
                    </div>
                    <div className={Styles.box_title_story}>
                        <h4 className={Styles.title_story}>Học sinh Hà Nội có thể nghỉ hè muộn hơn mọi năm</h4>
                    </div>
                </div>
            </div>
        </>
    )
}