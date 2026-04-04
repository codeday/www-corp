import { apiFetch } from "@codeday/topo/utils";
import { print } from "graphql";
import { GetStaticProps } from "next";
import React from "react";

import Announcement from "../components/Index/Announcement";
import Community from "../components/Index/Community";
import Hero from "../components/Index/Hero";
import Programs from "../components/Index/Programs";
import Quote from "../components/Index/Quotes";
import Sponsors from "../components/Index/Sponsors";
import Stats from "../components/Index/Stats";
import Workshops from "../components/Index/Workshops";
import Page from "../components/Page";
import { IndexQuery } from "./index.gql";

interface HomeProps {
  seed: number;
}

export default function Home({ seed }: HomeProps) {
  return (
    <Page slug="/" fun>
      <Announcement mt={-12} mb={8} />
      <Hero mb={8} />
      <Stats />
      <Programs />
      <Sponsors mt={12} />
      <Community />
      <Quote seed={seed} />
      <Workshops />
    </Page>
  );
}

const getDate = (offsetHours?: number) => {
  const d = new Date();
  d.setUTCHours(d.getUTCHours() - 7 + (offsetHours || 0));
  return d.toISOString();
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      query: await apiFetch(
        print(IndexQuery),
        {
          cmsDate: getDate(),
          clearDate: getDate(),
          calendarDateStart: getDate(12 * -1),
          calendarDateEnd: getDate(24 * 7 * 4),
        },
        {},
      ),
      seed: Math.random(),
    },
    revalidate: 300,
  };
};
