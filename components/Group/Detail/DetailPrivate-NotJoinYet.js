
// import Document from "next/document";
import Image from "next/image";
import React from "react";
import { BiLockAlt } from "react-icons/bi";
import { BsFillLockFill, BsSearch } from "react-icons/bs";
import { Tab } from "semantic-ui-react";
import ButtonJoin from "../../Button/ButtonJoin/ButtonJoin";
import Button from "../../Button/ButtonJoin/ButtonJoin.module.css";
import DropdownGroup from "../../Dropdown/Dropdown-NotJoinGroupYet/Dropdown";
import Styled from "../Detail/DetailContentGroup.module.css";
import PicturePeopleGroup from '../component/PicturePeopleGroup'

class DetailContent extends React.Component {
  state = { activeIndex: 0 };
  handleRangeChange = (e) => this.setState({ activeIndex: e.target.value });
  handleTabChange = (e, { activeIndex }) => this.setState({ activeIndex });
  handleItemClick = (id) => this.setState({ activeIndex: id });
  render() {
    const { activeIndex } = this.state;
    const panes = [
      {
        menuItem: "Giới thiệu",
        render: () => (
          <div style={{ textAlign: "center" }}>
            <BsFillLockFill style={{ fontSize: "18em", opacity: "0.7" }} />
          </div>
        ),
      },
      {
        menuItem: "Thảo luận",
        render: () => (
          <div style={{ textAlign: "center" }}>
            <BsFillLockFill style={{ fontSize: "18em", opacity: "0.7" }} />
          </div>
        ),
      },
      {
        menuItem: "Phòng họp",
        render: () => (
          <div style={{ textAlign: "center" }}>
            <BsFillLockFill style={{ fontSize: "18em", opacity: "0.7" }} />
          </div>
        ),
      },
      {
        menuItem: "Ảnh",
        render: () => (
          <div style={{ textAlign: "center" }}>
            <BsFillLockFill style={{ fontSize: "18em", opacity: "0.7" }} />
          </div>
        ),
      },
      {
        menuItem: "Các file phương tiện",
        render: () => (
          <div style={{ textAlign: "center" }}>
            <BsFillLockFill style={{ fontSize: "18em", opacity: "0.7" }} />
          </div>
        ),
      },
      {
        menuItem: "Album",
        render: () => (
          <div style={{ textAlign: "center"}}>
            <BsFillLockFill style={{ fontSize: "18em", opacity: "0.7" }} />
          </div>
        ),
      },
    ];

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
            <DropdownGroup
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
                STECH GROUP
                <p>
                  <BiLockAlt
                    style={{ position: "relative", top: "2", fontSize: "16px" }}
                  />{" "}
                  Nhom kin - 220 thanh vien
                </p>
              </span>
              <div className={Styled["User-Group"]}>
                <PicturePeopleGroup />
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
              <ButtonJoin />
            </div>
          </div>
        </div>
        <div className={Styled["privateGroup-cmn"]}>
          <Tab
            className="mainGroups"
            panes={panes}
            activeIndex={activeIndex}
            onTabChange={this.handleTabChange}
        />
          <div className={Styled["privateGroup-description"]}>
            <h4>Đây là nhóm kín</h4>
            <p>Tham gia vào group để theo dõi các nội dung bài viết</p>
          </div>
        </div>
      </div>
    
    );
  }
}

export default DetailContent;
