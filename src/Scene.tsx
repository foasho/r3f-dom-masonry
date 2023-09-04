import React from "react";
import { Box } from "@react-three/drei";

interface SceneProps {
  bgColor?: string | undefined;
  children?: React.ReactNode;
}
export const Scene = ({ bgColor = undefined, children = null }: SceneProps) => {
  return (
    <>
      {bgColor && <color attach="background" args={[bgColor]} />}
      <ambientLight intensity={0.75} />
      <directionalLight position={[5, 10, 3]} intensity={1} />
      {children ? (
        children
      ) : (
        <Box rotation={[-Math.PI / 2, 0, 0]}>
          <meshStandardMaterial attach={"material"} color="orange" />
        </Box>
      )}
    </>
  );
};
