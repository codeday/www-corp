import React, { useState } from 'react';
import { print } from 'graphql';
import { apiFetch } from '@codeday/topo/utils';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Image from '@codeday/topo/Atom/Image';
import Content from '@codeday/topo/Molecule/Content';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import UiX from '@codeday/topocons/Icon/UiX';
import Page from '../../../components/Page';
import ContentfulRichText from '../../../components/ContentfulRichText';
import { useQuery } from '../../../query';
import { HelpProgramAudienceQuery, HelpProgramAudiencePathsQuery } from './audience.gql';

export default function Audience({ programWebname, audience }) {
  const [tag, setTag ] = useState(null);

  if (!programWebname || !audience) return <></>;

  const { programs, faqs, events } = useQuery().cms || {};
  const program = programs?.items[0] || null;

  const photos = events?.items
    ?.map((e) => e?.linkedFrom?.pressPhotos?.items[0]?.photo?.url)
    .filter((photo) => photo) || [];
  const photo = photos[0] || null;

  const allTags = faqs?.items
    ?.map((faq) => faq.tags || [])
    .reduce((accum, tags) => [...accum, ...tags], [])
    .reduce((accum, tag) => accum.includes(tag) ? accum : [...accum, tag], []);

  const filteredFaqs = !tag
    ? faqs?.items
    : faqs?.items?.filter((faq) => faq?.tags?.includes(tag));

  return (
    <Page slug={`/help/${programWebname}/${audience.toLowerCase()}`} title={`${audience} ~ ${program.name} ~ Help`}>
    <Content mt={-8}>
        {photo && (
          <Image src={photo} alt="" w="100%" mb={8} rounded="sm" />
        )}
        <Heading as="h2" fontSize="5xl" mb={4}>{program.name} {audience} Helpdesk</Heading>

        {allTags?.length > 0 && (
          <Box borderWidth={1} p={2} mb={4} rounded="sm">
            <Text bold color="current.textLight" mb={1}>Show only questions about:</Text>
            {allTags.map((t) => (
              <Box
                key={t}
                d="inline-block"
                borderWidth={1}
                rounded="sm"
                onClick={() => setTag(t === tag ? null : t)}
                mr={2}
                mb={2}
                p={1}
                pl={2}
                pr={2}
                cursor="pointer"
                color={t === tag ? 'current.text' : 'current.textLight'}
              >
                {t}
                {t === tag && <>{' '}<UiX /></>}
              </Box>
            ))}
          </Box>
        )}

        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
          {filteredFaqs?.map((faq) => (
            <Box
              key={faq.sys.id}
              as="a"
              d="block"
              p={4}
              pb={0}
              href={`/help/article/${faq.sys.id}`}
              rounded="sm"
              borderWidth={1}
              mb={2}
              shadow="sm"
              maxHeight={48}
              overflowY="hidden"
              position="relative"
            >
              <Heading as="h3" fontSize="xl" mb={4}>{faq.title}</Heading>
              <ContentfulRichText json={faq.answer.json} h1Size={1} />
              <Box
                position="absolute"
                height={24}
                background="linear-gradient(0deg, rgba(255,255,255,1) 25%, rgba(255,255,255,0) 100%)"
                bottom={0}
                left={0}
                right={0}
              >
                &nbsp;
              </Box>
              <Box
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                textAlign="center"
                textDecoration="underline"
                color="blue.800"
                pb={2}
              >
                Read More
              </Box>
            </Box>
          ))}
        </Grid>
      </Content>
    </Page>
  )
}

export async function getStaticPaths() {
  const query = await apiFetch(print(HelpProgramAudiencePathsQuery));

  return {
    paths: query.cms.programs?.items
      ?.filter((program) => program?.linkedFrom?.faqs?.items?.length > 0)
      .map((program) => {
        const audiences = program?.linkedFrom?.faqs?.items
          ?.map((faq) => faq.audience)
          .reduce((accum, auds) => [...accum, ...auds], [])
          .reduce((accum, aud) => accum.includes(aud) ? accum : [...accum, aud], []) || [];

        return audiences.map((aud) => ({ params: { program: program.webname, audience: aud.toLowerCase() } }));
      })
      .reduce((accum, elem) => [...accum, ...elem], []),
    fallback: true,
  };
}

export async function getStaticProps({ params: { program, audience } }) {
  const audienceName = audience.charAt(0).toUpperCase() + audience.slice(1);
  const query = await apiFetch(print(HelpProgramAudienceQuery), { programWebname: program, audience: audienceName });

  return {
    props: {
      query,
      programWebname: program,
      audience: audienceName,
    },
    revalidate: 300,
  };
}

