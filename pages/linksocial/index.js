import Layout from "../../components/Layout/Layout";
import Styles from "../../styles/LinkSocial.module.css"
import PopupLinkSocial from "../../components/PopupLinkSocial/PopupLinkSocial";
import { AiFillFacebook, AiOutlineInstagram, AiFillYoutube, AiOutlineTwitter, AiOutlineGooglePlus } from "react-icons/ai"
import { FaTiktok, FaTwitch, FaTrash } from "react-icons/fa"
import { useEffect, useState } from "react"
import Head from "next/head";
import API, { endpoints, headers } from "../../API";
import PopupConfirmDelete from "../../components/PopupLinkSocial/PopupConfirmDelete";

export default function LinkSocial() {
    const [showPopup, setShowPopup] = useState(false);
    const [showConfirmDel, setShowConfirmDel] = useState(false);
    const [showLink, setShowLink] = useState([]);
    const [item, setItem] = useState('');
    const [language, setLanguage] = useState("en");
    const [content, setContent] = useState({});

    useEffect(() => {
        if (language) {
        setContent(require(`./languages/${language}.json`));
        } else {
        setContent(require(`./languages/en.json`));
        }
    }, [language]);

    const iCon = {
        facebook: AiFillFacebook,
        instagram: AiOutlineInstagram,
        youtube: AiFillYoutube,
        twitter: AiOutlineTwitter,
        google: AiOutlineGooglePlus,
        tiktok: FaTiktok,
        twitch: FaTwitch,
    }

    useEffect(() => {
        getAllLinkProfile();
    }, [])

    const getAllLinkProfile = () => {
        API.get(endpoints["getLinkProfile"](1, 10), { headers: headers.headers_token })
            .then((res) => {
                setShowLink(res.data.data);
            })
    }

    const handleDelete = (id) => {
        setItem(id);
        setShowConfirmDel((prev)=>!prev);
    }

    

    const filterIcon = (type) => {
        switch (type) {
            case 'facebook':
                return <iCon.facebook className={Styles["icons"]} style={{ color: "var(--facebook-color)" }} />
            case 'youtube':
                return <iCon.youtube className={Styles["icons"]} style={{ color: "var(--youtube-color)" }} />
            case 'tiktok':
                return <iCon.tiktok className={Styles["icons"]} style={{ color: "var(--tiktok-color)" }} />
            case 'twitter':
                return <iCon.twitter className={Styles["icons"]} style={{ color: "var(--twitter-color)" }} />
            case 'google':
                return <iCon.google className={Styles["icons"]} style={{ color: "var(--google-color)" }} />
            case 'twitch':
                return <iCon.twitch className={Styles["icons"]} style={{ color: "var(--twitch-color)" }} />
            case 'instagram':
                return <iCon.instagram className={Styles["icons"]} style={{ color: "var(--insta-color)" }} />
        }
    }

    const social_item_filters = [
        {
          className: "fab fa-youtube",
          name: "Youtube",
          type: "youtube"
        },
        {
          className: "fab fa-tiktok",
          name: "Tiktok",
          type: "tiktok"
        },
        {
          className: "fab fa-facebook-f",
          name: "Facebook",
          type: "facebook"
        },
        {
          className: "fa-brands fa-instagram",
          name: "Instagram",
          type: "instagram"
        },
        {
          className: "fa-brands fa-twitch",
          name: "Twitch",
          type: "twitch"
        },
        {
          className: "fab fa-twitter",
          name: "Twitter",
          type: "twitter"
        },
        {
          className: "fab fa-google-plus-g",
          name: "Google",
          type: "google"
        },
      ];

      console.log({showLink});
    return (
        <>
            <Head>
                <title>DAK - Social</title>
                <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
                integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA=="
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                />
            </Head>
            <Layout page="linksocial" setLanguage={setLanguage}>
                <div className={Styles["linkSocialPage"]}>
                    <div className={Styles["linkSocial__header"]}>
                        <h2>{content.popup_link_social_title}</h2>
                        <button className={Styles["linkSocial__add"]} onClick={() => { setShowPopup((prev) => !prev) }}>
                           + {content.linkSocial_add_link}
                        </button>
                    </div>
                    <div className={Styles["linkSocial__body"]}>
                        <ul className={Styles["linkSocial__list"]}>
                            {showLink != '' && showLink.map((item, key) => <li key={key} className={Styles["linkSocial__items"]}>
                                <div className={Styles["linkSocial__edit"]}>
                                    <span className={Styles["linkSocial__icon"]}>
                                        {
                                            filterIcon(item.type)
                                        }
                                    </span>
                                    <span>
                                        <a href={`${item.link}`} rel="noreferrer" target="_blank"  className={Styles["linkSocial"]}>
                                            {item.link}
                                        </a>
                                    </span>
                                </div>
                                <div className={Styles["popupIcon"]}>
                                    <FaTrash className={Styles["icon__dots"]} onClick={() => handleDelete(item)} />
                                </div>
                            </li>)}
                        </ul>
                    </div>
                </div>
                {showPopup && <PopupLinkSocial
                    setShowPopup={setShowPopup}
                    handleClick={() => setShowPopup(false)}
                    setShowLink={setShowLink}
                    social_item_filters={social_item_filters}
                />}
                {
                    showConfirmDel && <PopupConfirmDelete
                        setShowConfirmDel={setShowConfirmDel}
                        item={item}
                        handleClick={()=>setShowConfirmDel(false)}
                        setShowLink={setShowLink}
                        />
                }
            </Layout>
        </>
    )
}