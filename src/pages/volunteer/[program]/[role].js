import { print } from 'graphql';
import { apiFetch } from '@codeday/topo/utils';
import { VolunteerQuery } from '../volunteer.gql';

export { default } from '../index.js';

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params: { program, role }}) {
  const query = await apiFetch(print(VolunteerQuery));

  return {
    props: {
      query,
      program,
      role: role.replace(/-/g, ' '),
    },
    revalidate: 300,
  };
}
