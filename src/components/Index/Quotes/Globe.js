import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types';
import { useInView } from 'react-intersection-observer';
import Box from '@codeday/topo/Atom/Box';
import { useTheme } from '@codeday/topo/utils';

const options = {
  cameraRotateSpeed: 0.2,
  focusAnimationDuration: 1000,
  focusEasingFunction: ['Linear', 'None'],
  markerTooltipRenderer: () => ``,
  enableCameraRotate: false,
  focusDistanceRadiusScale: 2.1,
  enableMarkerGlow: false,
  enableDefocus: false,
  enableCameraZoom: false,
  globeGlowCoefficient: 0.05,
  ambientLightIntensity: 1,
  pointLightIntensity: 0.5,
};

const ReactGlobe = dynamic(() => import('react-globe'), { ssr: false });

function InnerGlobe({ regions, testimonial }){
  const { colors } = useTheme();
  const [globe, setGlobe] = useState();
  const [lastTestimonialHadRegion, setLastTestimonialHadRegion] = useState(false);

  useEffect(() => {
    if (!globe) return;
    if (!lastTestimonialHadRegion && !testimonial?.region) return;

    setLastTestimonialHadRegion(Boolean(testimonial?.region));

    const focusOn = testimonial?.region
        ? [testimonial.region.location.lat, testimonial.region.location.lon + 4]
        : [38.0000, -88.0000]
    globe.updateFocus(focusOn, {
      ...options,
      ...(!testimonial?.region ? {
          cameraRotateSpeed: 0,
          disableCameraRotate: true,
        } : {})
    });
  }, [globe, testimonial]);

  const markers = regions?.map((r) => ({
    id: `${r.webname}-${testimonial?.region?.webname === r.webname ? 'active' : 'inactive'}`,
    color: testimonial?.region?.webname === r.webname ? colors.red[600] : colors.white,
    value: 10,
    coordinates: [r.location.lat, r.location.lon],
  }));

  useEffect(() => {
    if (globe) globe.updateFocus([38.0000, -88.0000]);
  }, [globe]);

  return (
    <ReactGlobe
      height="100%"
      width="100%"
      globeCloudsTexture={null}
      markers={markers}
      globeTexture="/globe.jpg"
      globeBackgroundTexture="/background.png"
      options={{
        ...options
      }}
      onClickMarker={() => {}}
      onMouseOutMarker={() => {}}
      onMouseOverMarker={() => {}}
      onGetGlobe={setGlobe}
    />
  );
}

export default function Globe({ testimonial, regions }) {
  if (typeof window === 'undefined') {
    return null;
  }

  const { ref, inView } = useInView({ rootMargin: '500px' });
  const [hasLoaded, setHasLoaded] = useState(false);
  useEffect(() => {
    if (inView) {
      setHasLoaded(true);
    }
  }, [ inView ]);

  return (
    <Box ref={ref} height="30em" width="100%">
      {hasLoaded && (
        <InnerGlobe regions={regions} testimonial={testimonial} />
      )}
    </Box>
  );
}
Globe.propTypes = {
  testimonial: PropTypes.object.isRequired,
  regions: PropTypes.arrayOf([PropTypes.object]).isRequired,
};
