import React from 'react';
import { Spinner } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import Calendly from '../../components/Calendly';
import Page from '../../components/Page';

export default function CalendlyPage({ slug }) {
  return (
    <Page slug={`/m/${slug}`} title="Schedule Meeting">
      <Content>
        {!slug ? <Spinner /> : (
          <Calendly mt={-8} slug={slug[0]} meeting={slug.length > 1? slug[1] : undefined} />
        )}
      </Content>
    </Page>
  );
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export async function getStaticProps({ params: { slug } }) {
  return {
    props: {
      slug,
    },
    revalidate: 300,
  };
}
