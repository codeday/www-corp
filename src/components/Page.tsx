import React, { ReactNode } from 'react';
import { DefaultSeo } from 'next-seo';
import Head from 'next/head';
import { Box, CodeDay, Button, Link, Text } from '@codeday/topo/Atom';
import { Header, SiteLogo, Main, Menu, Footer, CustomLinks } from '@codeday/topo/Organism';
import { Fade, useColorModeValue } from '@chakra-ui/react';
import { useQuery } from '../query';
import { Content } from '@codeday/topo/Molecule';
import { useFundraise } from '../providers';

const DOMAIN = 'https://www.codeday.org';
const FUNDRAISE_UP_BUTTON_ID = 'XBSBRRMF';

interface PageProps {
  children?: ReactNode;
  title?: string;
  darkHeader?: boolean;
  slug?: string;
  seo?: any;
  fun?: boolean;
  [key: string]: any;
}

export default function Page ({ children, title, darkHeader, slug, seo, fun=false }: PageProps) {
  const { cms } = useQuery();
  const { mission, globalSponsors } = cms || {};
  const { isFundraiseLoaded } = useFundraise();
  const bgColor = useColorModeValue('white', '#292929' /* equiv to gray.1100 */);

  const disclaimerTexts = (cms?.globalSponsors?.items || []).flatMap((sponsor: any) => sponsor.legalDisclaimer.split(`\n`)).filter(Boolean);


  return (
    <Box overflow="hidden">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      {seo ??
      <DefaultSeo
        title={title ? `${title} ~ CodeDay` : 'CodeDay'}
        description={mission?.items[0]?.value}
        canonical={`${DOMAIN}${slug}`}
        openGraph={{
          type: 'website',
          locale: 'en_US',
          site_name: 'CodeDay',
          url: `${DOMAIN}${slug}`,
        }}
        twitter={{
          handle: '@codeday',
          site: '@codeday',
          cardType: 'summary_large_image',
        }}
      />}
      <Box position="relative">
        <Header darkBackground={darkHeader} gradAmount={darkHeader && 'lg'} underscore>
          <SiteLogo>
            <a href="/">
              <CodeDay withText />
              <Box as="h1" visuallyHidden>
                CodeDay
              </Box>
            </a>
          </SiteLogo>
          <Menu>
            <Button as="a" variant="ghost" href="/contact">Contact</Button>
            <Button as="a" variant="ghost" href="/edu">Educators</Button>
            <Button as="a" variant="ghost" href="/volunteer">Volunteer</Button>
            <Button as="a" variant="ghost" href="/press">Press</Button>

            <Box mt={-4} display="inline-block" minW="129px" maxH="48px">
              <Fade in={isFundraiseLoaded}>
                <Box>
                  <a href={`#${FUNDRAISE_UP_BUTTON_ID}`} />
                </Box>
              </Fade>
            </Box>

          </Menu>
        </Header>
        <Main>
          {children}
        </Main>
        <Box mt={32}>
          <Content fontFamily="mono" color="current.textLight" fontSize="2xs">
            {disclaimerTexts.map((text: string) => (
              <Text mb={4} key={text}>{text}</Text>
            ))}
          </Content>
          <Footer repository="www-corp" branch="master">{''}</Footer>
        </Box>
      </Box>
    </Box>
  )
}
