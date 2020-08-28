import React from 'react';
import { print } from 'graphql';
import { apiFetch } from '@codeday/topo/utils';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import Button from '@codeday/topo/Atom/Button';
import Image from '@codeday/topo/Atom/Image';
import Content from '@codeday/topo/Molecule/Content';
import ContentfulRichText from '../components/ContentfulRichText';
import Page from '../components/Page';
import PhotoGallery from '../components/Press/PhotoGallery';
import PreviousCoverageLogos from '../components/PreviousCoverageLogos';
import { useQuery } from '../query';
import { PressQuery } from './press.gql';

export default function Press() {
  const { cms: { mission, pressContact, pressDetails, programs }} = useQuery();

  return (
    <Page slug="/press" title="Press">
      <Content>
        <Heading as="h2" fontSize="5xl" mb={8} mt={-8}>Press Kit</Heading>
        <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={8} mb={8}>
          <Box>
            <Text fontSize="xl" mb={8}>{mission?.items[0]?.value}</Text>
            <ContentfulRichText json={pressDetails?.items[0]?.richValue?.json} />
          </Box>
          <Box>
            <Box p={4} pb={0} borderWidth={1} borderColor="blue.600" bg="blue.50" color="blue.900">
              <Heading as="h3" fontSize="lg" mb={4} bold>Press Contact</Heading>
              <ContentfulRichText json={pressContact?.items[0]?.richValue?.json} />
            </Box>
            <Box textAlign="center" mt={4}>
              <Text color="current.textLight" bold>Previous Coverage</Text>
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

        <Heading as="h3" fontSize="2xl" mb={8}>Our Programs</Heading>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }} gap={8} mb={4}>
          {programs?.items?.map((program) => (
            <Box textAlign={{ base: 'left', md: 'center' }} key={program.name}>
              <Text bold>
                <Image src={program.logo.url} height="1em" display="inline-block" mr={2} alt="" />
                {program.name}
              </Text>
              <Text>{program.shortDescription}</Text>
            </Box>
          ))}
        </Grid>

        <Heading as="h3" fontSize="2xl" mb={4}>Assets</Heading>
        <Text>
          You may use any of the photos below without prior permission for editorial use, or other use under
          a CC-BY-SA license. All pictured individuals have signed media waivers.
        </Text>
        <Text>
          Logos are available for media use. All logos and names are trademarks of CodeDay.
        </Text>
        <Button as="a" href="https://f1.codeday.org/logos.zip" variantColor="blue">Download Logos</Button>
      </Content>
      <PhotoGallery />
    </Page>
  );
}

export async function getStaticProps() {
  const query = await apiFetch(print(PressQuery));

  return {
    props: {
      query,
    },
    revalidate: 300,
  };
}
