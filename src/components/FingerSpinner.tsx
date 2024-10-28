"use client";

import { Canvas } from "@react-three/fiber";
import { useState, useRef } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";
import { useCallback } from "react";

const SpinnerMesh = ({ rotationSpeed, setRotationSpeed }) => {
  const spinnerRef = useRef<Mesh>(null);
  const [dragging, setDragging] = useState(false);
  const [lastPointerX, setLastPointerX] = useState(null);

  const startSpin = useCallback(
    (e) => {
      setDragging(true);
      setLastPointerX(e.clientX || e.touches[0].clientX);
      setRotationSpeed(0); // Stop spinning when touched
    },
    [setRotationSpeed]
  );

  const handleDrag = useCallback(
    (e) => {
      if (dragging && lastPointerX !== null) {
        const currentX =
          e.clientX !== undefined ? e.clientX : e.touches[0].clientX;
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
      onPointerDown={startSpin}
      onPointerMove={handleDrag}
      onPointerUp={stopSpin}
      onPointerOut={stopSpin}
      onTouchStart={startSpin}
      onTouchMove={handleDrag}
      onTouchEnd={stopSpin}
    >
      <cylinderGeometry args={[1, 1, 0.2, 32]} />
      <meshStandardMaterial color={"orange"} />
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
