import React from 'react';
import { Text, Box, Grid, Image, Link } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { useQuery } from '../../query';

const titleContents = ['Executive Director', 'President', 'VP', 'Chief', 'Director', 'Head', 'Manager', 'Lead'];
const titlePrecedence = (title) => titleContents
  .reduce((accum, t, i) => (title && (title.indexOf(t) >= 0) ? Math.min(i, accum) : accum), titleContents.length);
function sortFn(a, b) {
  if (a.title.startsWith('Consult') && !b.title.startsWith('Consult')) return 1;
  if (b.title.startsWith('Consult') && !a.title.startsWith('Consult')) return -1;
  const aPrec = titlePrecedence(a.title);
  const bPrec = titlePrecedence(b.title);
  if (aPrec !== bPrec) return aPrec - bPrec;

  if (a.name > b.name) return -1;
  if (b.name > a.name) return 1;
  return 0;
}

function dedupeByKey(key, arr) {
  return Object.entries(
    Object.fromEntries(
      arr.map(e => [e[key], e])
    )
  ).map(([_, e]) => e);
}

export default function Employees(props) {
  const { account: { employees, otherTeam, contractors } } = useQuery();

  const sortedEmployees = dedupeByKey('username', [
    ...employees,
    ...otherTeam,
    ...contractors,
  ]).sort(sortFn);

  return (
    <Content {...props}>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={12}>
        {sortedEmployees.map((emp) => (
          <Box>
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
                <Link mt={0} display="block" mb={0} p={0} href={`mailto:${emp.username}@codeday.org`} fontSize="sm" color="current.textLight">{emp.username}@codeday.org</Link>
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
