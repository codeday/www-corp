import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Script from 'next/script';
import Head from 'next/head';

interface FundraiseContextType {
  isFundraiseLoaded: boolean;
}

const FundraiseContext = createContext<FundraiseContextType>({
  isFundraiseLoaded: false,
});

const FUNDRAISE_UP_IFRAME_SELECTOR = 'iframe[title="Donate Button"], iframe[title="Donation Form"], iframe[title="Donation Activity Popup"], .fun-social-proof-iframe, iframe[title="Donation Reminder"]';

export function FundraiseProvider({ children }: { children: ReactNode }) {
  const [isFundraiseLoaded, setIsFundraiseLoaded] = useState(false);
  useEffect(() => {
    if (isFundraiseLoaded) {
      const elements = document.querySelectorAll(FUNDRAISE_UP_IFRAME_SELECTOR);
      elements.forEach((element) => {
        if (element instanceof HTMLIFrameElement && element.contentDocument?.body) {
          element.style.colorScheme = 'normal';
          element.style.backgroundColor = 'transparent';
          element.contentDocument.documentElement.style.backgroundColor = 'transparent';
          element.contentDocument.body.style.backgroundColor = 'transparent';
        }
      });
    }
  }, [isFundraiseLoaded]);


  return (
    <FundraiseContext.Provider value={{ isFundraiseLoaded }}>
      <Head>
        <link rel="preconnect" href="https://cdn.fundraiseup.com" />
        <link rel="preload" href="https://cdn.fundraiseup.com/widget/AHCSATYN" as="script" />
      </Head>
      <Script
        strategy="afterInteractive"
        src="https://cdn.fundraiseup.com/widget/AHCSATYN"
        onLoad={() => {
          const checkLoadedTask = setInterval(() => {
            if (document.querySelectorAll(FUNDRAISE_UP_IFRAME_SELECTOR).length > 0) {
              setIsFundraiseLoaded(true);
              clearInterval(checkLoadedTask);
            }
          }, 500);
        }}
      />
      {children}
    </FundraiseContext.Provider>
  );
}

export function useFundraise(): FundraiseContextType {
  const fundraiseData = useContext(FundraiseContext)
  return fundraiseData;
};
