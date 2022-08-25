import React, { useState } from 'react';
import { print } from 'graphql';
import { Box, Heading, Button, Divider } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { apiFetch } from '@codeday/topo/utils';
import Page from '../components/Page';
import ContentfulRichText from '../components/ContentfulRichText';
import { useQuery } from '../query';
import { ConductQuery } from './conduct.gql';

function ConductEntry({ entry }) {
  const [isOpen, setIsOpen] = useState(false);
  const description = entry?.richValue;
  const moreInfo = entry?.subvalues?.items[0]?.richValue;

  return (
    <Box mb={4}>
      <ContentfulRichText json={description.json} />
      {moreInfo && (
        <>
          <Box>
            <Button colorScheme="blue" variant="ghost" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? 'Hide More Info' : 'More Info'}
            </Button>
          </Box>
          {isOpen && (
            <Box bg="blue.50" color="blue.900" borderWidth={1} borderColor="blue.600" p={4} mt={4}>
              <ContentfulRichText json={moreInfo.json} />
            </Box>
          )}
        </>
      )}
    </Box>
  )
}

export default function Conduct() {
  const { conduct, report } = useQuery().cms;

  const conductTitle = conduct?.items[0]?.value;
  const conductIntro = conduct?.items[0]?.richValue;

  const conductEntries = conduct?.items[0]?.subvalues?.items;

  return (
    <Page title={conductTitle} slug="/privacy">
      <Content maxWidth="container.md">
        <Heading as="h2" fontSize="5xl" mt={-2} mb={8}>{conductTitle}</Heading>
        <ContentfulRichText json={conductIntro?.json} />
        {conductEntries?.map((entry) => <ConductEntry entry={entry} />)}
        <Divider mt={8} mb={8} />
      </Content>
      <Content>
        <ContentfulRichText json={report?.items[0]?.richValue?.json} />
      </Content>
    </Page>
  );
}

export async function getStaticProps() {
  return {
    props: {
      query: await apiFetch(print(ConductQuery)),
    },
    revalidate: 300,
  };
}
