import { print } from 'graphql';
import { DateTime } from 'luxon';
import { useRouter } from 'next/router';
import Markdown from 'react-markdown';
import { Text, Link, Heading, Skelly, Spinner, Box, Grid, Divider, HStack, List, ListItem } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { apiFetch } from '@codeday/topo/utils';
import Error404 from './404';
import Page from '../components/Page';
import { ListPublicationsQuery } from './data.gql';
import { useQuery } from '../query';
import { sign } from 'jsonwebtoken';

export default function Home() {
  const { cms } = useQuery();
  const { query } = useRouter();

  if (!cms) {
    return (
      <Page slug={`/data`}>
        <Content>
          <Skelly h={12} mb={4} />
          <Spinner />
        </Content>
      </Page>
    )
  }

  if (cms?.publications?.items.length < 1) {
    return <Error404 />;
  }

  return (
    <Page slug={`/data`} title="Open Datasets">
      <Content mt={-8} mb={2}>
        <Heading as="h2" fontSize={{ base: '2xl', md: '4xl' }} mb={2}>CodeDay Open Data Repository</Heading>
        <Box mb={4}>
          <Link fontSize="sm" href={`https://doi.org/${process.env.NEXT_PUBLIC_DOI_PREFIX}/${process.env.NEXT_PUBLIC_DATABASE_DOI}`}>
            https://doi.org/{process.env.NEXT_PUBLIC_DOI_PREFIX}/{process.env.NEXT_PUBLIC_DATABASE_DOI}
          </Link>
        </Box>
        <List styleType="disc" pl={4}>
            {cms.publications.items.map((p) => (
                <ListItem key={p.doiSuffix}>
                    <Box as="a" href={`/doi/${process.env.NEXT_PUBLIC_DOI_PREFIX}/${p.doiSuffix}`}>
                        <Link as="span">{p.title}</Link>
                        <Text fontSize="sm">
                            {p.contributors.length > 0 ? (
                                <>
                                    {p.contributors.map((c) => c.name).join('; ')},{' '}
                                </>
                            ) : null}
                            {DateTime.fromISO(p.publicationDate).toFormat('MMMM dd, yyyy')}
                        </Text>
                    </Box>
                </ListItem>
            ))}
        </List>
      </Content>
    </Page>
  );
}

export async function getStaticProps() {
  return {
    props: {
      query: await apiFetch(
        print(ListPublicationsQuery),
      ),
    },
    revalidate: 300,
  };
}
