import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text } from '@codeday/topo/Atom';
import BioInfo from './BioInfo';

export default function TextQuote({ testimonial, ...props }) {
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
TextQuote.propTypes = {
  testimonial: PropTypes.object.isRequired,
};
