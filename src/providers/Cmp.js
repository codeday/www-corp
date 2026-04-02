import { createContext, useContext, useState, useEffect, useReducer } from 'react';
import Head from 'next/head';
import Script from 'next/script';

const CmpContext = createContext({
  isCmpLoaded: false,
  isConsentRequired: true,
  withConsent: () => {},
  uc: undefined
});

export function CmpProvider({ children }) {
  const [isCmpLoaded, setIsCmpLoaded] = useState(false);
  const [isConsentRequired, setIsConsentRequired] = useState(true);
  const [uc, setUc] = useState(undefined);

  const [awaitingConsent, setAwaitingConsent] = useReducer((state, action) => {
    if (action.type === 'add') {
      return {
        ...state,
        [action.provider]: [...(state[action.provider] || []), action.callback],
      };
    }
    if (action.type === 'remove') {
      return Object.fromEntries(
        Object.entries(state).filter(([key]) => key !== action.provider)
      );
    }
    if (action.type === 'clear') {
      return {};
    }
    return state;
  }, {});

  useEffect(() => {
    if (isCmpLoaded) {
      window.uc.setCustomTranslations('https://termageddon.ams3.cdn.digitaloceanspaces.com/translations/');
      setUc(window.uc);
    }
  }, [isCmpLoaded]);

  useEffect(() => {
    if (!isCmpLoaded || !isConsentRequired) return;
    const consentInterval = setInterval(() => {
      setIsConsentRequired(window.UC_UI?.isConsentRequired());
    }, 1000);
    return () => clearInterval(consentInterval);
  }, [isCmpLoaded, isConsentRequired]);

  const checkConsent = (provider) => {
    return (UC_UI.getServicesBaseInfo() || [])
      .filter(s => s.id === provider && s.consent.status)
      .length > 0;
  }

  useEffect(() => {
    if (!isConsentRequired) {
      Object.entries(awaitingConsent).forEach(([provider, callbacks]) => {
        if (checkConsent(provider)) {
          callbacks.forEach(callback => callback());
        }
      });
      setAwaitingConsent({ type: 'clear' });
    }
  }, [isConsentRequired]);

  const withConsent = (provider, callback) => {
    if (isConsentRequired) {
      setAwaitingConsent({ type: 'add', provider, callback });
    } else if (uc.getStatus(provider)) {
      callback();
    }
  }

  return (
    <CmpContext.Provider value={{ isCmpLoaded, isConsentRequired, withConsent, uc }}>
        <Head>
            <link rel="preconnect" href="https://privacy-proxy.usercentrics.eu" />
            <link rel="preload" href="https://privacy-proxy.usercentrics.eu/latest/uc-block.bundle.js" as="script" />
            <link rel="preload" href="https://app.usercentrics.eu/browser-ui/latest/loader.js" as="script" />
        </Head>
        <Script src="https://privacy-proxy.usercentrics.eu/latest/uc-block.bundle.js" />
        <Script
            id="usercentrics-cmp"
            src="https://app.usercentrics.eu/browser-ui/latest/loader.js"
            data-settings-id="FQ314iLcg1whiu"
            strategy="beforeInteractive"
            onReady={() => {
              const checkCmpLoaded = () => typeof window?.uc !== 'undefined' && window.uc.isCMPLoaded;

              if (checkCmpLoaded()) {
                setIsCmpLoaded(true);
              } else {
                window.addEventListener('UC_UI_INITIALIZED', () => {
                  const checkLoadedTask = setInterval(() => {
                    if (checkCmpLoaded()) {
                      setIsCmpLoaded(true);
                      clearInterval(checkLoadedTask);
                    }
                  }, 200);
                }, { once: true });
              }
            }}
        />
      {children}
    </CmpContext.Provider>
  );
}

export function useCmp() {
  return useContext(CmpContext);
}