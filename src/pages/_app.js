import React from 'react';
import Script from 'next/script';
import Theme from '@codeday/topo/Theme';
import { Provider } from '../query';
import 'react-responsive-modal/styles.css';

export default function App ({ Component, pageProps }) {
  return (
    <>
      <Script strategy="beforeInteractive" src="https://cdn.fundraiseup.com/widget/AHCSATYN" />
      <Theme withChat brandColor="red" analyticsId="AHHYLKBK">
        <Provider value={pageProps?.query || {}}>
          <Component {...pageProps} />
        </Provider>
      </Theme>
    </>
  );
}
