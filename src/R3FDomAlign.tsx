import React, { useEffect, useMemo } from "react";
import {
  Canvas,
  useFrame
} from "@react-three/fiber";
import { ShaderMaterial } from "three";
import { r3f } from "./Helper";
import { Scene } from "./Scene";

const Object = () => {

  const shaderMaterial = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {

      },
      vertexShader: `
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        void main() {
          gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
      `,
      transparent: true,
    });
  }, []);

  useEffect(() => {
    const resize = () => {

    }
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useFrame((_, state) => {

  });

  return (
    <mesh>
      <planeGeometry args={[1, 1]} />
      <primitive attach="material" object={shaderMaterial} />
    </mesh>
  )
}

interface R3FDomAlingItemProps {}

interface R3FDomAlignProps {
  items: Array<R3FDomAlingItemProps>;
}
export const R3FDomAlign = (props: R3FDomAlignProps) => {
  return (
    <>
      {/** Canvas */}
      <Canvas 
        shadows
        gl={{
          antialias: true,
          alpha: true,
        }}
        camera={
          {
            fov: 52,
            aspect: 1,
            near: 0.01,
            far: 10000,
            position: [0, 0, 300]
          }
        }
      >
        <Scene isOrbit={false}>
        </Scene>
      </Canvas>
      {/** Dom */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 1,
        }}
      >
        <div>
          
        </div>
        <r3f.Out />
      </div>
    </>
  )
}

interface DomItemProps {
  width: number;
  height: number;
  title: string;
}
const DomItem = ({...props}: DomItemProps) => {

  return (
    <>
    </>
  )
}