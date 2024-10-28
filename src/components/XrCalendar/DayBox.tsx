import { OrbitControls, Text, Edges } from "@react-three/drei";


const DayBox: React.FC<{
  position: [number, number, number];
  label: string;
}> = ({ position, label }) => (
  <mesh position={position}>
    <planeGeometry args={[1.3, 1.5]} />
    <meshMatcapMaterial color="white" transparent={true} opacity={0.2} />
    <Edges scale={1.0} color="black" />
    <Text position={[0, 0.4, 0]} fontSize={0.2} color="black">
      {label}
    </Text>
  </mesh>
);

export default DayBox;
