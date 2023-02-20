import Styled from './ReportOption.module.css';
import { useEffect, useState } from 'react';
import { getCookieUserLogin } from '../../../modules/Cookies/Auth/userLogin';

export default function ReportOption () {

    const userLogin = getCookieUserLogin();

    const [content, setContent] = useState({});

    const [dataClicked, setDataClicked] = useState([]);

    const [otherInterface, setOtherInterface] = useState(false)

    console.log(dataClicked);

    const [arrOptionSelection,setArrOptionSelection] = useState([])

    useEffect(() => {
        if(userLogin.language!== undefined) {
            setContent(require(`../languages/${userLogin.language}.json`));
        }else{
            setContent(require(`../languages/en.json`));
        }
    }, [userLogin])

    useEffect(() => {

        if(dataClicked.includes(content.reportOptions_other)) {
            setOtherInterface(false);
            // console.log(otherInterface);
        } else {
            setOtherInterface(true);
            // console.log(otherInterface);
        }

    }, [dataClicked.length])


    const options = [
        {
            id: 1,
            name: `${content.reportOptions_trouble}`
        },

        {
            id: 2,
            name: `${content.reportOptions_selfInjury}`
        },

        {
            id: 3,
            name: `${content.reportOptions_sharingInappropriateContent}`
        },

        {
            id: 4,
            name: `${content.reportOptions_clone}`
        },

        {
            id: 5,
            name: `${content.reportOptions_spam}`
        },

        {
            id: 6,
            name: `${content.reportOptions_other}`
        },
    ]

    console.log(otherInterface);

    return (
        <>
            {otherInterface ? 
                <div className={Styled.optionsList}>
                    {options.map((option, index) => (
                        <>
                            <Option key={index} id={option.id} name={option.name} onClick={setDataClicked} dataClicked={dataClicked}/>    
                        </>
                    ))}
                </div>
                :
                <div className={Styled.content__others}>
                    <div className={Styled.optionsList__others}>
                        {dataClicked.map((item, index) => (
                            <>
                                <div className={Styled.options__others}>{item}</div>
                            </>
                        ))}
                    </div>
                    <div className={Styled.inputForm__others}>
                        <div className={Styled.input__others} data-placeholder="Let us know your problem!" contentEditable="true"></div>
                    </div>
                </div>
            
            }
        </>
        
    )
}


export function Option({id, name, onClick, dataClicked}) {

    // test-render-web
    useEffect(() => {
        console.log('render Option')
        }, [])

    const [toggle, setToggle] = useState(false)
    const [clicked, setClicked] = useState([1])
    


    const handleClick = (name) => {
        setToggle(!toggle)
        
        
        if (dataClicked?.includes(name)) {
            const nameArr = [...dataClicked].filter(item => item !== name);
            onClick(nameArr)
        } else {
            const nameArr = [name, ...dataClicked];
            onClick(nameArr)
        }

        setClicked( prev => {
            // const isClicked = clicked.includes(name)
            if (toggle) {
                return clicked.filter(item => item !== name)
            } 
            else {
                return [...prev, name]
            }
        })


        // if(!toggle && id !== 5) {
        //     console.log('true')
        // }
        
    }

    // const handleMouseDown = (name) => {
    //     setDataClicked(prev => [...prev, name])
    //     var arr = dataClicked;
    //     arr.push(name);
    //     setDataClicked(arr)
    // }
    // console.log(dataClicked);

    const theme =  window.localStorage.getItem('theme')
    

    return (
    <>
        <button 
                key = {id}
                value= {name}
                className={ toggle? Styled.options__active: theme == 'dark' ? Styled.options__dark : Styled.options}
                onClick={() => handleClick(name, id)}
                >
                    {name}
        </button>
    </>
    )
}











{/* 
        <button 
            value='trouble'
            className={Styled.options} 
            style={option1 ? { 'background-color' : '#f9d205' } : {'background-color' : '#fff'}} 
            onClick={() => setOption1(!option1)}
            >
                TROUBLE
        </button>   

        <button 
            value='self-injury'
            className={Styled.options} 
            style={option2 ? { 'background-color' : '#f9d205' } : {'background-color' : '#fff'}} 
            onClick={() => setOption2(!option2)}
            >
                SELF INJURY
        </button>

        <button 
            value='sharing-inapproriate-content'
            className={Styled.options} 
            style={option3 ? { 'background-color' : '#f9d205' } : {'background-color' : '#fff'}} 
            onClick={() => setOption3(!option3)}
            >
                SHARING INAPPRORIATE CONTENT
        </button>

        <button 
            value='clone'
            className={Styled.options} 
            style={option4 ? { 'background-color' : '#f9d205' } : {'background-color' : '#fff'}} 
            onClick={() => setOption4(!option4)}
            >
                CLONE
        </button>

        <button 
            value='other'
            className={Styled.options} 
            style={option5 ? { 'background-color' : '#f9d205' } : {'background-color' : '#fff'}} 
            onClick={() => setOption5(!option5)}
            >
                OTHER
        </button>

        <button 
            value='self-injury'
            className={Styled.options} 
            style={option6 ? { 'background-color' : '#f9d205' } : {'background-color' : '#fff'}} 
            onClick={() => setOption6(!option6)}
            >
                SELF INJURY
        </button>  

        <button 
            value='self-injury'
            className={Styled.options} 
            style={option7 ? { 'background-color' : '#f9d205' } : {'background-color' : '#fff'}} 
            onClick={() => setOption7(!option7)}
            >
                TROUBLE
        </button>

        <button 
            value='sharing-inapproriate-content'
            className={Styled.options} 
            style={option8 ? { 'background-color' : '#f9d205' } : {'background-color' : '#fff'}} 
            onClick={() => setOption8(!option8)}
            >
                SHARING INAPPRORIATE CONTENT
        </button>

        <button 
            value='clone'
            className={Styled.options} 
            style={option9 ? { 'background-color' : '#f9d205' } : {'background-color' : '#fff'}} 
            onClick={() => setOption9(!option9)}
            >
                CLONE
        </button>

        <button 
            value='other'
            className={Styled.options} 
            style={option10 ? { 'background-color' : '#f9d205' } : {'background-color' : '#fff'}} 
            onClick={() => setOption10(!option10)}
            >
                TROUBLE
        </button> */}
 