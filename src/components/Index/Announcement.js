import React from 'react';
import { DateTime } from 'luxon';
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
  const { cms: { announcements }, announcementWebinar: { events } } = useQuery();

  const now = new Date();
  const webinarAnnouncementEndDate = (new Date()).setDate(now.getDate()+2);

  const sortedAnnouncements = (!announcements?.items || announcements.items.length === 0) ? [] : (
    announcements.items.sort((a, b) => fromIso(a.displayAt) > fromIso(b.displayAt) ? -1 : 1)
  );

  const sortedEvents = (!events || events.length === 0) ? [] : (
    events
      .filter((e) => fromIso(e.start) < webinarAnnouncementEndDate && fromIso(e.end) >= now)
      .sort((a, b) => fromIso(a.start) > fromIso(b.start))
  );

  let announcement;
  if (sortedEvents.length > 0) {
    const event = sortedEvents[0];
    const start = DateTime.fromISO(event.start).toLocaleString({
      day: 'numeric',
      month: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
    announcement = {
      link: event.metadata?.preregister ? event.location : `/e/${event.calendarId}/${event.id}`,
      type: 'Upcoming Webinar',
      oneline: `${event.title} (${start})`,
      cta: 'Register',
    };
  } else if (sortedAnnouncements > 0) announcement = sortedAnnouncements[0];
  else return <></>;

  const baseColor = {
    New: 'blue',
    Improved: 'yellow',
    Alert: 'red',
    'Upcoming Webinar': 'indigo',
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
                <Text as="span" bold d={{ base: 'none', md: 'inline' }}>{announcement.type}: </Text>
                {announcement.oneline}
            </Text>
          </Box>
          <Box textAlign="right" display={{ base: 'none', md: 'block' }}>
            <Button size="sm" variantColor={baseColor} mb={0}>{announcement.cta || 'Learn More'}</Button>
          </Box>
        </Grid>
      </Box>
    </Content>
  )
}
