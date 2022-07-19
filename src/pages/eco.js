import React from 'react';
import { print } from 'graphql';
import { Heading } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { apiFetch } from '@codeday/topo/utils';
import Page from '../components/Page';
import ContentfulRichText from '../components/ContentfulRichText';
import { useQuery } from '../query';
import { EcoQuery } from './eco.gql';

export default function Eco() {
  const { details } = useQuery().cms;

  return (
    <Page title="Ecological Footprint" slug="/eco">
      <Content maxWidth="container.md">
        <Heading as="h2" fontSize="5xl" mt={-2} mb={8}>Ecological Footprint</Heading>
        <ContentfulRichText json={details?.items[0]?.richValue?.json} />
      </Content>
    </Page>
  );
}

export async function getStaticProps() {
  return {
    props: {
      query: await apiFetch(print(EcoQuery)),
    },
    revalidate: 300,
  };
}
