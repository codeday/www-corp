import { createContext, useContext, useEffect } from 'react';
import LinkedInTag from 'react-linkedin-insight';
import { useCmp } from './Cmp';

const MarketingContext = createContext({
  linkedInConversion: () => {},
});

const LINKEDIN_CMP_PROVIDER = 'JQ2XQxIk';
const LINKEDIN_PARTNER_ID = '1831116';

export function MarketingProvider({ children }) {
  const { withConsent } = useCmp();

  useEffect(() => {
    if (typeof withConsent !== 'function') return;
    withConsent(LINKEDIN_CMP_PROVIDER, () => {
      LinkedInTag.init(LINKEDIN_PARTNER_ID, null, false);
    });
  }, [typeof withConsent]);

  const linkedInConversion = (e) => LinkedInTag.track(e);

  return (
    <MarketingContext.Provider value={{ linkedInConversion }}>
    {children}
    </MarketingContext.Provider>
  );
}

export function useMarketing() {
  return useContext(MarketingContext);
}