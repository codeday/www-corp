import React from 'react';
import PropTypes from 'prop-types';
import Box from '@codeday/topo/Atom/Box';
import Image from 'next/image';
import MediaPlay from '@codeday/topocons/Icon/MediaPlay';
import VideoLink from './VideoLink';

export default function VideoTestimonialThumbnail({ video, ...props }) {
  return (
    <VideoLink url={video.video.url} poster={video.largeImage?.url} autoPlay>
      <Box
        width="100%"
        p={0}
        aria-label={`Video quote from ${video.firstName || video.groupName}`}
        rounded="sm"
        textAlign="center"
        color="white"
        fontSize="4xl"
        boxShadow="md"
        position="relative"
        backgroundImage={`url(${video.testimonialPlayerThumb?.url})`}
        backgroundSize="cover"
        backgroundPosition="50% 50%"
        backgroundRepeat="no-repeat"
        height={40}
        {...props}
      >
        <Box d="inline" position="absolute" top="calc(50% - 0.5em)" left="calc(50% - 0.5em)">
          <MediaPlay />
        </Box>
      </Box>
    </VideoLink>
  );
}
VideoTestimonialThumbnail.propTypes = {
  video: PropTypes.object.isRequired,
};
