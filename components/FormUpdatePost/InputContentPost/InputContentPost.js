import React, { useEffect, useState } from 'react'
import Styles from './InputContentPost.module.css'

const InputContentPost = ({previewStatus,setShowPicker,holderIcon,setHolderIcon,setIsTyping}) => {

  const [activePlaceholder, setActivePlaceholder] = useState(false);
  //check placeholder truyen tu vao khi thay đổi icon
  useEffect(() => {
    setActivePlaceholder(holderIcon)
  }, [holderIcon]);
  //xu ly input editor
  const handleEditor = (e) =>{
    if(e.target.innerHTML.slice(0,6) ==="&nbsp;"){
      e.target.innerHTML = ""
    }
    else{
      setShowPicker(false)
      
    }
    //active placeholder
    if(e.target.innerHTML === ""){
      setActivePlaceholder(true)
      setIsTyping(false)
      setHolderIcon(true)
    }
    else{
      setActivePlaceholder(false)
      setIsTyping(true)
    }
  }
  //catch breakline
  const handleBreakLine = (e) =>{
    if(e.key ==="Enter"){
        document.execCommand('insertHTML', false, '<br><br>');
    }
  }
  //huy su kien enter mac dinh
  useEffect(() => {
  document.getElementById('editor').addEventListener('keydown' , e => {
    if(e.which == 13){
      e.preventDefault();
    }
   })
  }, []);
  //truyen status vao editor
  useEffect(()=>{
    if(previewStatus.includes("/n")){
      previewStatus = previewStatus.replaceAll("/n","<br>")
     }
    document.getElementById("editor").innerHTML = previewStatus
  },[previewStatus])

  return (
    <>
      <div 
        contentEditable={true} 
        className={Styles.editor}
        id="editor" 
        onInput = {e => handleEditor(e)}
        onKeyUp = {e => handleBreakLine(e)}
      >
    </div>
    {activePlaceholder && <span className={Styles.placeholder}>What are you thinking...</span>}
    </>
  )
}

export default InputContentPost