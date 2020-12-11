import React, { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic';
import Box from '@codeday/topo/Atom/Box';

const Hls = dynamic(() => import('hls.js/dist/hls.light.js'), { ssr: false });

export default function VideoPlayer({ url, poster, autoPlay, volume, ...props }) {
  const player = useRef();
  useEffect(() => {
    if (typeof window === 'undefined' || typeof player === 'undefined') return;
    if (url?.split('.').pop() !== 'm3u8') return;
    if (!Hls.isSupported()) return;

    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(player);
  }, [typeof window, player, url]);

  return (
    <Box {...props}>
      <video
          ref={player}
          poster={poster}
          controls={true}
          preload="auto"
          autoPlay={autoPlay || false}
          src={url}
          volume={volume}
          width="100%"
          height="100%">
      </video>
    </Box>
  );
}
