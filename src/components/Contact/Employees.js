import React from 'react';
import { Text, Box, Grid, Image, Link } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { useQuery } from '../../query';

const titleContents = ['Executive Director', 'VP', 'Director', 'Head', 'Manager', 'Lead'];
const titlePrecedence = (title) => titleContents
  .reduce((accum, t, i) => (title && (title.indexOf(t) >= 0) ? Math.min(i, accum) : accum), titleContents.length);
function sortFn(a, b) {
  const aPrec = titlePrecedence(a.title);
  const bPrec = titlePrecedence(b.title);
  if (aPrec !== bPrec) return aPrec - bPrec;

  if (a.name > b.name) return -1;
  if (b.name > a.name) return 1;
  return 0;
}

export default function Employees(props) {
  const { account: { employees, otherTeam, contractors } } = useQuery();

  const sortedEmployees = [...employees.sort(sortFn), ...otherTeam.sort(sortFn)];

  return (
    <Content wide {...props}>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
        {sortedEmployees.map((emp) => (
          <Box p={4}>
            <Box>
              <Image
                title={emp.username}
                src={emp.picture.replace('256x256', 'w=100;h=100;fit=crop').replace('s=480', 's=64')}
                float="left"
                mr={4}
                rounded="full"
                w="64px"
                h="64px"
                alt=""
              />
              <Box  position="relative" top={-2}>
                <Text mb={0} pt={2} fontWeight="bold">{emp.name}</Text>
                <Link mt={0} display="block" mb={0} p={0} href={`${emp.username}@codeday.org`} fontSize="sm" color="current.textLight">{emp.username}@codeday.org</Link>
                <Text mt={0} display="block" mb={0} p={0} fontSize="sm" color="current.textLight">{emp.title || 'Staff'}, {emp.pronoun}</Text>
              </Box>
            </Box>
            <Box ml="64px" pl={4}>
              <Text>{emp.bio || `${emp.name} is ${emp.title ? `the ${emp.title}` : 'a staff member'} at CodeDay.`}</Text>
            </Box>
          </Box>
        ))}
      </Grid>
    </Content>
  );
}
