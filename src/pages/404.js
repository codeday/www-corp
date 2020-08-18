import React from 'react';
import { print } from 'graphql';
import Text, { Heading, Link } from '@codeday/topo/Atom/Text';
import Content from '@codeday/topo/Molecule/Content';
import Image from '@codeday/topo/Atom/Image';
import Box from '@codeday/topo/Atom/Box';
import { apiFetch } from '@codeday/topo/utils';
import Page from '../components/Page';
import { Error404Query } from './404.gql';

export default function Home() {
  return (
    <Page title="404 File Not Found">
      <Content>
        <Image
          alt=""
          src="https://img.codeday.org/w=1024;h=300;fit=crop;crop=faces,edges/6/t/6ttx5an4wbxypvf324er646d48ri8py88fjwbdwp5cxay8tfwo9nnmdwq9vpbseffz.jpg"
        />
        <Text as="h2" fontSize="5xl" bold mt={4}>Oh no!</Text>
        <Heading as="h2" fontSize="4xl" fontWeight="normal">That page wasn&apos;t found.</Heading>
        <Box mt={4} mb={16}>
          <Text>
            If you think this page should be here, please <Link href="mailto:team@codeday.org">contact us.</Link>
          </Text>
        </Box>
      </Content>
    </Page>
  );
}

export async function getStaticProps() {
  return {
    props: {
      query: await apiFetch(print(Error404Query)),
    },
    revalidate: 300,
  };
}
