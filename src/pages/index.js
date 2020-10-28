import React from 'react';
import { print } from 'graphql';
import Content from '@codeday/topo/Molecule/Content';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Link from '@codeday/topo/Atom/Text/Link';
import { apiFetch } from '@codeday/topo/utils';
import Eco from '@codeday/topocons/Icon/Eco';
import { useQuery } from '../query';
import Page from '../components/Page';
import Hero from '../components/Index/Hero';
import Stats from '../components/Index/Stats';
import Programs from '../components/Index/Programs';
import Sponsors from '../components/Index/Sponsors';
import Announcement from '../components/Index/Announcement';
import Community from '../components/Index/Community';
import Quote from '../components/Index/Quotes';
import { IndexQuery } from './index.gql';

export default function Home({ seed }) {
  const { eco, learnMore } = useQuery().cms;

  return (
    <Page slug="/">
      <Announcement mt={-12} mb={8} />
      <Hero seed={seed} mb={8} />
      <Stats />
      <Programs />
      <Sponsors />
      <Community />
      <Quote seed={seed} />
      <Content color="current.textLight" mt={16} mb={-12}>
        <Grid borderWidth={1} rounded="md" p={8} gap={8} templateColumns="1fr 100%" alignItems="center">
          <Box float="left" fontSize="2xl">
            <Eco />
          </Box>
          <Box pr={8}>
            {eco?.items[0]?.value}{' '}
            <Link href="/eco">{learnMore?.items[0]?.value || 'Learn more.'}</Link>
          </Box>
        </Grid>
      </Content>
    </Page>
  );
}

const getDate = () => {
  const d = new Date();
  d.setUTCHours(d.getUTCHours() - 7);
  return d.toISOString();
};

export async function getStaticProps() {
  return {
    props: {
      query: await apiFetch(print(IndexQuery), { cmsDate: getDate() }),
      seed: Math.random(),
    },
    revalidate: 300,
  };
}
