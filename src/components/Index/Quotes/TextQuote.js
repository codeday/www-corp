import React from 'react';
import PropTypes from 'prop-types';
import Box from '@codeday/topo/Atom/Box';
import Text from '@codeday/topo/Atom/Text';
import BioInfo from './BioInfo';

export default function TextQuote({ testimonial, ...props }) {
  return (
    <Box {...props}>
      <Text
        fontSize="2xl"
        fontStyle="italic"
        borderLeftWidth={2}
        borderColor="current.border"
        pl={4}
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
