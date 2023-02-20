import Styles from './LoaderTab.module.css';
import {useState, useEffect} from "react"

const Loader = () => {
    const [showLoading, setShowLoading] = useState(true);
    useEffect(() => {
        var links = document.getElementsByClassName("Header_social__link__N7reX ");
        for (var i = 0; i < links.length; i++)
        {
            links[i].onClick = function()
            {
                setShowLoading(true);
            };
        }
  },[])
  return (
    <>
        {showLoading &&  
        <div className={Styles.wrap__loader}>
            <div className={Styles.loader}></div>
        </div>
    }
    </>
  )
}

export default Loader