import { print } from 'graphql';
import { apiFetch } from '@codeday/topo/utils';
import { DateTime } from 'luxon';
import { VolunteerQuery, AllRegionsQuery } from './volunteer.gql';

export { default } from './index.js';

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params: { region } }) {
  const query = await apiFetch(print(VolunteerQuery), { now: DateTime.now().minus({ months: 6 }) });

  return {
    props: {
      query,
      seed: Math.random(),
      startBackground: 'student',
      startRegion: region,
      startPage: 2,
    },
    revalidate: 300,
  };
}
