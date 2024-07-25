import React from 'react';
import { Box, Grid, Text, Image } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import shuffle from 'knuth-shuffle-seeded';
import { useQuery } from '../../query';

function VolunteerBox({ name }) {
  return (
    <Box>
      <Box>
        <Text
          mb={0}
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {name}
        </Text>
      </Box>
    </Box>
  );
}

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}

export default function Volunteers({ seed, ...props }) {
  const { account: { employees, otherTeam, volunteers, board, contractors, emeritus }, labs, clear } = useQuery();
  const employeeIds = [...employees, ...otherTeam, ...board, ...contractors, ...emeritus].map((e) => e.id);
  const justVolunteers = shuffle(volunteers.filter((v) => !employeeIds.includes(v.id)), seed);

  const volunteerNames = [...(
    new Set(
      [
        ...justVolunteers,
        ...labs.mentors,
        ...clear.tickets,
      ]
      .map(vol => toTitleCase(
        vol.name
          ? vol.name
          : `${vol.firstName || vol.givenName || ''} ${vol.lastName || vol.surname || vol.familyName || ''}`
      ).replace(/( \.| \*)/g, ''))
    )
  )]
  .filter(a => !a.includes('Volunteer') && a.length > 3 && !a.includes('?'))
  .sort();

  return (
    <Content {...props}>
      <Grid
        templateColumns={{
          base: 'repeat(2, minmax(0, 1fr))',
          md: 'repeat(3, minmax(0, 1fr))',
          lg: 'repeat(4, minmax(0, 1fr))',
          xl: 'repeat(5, minmax(0, 1fr))',
        }}
        columnGap={4}
        rowGap={1}
      >
        {volunteerNames.map((name) => <VolunteerBox name={name} />)}
      </Grid>
    </Content>
  );
}
