import React from 'react';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Text from '@codeday/topo/Atom/Text';
import Image from '@codeday/topo/Atom/Image';
import Content from '@codeday/topo/Molecule/Content';
import { useQuery } from '../../query';

export default function Volunteers(props) {
  const { account: { employees, volunteers } } = useQuery();
  const employeeIds = employees.map((e) => e.id);
  const justVolunteers = volunteers.filter((v) => !employeeIds.includes(v.id));

  return (
    <Content {...props}>
      <Grid
        templateColumns={{
          base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)', xl: 'repeat(5, 1fr)',
        }}
      >
        {justVolunteers.map((vol) => (
          <Box>
            <Image
              src={vol.picture.replace('256x256', 'w=32;h=32;fit=crop').replace('s=480', 's=32')}
              rounded="full"
              width="32px"
              alt=""
              float="left"
              mr={2}
              mt={1}
            />
            <Box>
              <Text mb={0}>{vol.name}</Text>
              <Text fontSize="sm" color="current.textLight">{vol.title || 'Volunteer'}</Text>
            </Box>
          </Box>
        ))}
      </Grid>
      <Text color="current.textLight" textAlign="center" mt={8}>... plus hundreds of day-of volunteers.</Text>
    </Content>
  );
}
