import React from 'react';
import { print, parse } from 'graphql';
import { apiFetch } from '@codeday/topo/utils';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Image from '@codeday/topo/Atom/Image';
import Text, { Heading, Link } from '@codeday/topo/Atom/Text';
import List, { Item as ListItem } from '@codeday/topo/Atom/List';
import Button from '@codeday/topo/Atom/Button';
import Content from '@codeday/topo/Molecule/Content';
import Page from '../components/Page';
import ContentfulRichText from '../components/ContentfulRichText';
import { formatInterval, upcomingEvents } from '../utils/time';
import { useQuery } from '../query';
import { VolunteerQuery } from './volunteer.gql';

const ROLE_COLORS = {
  mentor: 'blue',
  judge: 'gray',
  'general volunteer': 'red',
  speaker: 'orange',
  'career advisor': 'purple',
};
const PROGRAM_WEIGHT = ["primary", "secondary", "minor"];

export default function Volunteer() {
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
      <Content>
        <Image
          src="https://img.codeday.org/o/m/f/mfwgeuyxb7euvouiwx5252n79xan15ujhprpjqh1q198s7uutheambb6eamm2zdyu1.jpg"
          rounded="md"
          mt={-8}
          mb={4}
          alt=""
        />
        <Heading as="h2" fontSize="5xl">Have fun. Make a difference. Volunteer.</Heading>
        <Text fontSize="xl" mb={8}>
          We need everyone's help to create a more inclusive tech future for students! (Even if you don&apos;t
          have a tech background!) For corporate volunteering please email us at{' '}
          <Link href="mailto:volunteer@codeday.org">volunteer@codeday.org</Link>.
        </Text>
        <Box>
          {programsWithUpcoming.filter((program) => program.volunteerDetails).map((program) => (
            <Box border="current.borderColor" borderWidth={1} p={4} mb={8}>
              <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={8}>

                <Box>
                  <Box fontSize="3xl" fontWeight="bold" mb={4}>
                    <Image src={program.logo.url} height="1em" alt="" d="inline" />{' '}
                    {program.name}
                  </Box>
                  {program.upcoming.length > 0 && (
                    <Box mb={4}>
                      <Text bold mb={1}>Upcoming Dates</Text>
                      <List styleType="disc" pl={2}>
                        {program.upcoming.slice(0,3).map((event) => (
                          <ListItem>
                            {formatInterval(event.startsAt, event.endsAt)}
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Box>

                <Box>
                  <ContentfulRichText json={program.volunteerDetails.json} />
                  {program.virtual && (
                    <Box fontWeight="bold" color="red.600">
                      Online volunteer opportunity.
                    </Box>
                  )}
                </Box>

                <Box>
                  <Button as="a" href={program.volunteerUrl} target="_blank" rel="noopener" w="100%" mb={4}>
                    Learn More
                  </Button>
                  {program.volunteerPositions?.map((pos) => (
                    <Box
                      d="inline-block"
                      p={1}
                      mr={1}
                      mb={1}
                      borderWidth={1}
                      borderColor={`${ROLE_COLORS[pos]}.700`}
                      rounded="md"
                      bg={`${ROLE_COLORS[pos]}.50`}
                      color={`${ROLE_COLORS[pos]}.700`}
                    >
                        {pos.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1))}s
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Box>
          ))}
        </Box>
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
