import React from 'react';
import { Provider } from '../query';
import Theme from '@codeday/topo/Theme';
import 'react-responsive-modal/styles.css';

export default function App ({ Component, pageProps }) {
  return (
    <Theme  brandColor="red" analyticsId="AHHYLKBK">
      <Provider value={pageProps?.query || {}}>
        <Component {...pageProps} />
      </Provider>
    </Theme>
  );
}
