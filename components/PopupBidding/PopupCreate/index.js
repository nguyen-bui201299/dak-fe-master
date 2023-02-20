import {
  FaRegTimesCircle,
  FaArrowLeft,
} from "react-icons/fa";
import { useState, useRef, useEffect } from "react";

import Styles from "./PopuCreate.module.css";
import PopupSuccess from "../PopupSuccess";
import API, { endpoints, headers } from "../../../API";
import formatDate from "../../../modules/Time/formatDate";
import Post from "../../Post/Post";
import { ErrorNotification } from "../../../modules/Notification/Notification";
import { getCookieUserLogin } from "../../../modules/Cookies/Auth/userLogin";


export default function PopupCreate({ handleClick, setShowPopupCreate }) {

  const userLogin = getCookieUserLogin()

  const [content, setContent] = useState({});

  useEffect(() => {
    if (userLogin.language !== undefined) {
      setContent(require(`../languages/${userLogin.language}.json`));
    } else {
      setContent(require(`../languages/en.json`));
    }
  }, [userLogin]);

  const [step, setStep] = useState(1);
  const [feeBidding, setFeeBidding] = useState();
  const [feeView, setFeeView] = useState();
  const [postType, setPostType] = useState("");
  const [ownerAvatar, setOwnerAvatar] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [postId, setPostId] = useState("");
  const [postCaption, setPostCaption] = useState("");
  const [postDate, setPostDate] = useState("");
  const [postUrl, setPostUrl] = useState("");
  const [showPost, setShowPost] = useState(false);
  const [post, setPost] = useState("");
  const [bidding, setBidding] = useState(false);
  const [notFound, setNotFound] = useState("");
  const [findPost, setFindPost] = useState("");
  const popupBidding = useRef();
  const searchIcon = useRef();

  const closePopup = (e) => {
    if (popupBidding.current === e.target) {
      setShowPopupCreate(false);
    }
  };

  const showArticle = (e) => {
    if (
      //   (e.code === "Enter" ||
      //     searchIcon.current === e.currentTarget.parentElement) &&
      e.target.value != ""
    ) {
      // console.log(e.target.value.split('/')[4])
      setFindPost(
        e.target.value.split("/")[4] !== undefined
          ? e.target.value.split("/")[4]
          : e.target.value
      );
      setShowPost(true);
      API.get(
        endpoints["getpost"](
          e.target.value.split("/")[4] !== undefined
            ? e.target.value.split("/")[4]
            : e.target.value
        ),
        { headers: headers.headers_token }
      )
        .then((response) => {
          console.log(response);
          if (
            (e.target.value.split("/")[4] !== "" || e.target.value !== "") &&
            response.data.success === false
          ) {
            setBidding(false);
            setNotFound(content.popupCreate_notFound);
          } else {
            // console.log(response);
            setBidding(true);
            setPost(response.data);
            setPostType(response.data.post.post_url);
            setOwnerAvatar(response.data.owner.avatar);
            setOwnerName(response.data.owner.name);
            setPostId(response.data.post.id);
            setPostCaption(response.data.post.caption);
            setPostDate(response.data.post.created_at);
            setPostUrl(response.data.post.post_url);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (e.target.value.split("/")[4] === "" || e.target.value === "") {
      setNotFound("");
    } else {
      setShowPost(false);
    }
  };

  const createBidding = () =>{
  

    if(feeBidding && feeView && postId){
      API.post(
        "/bidding",
        {
          post_id: postId,
          amount: Number(feeBidding),
          ratio: Number(feeView)
        },
        { headers: headers.headers_token }
      )
      .then(res =>{
        if(res.data.success){
          setStep(4);
        }
        else{
          ErrorNotification(res.data.message);
          setStep(1);
          setShowPost(false)
          setPost();
          setPostId();
          setFeeBidding();
          setFeeView();
        }
      })
      .catch(err => ErrorNotification(err))
    }
    else{
      ErrorNotification("Missing Data FeeBidding, FeeView or LinkPostID!!!");
    }
  }


  const handlePrev = () => {
    setStep((prevStep) => prevStep - 1);
    if (step === 3) {
      setShowPost(false)
      setPost();
      setPostId();
    }
    else if (step == 2){
      setFeeBidding();
      setFeeView();
    }
  };

  return (
    <div
      className={Styles["overlay-create"]}
      ref={popupBidding}
      onClick={closePopup}
    >
      {step < 4 && (
        <div className={Styles["overlay__content"]}>
          <div className={Styles["overlay__content-heading"]}>
            {step === 1 ? (
              <h3>{content.popupCreate_title}</h3>
            ) : (
              <h3>
                <FaArrowLeft
                  onClick={handlePrev}
                  className={Styles["prev-button"]}
                />{" "}
                {content.popupCreate_title}
              </h3>
            )}
            <FaRegTimesCircle
              className={Styles["close-icon"]}
              onClick={handleClick}
            />
          </div>

          {step === 1 && (
            <div className={Styles["overlay__content-body"]}>
              <div className={Styles["overlay__body-form"]}>
                <p className={Styles["body-form__title"]}>{content.popupCreate_bidding_fee}</p>
                <div className={Styles["popup-input"]}>
                  <input
                    type="number"
                    placeholder={content.popupCreate_input_bidding_fee}
                    onChange={(e) => setFeeBidding(e.target.value)}
                  />
                  <span>DAK Point</span>
                </div>
              </div>
              <div className={Styles["overlay__body-form"]}>
                <p className={Styles["body-form__title"]}>
                  {content.popupCreate_view_fee}
                </p>
                <div className={Styles["popup-input"]}>
                  <input
                    type="number"
                    placeholder={content.popupCreate_input_view_fee}
                    onChange={(e) => setFeeView(e.target.value)}
                  />
                  <span>DAK Point</span>
                </div>
              </div>
              <div className={Styles["overlay__body-prior"]}>
                <span>{content.popupCreate_priority}</span>
                <ul className={Styles["prior-list"]}>
                  <li>1</li>
                  <li className={Styles["active"]}>2</li>
                  <li>3</li>
                  <li>4</li>
                </ul>
              </div>
              <div className={Styles["overlay__body-button"]}>
                <button
                  className={
                    Styles[
                      feeBidding && feeView
                        ? "next-step-active"
                        : "next-step"
                    ]
                  }
                  disabled = {!feeBidding || !feeView ? true : false}
                  onClick={() =>  setStep(2)}
                >
                  {content.popupCreate_continue_btn}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className={Styles["slide"]}>
              <div className={Styles["content__overlay-body"]}>
                <div className={Styles["overlay__body-form"]}>
                  <p className={Styles["popup-title"]}>{content.popupCreate_bidding_post}</p>
                  <div className={Styles["popup-input"]}>
                    <input
                      type="text"
                      placeholder={content.popupCreate_input_URL}
                      onChange={(e) => showArticle(e)}
                    />
                    {/* <span ref={searchIcon}>
                      <FaSearch onClick={showArticle} />
                    </span> */}
                  </div>

                  {showPost && bidding ? (
                    <>
                      <div className={Styles["post"]}>
                        <div className={Styles["avatar"]}>
                          {/* <Image src={Thumb} alt="Status"></Image> */}
                          <img
                            alt=""
                            src={ownerAvatar}
                            style={{ maxWidth: "50px", maxHeight: "50px" }}
                          ></img>
                        </div>
                        <div className={Styles["post-content"]}>
                          <h3 className={Styles["post-id"]}>ID: {postId}</h3>
                          <p className={Styles["post-quote"]}>
                            {/* Hôm nay tôi thật buồn.... */}
                            {postCaption}
                          </p>
                          <div className={Styles["post-meta"]}>
                            <p className={Styles["post-date"]}>
                              {/* Đăng vào <span>27.03.2022</span> */}
                              {content.popupCreate_post_date} <span>{formatDate(postDate)}</span>
                            </p>
                            <p className={Styles["post-author"]}>
                              {content.popupCreate_post_by}:{" "}
                              <span>
                                {ownerName !== undefined
                                  ? ownerName
                                  : "Popular"}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className={Styles["overlay__body-button"]}>
                        <button
                          className={Styles["next-step-active"]}
                          onClick={() => setStep(3)}
                        >
                          {content.popupCreate_continue_btn}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className={Styles["not-found"]}>
                      <h3>{notFound}</h3>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={Styles["slide"]}>
              <p className={Styles["popup-title"]}>{content.popupCreate_accept_bidding}</p>
              <div className={Styles["post-confirm"]}>
                <div className={Styles["post-big-thumb"]}>
                  {/* <Image src={Bigthumb} alt="Status"></Image> */}
                  {/* <img src={postUrl}></img> */}
                  {postUrl !== undefined ? (
                    <>
                      {postType.includes("youtube") && (
                        <Post
                          hide={"hide"}
                          typepost={"youtube"}
                          url={postUrl}
                          postid={postId}
                          post={post}
                        />
                      )}

                      {postType.includes("facebook") && (
                        <>
                          <Post
                            hide={"hide"}
                            typepost={"facebook"}
                            url={postUrl}
                            postid={postId}
                            post={post}
                          />
                        </>
                      )}

                      {postType.includes("twitch") && (
                        <>
                          <Post
                            hide={"hide"}
                            typepost={"twitch"}
                            url={postUrl}
                            postid={postId}
                            post={post}
                          />
                        </>
                      )}

                      {postType.includes("tiktok") && (
                        <>
                          <Post
                            hide={"hide"}
                            typepost={"tiktok"}
                            url={postUrl}
                            postid={postId}
                            post={post}
                          />
                        </>
                      )}

                      {postType.includes("instagram") && (
                        <>
                          <Post
                            hide={"hide"}
                            typepost={"instagram"}
                            url={postUrl}
                            postid={postId}
                            post={post}
                          />
                        </>
                      )}

                      {postType.includes("twitter") && (
                        <>
                          <Post
                            hide={"hide"}
                            typepost={"twitter"}
                            url={postUrl}
                            postid={postId}
                            post={post}
                          />
                        </>
                      )}
                    </>
                  ) : (
                    <Post
                      hide={"hide"}
                      typepost={"normal"}
                      url={postUrl}
                      postid={postId}
                      post={post}
                    />
                  )}
                </div>
              </div>
              <div className={Styles["overlay__body-button"]}>
                <button
                  className={Styles["next-step-active"]}
                  // onClick={() => setStep(4)}
                   onClick={() => createBidding()}
                >
                  {content.popupCreate_accept_btn}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {step === 4 && (
        <PopupSuccess closePopup={setShowPopupCreate}></PopupSuccess>
      )}
    </div>
  );
}
