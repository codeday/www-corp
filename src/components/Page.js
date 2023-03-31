import { DefaultSeo } from 'next-seo';
import Head from 'next/head';
import { Box, CodeDay, Button, Link } from '@codeday/topo/Atom';
import { Header, SiteLogo, Main, Menu, Footer, CustomLinks } from '@codeday/topo/Organism';
import { useQuery } from '../query';

const DOMAIN = 'https://www.codeday.org';

export default function Page ({ children, title, darkHeader, slug, seo }) {
  const { cms } = useQuery();
  const { mission } = cms || {};

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
            <Box mt={-4} d="inline-block" minW="129px">
              <a href="#XBSBRRMF" style={{ display: 'none' }}></a>
            </Box>
          </Menu>
        </Header>
        <Main>
          {children}
        </Main>
        <Footer repository="www-corp" branch="master" mt={32}>
          <CustomLinks>
            <Link href="/help" d="block">FAQs &amp; Help</Link>
            <Link href="/docs" d="block">Legal Documents</Link>
          </CustomLinks>
        </Footer>
      </Box>
    </Box>
  )
}
