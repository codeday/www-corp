import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Content from '@codeday/topo/Molecule/Content';
import Box from '@codeday/topo/Atom/Box';
import Broadcast from '@codeday/topocons/Icon/Broadcast';

export default function Live({ username, ...props }) {
  const [parent, setParent] = useState('www.codeday.org');
  const [size, setSize] = useState(310);
  const ref = useRef();

  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current) return () => {};
    const refreshSize = () => setSize(Math.floor((ref.current.clientWidth / 16) * 9));
    refreshSize();
    // eslint-disable-next-line no-undef
    window.addEventListener('resize', refreshSize);
    // eslint-disable-next-line no-undef
    return () => window.removeEventListener('resize', refreshSize);
  }, [typeof window, ref.current]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setParent(window.location.host);
  }, [typeof window]);

  if (!username || !parent) return <></>;

  return (
    <Box as="a" href={`https://twitch.tv/${username}`} target="_blank" rel="noopener" {...props}>
      <Box color="red.600" fontWeight="bold"><Broadcast /> LIVE</Box>
      <Box
        ref={ref}
        as="iframe"
        src={`https://player.twitch.tv/?channel=${username}&parent=${parent}&muted=true&autoplay=true`}
        height={size}
        width="100%"
        frameBorder="no"
        scrolling="no"
        allowFullScreen="no"
        shadow="sm"
        rounded="sm"
        borderWidth={1}
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
