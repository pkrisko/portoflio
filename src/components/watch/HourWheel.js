// ThirdWheel.js
import React, { forwardRef, useMemo } from 'react';
import { Box, Cylinder } from '@react-three/drei';
import { MathUtils } from 'three';
import Gear from '@/components/watch/Gear';
import { Shape, ExtrudeGeometry } from 'three';
import Spokes from '@/components/watch/Spokes';
import Hand from '@/components/watch/Hand';

const AXLE_HEIGHT = 15;
const AXLE_WIDTH = 1.5; // Slightly wider than second hand, in real world would be a tube.
const HOUR_HAND_LENGTH = 34;

const HourWheel = forwardRef(({
  position = [0, 0, 8],
  spurTeethCount = 30,
  axleHoleRadius = 2.5,
  spurRadius = 9.5,
}, ref) => {
  // Calculate the initial rotation of the seconds hand
  const hourHandRotation = useMemo(() => {
    const now = new Date();
    const minutes = now.getMinutes() + now.getSeconds() / 60;
    const hours = now.getHours() + minutes / 60;
    const angle = MathUtils.degToRad(0 - (hours * 30)); // 30 = (360º / 12 hours)
    return [0, 0, angle];
  }, []);

  // Ring parameters
  const ringInnerRadius = axleHoleRadius - 1; // Hole size
  const ringOuterRadius = axleHoleRadius; // Outer edge of the ring

  // Adjusted radii for spokes
  const innerRadius = ringOuterRadius; // Start of spokes
  const outerRadius = spurRadius - 3; // End of spokes

  // Create the ring shape (CD-like disc)
  const ringShape = useMemo(() => {
    const shape = new Shape();

    // Outer circle
    shape.absarc(0, 0, ringOuterRadius, 0, Math.PI * 2, false);

    // Inner hole
    const hole = new Shape();
    hole.absarc(0, 0, ringInnerRadius, 0, Math.PI * 2, true);
    shape.holes.push(hole);

    return shape;
  }, [ringInnerRadius, ringOuterRadius]);

  // Extrude the shape to create 3D geometry
  const ringGeometry = useMemo(() => {
    return new ExtrudeGeometry(ringShape, {
      depth: 2,
      bevelEnabled: false,
    });
  }, [ringShape]);

  return (
    <group ref={ref} position={position} rotation={[0, 0, 0]}>
      <Gear
        numTeeth={spurTeethCount}
        radius={spurRadius}
        module={2}
        addendumFactor={1.8}
        rotation={[0, 0, 0.07]}
      />
      {/* Central Ring (CD-shaped disc) */}
      <mesh geometry={ringGeometry} position={[0, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#D8DADA" />
      </mesh>

      {/* Spokes */}
      <Spokes
        numSpokes={5}
        thickness={2}
        innerRadius={innerRadius - 2}
        outerRadius={outerRadius + 2}
      />

      {/* Axle with hole in the middle */}
      <Cylinder
        args={[AXLE_WIDTH, AXLE_WIDTH, AXLE_HEIGHT, 32, 1]}
        position={[0, 0, AXLE_HEIGHT / 2]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="gray" side={2} /> {/* side={2} to render both sides */}
      </Cylinder>
      {/* Minute hand */}
      <Hand
        position={[0, 0, AXLE_HEIGHT - 2]}
        rotation={hourHandRotation}
        length={HOUR_HAND_LENGTH}
        donutRadius={3.8}
        rearOffset={7.5}
      />
    </group>
  );
});

HourWheel.displayName = 'HourWheel';

export default HourWheel;
