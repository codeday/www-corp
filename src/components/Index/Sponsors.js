import React from 'react';
import { Grid, Heading, Link, Box, Text, Image } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { useColorMode } from '@codeday/topo/Theme';
import { useQuery } from '../../query';
import PreviousCoverageLogos from '../PreviousCoverageLogos';

export default function Sponsors(props) {
  const { colorMode } = useColorMode();
  const { cms: { majorSponsors, minorSponsors } } = useQuery();
  return (
    <Content {...props}>
      <Grid templateColumns={{ base: '1fr', md: '1fr 2fr' }} gap={4}>
        <Box>
          <Text mb={0} fontSize="xl" display="inline-block" color="current.textLight" mb={4} bold>Recognized by...</Text>
          <Grid templateColumns="1fr 1fr" gap={2}>
            <Link href="https://www.guidestar.org/profile/shared/88ca3b85-4294-40a3-a922-415c75f0b9e5" target="_blank">
              <Image src="https://widgets.guidestar.org/TransparencySeal/8867365" maxHeight={32} />
            </Link>
            <Link href="https://www.charitynavigator.org/ein/264742589" target="_blank">
              <Image src="/charity-navigator.png" maxHeight={32} />
            </Link>
          </Grid>
        </Box>
        
        <Box opacity="0.7">
          <Text mb={0} fontSize="xl" display="inline-block" color="current.textLight" mb={4} bold>As seen in...</Text>
          <PreviousCoverageLogos num={5} h={8} mr={4} ml={0} mb={2} />
        </Box>
      </Grid>
      <Heading as="h2" color="current.textLight" fontSize="xl" mt={12} mb={2} fontWeight="bold">With support from...</Heading>
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
