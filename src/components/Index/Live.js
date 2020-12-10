import React, { useState, useRef, useEffect } from 'react';
import Content from '@codeday/topo/Molecule/Content';
import Box from '@codeday/topo/Atom/Box';
import Broadcast from '@codeday/topocons/Icon/Broadcast';
import { apiFetch } from '@codeday/topo/utils';

export default function Live(props) {
  const [username, setUsername] = useState(undefined);
  const [size, setSize] = useState(310);
  const ref = useRef();

  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current) return () => {};
    const refreshSize = () => setSize(Math.floor((ref.current.clientWidth / 16) * 9));

    // eslint-disable-next-line no-undef
    window.addEventListener('resize', refreshSize);
    // eslint-disable-next-line no-undef
    return () => window.removeEventListener('resize', refreshSize);
  }, [typeof window, ref.current]);

  useEffect(() => {
    if (typeof window === 'undefined') return () => {};

    const refresh = async () => {
      const result = await apiFetch(`{ twitch { live { username } } }`);
      setUsername(result?.twitch?.live?.username);
    };
    refresh();
    const interval = setInterval(refresh, 60 * 1000);
    return () => clearInterval(interval);
  }, [typeof window])

  if (!username) return <></>;

  return (
    <Content maxWidth="xl" {...props}>
      <Box color="red.600" fontWeight="bold"><Broadcast /> LIVE</Box>
      <Box
        ref={ref}
        as="iframe"
        src={`https://player.twitch.tv/?channel=${username}&parent=www.codeday.org&muted=true&autoplay=true`}
        height={size}
        width="100%"
        frameBorder="no"
        scrolling="no"
        allowFullScreen="no"
      />
    </Content>
  );
}
