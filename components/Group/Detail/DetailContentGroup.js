import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { IoEarthSharp } from "react-icons/io5";
import { RiGitRepositoryPrivateLine } from "react-icons/ri";
import API, { endpoints, headers } from "../../../API";
import ButtonJoin from "../../Button/ButtonJoin/ButtonJoin";
import Button from "../../Button/ButtonJoin/ButtonJoin.module.css";
import DropdownGroupForAdmin from "../../Dropdown/DropdownGroup-ForAdmin/Dropdown";
import Post from '../../Post/Post';
import PicturePeopleGroup from '../component/PicturePeopleGroup';
import Styled from "../Detail/DetailContentGroup.module.css";
import Introduce from "./Introduce/Introduce";

export default function DetailContentGroup(props) {
  const [menuIndex, setMenuIndex] = useState(1);
  const [isActive, setIsActive] = useState(1);
  const [listPost, setListPost] = useState([])
  const [infoGroup, setInfoGroup] = useState()

  // const router = useRouter()

  useEffect(() => {
    console.log(props.idGroup);
    API.get(endpoints.getDetailGroup(props.idGroup), { headers: headers.headers_token })
      .then(res => {
        if (res.status == 200) {
          console.log(res);
          setInfoGroup(res.data)
        }
      })
      .catch(err => {
        console.log(err);
      })
  }, [props.idGroup])

  useEffect(() => {
    API.get(endpoints.getGroupPost(props.idGroup), { headers: headers.headers_token })
      .then((res) => {
        setListPost(res.data.data)
      })
      .catch((err) => console.log(err))
  }, [props.idGroup])

  console.log("infoGroup",infoGroup);

  return (
    <div id="something" className={Styled.main}>
      <div className={Styled["main-Detail"]}>
        <div className={Styled["other-thing"]}>
          <BsSearch
            style={{
              color: "var(--text-color)",
              fontSize: "20px",
              cursor: "pointer",
              marginRight: "20px",
            }}
          />
          <DropdownGroupForAdmin
            style={{ fontSize: "24px", color: "var(--text-color)" }}
          />
        </div>
        <Image
          src={"/images/3126518.jpg"}
          alt="picture-group"
          width={1000}
          height={350}
        ></Image>
        <div className={Styled["main-Detail-Content"]}>
          <div className={Styled["name-number-Group"]}>
            <span>
              {/* chỗ này để tên nhóm */}
              {infoGroup && infoGroup.group.name}
              {
                infoGroup && infoGroup.group.access === 1
                  ? <p>
                    {/* chỗ này để loại nhóm và số lượng thành viên của nhóm */}
                    <IoEarthSharp
                      style={{ position: "relative", top: "3", fontSize: "16px", marginRight: '5px' }}
                    />
                    Public group - {infoGroup && infoGroup.member_count} members
                  </p>
                  :
                  <p>
                    {/* chỗ này để loại nhóm và số lượng thành viên của nhóm */}
                    <RiGitRepositoryPrivateLine
                      style={{ position: "relative", top: "3", fontSize: "16px", marginRight: '5px' }}
                    />
                    Private group - {infoGroup && infoGroup.member_count} members
                  </p>
              }
            </span>
            <div className={Styled["User-Group"]}>
              <PicturePeopleGroup />
              <PicturePeopleGroup />
              <PicturePeopleGroup />
              <PicturePeopleGroup />
              <span className={Styled["picture-people-Group"]}>
                <Image
                  src={"/images/istockphoto-1186972006-612x612.jpg"}
                  alt="other-user"
                  width={35}
                  height={35}
                />
              </span>
            </div>
          </div>
          <div className={Button["button-Group"]}>
            <button>+ Mời bạn bè</button>
            <ButtonJoin 
              isJoin = {infoGroup && infoGroup.has_joined}
            />
          </div>
        </div>
      </div>
      <Introduce/>
      <div className={Styled["posts-of-user"]}>
        <div className={Styled["box-posts"]}>
          { listPost &&
            listPost.map((item, index) => (
              <Post
                typepost={item.post.post_url_type}
                url={item.post.post_url}
                key={index}
                postid={item.post.id}
                post={item}
              />
            ))
          }
        </div>
      </div>
    </div>
  );
}
