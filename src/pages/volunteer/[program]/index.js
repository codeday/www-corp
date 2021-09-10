import React from 'react';
import { NextSeo } from 'next-seo';
import DefaultErrorPage from 'next/error'
import { print } from 'graphql';
import { apiFetch } from '@codeday/topo/utils';
import Text, { Heading, Link } from '@codeday/topo/Atom/Text';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import VideoTestimonialThumbnail from '../../../components/VideoTestimonialThumbnail';
import Content from '@codeday/topo/Molecule/Content';
import Wizard from '../../../components/Volunteer/Wizard';
import ProgramShareBlurb from '../../../components/Volunteer/ProgramShareBlurb';
import ContentfulRichText from '../../../components/ContentfulRichText';
import Page from '../../../components/Page';
import { upcomingEvents } from '../../../utils/time';
import { useQuery } from '../../../query';
import { VolunteerQuery } from '../volunteer.gql';

const PROGRAM_WEIGHT = ["primary", "secondary", "minor"];

export default function Volunteer({ program }) {
  const { cms: { volunteerPrograms, testimonials } } = useQuery();
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

  const myProgram = programsWithUpcoming.filter((p) => p.webname === program)[0];
  const videoTestimonial = testimonials?.items?.filter((t) => t.video)[0];

  if (!myProgram) return <DefaultErrorPage statusCode={404} />;

  return (
    <Page slug={`/volunteer/${program}`} title={`Volunteer for ${myProgram.name}`}>
      <NextSeo
        description={myProgram.shortDescription}
        openGraph={{
          title: `Volunteers needed: ${myProgram.name}`,
          description: myProgram.shortDescription,
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
        <Heading as="h2" fontSize="4xl" mb={4}>
          Volunteer for {myProgram.name}
        </Heading>
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr', lg: '3fr 2fr' }} gap={8}>
          <Box>
            <Text fontSize="xl">{myProgram.shortDescription}</Text>
            <ContentfulRichText json={myProgram.volunteerDetails?.json} />
            <Text mb={8}>
              For corporate volunteering please email us at{' '}
              <Link href="mailto:volunteer@codeday.org">volunteer@codeday.org</Link>.
            </Text>
          </Box>
          <Box>
            <Heading as="h3" fontSize="md" color="current.textLight" textAlign="center" mb={2}>
              Hear why {videoTestimonial.firstName}
              {videoTestimonial.company && (
                <>
                  {videoTestimonial.title ? `, ${videoTestimonial.title} at ` : ' from '}
                  {videoTestimonial.company}{videoTestimonial.title && ','}
                </>
              )}{' '}
              volunteers:
            </Heading>
            <VideoTestimonialThumbnail video={videoTestimonial} />
          </Box>
        </Grid>
        <Wizard
          programs={programsWithUpcoming.filter((program) => program.volunteerDetails)}
          defaultPrograms={[ program ]}
        />
        <ProgramShareBlurb program={myProgram} />
      </Content>
    </Page>
  );
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params: { program, role }}) {
  const query = await apiFetch(print(VolunteerQuery));

  return {
    props: {
      query,
      program,
    },
    revalidate: 300,
  };
}
