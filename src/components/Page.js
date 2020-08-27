import { DefaultSeo } from 'next-seo';
import { useRouter } from 'next/router';
import Box from '@codeday/topo/Atom/Box';
import Header, { SiteLogo, Menu } from '@codeday/topo/Organism/Header';
import Footer from '@codeday/topo/Organism/Footer';
import { CodeDay } from '@codeday/topo/Atom/Logo';
import { useQuery } from '../query';
import Button from '@codeday/topo/Atom/Button';

const DOMAIN = 'https://www.codeday.org';

export default function Page ({ children, title, darkHeader, slug }) {
  const { cms } = useQuery();
  const { mission } = cms || {};

  return (
    <>
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
            </a>
          </SiteLogo>
          <Menu>
            <Button as="a" variant="ghost" href="/contact">Contact</Button>
            <Button as="a" variant="ghost" href="/edu">Educators</Button>
            <Button as="a" variant="ghost" href="/volunteer">Volunteer</Button>
            <Button as="a" variant="ghost" href="/press">Press</Button>
            <Button as="a" variant="ghost" href="https://blog.codeday.org/" target="_blank">Blog</Button>
          </Menu>
        </Header>
        {children}
        <Box mb={32} />
        <Footer />
      </Box>
    </>
  )
}
