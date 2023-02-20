import { useState, useEffect } from 'react';
import Button from './Button.module.css'


const ButtonAgreedOrDenied = (onClick) => {
  
  const [show, setShow] = useState(false);
  const [hidden, setHidden] = useState(false);
  return(
    <>
        {!hidden && <button className={Button.Agreed_} onClick={() => {setHidden(true); setShow(prev => !prev);}}>Phê duyệt</button>}
        {/* {show && <p>This is your component</p>} */}
        {!hidden && <button className={Button.Denied_} onClick={() => {setHidden(true); setShow(prev => !prev);}}>Từ chối</button>}

    </>
  );
}

export default ButtonAgreedOrDenied