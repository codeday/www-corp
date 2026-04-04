import { ThemeProvider } from "@codeday/topo/Theme";

import "react-responsive-modal/styles.css";
import { debug } from "@codeday/utils";
import { AppProps } from "next/app";
import { useEffect } from "react";

import { MarketingProvider, FundraiseProvider } from "../providers";
import { Provider } from "../query";
const DEBUG = debug(["www", "pages", "_app"]);

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    DEBUG("pageProps", pageProps);
  }, []);
  return (
    <>
      <ThemeProvider brandColor="red" useSystemColorMode cookies={pageProps.cookies}>
        <MarketingProvider>
          <FundraiseProvider>
            <Provider value={pageProps?.query || {}}>
              <Component {...pageProps} />
            </Provider>
          </FundraiseProvider>
        </MarketingProvider>
      </ThemeProvider>
    </>
  );
}
