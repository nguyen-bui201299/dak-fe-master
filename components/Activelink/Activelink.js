import { withRouter } from 'next/router';
import PropTypes from 'prop-types';
// import { useEffect } from 'react';

  
  const ActiveLink = ({ router, href, isLeftSideBar = false, children }) => {
  const isCurrentPath = router.pathname === href || router.asPath === href;

  const handleClick = (e) => {
    e.preventDefault();
    router.push(href);
  };

  (function prefetchPages() {
    if (typeof window !== 'undefined') router.prefetch(router.pathname);
  })();

  return (
    <a
      href={href}
      onClick={handleClick}
      style={{
        textDecoration: 'none',
        margin: 16,
        padding: 0,
        fontWeight: isCurrentPath ? 'bold' : 'normal', // I left mine all bold
        fontSize: 17,
        color: isLeftSideBar ? '#e65100' : '#ffeb3b',
      }}>
      {children}
    </a>
  );
};

ActiveLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.any,
};

export default withRouter(ActiveLink);