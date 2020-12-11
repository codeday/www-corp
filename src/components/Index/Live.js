import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Box, { RatioBox } from '@codeday/topo/Atom/Box';

export default function Live({ username, ...props }) {
  const [parent, setParent] = useState('www.codeday.org');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setParent(window.location.host);
  }, [typeof window]);

  if (!username || !parent) return <></>;

  return (
    <Box as="a" href={`https://twitch.tv/${username}`} target="_blank" rel="noopener" {...props}>
      <RatioBox
        as="iframe"
        w={16}
        h={9}
        auto="h"
        autoDefault={480}
        src={`https://player.twitch.tv/?channel=${username}&parent=${parent}&muted=true&autoplay=true`}
        frameBorder="no"
        scrolling="no"
        allowFullScreen="no"
        style={{
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
}
Live.propTypes = {
  username: PropTypes.string.isRequired,
};
