import Link from "next/link";

//  const formatCaption = (caption) => {
//     const newCaptionArr = [];
//     if(caption != "" && caption != undefined){
//         let itemCaption = caption.split(" ");
        
//         let newCaption = "";
//         itemCaption.map((item, index) => {
//             if(checkHashTag(item)){
//                 newCaptionArr.push((
//                     <Link href={{ 
//                         pathname: "/searched/hastag",
//                         query: {
//                             keyword: item,
//                         }
//                     }}>
//                         <a style={{color: "#f9d205", cursor:"pointer", width: "10%"}}> {item.substr(0, 60)} </a>
//                     </Link>), ' ');
//                 // newCaption = newCaption + `<span style="color: #f9d205; cursor: pointer;"> ${item} </span>` + " ";
//             }else{
//                 newCaptionArr.push(item,' ');
//                 // newCaption = newCaption + item + " ";
//             }
//         });
//         // console.log(newCaptionArr);
//         var arrCaption = [];
//         newCaptionArr.map((caption) => {
//             if(typeof(caption) === 'string'){
//                 const checkCaption = caption.indexOf("/n");
//                 if(checkCaption >= 0)
//                 {
//                     var newCaptions = [];
//                     for (let index = 0; index < caption.length; index++) {
//                         const element = caption[index];
//                         // if(caption[index] != '/')
//                         // {
//                         //     if(caption[index] != 'n'){
//                         //         newCaptions.push(caption[index])
//                         //     }
//                         // }
//                         // else if(caption[index] == '/' && caption[index + 1] == 'n'){
//                         //     newCaptions.push(<br />)
//                         // }
//                         //fix check xuong dong
//                         if(caption[index] == '/' && caption[index + 1] == 'n'){
//                             newCaptions.push(<br />)
//                         }
//                         else{
//                             if(caption[index] == 'n'){
//                                 if(caption[index-1] != '/'){
//                                     newCaptions.push(caption[index])
//                                 }
//                             }
//                             else{
//                                     newCaptions.push(caption[index])
//                             }
//                         }
//                     }
//                     // console.log(newCaptions);
//                     arrCaption.push(newCaptions)
//                 }
//                 else{
//                     arrCaption.push(caption, '')
//                 }
//             }
//             else{
//                 arrCaption.push(caption, '')
//             }
//         })
//         return arrCaption;
//     }else{
//         return "";
//     }
// } 

const checkHashTag = (caption) => {
    if(caption != ""){
        if(caption[0] == "#"){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }
}

export const formatCaption = (caption) => {
    if(caption != "" && caption !== undefined){
        caption = caption?.toString().replaceAll('\n','/n');
        const arrSentenceCaption = []

        arrSentenceCaption = caption.split('/n');
        
        const mainArr=[]

        arrSentenceCaption.map((sentence,index) =>{
            const arrWord =[]
            arrWord= sentence.split(" ")
            
            let arrTemp=[]
            arrWord.map((word) =>{

                if(checkHashTag(word)){
                    arrTemp.push( ( <Link href={{  pathname: "/searched/hashtag", query: { keyword: word, } }}>
                                    <a style={{color: "#f9d205", cursor:"pointer", width: "10%"}}> {word.substr(0, 60)} </a>
                                </Link>)
                                , ' '
                            )
                }
                else{
                    arrTemp.push(word,' ')
                }
            })

            if(index != arrSentenceCaption.length-1){

                mainArr.push(arrTemp,<br/>)
            }
            else{
                mainArr.push(arrTemp)
            }
        })
        // console.log('tempArr:',tempArr);
        return mainArr
    }
    else{
        return false
    }
}
