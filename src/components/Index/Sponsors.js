import React from 'react';
import Image from 'next/image';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Content from '@codeday/topo/Molecule/Content';
import { useQuery } from '../../query';
import { Heading, Link } from '@codeday/topo/Atom/Text';

export default function Sponsors(props) {
  const { cms: { majorSponsors, minorSponsors } } = useQuery();
  return (
    <Content textAlign="center" {...props}>
      <Heading as="h2" color="current.textLight" fontSize="2xl" mt={16} mb={8} bold>With support from...</Heading>
      <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)", lg: "repeat(8, 1fr)" }} gap={6}>
        {[...(majorSponsors?.items || []), ...(minorSponsors?.items || [])]?.map((sponsor) => (
          <Link
            href={sponsor.link}
            target="_blank"
            rel="noopener"
            gridColumn={sponsor.type === 'major' ? 'span 2' : undefined}
            gridRow={sponsor.type === 'major' ? 'span 2' : undefined}
            key={sponsor.link}
            backgroundImage={`url(${sponsor.logo.url})`}
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
