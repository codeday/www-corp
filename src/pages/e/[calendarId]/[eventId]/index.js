import React from 'react';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { Content } from '@codeday/topo/Molecule';
import { apiFetch } from '@codeday/topo/utils';
import Page from '../../../../components/Page';
import Event from '../../../../components/EventInfo';
import { EventByIdQuery } from './index.gql';

export default function Home({ event }) {
  const { id } = useRouter().query;

  return (
    <Page slug={`/e/${id}`} title={event.title}>
      <NextSeo
        description={event.description}
      />
      <Content mt={-8}>
        <Event event={event} />
      </Content>
    </Page>
  );
}

export async function getServerSideProps({ req, params: { calendarId, eventId } }) {
  const resp = await apiFetch(EventByIdQuery, { id: eventId, calendarId });
  return {
    props: {
      event: resp?.calendar?.event,
    },
  }
}
