import React from 'react';
import { print } from 'graphql';
import { Heading } from '@codeday/topo/Atom/Text';
import Content from '@codeday/topo/Molecule/Content';
import { apiFetch } from '@codeday/topo/utils';
import Page from '../../components/Page';
import ContentfulRichText from '../../components/ContentfulRichText';
import { useQuery } from '../../query';
import { PrivacyIndexQuery } from './index.gql';

export default function PrivacyPolicy() {
  const { heading, policy } = useQuery().cms;

  return (
    <Page title={heading?.items[0]?.value} slug="/privacy">
      <Content>
        <Heading as="h2" fontSize="5xl" mt={-2} mb={8}>{heading?.items[0]?.value}</Heading>
        <ContentfulRichText json={policy?.items[0]?.richValue?.json} />
      </Content>
    </Page>
  );
}

export async function getStaticProps() {
  return {
    props: {
      query: await apiFetch(print(PrivacyIndexQuery)),
    },
    revalidate: 300,
  };
}
