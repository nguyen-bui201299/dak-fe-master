// import Document, { Html, Head, Main, NextScript } from 'next/document'
import Styled from "../History/Search-history.module.css"
import ListHistory from '../List/ListHistory/List-History';
import ListFind from '../List/ListHistory/List-Find';
import ListAccess from '../List/ListHistory/List-Access';
import React, { useState } from "react";
import $ from 'jquery'

// const listItems = [
//     { values: 1, clicked: true, desc: "Tất cả" },
//     { values: 2, clicked: false, desc: "Tìm kiếm" },
//     { values: 3, clicked: false, desc: "Truy cập" },
// ];

// class Searched extends Document {
//     componentDidMount() {
//         $(".history").on('click', function(){
//             console.log('sdsdsd')
//         });
//     }
//     constructor(props) {
//         super(props);
//         this.state = {
//             listItems: listItems
//         };
//     }
//     handleOnClick = e => {
//         const { listItems } = this.state;
    
//         const updatedItems = listItems.map(item => {
//             if (item.values === e.target.value) {
//                 return {
//                 ...item,
//                 clicked: true
//                 };
//             } else {
//                 return {
//                 ...item,
//                 clicked: false
//                 };
//             }
//         });
    
//         this.setState({
//             listItems: updatedItems
//         });
//     };
//     createListItems = () => {
//         const { listItems } = this.state;
//             return listItems.map(item => {
//             return (
//                 <li
//                 onClick={this.handleOnClick}
//                 className={item.clicked ? "active" : ""}
//                 value={item.values}
//                 >
//                 {item.desc}
//                 </li>
//             );
//         });
//     };
// render() {
//         return (
//             <div className={Styled.history}>
//                 <div className={Styled["history-content"]}>
//                     <h2>Lịch Sử Tìm Kiếm</h2>
//                 </div>
//             <hr/>

//                 <div className={Styled["pills"]}>
//                     <ul className={Styled["pills-content"]}>
//                     {this.createListItems()}
//                     </ul>
//                 </div>
//             <List/>
//             </div>
//         )
//     }
// }
// export default Searched


const History = () => {
  return  <ListHistory />;
};
const Find = () => {
  return <ListFind />;
};
const Access = () => {
  return <ListAccess />;
};

export default function Searched() {
  if (typeof window !== "undefined") {
    $("ul li").click(function(){
      $('ul li').removeClass("active");
      $(this).addClass("active");
    })
  }
  const [active, setActive] = useState<number>(1);
  
  const toggleHandler = (id: number) => () =>
    setActive((active) => (active === id ? 1 : id));
    
  return (
    <div className={Styled.history}>
      <div className={Styled["history-content"]}>
        <h2>Lịch Sử Tìm Kiếm</h2>
      </div>
      <hr/>
      <div className={Styled["pills"]}>
          <ul className={Styled.pills_content}>
            <li className='active' onClick={toggleHandler(1)}>Tất cả</li>
            <li onClick={toggleHandler(2)}>Tìm kiếm</li>
            <li onClick={toggleHandler(3)}>Truy cập</li>
          </ul>
      </div>
      {active === 1 && <History />}
      {active === 2 && <Find />}
      {active === 3 && <Access />}
    </div>
  );
}