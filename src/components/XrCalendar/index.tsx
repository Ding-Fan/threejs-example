"use client";
import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import CalendarGrid from "./CalendarGrid";
import TiltingRectangle from "./TiltingRectangle";
import CameraController from "./CameraController";

export type Position = [number, number, number];
export type GoPressed = boolean;

export default function XrCalendar() {
  const [goPressed, setGoPressed] = useState<GoPressed>(false);
  const [selectedPosition, setSelectedPosition] = useState<Position>([0, 0, 0]);

  const handlePress = () => {
    setGoPressed((prevState) => !prevState);
  };

  return (
    <div className="h-[80vh] w-[80vw] border-solid border-2 relative">
      <button
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 2,
          userSelect: "none",
        }}
        onClick={handlePress}
      >
        {goPressed ? "Stop" : "Go"}
      </button>
      <Canvas
        orthographic
        camera={{ position: [0, 0, 10], zoom: goPressed ? 25 : 80 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 10, 5]} intensity={1} />
        <CalendarGrid setSelectedPosition={setSelectedPosition} />
        <OrbitControls
          enableZoom={false}
          enablePan={true}
          enableRotate={false}
          panSpeed={1}
          touches={{
            ONE: 1,
          }}
        />
        <CameraController
          goPressed={goPressed}
          selectedPosition={selectedPosition}
        />
        {goPressed && (
          <TiltingRectangle setSelectedPosition={setSelectedPosition} />
        )}
      </Canvas>
    </div>
  );
}
