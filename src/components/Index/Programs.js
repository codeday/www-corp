import React from 'react';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Image from '@codeday/topo/Atom/Image';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import Content from '@codeday/topo/Molecule/Content';
import { CodeDay } from '@codeday/topo/Atom/Logo';
import { nextUpcomingEvent, formatInterval } from '../../utils/time';
import { useQuery } from '../../query';

function NextEventDate({ upcoming }) {
  const next = nextUpcomingEvent(upcoming);
  return next ? (
    <Text color="current.textLight" mb={0} bold>
      Next event: {formatInterval(next.startsAt, next.endsAt)}
    </Text>
  ) : (
    <></>
  );
}

export default function Programs() {
  const { cms: { regions, mainPrograms, otherPrograms, codeDayProgram }} = useQuery();
  const codeDay = codeDayProgram?.items[0];

  return (
    <Content>

      <Heading as="h2" fontSize="5xl" textAlign="center" mb={16} mt={16} bold>Attend an Event</Heading>

      {/* CodeDay */}
      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8}>
        <Box borderWidth={1} borderColor="current.border" borderRadius={2} p={4} boxShadow="md">
          <CodeDay fontSize="4xl" withText />
          <NextEventDate upcoming={codeDay?.linkedFrom?.events?.items} />
          <Text fontSize="md" mt={4} mb={4}>{codeDay?.shortDescription}</Text>
          <Text fontSize="md" mb={4} bold>Choose a location:</Text>
          <Box borderWidth={1} borderColor="current.border" maxHeight={{ base: "sm", md: "md" }} overflowY="auto">
            {regions?.items?.map((region) => (
              <Box
                p={2}
                as="a"
                d="block"
                href={`https://old.codeday.org/${region.webname}`}
                target="_blank"
                fontSize="xl"
                borderColor="current.border"
                borderBottomWidth="1px"
              >
                {region.name}
              </Box>
            ))}
          </Box>
        </Box>

        {/* More Programs */}
        <Box>
          {mainPrograms?.items?.map((program) => (
            <Box
              borderBottomWidth={1}
              borderColor="current.border"
              p={4}
              mb={4}
              d="block"
              as="a"
              href={program.url}
              target="_blank"
              rel="noopener"
            >
              <Box mb={1}>
                <Box float="left" width={10} pr={4}>
                  <Image src={program.logo.url} height={6} alt="" />
                </Box>
                <Text fontSize="lg" mb={0} bold>{program.name}</Text>
              </Box>
              <NextEventDate upcoming={program.linkedFrom?.events?.items} />
              <Text mt={2} clear="both" mb={0}>{program.shortDescription}</Text>
            </Box>
          ))}

          {/* Even more programs! */}
          <Grid templateColumns="repeat(3, 1fr)" textAlign="center" gap={4}>
            {otherPrograms?.items?.map((prog, i) => (
                <Box
                  borderRightWidth={Math.min(1, (i+1) % 3)}
                  borderColor="current.border"
                  p={4}
                  mb={4}
                  d="block"
                  as="a"
                  href={prog.url}
                  target="_blank"
                  rel="noopener"
                >
                  <Image d="inline-block" src={prog.logo.url} height={12} mb={2} />
                  <br />
                  <Text fontSize="lg" mb={0} bold>{prog.name}</Text>
                </Box>
            ))}
          </Grid>
        </Box>
      </Grid>
    </Content>
  )
}
