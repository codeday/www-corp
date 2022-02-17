import React from 'react';
import CountUp from 'react-countup';
import { Text, Grid, Box } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { useColorMode } from '@codeday/topo/Theme';
import { useQuery } from '../../query';
import PreviousCoverageLogos from '../PreviousCoverageLogos';

function rollup(events) {
  const stats = {};
  events.forEach((event) => {
    Object.keys(event).forEach((k) => {
      if (!(k in stats)) stats[k] = 0;
      stats[k] += event[k];
    });
  });

  return stats;
}

function StatBox({
  num, label, unit, ...props
}) {
  return (
    <Box textAlign="center" {...props}>
      <Text fontSize="4xl" bold mb={0}>
        <CountUp start={0} end={num} duration={0.5} separator="," />
        {unit}
      </Text>
      <Text fontSize="md" bold mb={0}>{label}</Text>
    </Box>
  );
}

export default function Stats(props) {
  const { colorMode } = useColorMode();
  const { cms: { stats } } = useQuery();
  const rollupStats = rollup(stats.items);

  console.log('colorMode', colorMode)

  return (
    <Content
      full
      bg={colorMode === 'light' ? 'red.50' : 'red.900'}
      pt={4}
      pb={2}
      {...props}
    >
      <Content>
        <Grid templateColumns={{ base: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(5, 1fr)' }} gap={4}>
          <StatBox num={rollupStats.statEventCount} label="Events" opacity="0.7"/>
          <StatBox num={rollupStats.statStudentCount} label="CodeDay Alums" opacity="0.7" />
          <StatBox
            num={rollupStats.statStudentCount * 0.71}
            label="Underrepresented in CS"
            d={{ base: 'none', lg: 'block' }}
            opacity="0.7"
          />
          <StatBox
            num={rollupStats.statLowInterestCount}
            label="Didn't Like CS Before"
            opacity="0.7"
          />
          <StatBox
            num={Math.round(100 * (rollupStats.statLowInterestContinuedCount / rollupStats.statLowInterestCount))}
            unit="%"
            label="Kept Coding After"
            d={{ base: 'none', md: 'block' }}
            opacity="0.7"
          />
        </Grid>
        <Box textAlign="center" mt={8} opacity="0.7">
          <Text mb={0} d="inline-block" bold>As seen in...</Text>
          <PreviousCoverageLogos num={5} h={8} mr={4} ml={4} mb={2} />
        </Box>
      </Content>
    </Content>
  );
}
