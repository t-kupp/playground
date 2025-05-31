"use client";

import useScreenSize from "@/hooks/useScreenSize";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Stats, OrbitControls } from "@react-three/drei";
import { useEffect, useState, useRef } from "react";
import {
  EffectComposer,
  Pixelation,
  Noise,
  Glitch,
  Scanline,
  ChromaticAberration,
} from "@react-three/postprocessing";

// This component handles the raycasting and hover detection
function SquareGrid({
  squares,
  squareWidth,
  squareHeight,
  cols,
  rows,
  onToggleSquare,
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [highlightedIndices, setHighlightedIndices] = useState([]);
  const meshRefs = useRef([]);
  const { camera, mouse, viewport } = useThree();
  // Create raycaster once, not on every frame
  const raycaster = useRef(new THREE.Raycaster());
  const frameCount = useRef(0);
  const nextToggleFrame = useRef(getRandomFrameInterval());
  // Track previous mouse position to avoid unnecessary calculations
  const prevMouse = useRef({ x: 0, y: 0 });
  // Set a threshold for mouse movement to recalculate
  const mouseThreshold = 0.001;

  // Function to generate random frame interval between 5-15
  function getRandomFrameInterval() {
    return Math.floor(Math.random() * 11) + 5; // Random number between 5 and 15
  }

  useFrame(() => {
    // Increment frame counter
    frameCount.current += 1;

    // Only update raycaster if mouse has moved beyond threshold
    const mouseHasMoved =
      Math.abs(mouse.x - prevMouse.current.x) > mouseThreshold ||
      Math.abs(mouse.y - prevMouse.current.y) > mouseThreshold;

    if (mouseHasMoved) {
      // Update previous mouse position
      prevMouse.current = { x: mouse.x, y: mouse.y };

      // Update the picking ray with the camera and mouse position
      raycaster.current.setFromCamera(mouse, camera);

      // Calculate objects intersecting the picking ray
      const intersects = raycaster.current.intersectObjects(
        meshRefs.current.filter((mesh) => mesh),
      );

      // Update hovered state
      if (intersects.length > 0) {
        const index = meshRefs.current.indexOf(intersects[0].object);
        if (hoveredIndex !== index) {
          setHoveredIndex(index);

          // Calculate highlighted squares in grid
          const hoverCoords = squares[index].coords;
          const highlighted = [];

          // Calculate grid around the hovered square
          for (let i = -3; i <= 3; i++) {
            for (let j = -3; j <= 3; j++) {
              const newCol = hoverCoords[0] + i;
              const newRow = hoverCoords[1] + j;

              // Check if within grid boundaries
              if (
                newCol >= 0 &&
                newCol < cols &&
                newRow >= 0 &&
                newRow < rows
              ) {
                const highlightIndex = newCol * rows + newRow;
                highlighted.push(highlightIndex);
              }
            }
          }

          setHighlightedIndices(highlighted);
        }
      } else {
        setHoveredIndex(null);
        setHighlightedIndices([]);
      }
    }

    // Toggle a random highlighted square at random intervals
    if (
      frameCount.current >= nextToggleFrame.current &&
      highlightedIndices.length > 0
    ) {
      const randomIndex = Math.floor(Math.random() * highlightedIndices.length);
      const squareIndex = highlightedIndices[randomIndex];
      onToggleSquare(squareIndex);

      // Reset frame counter and set new random interval
      frameCount.current = 0;
      nextToggleFrame.current = getRandomFrameInterval();
    }
  });

  const isHighlighted = (index) => {
    return highlightedIndices.includes(index);
  };

  return (
    <>
      {squares.map((square, index) => (
        <group key={index} position={square.position}>
          {/* Main square mesh */}
          <mesh
            ref={(el) => (meshRefs.current[index] = el)}
            scale={[squareWidth, 0.1, squareHeight]}
          >
            <boxGeometry />
            <meshBasicMaterial
              color={square.color}
              transparent={true}
              opacity={isHighlighted(index) && square.show ? square.opacity : 0}
            />
          </mesh>

          {/* Border mesh */}
          <mesh scale={[squareWidth + 0.2, 0.5, squareHeight]}>
            <lineSegments>
              <edgesGeometry
                attach="geometry"
                args={[new THREE.BoxGeometry()]}
              />
              <lineBasicMaterial
                color={square.borderColor}
                opacity={
                  isHighlighted(index) && square.show ? square.borderOpacity : 0
                }
                transparent={true}
              />
            </lineSegments>
          </mesh>
        </group>
      ))}
    </>
  );
}

export default function Grid() {
  const [squares, setSquares] = useState([]);
  const { height, width } = useScreenSize();

  const cols = 30;
  const rows = 30;

  const squareWidth = Math.sqrt(width) / 20;
  const squareHeight = squareWidth;

  useEffect(() => {
    const gridWidth = cols * squareWidth;
    const gridDepth = rows * squareHeight;

    const startX = -gridWidth / 2;
    const startZ = -gridDepth / 2;

    const newSquares = [];

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const mesh = {
          position: [startX + i * squareWidth, 0, startZ + j * squareHeight],
          coords: [i, j], // Store grid coordinates for later use
          show: Math.random() > 0.5, // Initialize with random visibility
          color: Math.random() > 0.5 ? "cyan" : "red",
          opacity: 0.5,
          borderColor: "indigo",
          borderOpacity: 1,
        };
        newSquares.push(mesh);
      }
    }
    setSquares(newSquares);
  }, [height, width, cols, rows, squareWidth, squareHeight]);

  // Function to handle square toggle
  const handleToggleSquare = (index) => {
    // Create a copy of the square with toggled show status
    const updatedSquare = {
      ...squares[index],
      show: !squares[index].show,
    };

    // Create a new array with the updated square
    const newSquares = [...squares];
    newSquares[index] = updatedSquare;

    setSquares(newSquares);
  };

  return (
    <div>
      <div className="fixed top-0 left-0 h-screen w-screen">
        <img
          className="absolute -bottom-1/5 left-0 z-10 object-cover"
          src="/lady.png"
          alt=""
        />
        <img
          className="absolute top-0 left-0 h-full w-full object-cover"
          src="/city.png"
          alt=""
        />
      </div>
      <div className="fixed top-0 left-0 z-50 h-screen w-screen mix-blend-difference">
        <Canvas camera={{ position: [0, 20, 0] }} className="h-full w-full">
          {/* <OrbitControls /> */}
          <EffectComposer>
            <Noise opacity={1} />
          </EffectComposer>
          <SquareGrid
            squares={squares}
            squareWidth={squareWidth}
            squareHeight={squareHeight}
            cols={cols}
            rows={rows}
            onToggleSquare={handleToggleSquare}
          />
        </Canvas>
      </div>
    </div>
  );
}
