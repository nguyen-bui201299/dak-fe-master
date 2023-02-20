import Styled from "../../styles/ListFriend.module.css";
import Layout from "../../components/Layout/Layout";
import { FaUserCircle, FaPhone } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import API, { endpoints, headers } from "../../API";
import { ToastContainer } from "react-toastify";
import { ErrorNotification } from "../../modules/Notification/Notification";
import Link from "next/link";
import { useRouter } from "next/router";
import useDebounce from "../../modules/Debounce/useDebounce";
import BtnChatListfriend from "../../components/BtnChatListfriend/BtnChatListfriend";

export default function ListFriend() {
  const [keyword, setKeyword] = useState("");
  const [listFriend, setListFriend] = useState([]);
  const [limit, setLimit] = useState(10);
  const pageNumber = useRef(1);
  const RefListFriend = useRef();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const debounced = useDebounce(keyword, 1000);
  useEffect(() => {
    const handleSearch = async () => {
      setLoading(true);
      const res = await API.get(endpoints.findFriends(100, 1, debounced), {
        headers: headers.headers_token,
      });
      if (res.data.success) {
        if (res.data.data.length > 0) {
          setListFriend(res.data.data);
          {/*console.log(res.data.data);
          res.data.data.map((item, id) => {
            API.get(endpoints['user/profile'](item.user.id), {headers: headers.headers_token})
              .then(res => {
                setListFriend((prev) => [...prev, {user: res.data.data}]);
              })
              .catch(err => console.log(err))
          })*/}
        }
      } else {
        ErrorNotification("Lỗi");
      }
      setLoading(false);
    };
    handleSearch();
  }, [debounced]);

  const getListFriend = (l, p, k) => {
    API.get(endpoints.findFriends(l, p, k), { headers: headers.headers_token })
      .then((res) => {
        if (res.data.success) {
          if (res.data.data.length > 0) {
            res.data.data.map((item, id) => {
              API.get(endpoints['user/profile'](item.user.id), {headers: headers.headers_token})
                .then(res => {
                  setListFriend([...res.data.data]);
                })
                .catch(err => console.log(err))
            })
            pageNumber.current += 1;
          }
        } else {
          ErrorNotification("Lỗi");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRedirectChat = () => {
    router.push("/chat");
  };

  useEffect(() => {
    getListFriend(limit, pageNumber.current, keyword);
  }, []);

  const ScrollGetList = (e) => {
    //    if(e.target.scrollTop + window.innerHeight >= 940){
    //         getListFriend(limit, pageNumber.current, keyword)
    //    }
  };

  useEffect(() => {
    RefListFriend.current?.addEventListener("scroll", ScrollGetList);
  }, []);

  // Gọi cho người khác, gọi cho nhóm (nếu nhóm có ít hơn 10 thành viên)
  const handleCall = (e, friend, value) => {
      e.preventDefault();
          var spec  ="toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=350,width=800,height=600";
          const url = `/videocall/callaway?id=${friend.user.id}&camera=${value}`
          var link = window.open(url,"_blank",spec)

  }

  // Nhận cuộc gọi từ người khác, từ nhóm
  const handleIncomingCall = (e, friend) => {
      e.preventDefault();
      var spec  ="toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=350,width=800,height=600";
      let url = `/videocall/incomingcall?id=${friend.user.id}`

      var link = window.open(url,"_blank",spec)
  }

  useEffect(() => {

    API.get(endpoints['user/profile'] , {headers : headers.headers_token})
        .then(function (response2) {
            console.log(response2.data);
        })
        .catch(function (error) {
            console.log(error);
        });
  }, [])


  return (
    <>
      <ToastContainer />
      <Head>
        <title>DAK - List Friend</title>
      </Head>
      <Layout page="listfriend">
        
        <div className={Styled.listFriendPage}>
          <h2 className={Styled.listFriendTitle}>Danh sách bạn bè </h2>
          <div className={Styled.listFriendSearch}>
            <input
              className={Styled.search}
              type="text"
              placeholder="Tìm kiếm bạn bè"
              onChange={(e) => setKeyword(e.target.value)}
            />
            {loading ? (
              <AiOutlineLoading3Quarters className={Styled.iconLoading} />
            ) : (
              <BsSearch className={Styled.iconSearch} />
            )}
          </div>
          <ul className={Styled.listFriend} ref={RefListFriend}>
            {listFriend.map((friend, index) =>
                <li className={Styled.friendItem} key={index}>
                  <Link href={`otherprofile/${friend.user.id}`}>
                    <a className={Styled.left}>
                      <div className={Styled.friendAvatar}>
                        <img src={friend.user.avatar} alt="Avatar" />
                      </div>
                      <div className={Styled.friendInfo}>
                        <p className={Styled.friendName}>{friend.user.name}</p>
                        <p className={Styled.quantityFollower}>{friend.user.followers} followers</p>
                      </div>
                    </a>
                  </Link>
                  <ul className={Styled.listFeature}>
                    <li className={Styled.featureItem}>
                      <Link href={`otherprofile/${friend.user.id}`}>
                        <FaUserCircle className={Styled.iconFeature} />
                      </Link>
                    </li>
                    <li className={Styled.featureItem} onClick={(e) => {
                        handleCall(e, friend, false)
                    }}>
                      <FaPhone className={Styled.iconFeature} />
                    </li>
                    <li
                      className={Styled.featureItem}
                    >
                      <BtnChatListfriend friendId={friend.user.id} />
                    </li>
                  </ul>
                </li>
            )}
          </ul>
        </div>
      </Layout>
    </>
  );
}
