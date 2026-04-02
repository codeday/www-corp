import React from 'react';
import { print } from 'graphql';
import { Heading } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { apiFetch } from '@codeday/topo/utils';
import { GetStaticProps, GetStaticPaths } from 'next';
import Page from '../../components/Page';
import Markdown from '../../components/Markdown';
import { useQuery } from '../../query';
import { LegalPathsQuery, LegalContentQuery, TermageddonLegalContentQuery } from './policy.gql';

const TERMAGEDDON_POLICIES = ['tos', 'privacy', 'cookies', 'disclaimer'];

interface PolicyProps {
  slug: string;
}

export default function Policy({ slug }: PolicyProps) {
  const { termageddon, notion } = useQuery();
  const page = TERMAGEDDON_POLICIES.includes(slug)
    ? { content: termageddon.terms[slug], title: slug.charAt(0).toUpperCase() + slug.slice(1) }
    : notion?.page || { content: '', title: 'Not Found' };

  return (
    <Page title={page.title} slug={`/legal/${page.slug}`}>
      <Content>
        <Heading as="h2" fontSize="5xl" mt={-2} mb={8}>{page.title}</Heading>
        <Markdown baseHeadingLevel={3} allowHtml>{page.content}</Markdown>
      </Content>
    </Page>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { notion } = await apiFetch(print(LegalPathsQuery), {}, {});
  return {
    paths: [
      ...notion.pages.map((p: any) => ({ params: { policy: p.slug } })),
      ...TERMAGEDDON_POLICIES.map((p) => ({ params: { policy: p } })),
    ],
    fallback: true,
  };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    if (TERMAGEDDON_POLICIES.includes(params!.policy as string)) {
      return {
        props: {
          query: await apiFetch(print(TermageddonLegalContentQuery), {}, {}),
          slug: params!.policy,
        },
        revalidate: 300,
      };
    } else {
      return {
        props: {
          query: await apiFetch(print(LegalContentQuery), { slug: params!.policy, parentSlug: 'legal' }, {}),
          slug: params!.policy,
        },
        revalidate: 300,
      };
    }
  } catch (e) {
    return {
      notFound: true,
    };
  }
}
