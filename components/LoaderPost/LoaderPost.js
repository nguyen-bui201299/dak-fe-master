import React from 'react';
import Styles from './LoaderPost.module.css';

const LoaderPost = () => {
  return (
    <main className={Styles.loader_post_wrapper}>
        <article className={Styles.post}>
        <div className={Styles.post__loader}>
            <div className={Styles.loader__bar__1}></div>
            <div className={Styles.loader__bar__2}></div>
            <div className={Styles.loader__bar__3}></div>
            <div className={Styles.loader__bar__4}></div>
            <div className={Styles.loader__bar__5}></div>
            <div className={Styles.loader__bar__6}></div>
            <div className={Styles.loader__bar__7}></div>
            <div className={Styles.loader__bar__8}></div>
            <div className={Styles.loader__bar__9}></div>
            <div className={Styles.loader__bar__10}></div>
            <div className={Styles.loader__bar__11}></div>
            <div className={Styles.loader__bar__12}></div>
        </div>
        </article>
  </main>
  )
}

export default LoaderPost