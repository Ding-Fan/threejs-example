import { Edges } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState, useCallback, useEffect } from "react";
import { Group } from "three";


const TiltingRectangle: React.FC<{ setSelectedPosition: (position: [number, number, number]) => void }> = ({ setSelectedPosition }) => {
  const rectangleRef = useRef<Group>(null);
  const [tiltData, setTiltData] = useState({ beta: 0, gamma: 0 });
  const columns = 7;
  const rows = Math.ceil(30 / columns);
  const boxSize = 1.5;
  const gridWidth = columns * boxSize;
  const gridHeight = rows * boxSize;

  const getBoxPosition = useCallback((beta: number, gamma: number) => {
    const colIndex = Math.min(columns - 1, Math.max(0, Math.round((gamma * 2 + 90) / 180 * (columns - 1))));
    const rowIndex = Math.min(rows - 1, Math.max(0, Math.round((beta * 4 + 90) / 180 * (rows - 1))));
    const x = colIndex * boxSize - gridWidth / 2 + boxSize / 2;
    const y = -(rowIndex * boxSize - gridHeight / 2 + boxSize / 2);
    return [x, y, 1] as [number, number, number];
  }, [columns, rows, boxSize, gridWidth, gridHeight]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.DeviceOrientationEvent) {
      const handleOrientation = (event: DeviceOrientationEvent) => {
        const { beta, gamma } = event;
        setTiltData({ beta: beta || 0, gamma: gamma || 0 });
      };

      // Updated to check for permission in a more robust way that handles compatibility across devices
      if (window.DeviceOrientationEvent && typeof (window.DeviceOrientationEvent as any).requestPermission === "function") {
        (window.DeviceOrientationEvent as any).requestPermission()
          .then((response) => {
            if (response === "granted") {
              window.addEventListener("deviceorientation", handleOrientation);
            }
          })
          .catch(console.error);
      } else {
        window.addEventListener("deviceorientation", handleOrientation);
      }

      return () => {
        window.removeEventListener("deviceorientation", handleOrientation);
      };
    }
  }, []);

  useFrame(() => {
    if (rectangleRef.current) {
      const newPosition = getBoxPosition(tiltData.beta, tiltData.gamma);
      rectangleRef.current.position.set(newPosition[0], newPosition[1], newPosition[2]);
      setSelectedPosition([newPosition[0], newPosition[1], 0]);
    }
  });

  return (
    <group ref={rectangleRef} position={[0, 0, 1]}>
      <mesh>
        <planeGeometry args={[1.3, 1.5]} />
        <meshBasicMaterial color="red" transparent={true} opacity={0.0} />
        <Edges scale={1.0} color="red" />
      </mesh>
    </group>
  );
};

export default TiltingRectangle;
