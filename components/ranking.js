import React from 'react';
import Styled from '/styles/Ranking.module.css';
import Head from 'next/head';

export default function introductions() {
    
    
    return (<>

    <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Dongle:wght@700&family=Nunito:wght@600&family=Rubik+Beastly&display=swap" rel="stylesheet"/>
    </Head>
    <div className={Styled.container}>
        
        <h1 className={Styled.header}> Xếp hạng </h1>
            
        <div className={Styled.intro}>
            <div className={Styled.baseInfo}>
                <span>Lê Tấn Trường</span>
                <span>
                    <small>156</small>
                </span>
    
            </div>   
            <div> 
                <label className={Styled.dot}>...</label>
            </div>
        </div>

        <div className={Styled.intro}>
            <div className={Styled.baseInfo}>
                <span>Đặng Quốc Huy</span>
                <span>
                    <small>156</small>
                </span>
    
            </div>   
            <div> 
                <label className={Styled.dot}>...</label>
            </div>
        </div>

        <div className={Styled.intro}>
            <div className={Styled.baseInfo}>
                <span>Lê Viết Hoàng</span>
                <span>
                    <small>156</small>
                </span>
    
            </div>   
            <div> 
                <label className={Styled.dot}>...</label>
            </div>
        </div>

        <div className={Styled.intro}>
            <div className={Styled.baseInfo}>
                <span>Nguyễn Cẩm Ly</span>
                <span>
                    <small>156</small>
                </span>
    
            </div>   
            <div> 
                <label className={Styled.dot}>...</label>
            </div>
        </div>

        <div className={Styled.intro}>
            <label className={Styled.readMore}>Hiển thị thêm</label>
        </div>


    </div>
    </>
    );
}
