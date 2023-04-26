import React from 'react';
import { create } from 'random-seed';
import { Text, Box, Grid, Link, Heading } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import EcoBox from './EcoBox';
import { parseIsoString, formatShortDate } from '../../utils/time';
import { useQuery } from '../../query';

const fixedColors = {
  'Partners': 'gray',
  'Community': 'blue',
  'CodeDay Labs': 'green',
  'Virtual CodeDay': 'purple',
  'CodeDay': 'red',
  'Webinars': 'indigo',
}
const colors = ['green', 'blue', 'orange', 'cyan', 'purple', 'yellow', 'indigo'];

export default function Workshops() {
  const { calendar } = useQuery();

  if (calendar?.events?.length === 0) return <EcoBox />;

  return (
    <Content>
      <Heading as="h3" textAlign="center" fontSize="xl" mb={2}>Upcoming Webinars, Workshops, &amp; Events</Heading>
      <Text textAlign="center" fontSize="md" color="current.textLight" mb={5}>(Converted to Your Timezone)</Text>
      <Grid templateColumns="minmax(0, 1fr) minmax(0, 2fr) minmax(0, 4fr)" gap={4}>
        {calendar.events.map((e) => {
          const color = e.calendarName in fixedColors
            ? fixedColors[e.calendarName]
            : colors[create(e.calendarName).intBetween(0, colors.length)];
          const start = parseIsoString(e.start);

          return (
            <>
              <Box>
                <Box
                  display="inline-block"
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
                @ {formatAMPM(start)}
              </Text>
              <Text>
                <Link
                  href={e.metadata?.preregister ? e.location : `/e/${e.calendarId}/${e.id}`}
                  target="_blank"
                  rel="noopener"
                >
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

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}
