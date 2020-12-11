import React from 'react';
import Box, { Grid, VisibilityCheckBox, RatioBox } from '@codeday/topo/Atom/Box';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import Button from '@codeday/topo/Atom/Button';
import Play from '@codeday/topocons/Icon/MediaPlay';
import Live from './Live';
import Teaser from './Teaser';
import VideoLink from '../VideoLink';
import { useQuery } from '../../query';

export default function Hero({ seed, twitchUsername, ...props }) {
  const { cms: { mission, explainer } } = useQuery();

  const tagline = (
    <Box m={{ base: 8, lg: 0, xl: 16 }} mt={{ base: 0, xl: 0 }} textAlign={{ base: 'center', lg: 'left'}}>
      <Heading as="h2" fontSize="6xl" fontWeight="bold" lineHeight="1.1" color="#311c1c" mt={8}>
        There's a place in tech for everyone.
      </Heading>
      <Text fontSize="xl" mt={8} mb={8} color="#311c1c">{mission?.items[0]?.value}</Text>
      {explainer && (
        <VideoLink url={explainer.url} autoPlay>
          <Button variantColor="red">Learn More&nbsp;<Play /></Button>
        </VideoLink>
      )}
    </Box>
  );
  return (
    <Box maxWidth="1800px" role="banner" m="0 auto" {...props}>
      <Grid
        templateColumns={{ base: '1fr', lg: '8fr 10fr', xl: '4fr 3fr' }}
        gap={8}
        pl={4}
        pr={4}
        overflow={!twitchUsername && 'hidden'}
      >
        {tagline}
        <VisibilityCheckBox
          d={{ base: 'none', lg: 'block' }}
          mt={{ base: 12, xl: -12 }}
        >
          <Box
            shadow="sm"
            rounded="sm"
            borderWidth={1}
          >
            {twitchUsername ? (
              <Live username={twitchUsername} />
            ) : (
              <Teaser />
            )}
          </Box>
        </VisibilityCheckBox>
      </Grid>
    </Box>
  );
}
