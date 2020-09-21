import React, { useState } from 'react';
import Ticker from 'react-ticker';
import shuffle from 'knuth-shuffle-seeded';
import truncate from 'truncate';
import PageVisibility from 'react-page-visibility';
import Content from '@codeday/topo/Molecule/Content';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Image from '@codeday/topo/Atom/Image';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import { useQuery } from '../../query';

function PhotoTextCard({
  photo, text, author, wip, eventInfo
}) {
  return (
    <Box rounded="md" width="sm" maxHeight="100%" overflow="hidden">
      <Grid templateColumns="3fr 3fr">
        <Image src={photo} alt="" />
        <Box p={2} overflow="hidden">
          {author && (
            <Box>
              <Image
                src={author.picture.replace('256x256', '32x32')}
                alt=""
                float="left"
                w={4}
                h={4}
                mr={2}
                rounded="full"
              />
              <Text mb={0} bold fontSize="sm">{author.name}</Text>
            </Box>
          )}
          <Text fontSize="sm" mb={0}>
            {truncate(text, 90)}{' '}
            {wip && (
              <Text as="span" fontStyle="italic">(work-in-progress)</Text>
            )}
          </Text>
        </Box>
      </Grid>
    </Box>
  );
}

function PhotoCard({ photo, author, wip, eventInfo }) {
  return (
    <Box
      rounded="md"
      backgroundImage={`url(${photo})`}
      backgroundPosition="50% 50%"
      backgroundSize="cover"
      w={64}
      h="100%"
      position="relative"
    >
      {author && (
        <Box p={2} backgroundImage="linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))">
          <Image
            src={author.picture.replace('256x256', '32x32')}
            alt=""
            float="left"
            w={4}
            h={4}
            mr={2}
            rounded="full"
          />
          <Text mb={0} bold fontSize="sm" color="white">{author.name}</Text>
        </Box>
      )}
      {!author && eventInfo && (
        <Box p={2} backgroundImage="linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))">
          <Text mb={0} fontSize="sm" color="white" bold>
            {
              [
                eventInfo.event?.program?.name,
                eventInfo.region?.name,
                eventInfo.event?.startsAt?.substring(0,4)
              ].join(' ')
            }
          </Text>
        </Box>
      )}
      {wip && (
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          p={2}
          backgroundImage="linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1))"
        >
          <Text mb={0} fontSize="sm" color="white" fontStyle="italic">(work-in-progress)</Text>
        </Box>
      )}
    </Box>
  );
}

function Card({
  photo, text, author, wip, eventInfo,
}) {
  const elem = (text && text.length > 0)
    ? <PhotoTextCard photo={photo} text={text} author={author} wip={wip} eventInfo={eventInfo} />
    : <PhotoCard photo={photo} author={author} wip={wip} eventInfo={eventInfo} />;

  return (
    <Box
      role="figure"
      height={40}
      borderColor="current.border"
      borderWidth={1}
      overflow="hidden"
      mr={8}
      boxShadow="md"
    >
      {elem}
    </Box>
  );
}

export default function Community({ seed, ...props }) {
  const [pageIsVisible, setPageIsVisible] = useState(true);
  const { showYourWork, cms: { indexCommunityPhotos } } = useQuery();
  const cards = shuffle([
    ...(showYourWork.messages
      .map((m) => <Card key={m.imageUrl} photo={m.imageUrl} text={m.text} author={m.author} wip />)
        || []
    ),
    ...(shuffle(indexCommunityPhotos.items.map(i => i), seed)
      .map((p) => <Card key={p.photo.url} photo={p.photo.url} eventInfo={{ region: p.region, event: p.event }} />)
        || []
    ).slice(0, 25),
  ], seed);
  const rows = [
    cards.slice(0, Math.floor(cards.length / 2)),
    cards.slice(Math.floor(cards.length / 2)),
  ];

  return (
    <PageVisibility onChange={(visible) => setPageIsVisible(visible)}>
      <Box mt={32} mb={32} {...props}>
        <Box key={rows[0][0].imageUrl}>
          <Ticker move={pageIsVisible}>{({ index }) => rows[0][index % rows[0].length]}</Ticker>
        </Box>

        <Content>
          <Heading as="h2" fontSize="5xl" textAlign="center" mb={8} mt={8} bold>
            More than 50,000 students have created amazing projects at CodeDay events.
          </Heading>
        </Content>

        <Box key={rows[1][0].imageUrl} mb={8}>
          <Ticker move={pageIsVisible} offset={100}>{({ index }) => rows[1][index % rows[0].length]}</Ticker>
        </Box>
      </Box>
    </PageVisibility>
  );
}
