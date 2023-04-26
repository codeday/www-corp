import React from 'react';
import { print } from 'graphql';
import { apiFetch } from '@codeday/topo/utils';
import { Box, Grid, Image, Text, Heading } from '@codeday/topo/Atom';
import { Content, IconBox, IconBoxIcon as HeaderIcon, IconBoxText as HeaderText } from '@codeday/topo/Molecule';
import StudentIcon from '@codeday/topocons/Icon/Backpack';
import ParentIcon from '@codeday/topocons/Icon/BuildingHome';
import SchoolIcon from '@codeday/topocons/Icon/BuildingSchool';
import PartnerIcon from '@codeday/topocons/Icon/BuildingOffice';
import VolunteerIcon from '@codeday/topocons/Icon/IdCard';
import Page from '../../../components/Page';
import { useQuery } from '../../../query';
import { HelpProgramIndexQuery, HelpProgramIndexPathsQuery } from './index.gql';

const icons = {
  Student: <StudentIcon />,
  Parent: <ParentIcon />,
  School: <SchoolIcon />,
  Partner: <PartnerIcon />,
  Volunteer: <VolunteerIcon />,
};

export default function Program({ programWebname }) {
  const { programs, faqs, events } = useQuery().cms || {};

  if (!programWebname) return <></>;

  const program = programs?.items[0] || null;
  const audiences = faqs?.items
    ?.map((faq) => faq.audience)
    .reduce((accum, auds) => [...accum, ...auds], [])
    .reduce((accum, aud) => accum.includes(aud) ? accum : [...accum, aud], []) || [];

  const photos = events?.items
    ?.map((e) => e?.linkedFrom?.pressPhotos?.items[0]?.photo?.url)
    .filter((photo) => photo) || [];
  const photo = photos[0] || null;

  return (
    <Page slug={`/help/${programWebname}`} title={`${program.name} ~ Help`}>
      <Content mt={-8}>
        {photo && (
          <Image src={photo} alt="" w="100%" mb={8} rounded="sm" />
        )}
        <Heading as="h2" fontSize="5xl">{program.name} Helpdesk</Heading>
        <Text mb={8}>Which best describes you?</Text>
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr', lg: 'repeat(3, 1fr)'}} gap={8}>
          {audiences.map((aud) => (
            <IconBox as="a" key={aud} href={`/help/${programWebname}/${aud.toLowerCase()}`}>
              <HeaderIcon>
                <Box display="inline-block" rounded="full" bg="red.600" color="white" p={4} fontSize="4xl" textAlign="center">
                  {icons[aud]}
                </Box>
              </HeaderIcon>
              <HeaderText>{aud}</HeaderText>
            </IconBox>
          ))}
        </Grid>
      </Content>
    </Page>
  )
}

export async function getStaticPaths() {
  const query = await apiFetch(print(HelpProgramIndexPathsQuery));

  return {
    paths: query.cms.programs?.items
      ?.filter((program) => program?.linkedFrom?.faqs?.items?.length > 0)
      .map((program) => ({ params: { program: program.webname } })),
    fallback: true,
  };
}

export async function getStaticProps({ params: { program } }) {
  const query = await apiFetch(print(HelpProgramIndexQuery), { programWebname: program });

  return {
    props: {
      query,
      programWebname: program
    },
    revalidate: 300,
  };
}

