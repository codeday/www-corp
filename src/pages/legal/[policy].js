import React from 'react';
import { print } from 'graphql';
import { Heading } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { apiFetch } from '@codeday/topo/utils';
import Page from '../../components/Page';
import Markdown from '../../components/Markdown';
import { useQuery } from '../../query';
import { LegalPathsQuery, LegalContentQuery } from './policy.gql';

export default function PrivacyPolicy({ query }) {
  console.log(query);
  const { page } = useQuery().notion;

  return (
    <Page title={page.title} slug={`/legal/${page.slug}`}>
      <Content>
        <Heading as="h2" fontSize="5xl" mt={-2} mb={8}>{page.title}</Heading>
        <Markdown baseHeadingLevel={3} allowHtml>{page.content}</Markdown>
      </Content>
    </Page>
  );
}

export async function getStaticPaths() {
  const { notion } = await apiFetch(print(LegalPathsQuery));
  return {
    paths: notion.pages.map((p) => ({ params: { policy: p.slug } })),
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  return {
    props: {
      query: await apiFetch(print(LegalContentQuery), { slug: params.policy, parentSlug: 'legal' }),
    },
    revalidate: 300,
  };
}
