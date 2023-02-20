import React, { useEffect } from 'react';
import Styled from '/styles/Introduction.module.css';
import Head from 'next/head';


export default function introductions() {

    return (<>

    <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Dongle:wght@700&family=Nunito:wght@600&family=Rubik+Beastly&display=swap" rel="stylesheet"/>
    </Head>
    <div className={Styled.container}>
        
        <h1 className={Styled.header}> Gợi ý theo dõi </h1>
            
        <div className={Styled.intro}>
            <div className={Styled.avatar}>
                
            </div>
            <div className={Styled.baseInfo}>
                <span>Đặng Quốc Huy</span>
                <span>
                    <small>@gabdol98</small>
                </span>
    
            </div>   
            <div> 
                <label className={Styled.followButton}>Theo dõi</label>
            </div>
        </div>

        <div className={Styled.intro}>
            <div className={Styled.avatar}>
                
            </div>
            <div className={Styled.baseInfo}>
                <span>Trần Lam Giang</span>
                <span>
                    <small>@lamgiang12</small>
                </span>
    
            </div>   
            <div> 
                <label className={Styled.followButton}>Theo dõi</label>
            </div>
        </div>

        <div className={Styled.intro}>
            <div className={Styled.avatar}>
                
            </div>
            <div className={Styled.baseInfo}>
                <span>Vũ Phương Anh</span>
                <span>
                    <small>@phanh1997</small>
                </span>
    
            </div>   
            <div> 
                <label className={Styled.followButton}>Theo dõi</label>
            </div>
        </div>

        <div className={Styled.intro}>
            <div className={Styled.avatar}>
                
            </div>
            <div className={Styled.baseInfo}>
                <span>Nguyễn Thị Li Sa</span>
                <span>
                    <small>@gabdol98</small>
                </span>
    
            </div>   
            <div> 
                <label className={Styled.followButton}>Theo dõi</label>
            </div>
        </div>
        <div className={Styled.intro}>
            <div className={Styled.avatar}>
                
            </div>
            <div className={Styled.baseInfo}>
                <span>Elon Musk</span>
                <span>
                    <small>@elonmusk</small>
                </span>
    
            </div>   
            <div> 
                <label className={Styled.followButton}>Theo dõi</label>
            </div>
        </div>
    </div>

    </>
    );
}
