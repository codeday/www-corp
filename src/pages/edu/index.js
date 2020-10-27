import React from 'react';
import { print } from 'graphql';
import { apiFetch } from '@codeday/topo/utils';
import { Grid } from '@codeday/topo/Atom/Box';
import Image from '@codeday/topo/Atom/Image';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import Content from '@codeday/topo/Molecule/Content';
import IconBox, { HeaderIcon, HeaderText, Body as BoxBody } from '@codeday/topo/Molecule/IconBox';
import Page from '../../components/Page';
import { useQuery } from '../../query';
import { EduProgramsQuery } from './index.gql';

export default function EduIndex() {
  const { cms: { eduPrograms, communityPartners } } = useQuery();
  return (
    <Page slug="/edu" title="Education">
      <Content>
        <Image
          src="https://img.codeday.org/o/4/6/461yxm8rg4esfmoxh51u3e4bfrazeuvbpggg5fvjyrpi197ede5u8285ktdyjirrft.png"
          rounded="md"
          mt={-8}
          mb={4}
          alt=""
        />
        <Heading as="h2" fontSize="5xl">CodeDay Edu</Heading>
        <Text fontSize="xl">
          Many of our programs have special offers and options for teachers, professors, club leaders,
          and educational organizations. Learn more by clicking on a program below.
        </Text>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={4}>
          {eduPrograms?.items?.filter((program) => program.educationDetails).map((program) => (
            <IconBox as="a" d="block" href={`/edu/${program.webname}`} h="100%" key={program.webname}>
              <HeaderIcon><Image src={program.logo.url} h={16} alt="" /></HeaderIcon>
              <HeaderText>{program.name}</HeaderText>
              <BoxBody>{program.shortDescription}</BoxBody>
            </IconBox>
          ))}
        </Grid>

        <Heading as="h3" fontSize="3xl" mt={12} mb={4}>Partner Organizations and Programs</Heading>
        <Text fontSize="md" mb={8}>
          We partner with the following organizations who we think might be great fit for CS educators.
          {' '}<Text as="strong" bold>(Not CodeDay-run programs.)</Text>
        </Text>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={4}>
          {communityPartners?.items?.map((partner) => (
            <IconBox as="a" d="block" href={partner.url} target="_blank" rel="noopener" h="100%" key={partner.url}>
              <HeaderIcon><Image src={partner.logo.url} h={16} alt="" /></HeaderIcon>
              <HeaderText>{partner.name}</HeaderText>
              <BoxBody>
                {partner.blurb}
                {partner.regions?.items?.length > 0 && (
                  <>
                    <br /><br />({partner.regions.items.map((r) => r.name).join(', ')})
                  </>
                )}
              </BoxBody>
            </IconBox>
          ))}
        </Grid>
      </Content>
    </Page>
  );
}

const getDate = () => {
  const d = new Date();
  d.setUTCHours(d.getUTCHours() - 7);
  return d.toISOString();
};

export async function getStaticProps() {
  const query = await apiFetch(print(EduProgramsQuery, { cmsDate: getDate() }));

  return {
    props: {
      query,
    },
    revalidate: 300,
  };
}
