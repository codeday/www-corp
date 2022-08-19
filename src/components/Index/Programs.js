import React, { useEffect, useState } from 'react';
import { GeoHaversine } from "geo-haversine";
import { Box, Grid, Button, Image, Text, CodeDay, Link } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import UiStar from '@codeday/topocons/Icon/UiStar';
import { nextUpcomingEvent, upcomingEvents, formatInterval } from '../../utils/time';
import { useQuery } from '../../query';
import { GetMyLocation } from './Programs.gql';
import { apiFetch } from '@codeday/topo/utils';
import { print } from 'graphql';
import { useColorMode } from '@codeday/topo/Theme';

const geoHaversine = new GeoHaversine();

function NextEventDate({ upcoming }) {
  const next = nextUpcomingEvent(upcoming);
  return next ? (
    <Text color="current.textLight" mb={0} fontWeight="bold">
      {upcomingEvents(upcoming).map((e) => formatInterval(e.startsAt, e.endsAt)).join('; ')}
    </Text>
  ) : (
    <></>
  );
}

export default function Programs() {
  const { colorMode } = useColorMode();
  const { cms: { regions, mainPrograms, otherPrograms, codeDayProgram, labsProgram }, clear: { events } } = useQuery();
  const [geo, setGeo] = useState();
  const codeDay = codeDayProgram?.items[0];
  const labs = labsProgram?.items[0];
  let programs = codeDay?.linkedFrom?.events?.items;
  mainPrograms?.items?.map(program => programs = programs.concat(program.linkedFrom?.events?.items));

  const otherProgramsRowSize = Math.max(3, Math.min((otherPrograms?.items || []).length, 5));
  const upcomingWebnames = events.map((e) => e.contentfulWebname);
  const registrationOpenWebnames = events.filter((e) => e.registrationsOpen).map((e) => e.contentfulWebname);
  const upcomingNameOverrides = Object.fromEntries(events.map((e) => [e.contentfulWebname, e.name]));

  useEffect(async () => {
    if (typeof window === 'undefined') return;
    const res = await apiFetch(print(GetMyLocation));
    setGeo(res?.geo?.mine);
  }, [typeof window, setGeo, apiFetch]);

  const sortedRegions = (regions?.items || [])
  .map((r) => ({
    ...r,
    open: registrationOpenWebnames.includes(r.webname),
    upcoming: upcomingWebnames.includes(r.webname),
    distance: (typeof geo?.lat !== 'undefined' && typeof geo?.lng !== 'undefined')
      ? geoHaversine.getDistance([r.location.lat, r.location.lon], [geo.lat, geo.lng])
      : undefined,
  }))
  .sort((a, b) => {
    if (a.open && !b.open) return -1;
    if (b.open && !a.open) return 1;
    if (a.upcoming && !b.upcoming) return -1;
    if (b.upcoming && !a.upcoming) return 1;
    if (a.distance && b.distance) return a.distance < b.distance ? -1 : 1;
    return 0;
  });

  return (
    <Content>
      {/* CodeDay */}
      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8}>
        <Box borderWidth={1} borderRadius={2} p={4} boxShadow="md">
          <CodeDay fontSize="4xl" withText />
          {nextUpcomingEvent(codeDay?.linkedFrom?.events?.items) && Math.floor((nextUpcomingEvent(codeDay?.linkedFrom?.events?.items).startsAt - new Date()) / (24 * 60 * 60 * 1000)) <= 30 &&
            <Image src="/soon.svg" height={10} alt="" float="right" />}
          <NextEventDate upcoming={codeDay?.linkedFrom?.events?.items} />
          <Text fontSize="md" mt={4} mb={4}>{codeDay?.shortDescription}</Text>
          <Text fontSize="md" bold>Choose a location:</Text>
          <Text mb={4} fontSize="sm">
            (Nothing planned nearby? <Link color="red.600" href="https://event.codeday.org/organize">Organize a CodeDay!</Link>)
          </Text>
          <Box borderWidth={1} maxHeight={{ base: "sm", md: "lg" }} overflowY="auto">
            {sortedRegions.map((region) => (
              <Box
                p={2}
                as="a"
                d="block"
                href={`https://event.codeday.org/${region.webname}`}
                target="_blank"
                fontSize="xl"
                borderBottomWidth="1px"
                key={region.webname}
              >
                {upcomingNameOverrides[region.webname] || region.name}
                {region.upcoming && (
                  <Box fontSize="sm" ml={2} d="inline-block" color="current.textLight">
                    <Box position="relative" top="-0.2em" d="inline-block" mr={2}>
                      <UiStar />
                    </Box>
                    {registrationOpenWebnames.includes(region.webname) ? `Registrations open!` : ``}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
          <Box fontSize="sm" mt={4} d="inline-block" color="current.textLight">
            <Box position="relative" top="-0.2em" d="inline-block" mr={2}>
              <UiStar />
            </Box>
            Event planned this season.
          </Box>
        </Box>

        {/* More Programs */}
        <Box>
            <Box
              borderWidth={1}
              rounded="sm"
              p={4}
              mb={4}
              d="block"
              as="a"
              href={labs.url}
              target="_blank"
              rel="noopener"
              key={labs.name}
            >
              <Box>
                <Box float="left" mt={2} pr={2}>
                  <Image src={labs.logo.url} height={8} alt="" />
                </Box>
                <Text fontSize="4xl" mb={0} bold>{labs.name}</Text>
              </Box>
              <NextEventDate upcoming={labs.linkedFrom?.events?.items} />
              <Text mt={2} clear="both">{labs.shortDescription}</Text>
              <Image
                maxW={64}
                mt={4}
                mb={8}
                src={colorMode === 'dark' ? '/labs-dark.png' : 'labs-light.png'}
                alt="1 mentor + 3 students + 1 project"
              />
              <Box>
                <Button size="sm">Learn More &raquo;</Button>
              </Box>
            </Box>
          {mainPrograms?.items?.map((program) => (
            <Box
              borderBottomWidth={1}
              p={4}
              mb={4}
              d="block"
              as="a"
              href={program.url}
              target="_blank"
              rel="noopener"
              key={program.name}
            >
              <Box mb={1}>
                <Box float="left" width={10} pr={4}>
                  <Image src={program.logo.url} height={6} alt="" />
                </Box>
                {nextUpcomingEvent(program.linkedFrom?.events?.items) && Math.floor((nextUpcomingEvent(program.linkedFrom?.events?.items).startsAt - new Date()) / (24 * 60 * 60 * 1000)) <= 30 &&
                  <Image src="/soon.svg" height={10} alt="" float="right" />}
                <Text fontSize="lg" mb={0} bold>{program.name}</Text>
              </Box>
              <NextEventDate upcoming={program.linkedFrom?.events?.items} />
              <Text mt={2} clear="both">{program.shortDescription}</Text>
              <Box>
                <Button size="sm">Learn More &raquo;</Button>
              </Box>
            </Box>
          ))}

          {/* Even more programs! */}
          <Grid
            templateColumns={`repeat(${otherProgramsRowSize}, minmax(0, 1fr))`}
            textAlign="center"
            gap={Math.round(otherProgramsRowSize / 5)}
          >
            {otherPrograms?.items?.map((prog, i) => (
              <Box
                borderRightWidth={Math.min(1, (i + 1) % Math.min(otherProgramsRowSize, otherPrograms.items.length))}
                p={otherProgramsRowSize >= 5 ? 1 : 4}
                pt={4}
                pb={4}
                d="block"
                as="a"
                href={prog.url}
                target="_blank"
                rel="noopener"
                key={prog.name}
              >
                <Image d="inline-block" src={prog.logo.url} height={12} mb={2} />
                <br />
                <Text fontSize={['lg', 'lg', 'lg', 'md', 'sm'][otherProgramsRowSize - 1]} mb={0} bold>{prog.name}</Text>
              </Box>
            ))}
            {[...new Array(1)].map(() => <Box />)}
          </Grid>
        </Box>
      </Grid>
    </Content>
  )
}
