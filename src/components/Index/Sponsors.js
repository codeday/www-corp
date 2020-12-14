import React from 'react';
import Image from 'next/image';
import Box from '@codeday/topo/Atom/Box';
import Content from '@codeday/topo/Molecule/Content';
import { useQuery } from '../../query';
import { Heading, Link } from '@codeday/topo/Atom/Text';

export default function Sponsors(props) {
  const { cms: { majorSponsors, minorSponsors } } = useQuery();
  return (
    <Content textAlign="center" {...props}>
      <Heading as="h2" color="current.textLight" fontSize="2xl" mt={16} mb={8} bold>With support from...</Heading>
      <Box mr={-4} lineHeight={4} mb={8}>
        {majorSponsors?.items?.map((sponsor) => (
          <Link href={sponsor.link} target="_blank" rel="noopener" pr={8} key={sponsor.link}>
              <Box d="inline-block" h={16}>
                <Image src={sponsor.logo.url} height={80} width={160} alt={sponsor.name} />
              </Box>
          </Link>
        ))}
      </Box>
      <Box mr={-4} mb={8} lineHeight={3}>
        {minorSponsors?.items?.map((sponsor) => (
          <Link href={sponsor.link} target="_blank" rel="noopener" key={sponsor.link} pr={8}>
            <Box d="inline-block" h={5}>
              <Image src={sponsor.logo.url} height={40} width={80} alt={sponsor.name} />
            </Box>
          </Link>
        ))}
      </Box>
    </Content>
  )
}
