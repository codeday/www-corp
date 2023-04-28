import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, Text, Image, List, ListItem, Button } from '@codeday/topo/Atom';
import { formatInterval } from '../../utils/time';
import ContentfulRichText from '../ContentfulRichText';
import ProgramShareBlurb from './ProgramShareBlurb';
import { VOLUNTEER_ROLES } from './wizardConfig';

const ROLE_COLORS = Object.keys(VOLUNTEER_ROLES)
  .reduce((accum, type) => ({ [type]: VOLUNTEER_ROLES[type].color, ...accum }), {});

export default function ProgramInfo({ program }) {
  return (
    <Box border="current.borderColor" borderWidth={1} p={4} mb={8}>
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={8}>

        <Box>
          <Box fontSize="3xl" fontWeight="bold" mb={4}>
            <Image src={program.logo.url} height="1em" alt="" display="inline" />{' '}
            {program.name}
          </Box>
          {program.upcoming.length > 0 && (
            <Box mb={4}>
              <Text bold mb={1}>Upcoming Dates</Text>
              <List styleType="disc" pl={2}>
                {program.upcoming.slice(0,3).map((event) => (
                  <ListItem>
                    {formatInterval(event.startsAt, event.endsAt)}
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>

        <Box>
          <ContentfulRichText json={program.volunteerDetails.json} />
          {program.virtual && (
            <Box fontWeight="bold" color="red.600">
              Online volunteer opportunity.
            </Box>
          )}
        </Box>

        <Box position="relative" pb={{ base: null, md: 16 }}>
          {program.volunteerPositions?.map((pos) => (
            <Box
              display="inline-block"
              p={1}
              mr={1}
              mb={1}
              borderWidth={1}
              borderColor={`${ROLE_COLORS[pos]}.700`}
              rounded="md"
              bg={`${ROLE_COLORS[pos]}.50`}
              color={`${ROLE_COLORS[pos]}.700`}
            >
                {pos.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1))}s
            </Box>
          ))}
          <Button
            as="a"
            href={`/volunteer/${program.webname}`}
            target="_blank"
            rel="noopener"
            w="100%"
            mb={4}
            position={{ base: null, md: 'absolute' }}
            bottom={{ base: null, md: 0 }}
            left={{ base: null, md: 0 }}
          >
            Learn More
          </Button>
        </Box>
      </Grid>
      <ProgramShareBlurb program={program} />
    </Box>
  )
}
ProgramInfo.propTypes = {
  program: PropTypes.object.isRequired,
};
