import React from 'react';
import { print } from 'graphql';
import { useRouter } from 'next/router';
import { Heading } from '@codeday/topo/Atom/Text';
import Image from '@codeday/topo/Atom/Image';
import Content from '@codeday/topo/Molecule/Content';
import Skelly from '@codeday/topo/Atom/Skelly';
import Spinner from '@codeday/topo/Atom/Spinner';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import CognitoForm from '@codeday/topo/Molecule/CognitoForm';
import { apiFetch } from '@codeday/topo/utils';
import Error404 from '../404';
import ContentfulRichText from '../../components/ContentfulRichText';
import Page from '../../components/Page';
import { FormQuery, ListFormsQuery } from './form.gql';
import { useQuery } from '../../query';

export default function Home() {
  const { cms } = useQuery();
  const { isFallback, query } = useRouter();

  if (!cms) {
    return (
      <Page slug={`/f/${query.slug}`}>
        <Content>
          <Skelly h={12} mb={4} />
          <Spinner />
        </Content>
      </Page>
    )
  }

  if (cms?.forms?.items.length < 1) {
    return <Error404 />;
  }

  const { image, title, cognitoForm, details, sidebar } = cms.forms.items[0];

  return (
    <Page slug={`/f/${query.slug}`} title={title}>
      <Content>
        {image && (
          <Image src={image.url} alt="" mb={4} mt={-4} rounded="md" />
        )}
        <Heading as="h2" fontSize="4xl" mb={8}>{title}</Heading>
        <Grid templateColumns={sidebar ? {base: '1fr', md: '3fr 2fr', lg: '2fr 1fr'} : '1fr'} gap={8}>
          <Box>
            {details && (
              <ContentfulRichText json={details.json} links={details.links} />
            )}
            <CognitoForm formId={cognitoForm} fallback />
          </Box>
          {sidebar && (
            <Box>
              <Box bg="blue.50" color="blue.900" borderColor="blue.600" borderWidth={1} p={4}>
                <ContentfulRichText json={sidebar.json} links={sidebar.links} h1Size="2xl" />
              </Box>
            </Box>
          )}
        </Grid>
      </Content>
    </Page>
  );
}

export async function getStaticPaths() {
  const query = await apiFetch(print(ListFormsQuery));

  return {
    paths: query?.cms?.forms?.items?.map((i) => ({
      params: {
        slug: i.slug
      }
    })) || [],
    fallback: true,
  };
}

export async function getStaticProps({ params: { slug } }) {
  return {
    props: {
      query: await apiFetch(print(FormQuery), { slug }),
    },
    revalidate: 300,
  };
}
