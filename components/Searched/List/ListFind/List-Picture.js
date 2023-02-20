import { useState, useEffect } from "react";
import { BsXLg } from "react-icons/bs"
import Image from 'next/image'
import Styled from '../../Result/Search-result.module.css'

const List = () => {
    // test-render-web
    useEffect(() => {
        console.log('render List');
        }, [])

    return (
        <div className={Styled["picture"]}>
            <div className={Styled["actual-pictures"]}>
                <Image src={'/images/bg.png'} alt='picture-profile' width={130} height={130}/>
                <Image src={'/images/bg.png'} alt='picture-profile' width={130} height={130}/>
                <Image src={'/images/bg.png'} alt='picture-profile' width={130} height={130}/>
                <Image src={'/images/bg.png'} alt='picture-profile' width={130} height={130}/>
                <Image src={'/images/bg.png'} alt='picture-profile' width={130} height={130}/>
                <Image src={'/images/bg.png'} alt='picture-profile' width={130} height={130}/>
            </div>
        </div>
    );
};

export default List