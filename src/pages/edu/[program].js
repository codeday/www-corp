import React from 'react';
import { print } from 'graphql';
import { apiFetch } from '@codeday/topo/utils';
import Content from '@codeday/topo/Molecule/Content';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Text, { Heading, Link } from '@codeday/topo/Atom/Text';
import CognitoForm from '@codeday/topo/Molecule/CognitoForm';
import Image from '@codeday/topo/Atom/Image';
import ContentfulRichText from '../../components/ContentfulRichText';
import Page from '../../components/Page';
import { useQuery } from '../../query';
import { ProgramQuery } from './program.gql';

export default function EducationProgram() {
  const { cms } = useQuery();
  const program = cms?.programs?.items[0];

  if (!program) return <></>;

  return (
    <Page slug={`/edu/${program.webname}`} title={`${program.name} for Education`}>
      <Content>
        <Heading as="h2" fontSize="5xl" mb={8}>
          <Image
            src={program.logo.url}
            alt=""
            size="1em"
            d="inline-block"
            position="relative"
            top="-0.075em"
            mr="0.2em"
          />
          {program.name}
          <Box
            d="inline-block"
            bg="current.text"
            color="current.bg"
            ml="0.8em"
            p="0.2em"
            pt="0.1em"
            pb={0}
            rounded="md"
            fontSize="0.5em"
            fontWeight="bold"
            position="relative"
            top="-0.25em"
          >
            EDU
          </Box>
        </Heading>
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr', lg: '6fr 3fr' }} gap={8}>

          <Box>
            <Text fontSize="xl" bold>{program.description}</Text>
            <ContentfulRichText
              json={program.educationDetails.json}
              links={program.educationDetails.links}
              h1Size="3xl"
            />
            <Box borderWidth={2} borderColor="green.600" rounded="sm" mt={8}>
              <Heading as="h3" fontSize="2xl" mb={2} bg="green.600" p={4} color="white">Request More Info</Heading>
              <Box p={4}>
                <CognitoForm formId={76} prefill={{ Program: program.webname }} fallback />
              </Box>
            </Box>
          </Box>

          <Box>
            <Box p={4} bg="blue.50" borderWidth={1} borderColor="blue.200" color="blue.900">
              <Heading as="h3" fontSize="xl" mb={0}>Eligibility</Heading>
              <ContentfulRichText json={program.eligibility.json} h1Size="3xl" />
            </Box>
            {program.presentingSponsors?.items?.length > 0 && (
              <Box mt={4} textAlign="center">
                <Heading as="h3" fontSize="lg" color="current.textLight" mb={4}>Presented in partnership with</Heading>
                {program.presentingSponsors.items.map((sponsor) => (
                  <Link href={sponsor.link} rel="noopener" target="_blank">
                    <Image src={sponsor.logo.url} alt={sponsor.name} d="inline-block" mb={4} />
                  </Link>
                ))}
              </Box>
            )}
          </Box>
        </Grid>
      </Content>
    </Page>
  );
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export async function getStaticProps({ params: { program } }) {
  const query = await apiFetch(print(ProgramQuery), { webname: program });

  return {
    props: {
      query,
    },
    revalidate: 300,
  };
}
