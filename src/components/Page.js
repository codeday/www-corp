import { DefaultSeo } from 'next-seo';
import Head from 'next/head';
import Box from '@codeday/topo/Atom/Box';
import Header, { SiteLogo, Menu } from '@codeday/topo/Organism/Header';
import Main from '@codeday/topo/Organism/Main';
import Footer, { CustomLinks } from '@codeday/topo/Organism/Footer';
import { CodeDay } from '@codeday/topo/Atom/Logo';
import { useQuery } from '../query';
import Button from '@codeday/topo/Atom/Button';
import Link from '@codeday/topo/Atom/Text/Link';

const DOMAIN = 'https://www.codeday.org';

export default function Page ({ children, title, darkHeader, slug }) {
  const { cms } = useQuery();
  const { mission } = cms || {};

  return (
    <Box overflow="hidden">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
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
      />
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
            <Box mt={-4} d="inline-block" minW="129px">
              <a href="#XBSBRRMF" style={{ display: 'none' }}></a>
            </Box>
          </Menu>
        </Header>
        <Main>
          {children}
        </Main>
        <Box mb={32} />
        <Footer>
          <CustomLinks>
            <Link href="/help" d="block">FAQs &amp; Help</Link>
            <Link href="/docs" d="block">Legal Documents</Link>
            <Link href="/donate" d="block">Make a Donation</Link>
          </CustomLinks>
        </Footer>
      </Box>
    </Box>
  )
}
