import React, { useState, useReducer, useRef } from 'react';
import { RatioBox } from '@codeday/topo/Atom';
import ReactPlayer from 'react-player';
import { useInView } from 'react-intersection-observer';
import PageVisibility from 'react-page-visibility';

// eslint-disable-next-line no-secrets/no-secrets
const videoId = 'hXdlNf3YVpMgfGh7cUF2L00THVfG02YmRP';
const thumbWidth = 640;
const thumbHeight = 480;
const startAt = 4;

export default function Teaser() {
  const ref = useRef();
  const { ref: viewRef, inView } = useInView({ rootMargin: '200px', initialInView: true });
  const [pageVisible, setPageVisible] = useState(true);
  const [muted, setMuted] = useState(true);
  const [playing, togglePlaying] = useReducer((prev) => !prev, true);

  const onClick = () => {
    if (ref.current.getInternalPlayer().muted) {
      setMuted(false);
    } else {
      togglePlaying();
    }
  };

  const onPlay = () => {
    if (ref.current.getInternalPlayer().currentTime === 0) {
      ref.current.seekTo(startAt);
    }
  };

  const bg = `https://image.mux.com/${videoId}/thumbnail.png?width=${thumbWidth}&height=${thumbHeight}&fit_mode=crop&time=${startAt}`;

  return (
    <PageVisibility onChange={setPageVisible}>
      <RatioBox
        w={16}
        h={9}
        auto="h"
        autoDefault={425}
        backgroundImage={`url(${bg})`}
        backgroundSize="cover"
        backgroundRepeat="no-repeat"
        ref={viewRef}
      >
        <ReactPlayer
          url={`https://stream.mux.com/${videoId}.m3u8`}
          playing={(!muted || (inView && pageVisible)) && playing}
          muted={muted}
          volume={muted ? 0 : 1}
          width="100%"
          height="100%"
          onClick={onClick}
          onPlay={onPlay}
          style={{ cursor: 'pointer' }}
          pip={false}
          ref={ref}
          config={{ file: { attributes: { disablePictureInPicture: true } } }}
          loop
        />
      </RatioBox>
    </PageVisibility>
  );
}
