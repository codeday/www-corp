import React, { useState, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import Content from '@codeday/topo/Molecule/Content';
import shuffle from 'knuth-shuffle-seeded';
import TextQuote from './TextQuote';
import Globe from './Globe';
import { useQuery } from '../../../query';
import VideoTestimonialThumbnail from '../../VideoTestimonialThumbnail';

const DISPLAY_TIME = 10;
const TRANSITION_TIME = 0.5;

export default function Quotes({ seed }) {
  const { cms: { quoteRegions, quoteTestimonials } } = useQuery();
  const textQuotes = shuffle(quoteTestimonials?.items.filter((q) => !q.video), seed);
  const videoQuotes = shuffle(quoteTestimonials?.items.filter((q) => q.video?.url && q.image?.url), seed);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [visibleQuoteIndex, nextQuote] = useReducer((previous) => (previous + 1) % textQuotes.length, 0);

  // Set up the quote transition interval
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let transitionTimeout;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      transitionTimeout = setTimeout(() => {
        transitionTimeout = null;
        nextQuote();
        setIsTransitioning(false);
      }, (TRANSITION_TIME) * 1000);
    }, DISPLAY_TIME * 1000);
    return () => {
      clearInterval(interval);
      if (transitionTimeout) clearTimeout(transitionTimeout);
    }
  }, [typeof window, TRANSITION_TIME, DISPLAY_TIME]);

  return (
    <Content wide>
      <Grid templateColumns={{ base: '1fr', lg: '50% 50%'}} alignItems="center" gap={8} position="relative">


        {/* Globe */}
        <Box
          display={{ base: 'none', lg: 'block'}}
          borderColor="current.border"
          borderWidth={1}
          boxShadow="lg"
          rounded="md"
        >
          <Globe testimonial={textQuotes[visibleQuoteIndex]} regions={quoteRegions?.items} />
        </Box>

        {/* Text Quote */}
        <Box>
          <Heading
            as="h3"
            fontSize="4xl"
            bold
            mb={8}
            mt={0}
            d={{ base: 'none', lg: 'block' }}
            position="absolute" top="0"
          >
            In-person events in {quoteRegions?.items?.length } cities + worldwide virtual events.
          </Heading>
          <TextQuote
            testimonial={textQuotes[visibleQuoteIndex]}
            opacity={isTransitioning ? 0 : 1}
            transition={`opacity ${TRANSITION_TIME/2}s`}
            pt={{ base: 0, lg: 16 }}
          />
        </Box>
      </Grid>
      <Text color="current.textLight" fontSize="2xl" mt={8} textAlign="center">
        Hear from more students and volunteers:
      </Text>
      <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)'}} gap={4}>
        {videoQuotes.map((q) => (
          <VideoTestimonialThumbnail video={q} />
        ))}
      </Grid>
    </Content>
  )
}
Quotes.propTypes = {
  seed: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
