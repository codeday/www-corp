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
import { useQuery } from '../query';
import { ContactQuery } from './contact.gql';

function nl2br(str) {
  return str.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br />$2');
}

export default function Home({ seed }) {
  const { cms: { email, phone, address } } = useQuery();

  return (
    <Page slug="/contact" title="Contact">
      <Content>
        <Image
          src="https://img.codeday.org/o/1/9/191yum8oauq3rnagx6aakycvrxxmw4vdg46vei71sfaxessdj3qdn2inwx58derbbi.jpg"
          alt=""
          mt={-8}
          mb={8}
          rounded="md"
        />
        <Heading as="h2" fontSize="5xl" mb={12}>Let&apos;s Talk.</Heading>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={8} alignItems="center" mb={12}>
          <Text bold mb={1} fontSize="xl">
            <span dangerouslySetInnerHTML={{ __html: nl2br(address?.items[0]?.value)}} />
          </Text>

          <Text bold fontSize="2xl" mb={1} textAlign={{ base: 'left', md: 'center' }}>
            <Link href={`mailto:${email?.items[0]?.value}`}>{email?.items[0]?.value}</Link>
          </Text>

          <Text bold fontSize="2xl" mb={1} textAlign={{ base: 'left', md: 'right' }}>
            <Link href={`tel:${phone?.items[0]?.value.replace(/[^0-9]/g, '')}`}>{phone?.items[0]?.value}</Link>
          </Text>
        </Grid>
        <Heading as="h3" fontSize="xl" color="current.textLight" textAlign={{ base: 'left', md: 'center' }} mt={12}>
          Meet our team:
        </Heading>
      </Content>
      <Employees seed={seed} mb={16} />
      <Content>
        <Heading as="h3" fontSize="xl" color="current.textLight" textAlign={{ base: 'left', md: 'center' }} mt={12}>
          Volunteers:
        </Heading>
      </Content>
      <Volunteers seed={seed} />
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
