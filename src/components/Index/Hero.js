import React from 'react';
import { create } from 'random-seed';
import shuffle from 'knuth-shuffle-seeded';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import Button from '@codeday/topo/Atom/Button';
import Play from '@codeday/topocons/Icon/MediaPlay';
import Image from '@codeday/topo/Atom/Image';
import Slides from '@codeday/topo/Molecule/Slides';
import FlexScatter from '../FlexScatter';
import VideoLink from '../VideoLink';
import { useQuery } from '../../query';
import splitGroups from '../../utils/splitGroups';

function photoSlides(rand, photoGroups) {
  return photoGroups.map((pg, i) => (
    <Slides key={i} w="200px" h="150px" duration={rand.floatBetween(8, 15)}>
      {pg.map((p) => (
        <Box key={p.photo.jpg} position="relative">
          <Image src={p.photo.jpg} />
          <Text
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            mb={0}
            bg={`blackAlpha.500`}
            color="white"
            p={1}
            fontSize="sm"
          >
            {[p.event?.program?.name, p.region?.name, p.event?.startsAt?.substring(0,4)].join(' ')}
          </Text>
        </Box>
      ))}
    </Slides>
  ));
}

export default function Hero({ seed, ...props }) {
  const { cms: { indexHeroPhotos, mission, explainer } } = useQuery();

  const rand = create(seed);
  const photos = shuffle(indexHeroPhotos?.items || [], seed);

  return (
    <Box {...props}>
      <Grid
        templateColumns={{ base: '1fr', md: '8fr 5fr', lg: '8fr 10fr', xl: '4fr 3fr' }}
        gap={4}
        pl={4}
        overflow="hidden"
      >
        <Box m={{ base: 0, lg: 16 }} mt={{ base: 0, lg: 0 }} textAlign={{ base: 'center', md: 'left'}}>
          <Heading as="h2" fontSize="6xl" fontWeight="bold" lineHeight="1.1" mt={8}>
            There's a place in tech for everyone.
          </Heading>
          <Text fontSize="xl" mt={8} mb={8}>{mission?.items[0]?.value}</Text>
          {explainer && (
            <VideoLink url={explainer.url} autoPlay>
              <Button variantColor="red">Learn More&nbsp;<Play /></Button>
            </VideoLink>
          )}
        </Box>


        {/* Small display: 4x images */}
        <Box d={{ base: 'none', md: 'block', lg: 'none'}} marginRight='-100px'>
          <FlexScatter
            seed={seed}
            gapMin={5}
            gapMax={15}
            yOffsetMin={-25}
            yOffsetMax={75}
          >
            {photoSlides(rand, splitGroups(photos, 4))}
          </FlexScatter>
        </Box>

        {/* Large display: 6x images */}
        <Box d={{ base: 'none', lg: 'block'}} marginRight={{ base: '-125px', xl: '0'}}>
          <FlexScatter
            seed={seed}
            gapMin={25}
            gapMax={50}
            yOffsetMin={-25}
            yOffsetMax={75}
          >
            {photoSlides(rand, splitGroups(photos, 6))}
          </FlexScatter>
        </Box>
      </Grid>
    </Box>
  );
}
