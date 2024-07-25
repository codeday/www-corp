import React from 'react';
import { print } from 'graphql';
import { sign } from 'jsonwebtoken';
import { Box, Grid, Text, Heading, Link, Image } from '@codeday/topo/Atom';
import EmailIcon from '@codeday/topocons/Icon/Email';
import { Content } from '@codeday/topo/Molecule';
import { apiFetch } from '@codeday/topo/utils';
import Page from '../components/Page';
import Employees from '../components/Contact/Employees';
import Board from '../components/Contact/Board';
import Volunteers from '../components/Contact/Volunteers';
import Emeritus from '../components/Contact/Emeritus';
import { useQuery } from '../query';
import { ContactQuery } from './contact.gql';

function nl2br(str) {
  return str.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br />$2');
}

export default function Home({ seed }) {
  const { cms: { email, phone, fax, address, officeAddress } } = useQuery();

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
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={8} alignItems="center" mb={12} textAlign="center">
          <Box>
            <Heading as="h3" fontSize="2xl" mb={4}>Accounts Receivable</Heading>
            <Text mb={1} fontSize="md">
              <span dangerouslySetInnerHTML={{ __html: nl2br(address?.items[0]?.value)}} />
            </Text>
          </Box>

          <Box>
            <Heading as="h3" fontSize="2xl" mb={4}>HQ</Heading>
            <Text mb={1} fontSize="md">
              <span dangerouslySetInnerHTML={{ __html: nl2br(officeAddress?.items[0]?.value)}} />
            </Text>
          </Box>

          <Text fontWeight="bold" fontSize="2xl" mb={1}>
            <Link href={`mailto:${email?.items[0]?.value}`}>{email?.items[0]?.value}</Link><br />
            <Link href={`tel:${phone?.items[0]?.value.replace(/[^0-9]/g, '')}`}>{phone?.items[0]?.value}</Link><br />
            <Link href={`tel:${fax?.items[0]?.value.replace(/[^0-9]/g, '')}`}>{fax?.items[0]?.value}</Link> (fax)
          </Text>
        </Grid>
        <Heading as="h3" fontSize="xl" color="current.textLight" textAlign={{ base: 'left', md: 'center' }} mt={12}>
          Team <Link position="relative" top={1} cursor="pointer" href="mailto:team@codeday.org"><EmailIcon /></Link>
        </Heading>
      </Content>
      <Employees seed={seed} mb={8} />

      <Content>
        <Heading as="h3" fontSize="xl" color="current.textLight" textAlign={{ base: 'left', md: 'center' }} mt={12}>
          Independent Board Members <Link position="relative" top={1} cursor="pointer" href="mailto:board-external@codeday.org"><EmailIcon /></Link>
        </Heading>
      </Content>
      <Board seed={seed} mb={16} />

      <Content>
        <Heading as="h3" fontSize="xl" color="current.textLight" textAlign={{ base: 'left', md: 'center' }} mt={12}>
          Former Team Members
        </Heading>
      </Content>
      <Emeritus seed={seed} mb={16} />
      
      <Content>
        <Heading as="h3" fontSize="xl" color="current.textLight" textAlign={{ base: 'left', md: 'center' }} mt={12}>
          Volunteers
        </Heading>
      </Content>
      <Volunteers seed={seed} />
    </Page>
  );
}

export async function getStaticProps() {
  const token = sign({ scopes: 'read:users' }, process.env.ACCOUNT_SECRET, { expiresIn: '3m' });
  const labsToken = sign({ typ: 'a', aud: 'urn:gql.labs.codeday.org' }, process.env.LABS_SECRET, { expiresIn: '3m' });
  const clearToken = sign({ t: 'A', aud: 'clear-gql' }, process.env.CLEAR_SECRET, { expiresIn: '3m' });
  return {
    props: {
      query: await apiFetch(
        print(ContactQuery),
        {},
        {
          Authorization: `Bearer ${token}`,
          'X-Labs-Authorization': `Bearer ${labsToken}`,
          'X-Clear-Authorization': `Bearer ${clearToken}`,
        }
      ),
      seed: Math.random(),
    },
    revalidate: 300,
  };
}
