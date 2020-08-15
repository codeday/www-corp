import React from 'react';
import Content from '@codeday/topo/Molecule/Content';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Text from '@codeday/topo/Atom/Text';
import Button from '@codeday/topo/Atom/Button';
import { useQuery } from '../../query';

const fromIso = (s) => {
  var b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

export default function Announcement(props) {
  const { cms: { announcements } } = useQuery();

  const sortedAnnouncements = (!announcements?.items || announcements.items.length === 0) ? null : (
    announcements.items.sort((a, b) => fromIso(a.displayAt) > fromIso(b.displayAt) ? -1 : 1)
  );

  if (!sortedAnnouncements || sortedAnnouncements.length === 0) return <></>;
  const announcement = sortedAnnouncements[0];

  const baseColor = {
    New: 'blue',
    Improved: 'indigo',
    Alert: 'red'
  }[announcement.type];

  return (
    <Content {...props || {}}>
      <Box
          borderWidth={1}
          borderColor={`${baseColor}.500`}
          color={`${baseColor}.900`}
          borderRadius={4}
          p={4}
          m={0}
          d="block"
          as={announcement.link ? 'a' : 'div'}
          href={announcement.link}
          target={announcement.link ? '_blank' : null}
      >
        <Grid
          templateColumns={{ base: '1fr', md: '4fr 1fr' }}
          alignItems="center"
          textAlign={{ base: 'center', md: 'left' }}
        >
          <Box>
            <Text mb={0} d="inline">
                <Text as="span" bold d={{ base: 'inline', md: 'none' }}>New: </Text>
                {announcement.oneline}
            </Text>
          </Box>
          <Box textAlign="right" display={{ base: 'none', md: 'block' }}>
            <Button size="sm" variantColor={baseColor} mb={0}>Learn More</Button>
          </Box>
        </Grid>
      </Box>
    </Content>
  )
}
