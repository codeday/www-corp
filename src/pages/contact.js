import React from 'react';
import { print } from 'graphql';
import { sign } from 'jsonwebtoken';
import { Box, Grid, Text, Heading, Link, Image, Divider } from '@codeday/topo/Atom';
import EmailIcon from '@codeday/topocons/Icon/Email';
import { Content } from '@codeday/topo/Molecule';
import { apiFetch } from '@codeday/topo/utils';
import Page from '../components/Page';
import Employees from '../components/Contact/Employees';
import FullProfile from '../components/Contact/FullProfile';
import TextOnly from '../components/Contact/TextOnly';
import shuffle from 'knuth-shuffle-seeded';
import { useQuery } from '../query';
import { ContactQuery } from './contact.gql';

function nl2br(str) {
  return str.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br />$2');
}

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}


export default function Home({ seed }) {
  const { 
    cms: { email, phone, fax, address, officeAddress },
    account: { employees, otherTeam, volunteers, board, contractors, emeritus, boardEmeritus },
    labs,
    clear,
  } = useQuery();

  const employeeIds = employees.map((e) => e.id);
  const otherIds = [...employees, ...otherTeam, ...board, ...contractors, ...emeritus].map((e) => e.id);
  const justVolunteers = shuffle(volunteers.filter((v) => !otherIds.includes(v.id)), seed);
  const uniqueBoard = board.filter((director) => !employeeIds.includes(director.id));

  const boardEmeritusNames = boardEmeritus.map(e => toTitleCase(e.name).replace(/( \.| \*)/g, ''));
  const emeritusNames = emeritus.map(e => toTitleCase(e.name).replace(/( \.| \*)/g, ''));

  const volunteerNames = [...(
    new Set(
      [
        ...justVolunteers,
        ...labs.mentors,
        ...clear.tickets,
      ]
      .map(vol => toTitleCase(
        vol.name
          ? vol.name
          : `${vol.firstName || vol.givenName || ''} ${vol.lastName || vol.surname || vol.familyName || ''}`
      ).replace(/( \.| \*)/g, ''))
    )
  )]
  .filter(a => !a.includes('Volunteer') && a.length > 3 && !a.includes('?'))
  .sort();

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
      </Content>

      <Content><Divider /></Content>

      <Content>
        <Heading as="h3" fontSize="xl" color="current.textLight" textAlign={{ base: 'left', md: 'center' }} mt={12}>
          Team <Link position="relative" top={1} cursor="pointer" href="mailto:team@codeday.org"><EmailIcon /></Link>
        </Heading>
      </Content>
      <Employees seed={seed} mb={8} />

      <Content>
        <Heading as="h4" fontSize="sm" color="current.textLight" textAlign={{ base: 'left', md: 'center' }} mb={0} mt={0}>
          Emeriti
        </Heading>
      </Content>
      <TextOnly fontSize="sm" color="current.textLight" names={emeritusNames} mt={-2} mb={16} />


      <Content><Divider /></Content>

      <Content>
        <Heading as="h3" fontSize="xl" color="current.textLight" textAlign={{ base: 'left', md: 'center' }} mt={12}>
          Independent Board Members <Link position="relative" top={1} cursor="pointer" href="mailto:board-external@codeday.org"><EmailIcon /></Link>
        </Heading>
      </Content>
      <FullProfile mb={8} entries={uniqueBoard} />

      <Content>
        <Heading as="h4" fontSize="sm" color="current.textLight" textAlign={{ base: 'left', md: 'center' }} mb={0} mt={0}>
          Emeriti
        </Heading>
      </Content>
      <TextOnly fontSize="sm" color="current.textLight" names={boardEmeritusNames} mt={-2} mb={16} />
      

      <Content><Divider /></Content>

      <Content>
        <Heading as="h3" fontSize="xl" color="current.textLight" textAlign={{ base: 'left', md: 'center' }} mt={12}>
          Volunteers
        </Heading>
      </Content>
      <TextOnly names={volunteerNames} />
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
