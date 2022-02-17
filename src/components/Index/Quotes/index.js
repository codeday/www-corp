import React, { useState, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Text, Heading, Grid, VisibilityCheckBox, RatioBox } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
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
    <>
      <Content>
        <Heading
          as="h3"
          fontSize="2xl"
          fontWeight="bold"
          mt={0}
          textAlign="center"
        >
          In-person in {quoteRegions?.items?.length } cities + worldwide online events.
        </Heading>
        <Grid templateColumns={{ base: '1fr', lg: '40% 60%'}} alignItems="center" gap={8} position="relative">
          {/* Globe */}
          <VisibilityCheckBox display={{ base: 'none', lg: 'block'}}>
            <RatioBox w="1" h="1" auto="h">
              <Globe testimonial={textQuotes[visibleQuoteIndex]} regions={quoteRegions?.items} />
            </RatioBox>
          </VisibilityCheckBox>

          {/* Text Quote */}
          <Box>
            <TextQuote
              testimonial={textQuotes[visibleQuoteIndex]}
              opacity={isTransitioning ? 0 : 1}
              transition={`opacity ${TRANSITION_TIME/2}s`}
            />
          </Box>
        </Grid>
      </Content>
      <Content wide>
        <Text color="current.textLight" fontSize="2xl" mt={12} mb={8} textAlign="center">
          Hear from more students and volunteers:
        </Text>
        <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, minmax(0, 1fr))'}} gap={6}>
          {videoQuotes.map((q) => (
            <VideoTestimonialThumbnail key={q.video.url} video={q} />
          ))}
        </Grid>
      </Content>
    </>
  )
}
Quotes.propTypes = {
  seed: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
