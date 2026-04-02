import { ThemeProvider } from '@codeday/topo/Theme';
import 'react-responsive-modal/styles.css';
import { AppProps } from 'next/app';
import { Provider } from '../query';
import { FundraiseProvider } from '../providers/Fundraise';
import { CmpProvider } from '../providers/Cmp';
import { MarketingProvider } from '../providers';

export default function App ({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider brandColor="red" useSystemColorMode cookies={pageProps.cookies}>
        <CmpProvider>
          <MarketingProvider>
            <FundraiseProvider>
              <Provider value={pageProps?.query || {}}>
                <Component {...pageProps} />
              </Provider>
            </FundraiseProvider>
          </MarketingProvider>
        </CmpProvider>
      </ThemeProvider>
    </>
  );
}
