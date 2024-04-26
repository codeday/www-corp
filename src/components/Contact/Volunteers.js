import React from 'react';
import { Box, Grid, Text, Image } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import shuffle from 'knuth-shuffle-seeded';
import { useQuery } from '../../query';

function VolunteerBox({ vol, showTitle }) {
  return (
    <Box>
      <Image
        title={vol.username}
        src={vol.picture.replace('256x256', 'w=64;h=64;fit=crop').replace('s=480', 's=32')}
        rounded="full"
        width={showTitle ? '32px' : '18px'}
        alt=""
        float="left"
        mr={2}
        mt={1}
      />
      <Box>
        <Text
          mb={0}
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {vol.name}
        </Text>
        {showTitle && (
          <Text
            fontSize="sm"
            color="current.textLight"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {vol.title || 'Volunteer'}
          </Text>
        )}
      </Box>
    </Box>
  );
}

export default function Volunteers({ seed, ...props }) {
  const { account: { employees, otherTeam, volunteers, board, contractors, emeritus } } = useQuery();
  const employeeIds = [...employees, ...otherTeam, ...board, ...contractors, ...emeritus].map((e) => e.id);
  const justVolunteers = shuffle(volunteers.filter((v) => !employeeIds.includes(v.id)), seed);

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
        rowGap={4}
      >
        {justVolunteers.map((vol) => <VolunteerBox vol={vol} />)}
      </Grid>
      <Text color="current.textLight" textAlign="center" mt={8}>... plus hundreds of mentors and day-of volunteers.</Text>
    </Content>
  );
}
