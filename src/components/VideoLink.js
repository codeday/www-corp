import React, { useState, useEffect, useRef } from 'react'
import Hls from 'hls.js/dist/hls.light.js'
import { Modal } from 'react-responsive-modal'
import Box from '@codeday/topo/Atom/Box';

export default function VideoLink ({ url, poster, autoPlay, children, ...props }) {
  const [modalOpen, setModalOpen] = useState(false);
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
    <>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <video
            ref={player}
            poster={poster}
            controls={true}
            preload="auto"
            autoPlay={autoPlay || false}
            src={url}
            width="100%"
            height="100%">
        </video>
      </Modal>
      <Box cursor="pointer" onClick={() => setModalOpen(true)}>
        {children}
      </Box>
    </>
  );
}
