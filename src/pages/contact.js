import React from 'react';
import { print } from 'graphql';
import { Grid } from '@codeday/topo/Atom/Box';
import Text, { Heading, Link } from '@codeday/topo/Atom/Text';
import Image from '@codeday/topo/Atom/Image';
import Content from '@codeday/topo/Molecule/Content';
import { apiFetch } from '@codeday/topo/utils';
import Page from '../components/Page';
import Employees from '../components/Contact/Employees';
import Volunteers from '../components/Contact/Volunteers';
import { ContactQuery } from './contact.gql';

export default function Home({ seed }) {
  return (
    <Page slug="/contact" title="Contact">
      <Content>
        <Image
          src="https://img.codeday.org/o/1/9/191yum8oauq3rnagx6aakycvrxxmw4vdg46vei71sfaxessdj3qdn2inwx58derbbi.jpg"
          alt=""
          mt={-8}
          mb={4}
          rounded="md"
        />
        <Heading as="h2" fontSize="5xl" mb={4}>Let&apos;s Talk.</Heading>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={8} alignItems="center">
          <Text bold mb={1} fontSize="xl">CodeDay<br />340 S Lemon Ave PMB 7763<br />Walnut, CA 91789</Text>
          <Text bold fontSize="2xl" mb={1} textAlign={{ base: 'left', md: 'center' }}>
            <Link href="mailto:team@codeday.org">team@codeday.org</Link>
          </Text>
          <Text bold fontSize="2xl" mb={1} textAlign={{ base: 'left', md: 'center' }}>
            <Link href="tel:18886077763">(888) 607-7763</Link>
          </Text>
        </Grid>
        <Heading as="h3" fontSize="xl" color="current.textLight" textAlign={{ base: 'left', md: 'center' }} mt={12}>
          Meet our team:
        </Heading>
      </Content>
      <Employees mb={16} />
      <Volunteers />
    </Page>
  );
}

export async function getStaticProps() {
  return {
    props: {
      query: await apiFetch(print(ContactQuery)),
      seed: Math.random(),
    },
    revalidate: 300,
  };
}
