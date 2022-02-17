import React from 'react';
import { print } from 'graphql';
import { Heading } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { apiFetch } from '@codeday/topo/utils';
import Page from '../../components/Page';
import ContentfulRichText from '../../components/ContentfulRichText';
import { useQuery } from '../../query';
import { PrivacyThirdPartyQuery } from './third-party.gql';

export default function Home() {
  const { policy } = useQuery().cms;

  return (
    <Page title={policy?.items[0]?.value} slug="/privacy/third-party">
      <Content>
        <Heading as="h2" fontSize="5xl" mt={-2} mb={8}>{policy?.items[0]?.value}</Heading>
        <ContentfulRichText json={policy?.items[0]?.richValue?.json} />
      </Content>
    </Page>
  );
}

export async function getStaticProps() {
  return {
    props: {
      query: await apiFetch(print(PrivacyThirdPartyQuery)),
    },
    revalidate: 300,
  };
}
