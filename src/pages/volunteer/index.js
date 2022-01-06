import React, { useEffect } from 'react';
import { NextSeo } from 'next-seo';
import { print } from 'graphql';
import { apiFetch } from '@codeday/topo/utils';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Text, { Heading, Link } from '@codeday/topo/Atom/Text';
import Content from '@codeday/topo/Molecule/Content';
import Wizard from '../../components/Volunteer/Wizard';
import Page from '../../components/Page';
import PreviewVideo from '../../components/Volunteer/PreviewVideo';
import { upcomingEvents } from '../../utils/time';
import { useQuery } from '../../query';
import { VolunteerQuery } from './volunteer.gql';
import Testimonials from '../../components/Volunteer/Testimonials';
import PhotoGallery from '../../components/Volunteer/PhotoGallery';
import Highlight from '../../components/Highlight';

const PROGRAM_WEIGHT = ["primary", "secondary", "minor"];

export default function Volunteer({ program, role }) {
  const { cms: { volunteerPrograms } } = useQuery();
  const programsWithUpcoming = volunteerPrograms?.items?.map((program) => {
    return {
      ...program,
      upcoming: upcomingEvents(program.linkedFrom?.events?.items || []),
    };
  })
  .sort((a, b) => {
    if (a.upcoming.length > 0 && b.upcoming.length > 0)
      return a.upcoming[0].startsAt - b.upcoming[0].startsAt;
    if (a.upcoming.length > 0) return -1;
    if (b.upcoming.length > 0) return 1;
    return PROGRAM_WEIGHT.indexOf(a.type) - PROGRAM_WEIGHT.indexOf(b.type);
  })
   || [];

  return (
    <Page slug="/volunteer" title="Volunteer">
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
        <Heading
          as="h2"
          fontSize={{ base: "3xl", lg: "4xl" }}
          mb={8}
          mt={8}
          textAlign={{ base: "center", lg: "left" }}
        >
          You can help students find their place in the tech industry.
        </Heading>
        <Grid templateColumns={{ base: '1fr', md: '2fr 1fr', lg: '3fr 1fr' }} gap={8} mb={8}>
          <Box fontSize="lg">
            <Box maxW="32rem" margin="auto">
              <PreviewVideo mb={8} />
            </Box>
            <Text>
              Thousands of volunteers just like you have{' '}
              <Highlight>helped 50,000+ students find their place in tech,</Highlight> but hundreds of thousands more
              still need your help.
            </Text>
            <Text>
              CodeDay volunteers help with everything from mentoring, to judging, to operational support at events.{' '}
              <Highlight>No matter who you are, we need your help!</Highlight> You can volunteer whether you're a
              professional software engineer, a student, or a general community member.{' '}

            </Text>
          </Box>
          <Box>
            <Box bg="gray.100" p={4} textAlign="center">
              <Heading as="h3" fontSize="xl">Time Commitment</Heading>
              <Text>
                Varies by role:<br />
                30min, 2hr, or 20hr
              </Text>
              <Heading as="h3" fontSize="xl">Deadline</Heading>
              <Text>
                Opportunities available year-round
              </Text>
              <Heading as="h3" fontSize="xl">Requirements</Heading>
              <Text>
                Varies by role, see form below
              </Text>
              <Heading as="h3" fontSize="xl">Groups/Corporate</Heading>
              <Text mb={0}>

                <Link href="mailto:volunteer@codeday.org">Email us</Link> or {' '}
                <Link href="/volunteer/share">share with coworkers</Link>
              </Text>
            </Box>
          </Box>
        </Grid>
        <Box rounded="md" shadow="md" borderWidth={1} borderColor="red.700">
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
            <Wizard
              programs={programsWithUpcoming.filter((program) => program.volunteerDetails)}
              defaultPrograms={program ? [ program ] : undefined}
              defaultRoles={role ? [ role ] : undefined}
            />
          </Box>
        </Box>
      </Content>
      <Content mt={12}>
        <Heading as="h3" textAlign="center" fontSize="3xl">CodeDay volunteers make lasting impacts towards futures in tech.</Heading>
      </Content>
      <Content maxW="containers.md" mt={8} mb={12}>
        <Testimonials />
      </Content>
      <Content wide>
        <PhotoGallery />
      </Content>
    </Page>
  );
}

export async function getStaticProps() {
  const query = await apiFetch(print(VolunteerQuery));

  return {
    props: {
      query,
    },
    revalidate: 300,
  };
}
