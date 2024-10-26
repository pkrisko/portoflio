import React from 'react';
import { Cylinder, Box } from '@react-three/drei';
import Index from '@/components/watch/Index';

const Dial = ({
  color = "#fafbf8",
  outerRadius = 52,
  depth = 2,
  dialHeight = 13,
}) => {
  // Hour indices (0 to 11)
  const indices = [...Array(12).keys()]; // array [0, 1, ..., 11]

  // Minute markers (from 0 to 59), excluding multiples of 5
  const minuteIndices = [...Array(60).keys()].filter(
    (i) => i % 5 !== 0
  );

  // Sub-markers between minute markers
  const subMarkerIndices = [];
  for (let i = 0; i < 60; i++) {
    for (let j = 1; j <= 4; j++) {
      const subIndex = i + j / 5;
      subMarkerIndices.push(subIndex % 60); // Ensure it wraps around at 60
    }
  }

  // Create hour markers
  const indexMarkers = indices.map((i) => {
    const angle = (i / 12) * 2 * Math.PI;
    const radius = outerRadius - 10;
    const x = radius * Math.sin(angle);
    const y = radius * Math.cos(angle);
    const z = dialHeight + depth; // Place the index on top of the dial
    const rotation = [0, 0, -angle]; // Rotate the index to face outward

    return (
      <Index
        key={`index-${i}`}
        position={[x, y, z]}
        rotation={rotation}
      />
    );
  });

  // Create minute markers
  const minuteMarkers = minuteIndices.map((i) => {
    const angle = (i / 60) * 2 * Math.PI;
    const radius = outerRadius - 3.5; // Adjust radius as needed
    const x = radius * Math.sin(angle);
    const y = radius * Math.cos(angle);
    const z = dialHeight + 1; // Place the marker on top of the dial
    const rotation = [0, 0, -angle]; // Rotate the marker to face outward

    return (
      <Box
        key={`minute-${i}`}
        args={[0.2, 2, 0.2]} // width, height, depth
        position={[x, y, z]}
        rotation={rotation}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="black" />
      </Box>
    );
  });

  // Create sub-markers
  const subMarkers = subMarkerIndices.map((i) => {
    const angle = (i / 60) * 2 * Math.PI;
    const radius = outerRadius - 3; // Same radius as minute markers
    const x = radius * Math.sin(angle);
    const y = radius * Math.cos(angle);
    const z = dialHeight + 1; // Slightly lower than minute markers
    const rotation = [0, 0, -angle]; // Rotate the marker to face outward

    return (
      <Box
        key={`submarker-${i}`}
        args={[0.1, 1, 0.2]} // width, height, depth
        position={[x, y, z]}
        rotation={rotation}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="black" />
      </Box>
    );
  });

  return (
    <>
      <Cylinder
        args={[outerRadius, outerRadius, depth, 64]}
        position={[0, 0, dialHeight]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={color} />
      </Cylinder>
      {indexMarkers}
      {minuteMarkers}
      {subMarkers}
    </>
  );
};

Dial.displayName = 'Dial';

export default Dial;
