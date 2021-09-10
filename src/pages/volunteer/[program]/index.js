import React from 'react';
import DefaultErrorPage from 'next/error'
import { print } from 'graphql';
import { apiFetch } from '@codeday/topo/utils';
import Text, { Heading, Link } from '@codeday/topo/Atom/Text';
import Content from '@codeday/topo/Molecule/Content';
import Wizard from '../../../components/Volunteer/Wizard';
import Page from '../../../components/Page';
import { upcomingEvents } from '../../../utils/time';
import { useQuery } from '../../../query';
import { VolunteerQuery } from '../volunteer.gql';

const PROGRAM_WEIGHT = ["primary", "secondary", "minor"];

export default function Volunteer({ program }) {
  const { cms: { volunteerPrograms } } = useQuery();
  const programsWithUpcoming = volunteerPrograms?.items?.map((program) => {
    return {
      ...program,
      upcoming: upcomingEvents(program.linkedFrom?.events?.items || []),
    };
  })
  .sort((a, b) => {
    if (a.upcoming.length > 0 && b.upcoming.length > 0)
      return a.upcoming[0].startsAt - b.upcoming[0].startsAt;
    if (a.upcoming.length > 0) return -1;
    if (b.upcoming.length > 0) return 1;
    return PROGRAM_WEIGHT.indexOf(a.type) - PROGRAM_WEIGHT.indexOf(b.type);
  })
   || [];

  const myProgram = programsWithUpcoming.filter((p) => p.webname === program)[0];

  if (!myProgram) return <DefaultErrorPage statusCode={404} />;

  return (
    <Page slug="/volunteer" title="Volunteer">
      <Content mt={-8}>
        <Heading as="h2" fontSize="4xl" mb={8} mt={8}>
          Volunteer for {myProgram.name}
        </Heading>
        <Wizard
          programs={programsWithUpcoming.filter((program) => program.volunteerDetails)}
          defaultPrograms={[ program ]}
        />
      </Content>
    </Page>
  );
}

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
    },
    revalidate: 300,
  };
}
