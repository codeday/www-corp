import React from 'react';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Text from '@codeday/topo/Atom/Text';
import Image from '@codeday/topo/Atom/Image';
import Content from '@codeday/topo/Molecule/Content';
import { useQuery } from '../../query';

export default function Employees(props) {
  const { account: { board, employees } } = useQuery();

  const employeeIds = employees.map((e) => e.id);
  const uniqueBoard = board.filter((director) => !employeeIds.includes(director.id));

  return (
    <Content wide {...props}>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
        {uniqueBoard.map((director) => (
          <Box p={4}>
            <Box>
              <Image
                src={director.picture.replace('256x256', 'w=100;h=100;fit=crop').replace('s=480', 's=64')}
                float="left"
                mr={4}
                rounded="full"
                w="64px"
                w
                h="64px"
                alt=""
              />
              <Text mb={0} pt={2} bold>{director.givenName} {director.familyName}</Text>
              <Text fontSize="sm" color="current.textLight">Board Member, {director.pronoun}</Text>
            </Box>
            <Box ml="64px" pl={4}>
              <Text>{director.bio || `${director.givenName} is a member of the CodeDay board.`}</Text>
            </Box>
          </Box>
        ))}
      </Grid>
    </Content>
  );
}
