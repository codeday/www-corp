import { createContext, useContext, useEffect, ReactNode } from 'react';
import LinkedInTag from 'react-linkedin-insight';
import { useCmp } from './Cmp';

interface MarketingContextType {
  linkedInConversion: (e: string) => void;
}

const MarketingContext = createContext<MarketingContextType>({
  linkedInConversion: () => {},
});

const LINKEDIN_CMP_PROVIDER = 'JQ2XQxIk';
const LINKEDIN_PARTNER_ID = '1831116';

export function MarketingProvider({ children }: { children: ReactNode }) {
  const { withConsent } = useCmp();

  useEffect(() => {
    if (typeof withConsent !== 'function') return;
    withConsent(LINKEDIN_CMP_PROVIDER, () => {
      LinkedInTag.init(LINKEDIN_PARTNER_ID, null, false);
    });
  }, [typeof withConsent]);

  const linkedInConversion = (e: string) => LinkedInTag.track(e);

  return (
    <MarketingContext.Provider value={{ linkedInConversion }}>
    {children}
    </MarketingContext.Provider>
  );
}

export function useMarketing(): MarketingContextType {
  return useContext(MarketingContext);
}
