import { print } from 'graphql';
import { apiFetch } from '@codeday/topo/utils';
import { DateTime } from 'luxon';
import { GetStaticProps, GetStaticPaths } from 'next';
import { VolunteerQuery } from './volunteer.gql';

export { default } from './index';

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const region = params?.region as string;
  const query = await apiFetch(print(VolunteerQuery), { now: DateTime.now().minus({ months: 6 }) }, {});

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
