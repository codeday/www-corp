import React, { useState, useEffect } from 'react';
import { DefaultSeo } from 'next-seo';
import Head from 'next/head';
import { Box, CodeDay, Button, Link } from '@codeday/topo/Atom';
import { Header, SiteLogo, Main, Menu, Footer, CustomLinks } from '@codeday/topo/Organism';
import { Fade } from '@chakra-ui/react';
import { useQuery } from '../query';
import Script from 'next/script';
import DuckPrints from "./Fun/DuckPrints";

const DOMAIN = 'https://www.codeday.org';

export default function Page ({ children, title, darkHeader, slug, seo, noFun=false }) {
  const [hasLoaded, setHasLoaded] = useState(false)
  const { cms } = useQuery();
  const { mission } = cms || {};
  const [isFundraiseLoaded, setIsFundraiseLoaded] = useState(false)

  useEffect(() => setHasLoaded(true))
  return (
    <Box overflow="hidden">
      { (hasLoaded && !noFun) && <DuckPrints /> }
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
            <Script strategy="afterInteractive" src="https://cdn.fundraiseup.com/widget/AHCSATYN" onLoad={() => {
              // this feels very hacky and bad, but I don't think there's a better way to do this?
              const checkLoadedTask = setTimeout(() => {
                if(document.getElementById('XBSBRRMF')?.tagName === 'IFRAME') {
                  setIsFundraiseLoaded(true)
                  clearTimeout(checkLoadedTask)
                }
              }, 500)
            }}/>
              <Fade in={isFundraiseLoaded}>
                <Box>
                <a href="#XBSBRRMF" />
                </Box>
              </Fade>
            </Box>
          </Menu>
        </Header>
        <Main>
          {children}
        </Main>
        <Footer repository="www-corp" branch="master" mt={32}>
          <CustomLinks>
            <Link href="/help" display="block">FAQs &amp; Help</Link>
            <Link href="/docs" display="block">Legal Documents</Link>
          </CustomLinks>
        </Footer>
      </Box>
    </Box>
  )
}
