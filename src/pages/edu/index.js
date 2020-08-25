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
  const { cms: { eduPrograms } } = useQuery();
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
            <IconBox as="a" d="block" href={`/edu/${program.webname}`} h="100%">
              <HeaderIcon><Image src={program.logo.url} h={16} alt="" /></HeaderIcon>
              <HeaderText>{program.name}</HeaderText>
              <BoxBody>{program.shortDescription}</BoxBody>
            </IconBox>
          ))}
        </Grid>
      </Content>
    </Page>
  );
}

export async function getStaticProps() {
  const query = await apiFetch(print(EduProgramsQuery));

  return {
    props: {
      query,
    },
    revalidate: 300,
  };
}
