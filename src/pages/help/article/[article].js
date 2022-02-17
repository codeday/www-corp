import React from 'react';
import { print } from 'graphql';
import { DateTime } from 'luxon';
import { apiFetch } from '@codeday/topo/utils';
import { Content } from '@codeday/topo/Molecule';
import { Text, Heading, Link, Box, List, ListItem } from '@codeday/topo/Atom';
import UiArrowRight from '@codeday/topocons/Icon/UiArrowRight';
import Page from '../../../components/Page';
import ContentfulRichText from '../../../components/ContentfulRichText';
import { HelpArticleQuery, HelpArticlePathsQuery } from './article.gql';

export default function Article({ faq }) {
  if (!faq) return <></>;

  return (
    <Page slug={`/help/article/${faq.sys.id}`} title={`${faq.title} ~ Help`}>
      <Content mt={-8} maxWidth="xl">
        <Heading as="h2" fontSize="5xl" mb={1} mt={1}>{faq.title}</Heading>
        <Text color="current.textLight" mb={0}>
          Last updated {DateTime.fromISO(faq.sys.publishedAt).toLocaleString(DateTime.DATETIME_MED)}
        </Text>
        <Text color="current.textLight" mb={8}>
          Applies to{' '}
          <Link href={`/help/${faq.program.webname}`}>{faq.program.name}</Link>
          <UiArrowRight />
          {faq.audience.map((aud, i) => (
            <>
              <Link href={`/help/${faq.program.webname}/${aud.toLowerCase()}`}>
                {aud}s
              </Link>
              {i !== faq.audience.length - 1 && ','}
              {' '}
            </>
          ))}
        </Text>

        <ContentfulRichText json={faq.answer.json} links={faq.answer.links} />
        {faq?.relatedAnswers?.items?.length > 0 && (
          <Box p={4} borderWidth={1} rounded="sm">
            <Heading as="h3" fontSize="xl" mb={2}>Related Answers</Heading>
            <List styleType="disc">
              {faq?.relatedAnswers.items.map((related) => (
                <ListItem key={related.sys.id}>
                  <Link href={`/help/article/${related.sys.id}`}>{related.title}</Link>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Content>
    </Page>
  )
}

export async function getStaticPaths() {
  const { cms: { faqs } } = await apiFetch(print(HelpArticlePathsQuery));
  return {
    paths: faqs?.items?.map((faq) => ({ params: { article: faq.sys.id } })),
    fallback: true,
  };
}

export async function getStaticProps({ params: { article }}) {
  const { cms: { faq } } = await apiFetch(print(HelpArticleQuery), { article });
  return {
    props: {
      faq,
    },
    revalidate: 300,
  };
}
