import React, { useState, useEffect } from 'react';
import Ticker from 'react-ticker';
import shuffle from 'knuth-shuffle-seeded';
import truncate from 'truncate';
import PageVisibility from 'react-page-visibility';
import { useInView } from 'react-intersection-observer';
import { Content } from '@codeday/topo/Molecule';
import { Box, Grid, Image, Text, Heading } from '@codeday/topo/Atom';
import { useQuery } from '../../query';


function PhotoTextCard({
  photo, text, authors, wip, href, eventInfo
}) {
  return (
    <Box
      rounded="md"
      width="sm"
      maxHeight="100%"
      h="100%"
      overflow="hidden"
      as={href && 'a'}
      href={href}
      target="_blank"
    >
      <Grid templateColumns="3fr 3fr" h="100%">
        <Box
          backgroundImage={`url(${photo})`}
          backgroundPosition="50% 50%"
          backgroundSize="cover"
          backgroundRepeat="no-repeat"
          h="100%"
        />
        <Box p={2} overflow="hidden">
          {authors && authors.length > 0 && (
            authors.length > 1 ? (
              <Box>
                {authors.map((author) => (
                  <Image
                    src={author.picture}
                    float="left"
                    alt=""
                    w={4}
                    h={4}
                    mr={2}
                    rounded="full"
                    key={author.picture}
                  />
                ))}
              </Box>
            ) : (
              <Box>
                <Image
                  src={authors[0].picture}
                  alt=""
                  float="left"
                  w={4}
                  h={4}
                  mr={2}
                  rounded="full"
                />
                <Text mb={0} fontWeight="bold" fontSize="sm">{authors[0].name}</Text>
              </Box>
            )
          )}
          <Text fontSize="sm" mb={0} style={{ clear: 'both'}}>
            {truncate(text, 90)}{' '}
            {wip && (
              <Text as="span" fontStyle="italic">#work-in-progress</Text>
            )}
          </Text>
        </Box>
      </Grid>
    </Box>
  );
}

function PhotoCard({ photo, authors, wip, eventInfo, projectTitle, href }) {
  return (
    <Box
      rounded="md"
      backgroundImage={`url(${photo})`}
      backgroundPosition="50% 50%"
      backgroundSize="cover"
      w={64}
      h="100%"
      position="relative"
      as={href && 'a'}
      href={href}
      target="_blank"
      d="block"
    >
      {authors && authors.length > 0 && (
        authors.length > 1 ? (
          <Box p={2} backgroundImage="linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))">
            {authors.map((author) => (
              <Image
                src={author.picture}
                alt=""
                w={4}
                h={4}
                mr={2}
                float="left"
                rounded="full"
                key={author.picture}
              />
            ))}
            <Text mb={0} fontWeight="bold" fontSize="sm" color="white">&nbsp;</Text>
          </Box>
        ) : (
          <Box p={2} backgroundImage="linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))">
            <Image
              src={authors[0].picture}
              alt=""
              float="left"
              w={4}
              h={4}
              mr={2}
              rounded="full"
            />
            <Text mb={0} fontWeight="bold" fontSize="sm" color="white">{authors[0].name}</Text>
          </Box>
        )
      )}
      {!(authors && authors.length > 0) && eventInfo && (
        <Box p={2} backgroundImage="linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))">
          <Text mb={0} fontSize="sm" color="white" fontWeight="bold">
            { eventInfo
              ? [
                  eventInfo.event?.program?.name,
                  eventInfo.program?.name,
                  eventInfo.region?.name,
                ].join(' ')
              : projectTitle
            }
          </Text>
        </Box>
      )}
      {projectTitle && (
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          p={2}
          backgroundImage="linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1))"
        >
          <Text mb={0} fontSize="sm" color="white" fontWeight="bold">{projectTitle}</Text>
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
          <Text mb={0} fontSize="sm" color="white" fontStyle="italic">#work-in-progress</Text>
        </Box>
      )}
    </Box>
  );
}

function Card({
  photo, text, authors, wip, eventInfo, projectTitle, href,
}) {
  const elem = (text && text.length > 0)
    ? <PhotoTextCard photo={photo} text={text} authors={authors} wip={wip} eventInfo={eventInfo} href={href} />
    : <PhotoCard photo={photo} authors={authors} wip={wip} eventInfo={eventInfo} projectTitle={projectTitle} href={href} />;

  return (
    <Box
      role="figure"
      height={40}
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
  const { ref, inView } = useInView({ rootMargin: '200px' });
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (inView) setHasLoaded(true);
  }, [inView]);

  const { showYourWork, showcase, cms: { indexCommunityPhotos, stats } } = useQuery();

  const studentCount = stats?.items?.reduce((accum, e) => accum + e.statStudentCount, 0);
  const studentCountRound = Math.round(studentCount/10000) * 10000;
  const studentCountPrefix = ['More than', 'Nearly'][studentCountRound > studentCount ? 1 : 0];
  const showcaseDemos = showcase.projects
    .map((p) => ({
      ...p,
      members: p.members && p.members.map((a) => a.account).filter((a) => a),
      media: p.media && p.media.filter((m) => m.type === 'IMAGE' && m.topic !== 'TEAM')[0] || null,
    }))
    .filter((p) => p.media && p.members && p.members.length > 0);

  const cards = shuffle([
    ...(showYourWork.messages.filter((m => m.author))
      .map((m) => <Card key={m.imageUrl} photo={m.imageUrl} text={m.text} authors={[m.author]} wip />)
        || []
    ),
    ...(showcaseDemos
      .map((d) => (
        <Card
          key={d.media.image}
          photo={d.media.image}
          projectTitle={d.name}
          authors={d.members}
          href={`https://showcase.codeday.org/project/${d.id}`}
        />
      ))
    ),
    ...(shuffle(indexCommunityPhotos.items, seed)
      .map((p) => <Card key={p.photo.url} photo={p.photo.url} eventInfo={{ region: p.region, event: p.event }} />)
        || []
    ).slice(0, 25),
    ...(shuffle(showcase.photos, seed)
      .map((p) => <Card key={p.url} photo={p.url} eventInfo={{ region: p.region, program: p.program }} />)
        || []
    ),
  ], seed);
  const rows = [
    cards.slice(0, Math.floor(cards.length / 2)),
    cards.slice(Math.floor(cards.length / 2)),
  ];

  return (
    <PageVisibility onChange={setPageIsVisible}>
      <Box ref={ref} mt={32} mb={32} {...props}>
        <Box key={rows[0][0].imageUrl}>
          {(pageIsVisible && inView) ? (
            <Ticker>{({ index }) => rows[0][index % rows[0].length]}</Ticker>
          ) : <Box h={40} />}
        </Box>

        <Content>
          <Heading as="h2" fontSize="5xl" textAlign="center" mb={8} mt={8} fontWeight="bold">
            {studentCountPrefix} {studentCountRound.toLocaleString()} students have created amazing projects at CodeDay events.
          </Heading>
        </Content>

        <Box key={rows[1][0].imageUrl} mb={8}>
          {(pageIsVisible && inView) ? (
            <Ticker offset={-100}>{
              ({ index }) => rows[1][index % rows[0].length]
            }</Ticker>
          ) : <Box h={40} />}
        </Box>
      </Box>
    </PageVisibility>
  );
}
