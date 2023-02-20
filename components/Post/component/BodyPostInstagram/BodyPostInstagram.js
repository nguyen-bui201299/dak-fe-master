import Styles from "./BodyPostInstagram.module.css";
import {InstagramEmbed} from 'react-social-media-embed'
export default function BodyPostInstagram({url = "", id}) {


    return (
        <>
            <div className={Styles.profile__post__instagram}>
              <div style={{ marginTop: '14px' }} className={Styles.container}
              id={id === undefined ? '' : id}
              >
                  {/* <iframe
                    id = {id}
                      src={`${url}/embed`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Embedded Instagram"
                  /> */}
              
                <InstagramEmbed url={url} className={Styles.embed}/>
             </div>
              
            </div>
        
      
        </>
    )
}