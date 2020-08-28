import React from 'react';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Text from '@codeday/topo/Atom/Text';
import Image from '@codeday/topo/Atom/Image';
import Content from '@codeday/topo/Molecule/Content';
import { useQuery } from '../../query';

export default function Employees(props) {
  const { account: { employees } } = useQuery();

  return (
    <Content wide {...props}>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
        {employees.map((emp) => (
          <Box p={4}>
            <Box>
              <Image
                src={emp.picture.replace('256x256', 'w=100;h=100;fit=crop').replace('s=480', 's=64')}
                float="left"
                mr={4}
                rounded="full"
                w="64px"
                h="64px"
                alt=""
              />
              <Text mb={0} pt={2} bold>{emp.name}</Text>
              <Text fontSize="sm" color="current.textLight">{emp.title || 'Employee'}, {emp.pronoun}</Text>
            </Box>
            <Box ml="64px" pl={4}>
              <Text>{emp.bio || `${emp.name} is ${emp.title ? `the ${emp.title}` : 'an employee'} at CodeDay.`}</Text>
            </Box>
          </Box>
        ))}
      </Grid>
    </Content>
  );
}
