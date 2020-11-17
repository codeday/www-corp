import React from 'react';
import { create } from 'random-seed';
import Text, { Link, Heading } from '@codeday/topo/Atom/Text';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Content from '@codeday/topo/Molecule/Content';
import { parseIsoString, formatShortDate } from '../../utils/time';
import { useQuery } from '../../query';

const colors = ['green', 'blue', 'orange', 'cyan', 'purple', 'yellow', 'indigo'];

export default function Workshops() {
  const { calendar } = useQuery();

  if (calendar?.events?.length === 0) return <></>;

  return (
    <Content>
      <Heading as="h3" textAlign="center" fontSize="xl" mb={8}>Upcoming Workshops &amp; Events</Heading>
      <Grid templateColumns="minmax(0, 1fr) minmax(0, 2fr) minmax(0, 4fr)" gap={4}>
        {calendar.events.map((e) => {
          const color = colors[create(e.calendarName).intBetween(0, colors.length)];
          const start = parseIsoString(e.start);

          return (
            <>
              <Box>
                <Box
                  d="inline-block"
                  bg={`${color || 'red'}.500`}
                  color={`${color || 'red'}.50`}
                  rounded="sm"
                  p={2}
                  pt={1}
                  pb={1}
                  fontSize="sm"
                >
                  {e.calendarName}
                </Box>
              </Box>
              <Text>
                {formatShortDate(start, true)}{' '}
                @ {start.getHours()}:{start.getMinutes().toString().padStart(2, "0")} Pacific
              </Text>
              <Text>
                <Link href={e.location} target="_blank" rel="noopener">
                  {e.title}
                </Link>
              </Text>
            </>
          );
        })}
      </Grid>
    </Content>
  );
}
