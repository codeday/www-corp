import React from 'react';
import { print } from 'graphql';
import { apiFetch } from '@codeday/topo/utils';
import { Box, Grid, Image, Text, Heading } from '@codeday/topo/Atom';
import { Content, IconBox, IconBoxIcon as HeaderIcon, IconBoxText as HeaderText, IconBoxBody as BoxBody } from '@codeday/topo/Molecule';
import Page from '../../components/Page';
import { useQuery } from '../../query';
import { HelpIndexQuery } from './index.gql';

export default function Help() {
  const { programs } = useQuery().cms || {};
  const programsWithFaqs = programs?.items?.filter((p) => p.linkedFrom?.faqs?.items?.length > 0) || [];

  return (
    <Page slug="/help" title="Help">
      <Content mt={-8}>
        <Heading as="h2" fontSize="5xl">Helpdesk</Heading>
        <Text mb={8}>Choose which program you'd like help with:</Text>
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr', lg: 'repeat(3, 1fr)'}} gap={8}>
          {programsWithFaqs.map((program) => (
            <IconBox as="a" key={program.webname} href={`/help/${program.webname}`}>
              <HeaderIcon><Image src={program.logo.url} h={12} alt="" /></HeaderIcon>
              <HeaderText>{program.name}</HeaderText>
              <BoxBody>{program.shortDescription}</BoxBody>
            </IconBox>
          ))}
        </Grid>
      </Content>
    </Page>
  )
}

export async function getStaticProps() {
  const query = await apiFetch(print(HelpIndexQuery));

  return {
    props: {
      query,
    },
    revalidate: 300,
  };
}

