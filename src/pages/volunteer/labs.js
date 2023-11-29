import { print } from 'graphql';
import { apiFetch } from '@codeday/topo/utils';
import { DateTime } from 'luxon';
import { VolunteerQuery } from './volunteer.gql';

export { default } from './index.js';

export async function getStaticProps() {
  const query = await apiFetch(print(VolunteerQuery), { now: DateTime.now().minus({ months: 6 }) });
  return {
    props: {
      query,
      seed: Math.random(),
      startBackground: 'industry',
      startPage: 2,
      layout: 'go',
    },
    revalidate: 300,
  };
}
