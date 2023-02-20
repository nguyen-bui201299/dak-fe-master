
import '../styles/globals.css'
import "../styles/search.css";
import "../styles/masonry.css";
import "../styles/button.css";
import '../components/Stories/flickity.css';
import '../styles/Boxchat.css';
import { store } from '../redux/store'
import { Provider } from 'react-redux'

import Loader from '../components/Loader/Loader';

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Loader />
      <Component {...pageProps} />
    </Provider>
  )
    
}

export default MyApp;
