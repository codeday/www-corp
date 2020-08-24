import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic'
import { useTheme } from '@codeday/topo/utils';

const ReactGlobe = dynamic(() => import('react-globe'), { ssr: false });


const options = {
  cameraRotateSpeed: 0.5,
  focusAnimationDuration: 2000,
  focusEasingFunction: ['Linear', 'None'],
  pointLightIntensity: 1.5,
  markerTooltipRenderer: () => ``,
  enableCameraRotate: false,
  focusDistanceRadiusScale: 2,
  enableMarkerGlow: false,
  enableDefocus: false,
  enableCameraZoom: false,
};

export default function Globe({ testimonial, regions }) {
  const { colors } = useTheme();
  const markers = regions?.map((r) => ({
    id: `${r.webname}-${testimonial?.region?.webname === r.webname ? 'active' : 'inactive'}`,
    color: testimonial?.region?.webname === r.webname ? colors.red[600] : colors.white,
    value: 10,
    coordinates: [r.location.lat, r.location.lon],
  }));

  return (
    <ReactGlobe
      height="30em"
      globeBackgroundTexture={null}
      globeCloudsTexture={null}
      globeTexture="/globe.jpg"
      markers={markers}
      options={{
        ...options
      }}
      onClickMarker={() => {}}
      onMouseOutMarker={() => {}}
      onMouseOverMarker={() => {}}
      focus={testimonial?.region
        ? [testimonial.region.location.lat, testimonial.region.location.lon]
        : [38.0000, -97.0000]
      }
    />
  );
}
Globe.propTypes = {
  testimonial: PropTypes.object.isRequired,
  regions: PropTypes.arrayOf([PropTypes.object]).isRequired,
};
