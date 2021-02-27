import React from 'react';
import Box, { Grid, VisibilityCheckBox, RatioBox } from '@codeday/topo/Atom/Box';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import Button from '@codeday/topo/Atom/Button';
import Play from '@codeday/topocons/Icon/MediaPlay';
import Broadcast from '@codeday/topocons/Icon/Broadcast';
import Live from './Live';
import Teaser from './Teaser';
import VideoLink from '../VideoLink';
import { useQuery } from '../../query';

export default function Hero({ twitch, ...props }) {
  const { cms: { mission, explainer } } = useQuery();

  const tagline = (
    <Box m={{ base: 8, lg: 0, xl: 16 }} mt={{ base: 0, xl: 0 }} textAlign={{ base: 'center', lg: 'left'}}>
      <Heading as="h2" fontSize="6xl" fontWeight="bold" lineHeight="1.1" color="#311c1c" mt={8}>
        There's a place in tech for everyone.
      </Heading>
      <Text fontSize="xl" mt={8} mb={8} color="#311c1c">{mission?.items[0]?.value}</Text>
      {explainer && (
        <VideoLink url={explainer.url} autoPlay>
          <Button variantColor="red">Learn More&nbsp;<Play style={{ position: 'relative', top: '-0.15em' }} /></Button>
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
        pt={8}
        overflow={!twitch?.username && 'hidden'}
      >
        {tagline}
        <VisibilityCheckBox
          d={{ base: 'none', lg: 'block' }}
          mt={{ base: 12, xl: -12 }}
        >
          {twitch?.username ? (
            <Box>
              <Box fontWeight="bold">
                <Box as="span" color="red.600">
                    <Broadcast style={{ position: 'relative', top: '-0.15em'}} /> LIVE{twitch.title && ': '}
                </Box>
                {twitch.title && (
                  <Box as="span" color="current.textLight">
                      {twitch.title}
                  </Box>
                )}
              </Box>
              <Box
                shadow="sm"
                rounded="sm"
                borderWidth={1}
              >
                <Live username={twitch.username} />
              </Box>
            </Box>
          ) : (
            <Box
              shadow="sm"
              rounded="sm"
              borderWidth={1}
            >
              <Teaser />
            </Box>
          )}
        </VisibilityCheckBox>
      </Grid>
    </Box>
  );
}
