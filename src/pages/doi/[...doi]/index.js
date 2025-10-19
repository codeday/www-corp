import { print } from 'graphql';
import { DateTime } from 'luxon';
import { useRouter } from 'next/router';
import Markdown from 'react-markdown';
import { Text, Link, Heading, Skelly, Spinner, Box, Grid, Divider, HStack, Image } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { apiFetch } from '@codeday/topo/utils';
import Error404 from '../../404';
import Page from '../../../components/Page';
import { PublicationQuery, ListPublicationQuery } from './index.gql';
import { useQuery } from '../../../query';
import FileDbIcon from '@codeday/topocons/Icon/FileDb';
import FileDocIcon from '@codeday/topocons/Icon/FileDoc';
import FilePdfIcon from '@codeday/topocons/Icon/FilePdf';
import FileSlidesIcon from '@codeday/topocons/Icon/FileSlides';
import FileImageIcon from '@codeday/topocons/Icon/FileImage';
import FileMusicIcon from '@codeday/topocons/Icon/FileMusic';
import FileVideoIcon from '@codeday/topocons/Icon/FileVideo';
import { sign } from 'jsonwebtoken';

function getCitation(publication) {
  const citationAuthors = publication.contributors.map((c) => `${c.familyName}, ${c.givenName}`).join('; ');
  if (publication.type === 'dataset') {
    return `${citationAuthors}, ${DateTime.fromISO(publication.publicationDate).toFormat('yyyy')}, "${publication.title.replace(/"/g, '\'')}", https://doi.org/${process.env.NEXT_PUBLIC_DOI_PREFIX}/${publication.doiSuffix}, CodeDay`;
  }
}

function FileIcon({ file }) {
  if (file.fileName.endsWith('.pdf')) {
    return <FilePdfIcon />;
  }
  if (file.fileName.endsWith('.pptx')) {
    return <FileSlidesIcon />;
  }
  if (file.fileName.endsWith('.png') || file.fileName.endsWith('.jpg') || file.fileName.endsWith('.jpeg')) {
    return <FileImageIcon />;
  }
  if (file.fileName.endsWith('.mp3')) {
    return <FileMusicIcon />;
  }
  if (file.fileName.endsWith('.mp4')) {
    return <FileVideoIcon />;
  }
  if (file.fileName.endsWith('.csv') || file.fileName.endsWith('.json')) {
    return <FileDbIcon />;
  }
  return <FileDocIcon />;
}

export default function Home() {
  const { cms } = useQuery();
  const { isFallback, query } = useRouter();

  if (!cms) {
    return (
      <Page slug={`/doi/${query.doi}`}>
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

  const { title, type, description, contributors, files, doiSuffix, publicationDate, license, funderName } = cms.publications.items[0];

  return (
    <Page slug={`/doi/${query.doi}`} title={title}>
      <Content mt={-8} mb={2}>
        <Box
          fontSize="xs"
          mb={2}
          fontWeight="bold"
          p={1}
          pl={2}
          pr={2}
          bg="gray.100"
          color="black" 
          borderRadius="md"
          display="inline-block"
          textTransform="uppercase"
        >
          {type}
        </Box>
        <Box mb={2}>
          <Link fontFamily="monospace" fontSize="sm" href={`https://doi.org/${process.env.NEXT_PUBLIC_DOI_PREFIX}/${doiSuffix}`}>
            https://doi.org/{process.env.NEXT_PUBLIC_DOI_PREFIX}/{doiSuffix}
          </Link>
        </Box>
        <Heading as="h2" fontSize={{ base: '2xl', md: '4xl' }} mb={2}>{title}</Heading>
      </Content>
      <Content>
        <Grid templateColumns={{ base: '1fr', md: '3fr 1fr' }} gap={4}>
          <Box>
            <Box
              display={{ base: 'block', md: 'flex' }}
              gap={{ base: 0, md: 6 }}
              mb={12}
            >
              {contributors.map((c) => (
                <Box key={c.username} mb={4}>
                  
                  <Box fontSize="md" fontWeight="bold" mb={0}>
                    {c.name}
                    {c.orcid && (
                      <Link
                        position="relative"
                        top={0.5}
                        display="inline-block"
                        ml={2}
                        mb={0}
                        href={`https://orcid.org/${c.orcid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image src="/orcid.svg" h="16px" />
                      </Link>
                    )}
                  </Box>
                  <Text fontSize="xs" mt={-1} mb={0}>{c.affiliation || 'CodeDay'}</Text>
                </Box>
              ))}
            </Box>

            <Box mb={12}>
              <Heading fontSize="lg" mb={2}>{type === 'dataset' ? 'Description' : 'Abstract'}</Heading>
              <Text fontSize="lg">
                <Markdown>{description}</Markdown>
              </Text>
            </Box>

            <Box>
              <Heading fontSize="lg" mb={2}>Files</Heading>
              <Grid
                autoFlow="column"
                templateRows={{ base: `repeat(${files.items.length}, 1fr)`, md: `repeat(${Math.ceil(files.items.length/2)}, 1fr)` }}
                templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
                gap={2}
              >
                {files.items.map((f) => (
                  <Box key={f.contentfulBaseUrl}>
                    <Box as="a" href={f.contentfulBaseUrl}>
                      <HStack>
                        <Box fontSize="2xl" position="relative" top={1}>
                          <FileIcon file={f} />
                        </Box>
                        <Box>
                          <Link as="p" fontSize="sm" fontWeight="bold" mb={0}>{f.title}</Link>
                          <Text fontSize="xs" fontFamily="monospace" mb={0}>{f.fileName}</Text>
                        </Box>
                      </HStack>
                    </Box>
                  </Box>
                ))}
              </Grid>
            </Box>
          </Box>
          <Box>
            <Box borderWidth={1} borderRadius="md" p={4}>
              <Heading fontSize="sm" mb={0}>DOI</Heading>
              <Text fontSize="2xs" fontFamily="monospace" mb={2}>{process.env.NEXT_PUBLIC_DOI_PREFIX}/{doiSuffix}</Text>
              <Divider mb={2} />
              <Heading fontSize="sm" mb={0}>Published</Heading>
              <Text fontSize="2xs" fontFamily="monospace" mb={2}>{DateTime.fromISO(publicationDate).toFormat('yyyy-MM-dd')}</Text>
              <Divider mb={2} />
              <Heading fontSize="sm" mb={0}>License</Heading>
              <Text fontSize="2xs" fontFamily="monospace" mb={2}>{license}</Text>
              <Divider mb={2} />
              {funderName && (
                <>
                  <Heading fontSize="sm" mb={0}>Funder</Heading>
                  <Text fontSize="2xs" fontFamily="monospace" mb={2}>{funderName}</Text>
                  <Divider mb={2} />
                </>
              )}
              <Heading fontSize="sm" mb={0}>Citation</Heading>
              <Text fontSize="2xs" fontFamily="monospace" mb={2}>{getCitation(cms.publications.items[0])}</Text>
            </Box>
          </Box>
        </Grid>
      </Content>
    </Page>
  );
}

export async function getStaticPaths() {
  const query = await apiFetch(print(ListPublicationQuery));

  return {
    paths: query?.cms?.publications?.items?.map((i) => ({
      params: {
        doi: [process.env.NEXT_PUBLIC_DOI_PREFIX, i.doiSuffix],
      }
    })) || [],
    fallback: true,
  };
}

export async function getStaticProps({ params: { doi } }) {
  const token = sign({ scopes: 'read:users' }, process.env.ACCOUNT_SECRET, { expiresIn: '3m' });
  return {
    props: {
      query: await apiFetch(
        print(PublicationQuery),
        { doiSuffix: doi.slice(1).join('/') },
        {
          Authorization: `Bearer ${token}`,
        }
      ),
    },
    revalidate: 300,
  };
}
