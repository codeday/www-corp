import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text } from '@codeday/topo/Atom';

export default function Photo({ photo, ...props }) {
  return (
    <Box
      as="a"
      d="block"
      href={photo.photo.original}
      target="_blank"
      rel="noopener"
      backgroundImage={`url(${photo.photo.preview})`}
      backgroundSize="cover"
      backgroundPosition="50% 50%"
      backgroundRepeat="no-repeat"
      position="relative"
      {...props}
    >
      <Box
        opacity={0}
        _hover={{ opacity: 1 }}
        transition="opacity 0.5s"
        bg="rgba(0, 0, 0, 0.7)"
        color="white"
        position="absolute"
        top="0"
        right="0"
        bottom="0"
        left="0"
        p={4}
      >
        <Text fontWeight="bold">
          {
            [
              photo.event?.program?.name,
              photo.region?.name,
              photo.event?.startsAt?.substring(0,4)
            ].join(' ')
          }
        </Text>
        {photo.photo.description && <Text>{photo.photo.description}</Text>}
      </Box>
    </Box>
  );
}
Photo.propTypes = {
  photo: PropTypes.object.isRequired,
};
