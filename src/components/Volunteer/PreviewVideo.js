import React, {useState, useReducer, useRef, useEffect} from 'react';
import { Box, RatioBox } from '@codeday/topo/Atom';
import UiVolume from '@codeday/topocons/Icon/UiVolume';
import ReactPlayer from 'react-player';
import { useInView } from 'react-intersection-observer';
import PageVisibility from 'react-page-visibility';

// eslint-disable-next-line no-secrets/no-secrets
const videoId = 'c1BhPbPJvRjeGvUutUIgrCG5bCsgT021q';
const thumbWidth = 640;
const thumbHeight = 480;
const startAt = 14;

export default function PreviewVideo(props) {
  const ref = useRef();
  const { ref: viewRef, inView } = useInView({ rootMargin: '200px', initialInView: true });
  const [pageVisible, setPageVisible] = useState(true);
  const [muted, setMuted] = useState(true);
  const [playing, togglePlaying] = useReducer((prev) => !prev, true);
  const [pageLoaded, setPageLoaded] = useState(false)

  useEffect(() => setPageLoaded(true), [])
  const onClick = () => {
    if (ref.current.getInternalPlayer().muted) {
      setMuted(false);
      ref.current.seekTo(0);
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
        position="relative"
        {...props}
      >
        <Box
          position="absolute"
          bottom={2}
          width="100%"
          color="white"
          textAlign="center"
          fontSize="3xl"
          style={{ pointerEvents: 'none' }}
          display={muted ? undefined : 'none'}
        >
          <Box p={1} pl={2} pr={2} rounded="sm" bg="rgba(0,0,0,0.6)" display="inline-block">
            <UiVolume />
            <Box as="span" fontSize="xl" pl={4}>Unmute</Box>
          </Box>
        </Box>
        {pageLoaded &&
        <ReactPlayer
          url={`https://stream.mux.com/${videoId}.m3u8`}
          playing={(!muted || (inView && pageVisible)) && playing}
          playsinline
          muted={muted}
          volume={muted ? 0 : 1}
          width="100%"
          height="100%"
          onClick={onClick}
          onPlay={onPlay}
          style={{ cursor: 'pointer' }}
          pip={false}
          ref={ref}
          controls={!muted}
          config={{ file: { attributes: { disablePictureInPicture: true } } }}
          loop={muted}
        />}
      </RatioBox>
    </PageVisibility>
  );
}
