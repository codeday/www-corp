import { Content } from "@codeday/topo/Molecule";
import { apiFetch } from "@codeday/topo/utils";
import { GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import React from "react";

import Event from "../../../../components/EventInfo";
import Page from "../../../../components/Page";
import { EventByIdQuery } from "./index.gql";

interface EventPageProps {
  event: any;
}

export default function Home({ event }: EventPageProps) {
  const { id } = useRouter().query;

  return (
    <Page slug={`/e/${id}`} title={event.title}>
      <NextSeo description={event.description} />
      <Content mt={-8}>
        <Event event={event} />
      </Content>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const calendarId = params?.calendarId as string;
  const eventId = params?.eventId as string;
  const resp = await apiFetch(EventByIdQuery, { id: eventId, calendarId }, {});
  return {
    props: {
      event: resp?.calendar?.event,
    },
  };
};
