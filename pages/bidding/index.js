import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FaUserCog, FaSearch } from "react-icons/fa";
import { FiTrash, FiEdit } from "react-icons/fi";
import Link from "next/link";

import Layout from "../../components/Layout/Layout";
import Styles from "../../styles/Bidding.module.css";
import Thumb from "../../public/images/bidding-thumb.png";
import PopupCreate from "../../components/PopupBidding/PopupCreate";
import PopupDeleted from "../../components/PopupBidding/PopupDeleted";
import PopupEdit from "../../components/PopupBidding/PopupEdit";

export default function Bidding() {
  const [showPopupCreate, setShowPopupCreate] = useState(false);
  const [showPopupDeleted, setShowPopupDeleted] = useState(false);
  const [showPopupEdit, setShowPopupEdit] = useState(false);
  const [language, setLanguage] = useState("en");
  const [content, setContent] = useState({});

  useEffect(() => {
    if (language) {
      setContent(require(`./languages/${language}.json`));
      } else {
        setContent(require(`./languages/en.json`));
      }
  }, [language]);

  return (
    <>
      <Head>
        <title>DAK - Bidding</title>
      </Head>
      <Layout setLanguage={setLanguage}>
        <div className={Styles["bidding"]}>
          <div className={Styles["bidding__heading"]}>
            <h1>
              Danh sách Bidding
              <FaUserCog className={Styles["icon"]} />
            </h1>
            <div className={Styles["bidding__heading-bottom"]}>
              <div className={Styles["bidding__heading-search"]}>
                <input type="text" placeholder="Tìm tên..." />
                <FaSearch className={Styles["heading-search-icon"]} />
              </div>
              <button
                className={Styles["bidding__heading-create"]}
                onClick={() => setShowPopupCreate(!showPopupCreate)}
              >
                + {content.bidding_create_bidding}
              </button>
            </div>
          </div>

          <div className={Styles["bidding__body"]}>
            <ul className={Styles["bidding__article-list"]}>
              <li className={Styles["bidding__article-item"]}>
                <div className={Styles["item__col-left"]}>
                  <div className={Styles["item__thumb"]}>
                    <Image src={Thumb} alt="Status"></Image>
                  </div>
                  <div className={Styles["item__content"]}>
                    <Link href="../bidding/chart-bidding">
                      <a>
                        <h3 className={Styles["item__content-id"]}>
                          ID: 201788
                        </h3>
                      </a>
                    </Link>
                    <p className={Styles["item__content-description"]}>
                      Hôm nay tôi thật buồn...
                    </p>
                    <p className={Styles["item__content-time"]}>
                      Đăng vào <span>27.03.2022</span>
                    </p>
                    <div className={Styles["item__content-meta"]}>
                      <p className={Styles["item__content-meta-cost"]}>
                        Chi phí <span>30000P</span>
                      </p>
                      <ul className={Styles["item__content-meta-prior"]}>
                        <li>1</li>
                        <li className={Styles["active"]}>2</li>
                        <li>3</li>
                        <li>4</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className={Styles["item__col-right"]}>
                  <button onClick={() => setShowPopupDeleted(true)}>
                    <FiTrash
                      className={Styles["item__col-right-icon"]}
                    ></FiTrash>
                    Xoá bài viết
                  </button>
                  <button onClick={() => setShowPopupEdit(true)}>
                    <FiEdit className={Styles["item__col-right-icon"]}></FiEdit>
                    Chỉnh sửa bài viết
                  </button>
                </div>
              </li>
              <li className={Styles["bidding__article-item"]}>
                <div className={Styles["item__col-left"]}>
                  <div className={Styles["item__thumb"]}>
                    <Image src={Thumb} alt="Status"></Image>
                  </div>

                  <div className={Styles["item__content"]}>
                    <Link href="../bidding/chart-bidding">
                      <a>
                        <h3 className={Styles["item__content-id"]}>
                          ID: 201788
                        </h3>
                      </a>
                    </Link>
                    <p className={Styles["item__content-description"]}>
                      Hôm nay tôi thật buồn...
                    </p>
                    <p className={Styles["item__content-time"]}>
                      Đăng vào <span>27.03.2022</span>
                    </p>
                    <div className={Styles["item__content-meta"]}>
                      <p className={Styles["item__content-meta-cost"]}>
                        Chi phí <span>30000P</span>
                      </p>
                      <ul className={Styles["item__content-meta-prior"]}>
                        <li>1</li>
                        <li>2</li>
                        <li>3</li>
                        <li>4</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className={Styles["item__col-right"]}>
                  <button>
                    <FiTrash
                      className={Styles["item__col-right-icon"]}
                    ></FiTrash>
                    Xoá bài viết
                  </button>
                  <button>
                    <FiEdit className={Styles["item__col-right-icon"]}></FiEdit>
                    Chỉnh sửa bài viết
                  </button>
                </div>
              </li>
              <li className={Styles["bidding__article-item"]}>
                <div className={Styles["item__col-left"]}>
                  <div className={Styles["item__thumb"]}>
                    <Image src={Thumb} alt="Status"></Image>
                  </div>

                  <div className={Styles["item__content"]}>
                  <Link href="../bidding/chart-bidding">
                      <a>
                        <h3 className={Styles["item__content-id"]}>
                          ID: 201788
                        </h3>
                      </a>
                    </Link>
                    <p className={Styles["item__content-description"]}>
                      Hôm nay tôi thật buồn...
                    </p>
                    <p className={Styles["item__content-time"]}>
                      Đăng vào <span>27.03.2022</span>
                    </p>
                    <div className={Styles["item__content-meta"]}>
                      <p className={Styles["item__content-meta-cost"]}>
                        Chi phí <span>30000P</span>
                      </p>
                      <ul className={Styles["item__content-meta-prior"]}>
                        <li className={Styles["active"]}>1</li>
                        <li>2</li>
                        <li>3</li>
                        <li>4</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className={Styles["item__col-right"]}>
                  <button>
                    <FiTrash
                      className={Styles["item__col-right-icon"]}
                    ></FiTrash>
                    Xoá bài viết
                  </button>
                  <button>
                    <FiEdit className={Styles["item__col-right-icon"]}></FiEdit>
                    Chỉnh sửa bài viết
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {showPopupCreate && (
          <PopupCreate
            handleClick={() => setShowPopupCreate(!showPopupCreate)}
            setShowPopupCreate={setShowPopupCreate}
          />
        )}

        {showPopupDeleted && <PopupDeleted closePopup={setShowPopupDeleted} />}

        {showPopupEdit && <PopupEdit closeEdit={setShowPopupEdit} />}
      </Layout>
    </>
  );
}
