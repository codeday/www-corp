import React from 'react';
import { Box, Text } from '@codeday/topo/Atom';
import BioInfo from './BioInfo';

interface TextQuoteProps {
  testimonial: any;
  [key: string]: any;
}

export default function TextQuote({ testimonial, ...props }: TextQuoteProps) {
  return (
    <Box {...props}>
      <Text
        fontSize={testimonial.quote.length > 350 ? 'xl' : '2xl'}
        fontStyle="italic"
        borderLeftWidth={3}
        borderColor="red.600"
        pl={4}
        mb={4}
      >
        {testimonial.quote}
      </Text>
      <BioInfo testimonial={testimonial} />
    </Box>
  );
}
