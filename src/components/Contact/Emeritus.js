import React from 'react';
import { Box, Grid, Text, Image } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import shuffle from 'knuth-shuffle-seeded';
import { useQuery } from '../../query';

function EmeritusBox({ e }) {
  return (
    <Box>
      <Image
        title={e.username}
        src={e.picture.replace('256x256', 'w=64;h=64;fit=crop').replace('s=480', 's=32')}
        rounded="full"
        width="32px"
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
          {e.name}
        </Text>
        <Text
          fontSize="sm"
          color="current.textLight"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          Emeritus
        </Text>
      </Box>
    </Box>
  );
}

export default function Emeritus({ seed, ...props }) {
  const { account: { employees, otherTeam, board, contractors, emeritus } } = useQuery();
  const employeeIds = [...employees, ...otherTeam, ...contractors, ...board].map((e) => e.id);
  const all = shuffle(emeritus.filter((v) => !employeeIds.includes(v.id)), seed);

  return (
    <Content {...props}>
      <Grid
        templateColumns={{
          base: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))',
        }}
        columnGap={8}
        rowGap={1}
      >
        {all.map((e) => <EmeritusBox e={e} />)}
      </Grid>
    </Content>
  );
}
