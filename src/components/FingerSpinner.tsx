"use client";

import { Canvas, MeshProps, ThreeEvent } from "@react-three/fiber";
import { useState, useRef, Dispatch, SetStateAction } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";
import { useCallback } from "react";

interface Props extends MeshProps {
  rotationSpeed: number;
  setRotationSpeed: Dispatch<SetStateAction<number>>;
}

const SpinnerMesh: React.FC<Props> = ({ rotationSpeed, setRotationSpeed }) => {
  const spinnerRef = useRef<Mesh>(null);
  const [dragging, setDragging] = useState(false);
  const [lastPointerX, setLastPointerX] = useState<number | null>(null);

  const startSpin = useCallback(
    (e: ThreeEvent<PointerEvent | TouchEvent>) => {
      setDragging(true);

      // Narrowing the event type
      if ("clientX" in e) {
        // This is a PointerEvent
        setLastPointerX(e.clientX);
      } else if (e.touches && e.touches.length > 0) {
        // This is a TouchEvent
        setLastPointerX(e.touches[0].clientX);
      }
      setRotationSpeed(0); // Stop spinning when touched
    },
    [setRotationSpeed]
  );

  const handleDrag = useCallback(
    (e: ThreeEvent<PointerEvent | TouchEvent>) => {
      if (dragging && lastPointerX !== null) {
        let currentX: number;

        // Narrowing the event type
        if ("clientX" in e) {
          // This is a PointerEvent
          currentX = e.clientX;
        } else if (e.touches && e.touches.length > 0) {
          // This is a TouchEvent
          currentX = e.touches[0].clientX;
        } else {
          return; // Early exit if we can't determine the current X position
        }

        const deltaX = currentX - lastPointerX;
        setRotationSpeed((prevSpeed) =>
          Math.max(prevSpeed + deltaX * 0.001, 0)
        );
        setLastPointerX(currentX);

        if (navigator.vibrate) {
          navigator.vibrate(10);
        }
      }
    },
    [dragging, lastPointerX, setRotationSpeed]
  );

  const stopSpin = useCallback(() => {
    setDragging(false);
    setLastPointerX(null);
    setRotationSpeed(0.02); // Resume spinning after releasing

    if (navigator.vibrate) {
      navigator.vibrate(0);
    }
  }, [setRotationSpeed]);

  useFrame(() => {
    if (spinnerRef.current) {
      spinnerRef.current.rotation.z += rotationSpeed;
    }
  });

  return (
    <mesh
      ref={spinnerRef}
      onPointerDown={stopSpin}
      onPointerMove={handleDrag}
      onPointerUp={startSpin}
      onPointerOut={startSpin}
    >
      <cylinderGeometry args={[1, 1, 0.2, 32]} />
      <meshStandardMaterial color={"mint"} />
    </mesh>
  );
};

const FingerSpinner = () => {
  const [rotationSpeed, setRotationSpeed] = useState(0.02);

  return (
    <div className="w-96 h-96 mx-auto touch-none">
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <SpinnerMesh
          rotationSpeed={rotationSpeed}
          setRotationSpeed={setRotationSpeed}
        />
      </Canvas>
    </div>
  );
};

export default FingerSpinner;
