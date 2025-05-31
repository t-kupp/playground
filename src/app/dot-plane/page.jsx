"use client";

import { Instance, Instances, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  EffectComposer,
  TiltShift2,
  DepthOfField,
} from "@react-three/postprocessing";
import { useRef, useState } from "react";
import { MathUtils } from "three";

const rows = 40;
const columns = 50;

const particles = Array.from({ length: rows * columns }, (_, index) => ({
  factor: MathUtils.randInt(20, 100),
  speed: MathUtils.randFloat(0.01, 0.75),
  xFactor: (index % columns) * 0.5 - columns * 0.25,
  yFactor: MathUtils.randFloatSpread(1),
  zFactor: (Math.floor(index / columns) - 5) * 0.5,
  size: MathUtils.randFloat(0.02, 0.04),
}));

export default function DotPlane() {
  const defaultCameraPosition = [0, 0, 25];
  const [orbitControls, setOrbitControls] = useState(false);
  const cameraRef = useRef();

  function toggleOrbitControls() {
    if (orbitControls && cameraRef.current) {
      cameraRef.current.position.set(...defaultCameraPosition);
      cameraRef.current.lookAt(0, 0, 0);
    }
    setOrbitControls(!orbitControls);
  }

  return (
    <div className="h-screen w-screen">
      <Canvas
        camera={{ position: defaultCameraPosition, fov: 50 }}
        onCreated={({ camera }) => (cameraRef.current = camera)}
      >
        <color attach="background" args={["#e2e2e2"]} />
        <Dots />
        <OrbitControls />
        <EffectComposer>
          <TiltShift2 blur={0.03} />
          <DepthOfField focusDistance={0} focalLength={0.025} bokehScale={2} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

function Dots() {
  const ref = useRef();

  useFrame((state, delta) => {
    ref.current.rotation.y = MathUtils.damp(
      ref.current.rotation.y,
      -state.mouse.x * 0.02,
      4,
      delta,
    );

    ref.current.rotation.x = MathUtils.damp(
      ref.current.rotation.x,
      state.mouse.y * 0.02,
      4,
      delta,
    );

    // ref.current.position.y = -40;
    // ref.current.position.z = 50;

    ref.current.children.forEach((child, index) => {
      const time = state.clock.getElapsedTime();
      const yOffset = Math.sin(time * 0.5 + index * 0.5) * 0.2;
      const xOffset = Math.sin(time * 0.5 + index * 0.5) * 0.3;
      const zOffset = Math.sin(time * 0.5 + index * 0.5) * 0.4;

      child.position.y = particles[index].yFactor + yOffset;
      child.position.x = particles[index].xFactor + xOffset;
      child.position.z = particles[index].zFactor + zOffset;
    });
  });

  return (
    <Instances ref={ref} limit={particles.length}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={"#525252"} roughness={1} />
      {particles.map((particle, index) => (
        <Instance
          key={index}
          scale={[particle.size, particle.size, particle.size]}
          position={[particle.xFactor, particle.yFactor, particle.zFactor]}
        />
      ))}
    </Instances>
  );
}
