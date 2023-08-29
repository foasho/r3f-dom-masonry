import React, { useEffect, useMemo, useState, useRef, createContext, useContext } from "react";
import {
  Canvas,
  useFrame
} from "@react-three/fiber";
import { Color, ShaderMaterial, Vector2, Vector3, Mesh } from "three";
import { r3f } from "./Helper";
import { Scene } from "./Scene";

interface ObjectProps {
  target: HTMLDivElement;
  color1?: string;
  color2?: string;
  radius?: number;
}
const Object = (
  {
    target,
    color1 = "#000000",
    color2 = "#ffffff",
    radius = 20,
  }: ObjectProps
) => {
  const ref = useRef<Mesh>(null);

  console.log("Object: ", 
    target,
    color1,
    color2,
    radius
  );

  const shaderMaterial = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        // uTime: { value: Math.random() * 10 },
        // uResolution: { value: new Vector2() },
        // uNoiseScale: { value: Math.random() },
        // uColor1: { value: new Color(color1) },
        // uColor2: { value: new Color(color2) },
        // uBorderRadius: { value: radius },
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

  // useEffect(() => {
  //   const resize = () => {
  //     const rect = target.getBoundingClientRect();
  //     if (ref.current){
  //       ref.current.scale.set(
  //         rect.width * 1,
  //         rect.height * 1,
  //         1
  //       )
  //     }
  //     // setScale(new Vector3(width, height, 1));
  //   }
  //   window.addEventListener("resize", resize);
  //   return () => window.removeEventListener("resize", resize);
  // }, []);

  useFrame((_, state) => {

  });

  return (
    <mesh
      ref={ref}
    >
      <planeGeometry args={[1, 1]} />
      <primitive attach="material" object={shaderMaterial} />
    </mesh>
  )
}

const R3FDomAlignContext = createContext<{
  scale: number;
  fov: number;
  aspect: number;
  isCameraFixed: boolean;
  cameraPosition: Vector3;
  setCameraPosition: (position: Vector3) => void;
}>({
  scale: 1,
  fov: 52,
  aspect: 1,
  isCameraFixed: false,
  cameraPosition: new Vector3(0, 0, 300),
  setCameraPosition: () => {},
});
export interface R3FDomAlignProps {
  items: Array<DomItemProps>;
}
export const R3FDomAlign = ({ ...props }: R3FDomAlignProps) => {

  const scale = useRef<number>(1);
  const fov = 52;
  const [aspect, setAspect] = useState<number>(1);
  const [isCameraFixed, setIsCameraFixed] = useState<boolean>(false);
  const [cameraPosition, setCameraPosition] = useState<Vector3>(new Vector3(0, 0, 300));
  const dimensions = useRef<Vector2>(new Vector2(0, 0));

  useEffect(() => {
    const resize = () => {
      const { innerWidth, innerHeight } = window;
      setAspect(innerWidth / innerHeight);
    }
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const { items } = props;

  // itemsをグリッドに分割するロジック
  const chunkedItems: any[] = [];
  let chunk: any[] = [];
  
  items.forEach((item, index) => {
    chunk.push(item);
    if ((index + 1) % 3 === 0 || index === items.length - 1) {
      chunkedItems.push(chunk);
      chunk = [];
    }
  });

  return (
    <R3FDomAlignContext.Provider value={{
      scale: scale.current,
      fov: fov,
      aspect: aspect,
      isCameraFixed: isCameraFixed,
      cameraPosition: cameraPosition,
      setCameraPosition: setCameraPosition,
    }}>
      {/** Canvas */}
      <Canvas 
        shadows
        gl={{
          antialias: true,
          alpha: true,
        }}
        camera={
          {
            fov: fov,
            aspect: aspect,
            near: 0.01,
            far: 10000,
            position: cameraPosition,
          }
        }
      >
        <Scene isOrbit={false}>
          <CanvasSystem />
          <r3f.Out />
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
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4`}>
          {chunkedItems.map((itemChunk, chunkIndex) => (
            <div className="grid gap-4" key={chunkIndex}>
              {itemChunk.map((item: any, itemIndex: any) => (
                <DomItem key={itemIndex} {...item} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </R3FDomAlignContext.Provider>
  )
}

const CanvasSystem = () => {

  return (<></>)
}

export interface DomItemProps {
  height: number;
  title: string;
}
const DomItem = ({...props}: DomItemProps) => {
  const { 
    fov, 
    isCameraFixed, 
    cameraPosition, 
    setCameraPosition, 
    aspect 
  } = useContext(R3FDomAlignContext);
  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { height, title } = props;

  const resize = (w: number, h: number, s: number) => {}

  useEffect(() => {
    
    // Zの位置を1/2Hを計算し、設定する
    const z = height / Math.tan(fov * Math.PI / 360) * 0.5;
    let scale = 1;

    if (isCameraFixed){
      scale = cameraPosition.z / z;
    }
    else {
      setCameraPosition(new Vector3(0, 0, z));
      scale = 1;
    }

    

  }, [aspect]);

  return (
    <div ref={ref} style={{ height: `${height}px` }}>
      <div className="h-full max-w-full rounded-lg bg-gray-600 solid">
        {title}
      </div>
      {ready && 
        <r3f.In>
          
        </r3f.In>
      }
    </div>
  )
}