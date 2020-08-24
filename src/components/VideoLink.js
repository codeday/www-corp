import React, { useState } from 'react';
import { Modal } from 'react-responsive-modal';
import Box from '@codeday/topo/Atom/Box';
import VideoPlayer from './VideoPlayer';

export default function VideoLink({ children, ...props }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <VideoPlayer {...props} />
      </Modal>
      <Box cursor="pointer" onClick={() => setModalOpen(true)}>
        {children}
      </Box>
    </>
  );
}
