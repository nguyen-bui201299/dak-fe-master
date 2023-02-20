import React, { useEffect, useRef, useState } from "react";
import Editor, { createEditorStateWithText } from "@draft-js-plugins/editor";
import createHashtagPlugin from "@draft-js-plugins/hashtag";
import editorStyles from "./InputContentSharePost.module.css";
import hashtagStyles from "./hashtagStyles.module.css";
import { convertToRaw } from "draft-js";
import "draft-js/dist/Draft.css";

const hashtagPlugin = createHashtagPlugin({ theme: hashtagStyles });
const plugins = [hashtagPlugin];
let text = ``;
const placeholder = `What are you thinking...`;


export default function InputContentPost(props) {
 
  const editorRef = useRef(null)

  const [editorState, setEditorState] = useState(createEditorStateWithText(props.caption.replaceAll('/n','\n') || ""));

  const onChange = (editorState) => {
    let result = "";
    setEditorState( editorState);
    
    if(convertToRaw(editorState.getCurrentContent()).blocks.length > 1){
      convertToRaw(editorState.getCurrentContent()).blocks.map((item, index) => {
        if(index == 0){
          result += item.text;
        }
        else{
          result = result + '/n' + item.text;
        }
      
      });
    }
    else{
      convertToRaw(editorState.getCurrentContent()).blocks.map((item) => {
        result += item.text;
      });
    }
    
    text = result
    if(text ==""){
      props.setCaption(" ");
    }
    else{
      props.setCaption(text);
    }
  };
  
  return (
    <div className={editorStyles.editor} onClick={focus}>
      <Editor
        editorState={editorState}
        onChange={onChange}
        plugins={plugins}
        placeholder={placeholder}
        ref={ editorRef }
      />
    </div>
  );
  
}
