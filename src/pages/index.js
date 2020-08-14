import React from 'react';
import { print } from 'graphql';
import { apiFetch } from '@codeday/topo/utils';
import Page from '../components/Page';
import Hero from '../components/Index/Hero';
import Stats from '../components/Index/Stats';
import Programs from '../components/Index/Programs';
import Sponsors from '../components/Index/Sponsors';
import { IndexQuery } from './index.gql';

export default function Home({ seed }) {
  return (
    <Page slug="/" title="CodeDay">
      <Hero seed={seed} mb={8} />
      <Stats />
      <Programs />
      <Sponsors />
    </Page>
  );
}

export async function getStaticProps() {
  return {
    props: {
      query: await apiFetch(print(IndexQuery)),
      seed: Math.random(),
    },
    revalidate: 300,
  };
}
