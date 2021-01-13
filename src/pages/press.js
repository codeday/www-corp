import React from 'react';
import { print } from 'graphql';
import { DateTime } from 'luxon';
import { apiFetch } from '@codeday/topo/utils';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import Button from '@codeday/topo/Atom/Button';
import Image from '@codeday/topo/Atom/Image';
import Divider from '@codeday/topo/Atom/Divider';
import Content from '@codeday/topo/Molecule/Content';
import ContentfulRichText from '../components/ContentfulRichText';
import Page from '../components/Page';
import PhotoGallery from '../components/Press/PhotoGallery';
import PreviousCoverageLogos from '../components/PreviousCoverageLogos';
import { useQuery } from '../query';
import { PressQuery } from './press.gql';

export default function Press({ seed }) {
  const { cms: { mission, pressContact, pressDetails, programs, previousCoverage }} = useQuery();

  return (
    <Page slug="/press" title="Press">
      <Content>
        <Heading as="h2" fontSize="5xl" mb={8} mt={-8}>Press Kit</Heading>
        <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={8} mb={8}>
          <Box>
            <Text fontSize="xl" mb={8}>{mission?.items[0]?.value}</Text>
            <ContentfulRichText json={pressDetails?.items[0]?.richValue?.json} />

            <Heading as="h4" fontSize="lg" mt={6} mb={4}>Our Programs:</Heading>
            {programs?.items?.map((program) => (
              <Box key={program.name}>
                <Text bold mb={0}>
                  <Image src={program.logo.url} height="1em" display="inline-block" mr={2} alt="" />
                  {program.name}
                </Text>
                <Text>{program.shortDescription}</Text>
              </Box>
            ))}
          </Box>
          <Box>
            <Box p={4} pb={0} mb={4} borderWidth={1} borderColor="blue.600" bg="blue.50" color="blue.900">
              <Heading as="h3" fontSize="lg" mb={4} bold>Press Contact</Heading>
              <ContentfulRichText json={pressContact?.items[0]?.richValue?.json} />
            </Box>

            <Box textAlign="center">
              <Button variantColor="blue" as="a" href="#assets">Download Press Images &amp; Logos</Button>
            </Box>

            <Box textAlign="center" mt={4}>
              <Text color="current.textLight" bold>As Seen In</Text>
              <PreviousCoverageLogos
                num={4}
                mr={4}
                mb={2}
                width={24}
                style={{ filter: 'grayscale(1)' }}
                opacity="0.6"
              />
            </Box>
          </Box>
        </Grid>
      </Content>

      <Content wide borderWidth={1} rounded="md" p={4} shadow="lg" mb={16}>
        <Heading as="h3" fontSize="2xl" mb={8} textAlign="center">Recent Coverage</Heading>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' }} gap={8} mb={8}>
          {previousCoverage?.items?.map((coverage) => (
            <Box as="a" href={coverage.url} target="_blank" rel="noopener">
              <Text bold mb={0}>{coverage.title}</Text>
              <Text color="current.textLight">
                {coverage.publicationName},{' '}
                {DateTime.fromISO(coverage.date).toLocaleString({ month: 'long', year: 'numeric' })}
              </Text>
            </Box>
          ))}
        </Grid>
      </Content>

      <Content>
        <Heading as="h3" fontSize="2xl" mb={4}><a name="assets"></a>Assets</Heading>
        <Text>
          You may use any of the photos below without prior permission for editorial use, or other use under
          a CC-BY-SA license. All pictured individuals have signed media waivers.
        </Text>
        <Text>
          Logos are available for media use. All logos and names are trademarks of CodeDay.
        </Text>
        <Button as="a" href="https://f1.codeday.org/logos.zip" variantColor="blue">Download Logos</Button>
      </Content>
      <PhotoGallery seed={seed} />
    </Page>
  );
}

export async function getStaticProps() {
  const query = await apiFetch(print(PressQuery));

  return {
    props: {
      query,
      seed: Math.random().toString(),
    },
    revalidate: 300,
  };
}
