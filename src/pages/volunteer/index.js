import React, { useState, useRef } from 'react';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { print } from 'graphql';
import { apiFetch } from '@codeday/topo/utils';
import { Box, Grid, Text, Heading, Link, Button, Divider } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { useColorMode } from '@codeday/topo/Theme';
import Wizard from '../../components/Volunteer/Wizard';
import Page from '../../components/Page';
import PreviewVideo from '../../components/Volunteer/PreviewVideo';
import { upcomingEvents } from '../../utils/time';
import { useQuery } from '../../query';
import { VolunteerQuery } from './volunteer.gql';
import Testimonials from '../../components/Volunteer/Testimonials';
import PhotoGallery from '../../components/Volunteer/PhotoGallery';
import Highlight from '../../components/Highlight';
import RemindMe from '../../components/Volunteer/RemindMe';


export default function Volunteer({ seed, layout, startBackground, startRegion, startPage }) {
  const formRef = useRef();
  const { colorMode } = useColorMode();
  const { asPath, query } = useRouter();
  const { cms: { volunteerPrograms } } = useQuery();
  const { clear } = useQuery();
  const [wizardVisible, setWizardVisible] = useState(false);

  const secondText = (
    <>
      CodeDay volunteers help with everything from mentoring, to judging, to operational support at events.{' '}
      <Highlight>Most volunteer roles do not involve yourself coding, so we encourage you to apply, regardless
      of your technical background!</Highlight>{' '}
    </>
  );

  const signUp = (
    <Box rounded="md" shadow="md" borderWidth={1} borderColor="red.700" ref={formRef}>
      <Box
        p={4}
        pl={6}
        pr={6}
        color="white"
        bg="red.700"
        rounded="md"
        borderBottomLeftRadius={0}
        borderBottomRightRadius={0}
      >
        <Heading as="h3" fontSize="xl">Volunteer Sign-Up (3min)</Heading>
      </Box>
      <Box p={6}>
        {layout !== 'go' && (
          <>
            <Box display={{ base: 'block', md: 'none' }} textAlign="center">
              <RemindMe />
              {!wizardVisible && (
                <>
                  <Text mt={4}>- or -</Text>
                  <Button size="sm" onClick={() => setWizardVisible(true)}>fill it out now</Button>
                </>
              )}
            </Box>
            <Divider display={{ base: (wizardVisible ? 'block' : 'none' ), md: 'none' }} mt={8} mb={8} />
          </>
        )}
        <Box display={{ base: ((wizardVisible || layout === 'go') ? 'block' : 'none'), md: 'block' }}>
          <Wizard
            startBackground={startBackground}
            startPage={startPage}
            startRegion={startRegion}
            events={clear.events}
            formRef={formRef}
            after={query?.return && query?.returnto ? `https://${query.return}.codeday.org/${query.returnto}` : undefined}
          />
        </Box>
      </Box>
    </Box>
  );

  return (
    <Page slug={`/${asPath}`} title="Volunteer">
      <NextSeo
        description="We need you to help students find their place in the tech industry! (Even if you don't have a tech background!)`"
        openGraph={{
          title: 'Volunteer for CodeDay',
          description: `We need you to help students find their place in the tech industry! (Even if you don't have a tech background!)`,
          images: [
            {
              url: 'https://f2.codeday.org/d5pti1xheuyu/5HXduujNbKhEwAsFchjNcU/5ca87b445e48ae78593b8a4841e94775/gray-wallaby-965e09f9_o.jpg?w=1200&h=630&fit=fill',
              width: 1200,
              height: 630,
              alt: 'Volunteers watching a presentation at CodeDay.'
            }
          ]
        }}
      />
      <Content mt={-8}>
        {layout !== 'go' && (
          <>
            <Heading
              as="h2"
              fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
              mb={{ base: 4, md: 8 }}
              mt={{ base: 4, md: 8 }}
              textAlign={{ base: "center", lg: "left" }}
            >
              You can help students find their place in the tech industry.
            </Heading>
            <Grid templateColumns={{ base: '1fr', md: '2fr 1fr', lg: '3fr 1fr' }} gap={8} mb={{ base: 4, md: 8 }}>
              <Box fontSize="lg">
                <Box maxW="32rem" margin="auto">
                  <PreviewVideo mb={{ base: 4, md: 8 }} />
                </Box>
                <Text>
                  Thousands of volunteers just like you have{' '}
                  <Highlight>helped 50,000+ students find their place in tech,</Highlight> but hundreds of thousands more
                  still need your help.
                </Text>
                <Text display={{ base: 'none', md: 'block' }} mt={2}>
                  {secondText}
                </Text>
              </Box>
              <Box display={{ base: 'none', md: 'block' }}>
                <Box bg={colorMode === 'light' ? 'gray.100' : 'gray.900'} p={4} textAlign="center">
                  <Heading as="h3" fontSize="xl">Time Commitment</Heading>
                  <Text mb={2}>
                    Varies by role:<br />
                    30min, 2hr, or 20hr
                  </Text>
                  <Heading as="h3" fontSize="xl">Deadline</Heading>
                  <Text mb={2}>
                    Opportunities available year-round
                  </Text>
                  <Heading as="h3" fontSize="xl">Requirements</Heading>
                  <Text mb={2}>
                    Varies by role, see form below
                  </Text>
                  <Heading as="h3" fontSize="xl">Groups/Corporate</Heading>
                  <Text>
                    <Link href="mailto:volunteer@codeday.org">Email us</Link> or {' '}
                    <Link href="/volunteer/share">share with coworkers</Link>
                  </Text>
                </Box>
              </Box>
            </Grid>
          </>
        )}
        {signUp}
      </Content>
      {layout !== 'go' && (
        <>
          <Content display={{ base: 'block', md: 'none' }} mt={12}>
            <Text fontSize="lg">{secondText}</Text>
          </Content>
          <Content mt={12}>
            <Heading as="h3" textAlign="center" fontSize="3xl">CodeDay volunteers make lasting impacts towards futures in tech.</Heading>
          </Content>
          <Content maxW="container.md" mt={8} mb={12}>
            <Testimonials seed={seed} />
          </Content>
          <Content wide>
            <PhotoGallery />
          </Content>
        </>
      )}
    </Page>
  );
}

export async function getStaticProps() {
  const query = await apiFetch(print(VolunteerQuery), { now: new Date() });
  return {
    props: {
      query,
      seed: Math.random(),
    },
    revalidate: 300,
  };
}
