import { useEffect, memo } from "react";

function BodyPostFacebook({dataHref, className,width, id}) {
    const initFacebookSDK = () => {
        try{
          if (window.FB) {
            window.FB.XFBML.parse()
          }
          window.fbAsyncInit = () => {
            window.FB.init({
              appId: process.env.NEXT_PUBLIC_FACEBOOK_ID,
              cookie: true,
              xfbml: true,
              version: 'v14.0'
            })
          }
          (
            ((d, s, id) => {
              var js, fjs = d.getElementsByTagName(s)[0]
              if (d.getElementById(id)) return;
              js = d.createElement(s)
              js.id = id
              js.src = '//connect.facebook.net/vi-VN.sdk.js'
              fjs.parentNode.insertBefore(js, fjs)
            })(document, 'script', 'facebook-jssdk')
          );
        }catch(err){return null}
      }
    
      useEffect(() => {
        initFacebookSDK()
      }, [])
    
        return (
            <div
                id={id == undefined ? '' : id}
                className={className}
                data-href={dataHref}
                data-show-text={true}
                data-lazy={true}
                data-width={width != undefined ? width : ''}
                style={{ background: 'white', marginTop: '14px', display: 'block' }}
            >
            </div>
        );
}

export default memo(BodyPostFacebook);
