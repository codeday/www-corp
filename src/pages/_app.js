import React from 'react';
import Script from 'next/script';
import { useRouter } from 'next/router';
import Theme from '@codeday/topo/Theme';
import { Provider } from '../query';
import 'react-responsive-modal/styles.css';
import * as snippet from '@segment/snippet';

const { NODE_ENV = 'development' } = process.env;
const DEFAULT_WRITE_KEY = '1kVhnEo7QpqZc8LgvSAWb1iJOw3D61fi';

function renderSnippet() {
  const opts = {
    page: true,
    apiKey: process.env.NEXT_PUBLIC_ANALYTICS_WRITE_KEY || DEFAULT_WRITE_KEY,
  };
  if (NODE_ENV === 'development') {
    return snippet.max(opts);
  }
  return snippet.min(opts);
}

export default function App ({ Component, pageProps }) {
  return (
    <>
      <Script strategy="beforeInteractive" src="https://cdn.fundraiseup.com/widget/AHCSATYN" />
      <Script dangerouslySetInnerHTML={{ __html: renderSnippet() }} />
      <Theme withChat brandColor="red" analyticsId="AHHYLKBK">
        <Provider value={pageProps?.query || {}}>
          <Component {...pageProps} />
        </Provider>
      </Theme>
    </>
  );
}
