import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@codeday/topo/Atom';

export default function Calendly ({ slug, ...props }) {
  const holder = useRef(null);
  const [hasCalendlyLoaded, setHasCalendlyLoaded] = useState(false);

  const typeOfWindow = typeof window; // For static analysis
  const windowCalendly = typeOfWindow !== 'undefined' && window?.Calendly;

  useEffect(() => {
    if (window && !window.Calendly) {
      const script = document.createElement('script');
      script.src = 'https://calendly.com/assets/external/widget.js';
      script.addEventListener('load', () => {
        setHasCalendlyLoaded(true);
      });
      document.head.appendChild(script);

      const link = document.createElement('link');
      link.href = 'https://calendly.com/assets/external/widget.css';
      link.rel = 'stylesheet';
      document.body.appendChild(link);

      return () => {
        document.head.removeChild(script);
        document.body.removeChild(link);
      }
    }
  }, [typeOfWindow]);

  useEffect(() => {
    if (windowCalendly && holder) {
      window.Calendly.initInlineWidget({
        url: `https://calendly.com/${slug}`,
        parentElement: holder.current,
        prefill: {},
        utm: {}
      });
    }
  }, [windowCalendly, hasCalendlyLoaded, holder, slug]);

  return (
    <Box w="100%" h="50em" border="none" {...props} ref={holder} />
  );
}
Calendly.propTypes = {
  slug: PropTypes.string.isRequired,
}
