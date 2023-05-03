import React from 'react';
import { print } from 'graphql';
import { apiFetch } from '@codeday/topo/utils';
import { Box, Grid, Text, Heading, Link } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import ProgramInfo from '../../components/Volunteer/ProgramInfo';
import Page from '../../components/Page';
import VideoTestimonialThumbnail from '../../components/VideoTestimonialThumbnail';
import { upcomingEvents } from '../../utils/time';
import { useQuery } from '../../query';
import { VolunteerQuery } from './volunteer.gql';

const PROGRAM_WEIGHT = ["primary", "secondary", "minor"];

export default function Volunteer() {
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

  const videoTestimonial = testimonials?.items?.filter((t) => t.video)[0];

  return (
    <Page slug="/volunteer" title="Volunteer" noFun>
      <Content mt={-8}>
        <Heading as="h2" fontSize="5xl" mb={8} mt={8}>Have fun. Make a difference. Volunteer.</Heading>
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr', lg: '3fr 2fr' }} gap={8}>
          <Box>
            <Text fontSize="xl" mb={8}>
              We need everyone's help to create a more inclusive tech future for students! (Even if you don&apos;t
              have a tech background!) For corporate volunteering please email us at{' '}
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
        <Box>
          {programsWithUpcoming.filter((program) => program.volunteerDetails).map((program) => (
            <ProgramInfo program={program} />
          ))}
        </Box>
      </Content>
    </Page>
  );
}

export async function getStaticProps() {
  const query = await apiFetch(print(VolunteerQuery), { now: new Date() });
  return {
    props: {
      query,
    },
    revalidate: 300,
  };
}
