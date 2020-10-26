import React from 'react';
import { print } from 'graphql';
import { Heading } from '@codeday/topo/Atom/Text';
import Content from '@codeday/topo/Molecule/Content';
import Divider from '@codeday/topo/Atom/Divider';
import List, { Item as ListItem } from '@codeday/topo/Atom/List';
import { apiFetch } from '@codeday/topo/utils';
import Page from '../components/Page';
import { useQuery } from '../query';
import { DocsQuery } from './docs.gql';
import Link from '@codeday/topo/Atom/Text/Link';

export default function Conduct() {
  const { legalDocuments } = useQuery().cms;
  const types = {
    'annual-report': { title: 'Annual Report', items: [] },
    registration: { title: 'Registration', items: [] },
    meeting: { title: 'Meeting Minutes', items: [] },
    tax: { title: 'Taxes', items: [] },
    financial: { title: 'Financial Statements', items: [] },
    other: { title: 'Other', items: [] },
  };

  legalDocuments?.items?.forEach((k) => k.type in types && types[k.type].items.push(k));

  const displayTypes = Object.values(types).filter((t) => t.items.length > 0);

  return (
    <Page title="Documents" slug="/docs">
      <Content maxWidth="containers.md">
        <Heading as="h2" fontSize="5xl" mt={-2} mb={8}>Legal Documents</Heading>
        {displayTypes.map((t, i) => (
          <>
            <Heading as="h3" fontSize="2xl">{t.title}</Heading>
            <List styleType="disc">
              {t.items.map((item) => (
                <ListItem>
                  <Link href={item.file.contentfulBaseUrl} target="_blank" rel="noopener">
                    {item.title}
                  </Link>
                </ListItem>
              ))}
            </List>
            {i + 1 < displayTypes.length && <Divider mb={8} pt={8} />}
          </>
        ))}
      </Content>
    </Page>
  );
}

export async function getStaticProps() {
  return {
    props: {
      query: await apiFetch(print(DocsQuery)),
    },
    revalidate: 300,
  };
}
