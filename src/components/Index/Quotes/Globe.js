import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Box from '@codeday/topo/Atom/Box';
import dynamic from 'next/dynamic'
import { useTheme } from '@codeday/topo/utils';

const ReactGlobe = dynamic(() => import('react-globe'), { ssr: false });


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

export default function Globe({ testimonial, regions }) {
  const { colors } = useTheme();
  const [globe, setGlobe] = useState();
  const [lastTestimonialHadRegion, setLastTestimonialHadRegion] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  const markers = regions?.map((r) => ({
    id: `${r.webname}-${testimonial?.region?.webname === r.webname ? 'active' : 'inactive'}`,
    color: testimonial?.region?.webname === r.webname ? colors.red[600] : colors.white,
    value: 10,
    coordinates: [r.location.lat, r.location.lon],
  }));

  console.log(isVisible);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    const recalc = () => setIsVisible(ref.current.offsetParent !== null);
    recalc();
    window.addEventListener('resize', recalc, { passive: true });
    return () => window.removeEventListener('resize', recalc);
  }, [typeof window, ref]);

  useEffect(() => {
    if (globe) globe.updateFocus([38.0000, -88.0000]);
  }, [globe]);

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

  return (
    <Box ref={ref}>
      {isVisible && (
        <ReactGlobe
          height="30em"
          width="100%"
          globeCloudsTexture={null}
          markers={markers}
          globeTexture="/globe.jpg"
          globeBackgroundTexture="/background.jpg"
          options={{
            ...options
          }}
          onClickMarker={() => {}}
          onMouseOutMarker={() => {}}
          onMouseOverMarker={() => {}}
          onGetGlobe={setGlobe}
        />
      )}
    </Box>
  );
}
Globe.propTypes = {
  testimonial: PropTypes.object.isRequired,
  regions: PropTypes.arrayOf([PropTypes.object]).isRequired,
};
