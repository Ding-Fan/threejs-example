import { useThree } from "@react-three/fiber";
import { useEffect } from "react";


function CameraController({ goPressed, selectedPosition }) {
  const { camera, size } = useThree();

  useEffect(() => {
    if (goPressed) {
      camera.position.set(0, 0, 10);
      camera.zoom = size.width / 14; // Adjust to show the entire calendar, width should match the canvas width
    } else {
      camera.position.lerp({ x: selectedPosition[0], y: selectedPosition[1], z: 10 }, 0.1);
      camera.zoom = size.width / 4; // Zoom in to show selected daybox and surroundings
    }
    camera.updateProjectionMatrix();
  }, [goPressed, camera, size.width, selectedPosition]);

  return null;
}

export default CameraController;
