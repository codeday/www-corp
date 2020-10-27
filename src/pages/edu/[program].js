import React, { useState } from 'react';
import { print } from 'graphql';
import { useRouter } from 'next/router';
import shuffle from 'knuth-shuffle-seeded';
import { apiFetch } from '@codeday/topo/utils';
import Content from '@codeday/topo/Molecule/Content';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Text, { Heading, Link } from '@codeday/topo/Atom/Text';
import Skelly from '@codeday/topo/Atom/Skelly';
import CognitoForm from '@codeday/topo/Molecule/CognitoForm';
import Image from '@codeday/topo/Atom/Image';
import ContentfulRichText from '../../components/ContentfulRichText';
import Page from '../../components/Page';
import Error404 from '../404';
import { useQuery } from '../../query';
import { ProgramQuery, ProgramNamesQuery } from './program.gql';

function Faq({ faq }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box borderBottomWidth={1}>
      <Heading
        as="h4"
        fontSize="lg"
        onClick={() => setIsOpen(!isOpen)}
        bg={isOpen ? 'gray.900' : 'gray.50'}
        color={isOpen && 'white'}
        cursor="pointer"
        p={4}
      >
        {faq.title}
      </Heading>
      {isOpen && (
        <Box p={4}>
          <ContentfulRichText
            json={faq.answer.json}
            h1Size="xl"
          />
        </Box>
      )}
    </Box>
  )
}

export default function EducationProgram({ seed }) {
  const { cms } = useQuery();
  const { isFallback, query } = useRouter();
  const program = cms?.eduPrograms?.items[0];
  const testimonial = shuffle(JSON.parse(JSON.stringify(cms?.testimonials?.items || [])), seed)
    .filter((e) => !e.groupName)[0];
  const faqs = cms?.faqs?.items;
  const pageProps = {
    slug: `/edu/${query.program}`,
    title: program ? `${program.name} for Education` : 'CodeDay for Education',
  };

  if (isFallback) return (
    <Page {...pageProps}>
      <Content>
        <Skelly height={12} mb={4} />
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr", lg: "6fr 3fr" }} gap={8}>
          <Box>
            <Skelly />
            <Skelly />
            <Skelly />
            <Skelly />
            <Skelly />
            <Skelly />
          </Box>
          <Box>
            <Skelly />
            <Skelly />
            <Skelly />
            <Skelly />
          </Box>
        </Grid>
      </Content>
    </Page>
  );
  if (!program || !program.educationDetails) return <Error404 />;

  return (
    <Page {...pageProps}>
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
            {testimonial && (
              <Box borderLeftWidth={2} pl={4} ml={2} mb={8}>
                <Text fontSize="lg" fontStyle="italic">
                  {testimonial.quote}
                </Text>
                <Text>
                  &mdash;{testimonial.firstName} {testimonial.lastName},
                  {' '}{testimonial.title || testimonial.type} {testimonial.company}
                </Text>
              </Box>
            )}
            <ContentfulRichText
              json={program.educationDetails.json}
              links={program.educationDetails.links}
              h1Size="3xl"
            />
          </Box>

          <Box>
            {program.eligibility && (
              <Box p={4} bg="blue.50" borderWidth={1} borderColor="blue.200" color="blue.900">
                <Heading as="h3" fontSize="xl" mb={0}>Eligibility</Heading>
                <ContentfulRichText json={program.eligibility.json} h1Size="3xl" />
              </Box>
            )}
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

          <Box>
            <Box borderWidth={2} borderColor="green.600" rounded="sm">
              <Heading as="h3" fontSize="2xl" mb={2} bg="green.600" p={4} color="white">Request More Info</Heading>
              <Box p={4}>
                <CognitoForm formId={76} prefill={{ Program: program.webname }} fallback />
              </Box>
            </Box>

            {faqs && faqs.length > 0 && (
              <>
                <Heading as="h3" fontSize="2xl" mt={8} mb={2}>FAQs</Heading>
                <Box mt={4} rounded="sm" borderWidth={1}>
                  {faqs.map((faq) => <Faq faq={faq} />)}
                </Box>
              </>
            )}
          </Box>
        </Grid>

      </Content>
    </Page>
  );
}

export async function getStaticPaths() {
  const query = await apiFetch(print(ProgramNamesQuery));

  return {
    paths: query?.cms?.programs?.items?.map((i) => ({
      params: {
        program: i.webname
      }
    })) || [],
    fallback: true,
  };
}

export async function getStaticProps({ params: { program } }) {
  const query = await apiFetch(print(ProgramQuery), { webname: program });

  return {
    props: {
      query,
      seed: Math.random(),
    },
    revalidate: 300,
  };
}
