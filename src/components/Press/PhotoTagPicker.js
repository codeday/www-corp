import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Text from '@codeday/topo/Atom/Text';
import Box from '@codeday/topo/Atom/Box';
import UiX from '@codeday/topocons/Icon/UiX';

export default function PhotoTagPicker({ photos, onChange, ...props }) {
  const [selectedTag, setSelectedTag] = useState(null);
  const allTags = [...new Set(photos
    .map((p) => p.tags)
    .reduce((accum, t) => [...accum, ...(t || [])], [])
    .filter((t) => t))];

  return (
    <Box p={4} borderWidth={1} rounded="md" {...props}>
      <Text bold fontSize="sm" color="current.textLight">Show only photos of:</Text>
      {allTags.map((t) => (
        <Box
          d="inline-block"
          p={2}
          mr={2}
          mb={2}
          cursor="pointer"
          borderWidth={1}
          rounded="sm"
          color={selectedTag === t ? 'current.text' : 'current.textLight'}
          borderColor={selectedTag === t ? 'current.text' : 'current.border'}
          onClick={() => {
            const newTag = selectedTag === t ? null : t;
            setSelectedTag(newTag);
            onChange(newTag);
          }}
        >
          {selectedTag === t && (<><UiX />&nbsp;&nbsp;</>)}
          {t}
        </Box>
      ))}
    </Box>
  );
}
PhotoTagPicker.propTypes = {
  photos: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func.isRequired,
};
