import React from 'react';
import { Grid, Heading, Link } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { useColorMode } from '@codeday/topo/Theme';
import { useQuery } from '../../query';

export default function Sponsors(props) {
  const { colorMode } = useColorMode();
  const { cms: { majorSponsors, minorSponsors } } = useQuery();
  return (
    <Content textAlign="center" {...props}>
      <Heading as="h2" color="current.textLight" fontSize="2xl" mt={16} mb={8} fontWeight="bold">With support from...</Heading>
      <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)", lg: "repeat(8, 1fr)" }} gap={6}>
        {[...(majorSponsors?.items || []), ...(minorSponsors?.items || [])]?.map((sponsor) => (
          <Link
            href={sponsor.link}
            target="_blank"
            rel="noopener"
            gridColumn={sponsor.type === 'major' ? 'span 2' : undefined}
            gridRow={sponsor.type === 'major' ? 'span 2' : undefined}
            key={sponsor.link}
            backgroundImage={`url(${colorMode === 'light' ? (sponsor.logo?.url || sponsor.darkLogo?.url) : (sponsor.darkLogo?.url || sponsor.logo?.url)})`}
            backgroundSize="contain"
            backgroundPosition="50% 50%"
            backgroundRepeat="no-repeat"
            minHeight={sponsor.type === 'minor' ? 16 : 48}
            backgroundOrigin="content-box"
            aria-label={sponsor.name}
          />
        ))}
      </Grid>
    </Content>
  )
}
