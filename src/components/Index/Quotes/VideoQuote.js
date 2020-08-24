import React from 'react';
import PropTypes from 'prop-types';
import Box from '@codeday/topo/Atom/Box';
import MediaPlay from '@codeday/topocons/Icon/MediaPlay'
import VideoLink from '../../VideoLink';

export default function VideoQuote({ testimonial, ...props }) {
  return (
    <VideoLink url={testimonial.video.url} poster={testimonial.largeImage?.url} autoPlay>
      <Box
        width={64}
        height={40}
        backgroundImage={`url(${testimonial.largeImage?.url})`}
        backgroundSize="cover"
        backgroundPosition="50% 50%"
        alt={`Video quote from ${testimonial.firstName || testimonial.groupName}`}
        rounded="sm"
        textAlign="center"
        color="white"
        fontSize="4xl"
        boxShadow="md"
        position="relative"
        mb={8}
        {...props}
      >
        <Box d="inline" position="absolute" top="calc(50% - 0.5em)">
          <MediaPlay />
        </Box>
      </Box>
    </VideoLink>
  );
}
VideoQuote.propTypes = {
  testimonial: PropTypes.object.isRequired,
};
