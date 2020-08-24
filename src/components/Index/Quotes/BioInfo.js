import React from 'react';
import PropTypes from 'prop-types';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Text from '@codeday/topo/Atom/Text';
import Image from '@codeday/topo/Atom/Image';

export default function BioInfo({
  testimonial: {
    firstName, lastName, groupName, title, company, experience, type, image, program: { name: programName }, region,
  },
  ...props
}) {
  return (
    <Grid gap={4} alignItems="center" templateColumns={"1fr 100%"} {...props}>
      <Box width="32px">
        {image && (
          <Image src={image.url} rounded="full" />
        )}
      </Box>
      <Box>
        <Text mb={0} bold>{firstName} {lastName}{groupName && `, ${groupName}`}</Text>
        <Text mb={0}>
          {programName} {region?.name} {type}
        </Text>
        {title && company && (
          <Text mb={0}>{title} at {company}</Text>
        )}
      </Box>
    </Grid>
  );
}
BioInfo.propTypes = {
  testimonial: PropTypes.object.isRequired,
};
