import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import Image from '@codeday/topo/Atom/Image';
import List, { Item as ListItem } from '@codeday/topo/Atom/List';
import Button from '@codeday/topo/Atom/Button';
import UiArrowDown from '@codeday/topocons/Icon/UiArrowDown';
import UiArrowUp from '@codeday/topocons/Icon/UiArrowUp';
import FilePdf from '@codeday/topocons/Icon/FilePdf';
import { formatInterval } from '../../utils/time';
import ContentfulRichText from '../ContentfulRichText';
import Divider from '@codeday/topo/Atom/Divider';
import Link from '@codeday/topo/Atom/Text/Link';

const ROLE_COLORS = {
  mentor: 'blue',
  judge: 'gray',
  'general volunteer': 'red',
  speaker: 'orange',
  'career advisor': 'purple',
};

export default function ProgramInfo({ program }) {
  const [blurbVisible, setBlurbVisible] = useState(false);

  return (
    <Box border="current.borderColor" borderWidth={1} p={4} mb={8}>
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={8}>

        <Box>
          <Box fontSize="3xl" fontWeight="bold" mb={4}>
            <Image src={program.logo.url} height="1em" alt="" d="inline" />{' '}
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
              d="inline-block"
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
            href={program.volunteerUrl}
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
      {program.volunteerBlurb && (
        <>
          <Link as="div" onClick={() => setBlurbVisible(!blurbVisible)} position="relative" mt={4}>
            <Box textAlign="center">
              <Box bg="current.bg" d="inline-block" p={4} color="blue.800">
                <Link as="div" d="inline-block" mr={2}>
                  {blurbVisible ? 'Hide' : 'Share With Co-Workers'}
                </Link>
                {blurbVisible ? <UiArrowUp /> : <UiArrowDown />}
              </Box>
            </Box>
            <Divider
              d={blurbVisible ? null : 'none'}
              position="absolute"
              top="50%"
              transform="translateY(-0.5em)"
              left={0}
              right={0}
              zIndex={-1}
            />
          </Link>
          <Grid d={blurbVisible ? null : 'none'} templateColumns={{ base: '1fr', md: '8fr 3fr'}} gap={8}>
            <Box>
              <Heading as="h4" fontSize="2xl" mb={4}>Copy-Pastable Email Blurb</Heading>
              <Box pl={4} ml={4} borderLeftWidth={2} borderColor="blue.600">
                <ContentfulRichText json={program.volunteerBlurb.json} />
              </Box>
            </Box>
            <Box>
              <Button
                as="a"
                target="_blank"
                href={`https://www.linkedin.com/shareArticle/?url=${encodeURIComponent(program.volunteerUrl)}`}
                variantColor="blue"
                mb={8}
              >
                Share on LinkedIn
              </Button>
              {program.volunteerRecruitingResources?.items.length > 0 && (
                <>
                  <Heading as="h4" fontSize="xl" mb={4}>More Resources</Heading>
                  {program.volunteerRecruitingResources?.items.map((i) => (
                    <Link href={i.url} target="_blank" rel="noopener">
                      <Grid templateColumns="1fr 3fr" borderWidth={1} mb={1} gap={2} alignItems="center" minHeight={16}>
                          {i.contentType.split('/')[0] === 'image' ? (
                            <Image src={i.preview} alt={i.title} />
                          ) : (
                            <Box fontSize={32} textAlign="center">
                              <FilePdf />
                            </Box>
                          )}
                          <Text fontSize="sm" color="current.textLight" mb={0}>{i.title}</Text>
                        </Grid>
                    </Link>
                  ))}
                </>
              )}
            </Box>
          </Grid>
        </>
      )}
    </Box>
  )
}
ProgramInfo.propTypes = {
  program: PropTypes.object.isRequired,
};
