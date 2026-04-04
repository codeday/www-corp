import { Box } from "@codeday/topo/Atom";
import { useTheme } from "@codeday/topo/utils";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";

const options = {
  cameraRotateSpeed: 0.2,
  focusAnimationDuration: 1000,
  focusEasingFunction: ["Linear", "None"] as any,
  markerTooltipRenderer: () => ``,
  markerRadiusScaleRange: [0.02, 0.03] as [number, number],
  enableCameraRotate: false,
  enableCameraZoom: false,
  focusDistanceRadiusScale: 3.5,
  enableMarkerGlow: false,
  enableDefocus: false,
  globeGlowCoefficient: 0.05,
  ambientLightIntensity: 1,
  pointLightIntensity: 0.5,
};

//@ts-ignore
const ReactGlobe = dynamic(() => import("react-globe"), { ssr: false });

function InnerGlobe({ regions, testimonial }: { regions: any[]; testimonial: any }) {
  const { colors } = useTheme();
  const [globe, setGlobe] = useState<any>();
  const [lastTestimonialHadRegion, setLastTestimonialHadRegion] = useState(false);

  useEffect(() => {
    if (!globe) return;
    if (!lastTestimonialHadRegion && !testimonial?.region) return;

    setLastTestimonialHadRegion(Boolean(testimonial?.region));

    const focusOn = testimonial?.region
      ? [testimonial.region.location.lat, testimonial.region.location.lon + 4]
      : [38.0, -88.0];
    globe.updateFocus(focusOn, {
      ...options,
      ...(!testimonial?.region
        ? {
            cameraRotateSpeed: 0,
            disableCameraRotate: true,
          }
        : {}),
    });
  }, [globe, testimonial]);

  const markers = regions
    ?.map((r) => ({
      id: `${r.webname}-${testimonial?.region?.webname === r.webname ? "active" : "inactive"}`,
      color:
        testimonial?.region?.webname === r.webname
          ? (colors as any).red[600]
          : (colors as any).white,
      value: testimonial?.region?.webname === r.webname ? 20 : 10,
      coordinates: [r.location.lat, r.location.lon] as [number, number],
    }))
    .sort((a, b) => b.value - a.value);

  useEffect(() => {
    if (globe) globe.updateFocus([38.0, -88.0]);
  }, [globe]);

  return (
    <ReactGlobe
      //@ts-ignore
      height="100%"
      width="100%"
      globeCloudsTexture={null}
      markers={markers}
      globeTexture="/globe.jpg"
      globeBackgroundTexture={null}
      options={{
        ...options,
      }}
      onClickMarker={() => {}}
      onMouseOutMarker={() => {}}
      onMouseOverMarker={() => {}}
      onGetGlobe={setGlobe}
    />
  );
}

interface GlobeProps {
  testimonial: any;
  regions: any[];
}

export default function Globe({ testimonial, regions }: GlobeProps) {
  if (typeof window === "undefined") {
    return null;
  }

  const { ref, inView } = useInView({ rootMargin: "500px" });
  const [hasLoaded, setHasLoaded] = useState(false);
  useEffect(() => {
    if (inView) {
      setHasLoaded(true);
    }
  }, [inView]);

  return (
    <Box ref={ref} height="100%" width="100%">
      {hasLoaded && <InnerGlobe regions={regions} testimonial={testimonial} />}
    </Box>
  );
}
