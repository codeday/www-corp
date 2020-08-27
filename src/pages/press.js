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
import { useQuery } from '../query';
import { PressQuery } from './press.gql';

export default function Press() {
  const { cms: { pressOverview, pressContact, pressDetails, programs }} = useQuery();

  return (
    <Page slug="/press" title="Press">
      <Content>
        <Heading as="h2" fontSize="5xl" mb={8}>Presskit</Heading>
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr', lg: '3fr 2fr' }} gap={8} mb={8}>
          <Box>
            <Text fontSize="xl" mb={8}>{pressOverview?.items[0]?.value}</Text>
            <ContentfulRichText json={pressDetails?.items[0]?.richValue?.json} />
          </Box>
          <Box>
            <Box p={4} borderWidth={1} borderColor="blue.600" bg="blue.50" color="blue.900">
              <Heading as="h3" fontSize="lg" mb={4} bold>Press Contact</Heading>
              <ContentfulRichText json={pressContact?.items[0]?.richValue?.json} />
            </Box>
          </Box>
        </Grid>

        <Heading as="h3" fontSize="2xl" mb={8}>Our Programs</Heading>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }} gap={8} mb={8}>
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
          You may use any of the photos or logos below without prior permission for editorial use, or under CC-BY-SA.
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
