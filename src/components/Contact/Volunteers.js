import React from 'react';
import { Box, Grid, Text, Image } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import shuffle from 'knuth-shuffle-seeded';
import { useQuery } from '../../query';

function VolunteerBox({ vol, showTitle }) {
  return (
    <Box>
      <Image
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
  const { account: { employees, volunteers } } = useQuery();
  const employeeIds = employees.map((e) => e.id);
  const justVolunteers = shuffle(volunteers.filter((v) => !employeeIds.includes(v.id)), seed);

  const hasTitle = (v) => v.title && v.title !== 'Volunteer' && v.title !== 'Mentor' && v.title !== 'Staff';
  const withTitle = justVolunteers.filter(hasTitle);
  const withoutTitle = justVolunteers.filter((v) => !hasTitle(v));

  return (
    <Content {...props}>
      {/* Volunteers with a title */}
      <Grid
        templateColumns={{
          base: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))',
        }}
        columnGap={8}
        rowGap={1}
      >
        {withTitle.map((vol) => <VolunteerBox vol={vol} showTitle />)}
      </Grid>

      {/* Volunteers without a title */}
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
        {withoutTitle.map((vol) => <VolunteerBox vol={vol} />)}
      </Grid>
      <Text color="current.textLight" textAlign="center" mt={8}>... plus hundreds of day-of volunteers.</Text>
    </Content>
  );
}
