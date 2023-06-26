import React from 'react';
import { print } from 'graphql';
import { apiFetch } from '@codeday/topo/utils';
import Page from '../components/Page';
import Hero from '../components/Index/Hero';
import Stats from '../components/Index/Stats';
import Programs from '../components/Index/Programs';
import Sponsors from '../components/Index/Sponsors';
import Announcement from '../components/Index/Announcement';
import Community from '../components/Index/Community';
import Quote from '../components/Index/Quotes';
import Workshops from '../components/Index/Workshops';
import { IndexQuery } from './index.gql';

export default function Home({ seed }) {
  return (
    <Page slug="/" fun>
      <Announcement mt={-12} mb={8} />
      <Hero mb={8} />
      <Stats />
      <Programs />
      <Sponsors />
      <Community />
      <Quote seed={seed} />
      <Workshops />
    </Page>
  );
}

const getDate = (offsetHours) => {
  const d = new Date();
  d.setUTCHours(d.getUTCHours() - 7 + (offsetHours || 0));
  return d.toISOString();
};

export async function getStaticProps() {
  return {
    props: {
      query: await apiFetch(print(IndexQuery), {
        cmsDate: getDate(),
        clearDate: getDate(),
        calendarDateStart: getDate(12 * -1),
        calendarDateEnd: getDate(24 * 7 * 4),
      }),
      seed: Math.random(),
    },
    revalidate: 300,
  };
}
