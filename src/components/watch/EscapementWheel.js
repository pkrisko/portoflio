'use client';

import React, { forwardRef, useMemo } from 'react';
import { Shape, ExtrudeGeometry, MathUtils } from 'three';
import { Cylinder } from '@react-three/drei';
import Gear from '@/components/watch/Gear';
import SecondHand from '@/components/watch/SecondHand';

export const AXLE_HEIGHT = 28;
const AXLE_WIDTH = 2.5;

const EscapementWheel = forwardRef(
  (
    {
      position = [0, 0, 0],
      rotation = [0, 0, 0],
      numTeeth = 30,
      radius = 10,
      toothHeight = 3,
      thickness = 0.5,
      color = '#B1B5B5',
    },
    ref
  ) => {
    const geometry = useMemo(() => {
      const shape = new Shape();

      const anglePerTooth = (2 * Math.PI) / numTeeth;

      const liftAngleDegrees = 3; // Angle of the tooth rise
      const gapAngleDegrees = -5; // Gap between teeth, tooth width

      const liftAngleOffset = MathUtils.degToRad(liftAngleDegrees);
      const gapAngleOffset = MathUtils.degToRad(gapAngleDegrees);

      // Starting point at base of the first tooth
      let baseTheta = 0;
      let baseX = radius * Math.cos(baseTheta);
      let baseY = radius * Math.sin(baseTheta);
      shape.moveTo(baseX, baseY);

      for (let i = 0; i < numTeeth; i++) {
        baseTheta = i * anglePerTooth;
        const nextBaseTheta = (i + 1) * anglePerTooth;

        const baseX = radius * Math.cos(baseTheta);
        const baseY = radius * Math.sin(baseTheta);

        const tipTheta = baseTheta - liftAngleOffset;
        const tipX = (radius + toothHeight) * Math.cos(tipTheta);
        const tipY = (radius + toothHeight) * Math.sin(tipTheta);

        const gapTheta = nextBaseTheta + gapAngleOffset;
        const gapX = radius * Math.cos(gapTheta);
        const gapY = radius * Math.sin(gapTheta);

        // Draw the tooth
        if (i > 0) {
          shape.lineTo(baseX, baseY);
        }

        shape.lineTo(tipX, tipY);
        shape.lineTo(gapX, gapY);

        // Move to the next base point to create a gap
        shape.lineTo(
          radius * Math.cos(nextBaseTheta),
          radius * Math.sin(nextBaseTheta)
        );
      }

      shape.closePath();

      const extrudeSettings = {
        steps: 1,
        depth: thickness,
        bevelEnabled: false,
      };

      return new ExtrudeGeometry(shape, extrudeSettings);
    }, [numTeeth, radius, toothHeight, thickness]);

    return (
      <>
        <mesh
          ref={ref}
          geometry={geometry}
          position={position}
          rotation={rotation}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={color} />
          <Gear
            position={[0, 0, 2]}
            numTeeth={8}
            radius={7.2}
            clearance={0.0}
            backlash={0.0}
            thickness={2}
            module={3}
            color="#EAECEC"
            addendumFactor={1}
          />
          {/* Axle which seconds hand spins on. */}
          <Cylinder
            args={[AXLE_WIDTH, AXLE_WIDTH, AXLE_HEIGHT, AXLE_HEIGHT]}
            position={[0, 0, AXLE_HEIGHT / 2 + 0.1]}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color="#EAECEC" />
          </Cylinder>
          <SecondHand />
        </mesh>
      </>
    );
  }
);

EscapementWheel.displayName = 'EscapementWheel';

export default EscapementWheel;
