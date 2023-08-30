import React, { useEffect, useMemo, useState, useRef, createContext, useContext } from "react";
import {
  Canvas,
  useFrame,
  useThree
} from "@react-three/fiber";
import { Color, ShaderMaterial, Vector2, Vector3, Mesh, PerspectiveCamera } from "three";
import { r3f } from "./Helper";
import { Scene } from "./Scene";
import { OrbitControls } from "@react-three/drei";

interface ObjectProps {
  target: HTMLDivElement;
  planePosition: React.MutableRefObject<Vector3>;
  planeScale: React.MutableRefObject<Vector3>;
  scale?: React.MutableRefObject<number>;
  color1?: string;
  color2?: string;
  radius?: number;
}
const Object = (
  {
    target,
    planePosition,
    planeScale,
    scale = useRef<number>(1),
    color1 = "#000000",
    color2 = "#ffffff",
    radius = 20,
  }: ObjectProps
) => {

  const ref = useRef<Mesh>(null);
  const shaderMaterial = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        uTime: { value: Math.random() * 10 },
        uResolution: { value: new Vector2() },
        uNoiseScale: { value: Math.random() },
        uColor1: { value: new Color(color1) },
        uColor2: { value: new Color(color2) },
        uBorderRadius: { value: radius },
      },
      vertexShader: `
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        
        uniform float uTime;
        uniform vec2 uResolution;
        uniform float uNoiseScale;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform float uBorderRadius;

        void main() {
          gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
      `,
      transparent: true,
    });
  }, []);

  useFrame((state, delta) => {
    // console.log("render");
    // console.log("scale", scale.current);
    // console.log("planeScale", planeScale);
    // console.log("planePosition", planePosition);
    if (
      ref.current &&
      planePosition.current &&
      planeScale.current
    ){
      ref.current.position.copy(planePosition.current);
      ref.current.scale.copy(planeScale.current);
    }
    shaderMaterial.uniforms.uTime.value += delta;
    if (target){
      target.style.borderRadius = `${radius}px`;
    }
    shaderMaterial.uniforms.uBorderRadius.value = radius * scale.current;
  });

  return (
    <mesh
      ref={ref}
    >
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial color="#00ff00" />
      {/* <primitive attach="material" object={shaderMaterial} /> */}
    </mesh>
  )
}

const R3FDomAlignContext = createContext<{
  scale: React.MutableRefObject<number>;
  fov: number;
  aspect: number;
  isCameraFixed: boolean;
  cameraPosition: Vector3;
  setCameraPosition: (position: Vector3) => void;
}>({
  scale: { current: 1 },
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

  const resize = () => {
    console.log("resize");
    const { innerWidth, innerHeight } = window;
    dimensions.current.set(innerWidth, innerHeight);

    // Zの位置を1/2Hを計算し、設定する
    let z = innerHeight / Math.tan(fov * Math.PI / 360) * 0.5;

    if (isCameraFixed){
      scale.current = cameraPosition.z / z;
    }
    else {
      setCameraPosition(new Vector3(0, 0, z));
      scale.current = 1;
    }

    // 再レンダを発火させる
    setAspect(innerWidth / innerHeight);
    
  }

  useEffect(() => {
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
      scale: scale,
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
          {/* <mesh
            scale={300}
          >
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial color="#00ff00" />
          </mesh> */}
          {/* <OrbitControls /> */}
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
          zIndex: 1
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

  const { camera } = useThree();
  const { aspect } = useContext(R3FDomAlignContext);

  useEffect(() => {
    (camera as PerspectiveCamera).aspect = aspect;
    camera.updateProjectionMatrix();
  }, [aspect]);

  useFrame((state, delta) => {
    const posX = state.camera.position.x.toFixed(2);
    const posY = state.camera.position.y.toFixed(2);
    const posZ = state.camera.position.z.toFixed(2);
    // console.log(`camera position: ${posX}, ${posY}, ${posZ}`);
  });

  return (<></>)
}

export interface DomItemProps {
  height: number;
  title: string;
}
const DomItem = ({...props}: DomItemProps) => {

  const { 
    aspect,
    scale,
  } = useContext(R3FDomAlignContext);

  const planeScale = useRef<Vector3>(new Vector3(1, 1, 1));
  const planePosition = useRef<Vector3>(new Vector3(0, 0, 0));
  const target = useRef<HTMLDivElement>(null);
  const resolution = useRef<Vector2>(new Vector2(0, 0));
  const { height, title } = props;

  const resize = (w: number, h: number, s: number) => {
    scale.current = s;
    if (!target.current) return;
    const rect = target.current.getBoundingClientRect();
    // Resolitionを更新する
    resolution.current.set(rect.width * s, rect.height * s);
    // リサイズ時に、planeのScaleを再設定する
    planeScale.current = 
      new Vector3(
        rect.width / s,
        rect.height / s,
        1
      );
    // リサイズ時に、planeのPositionを再設定する
    planePosition.current = 
      new Vector3(
        (rect.left + rect.width * 0.5 - w * 0.5) * s,
        (-rect.top - rect.height * 0.5 + h * 0.5) * s,
        0
      );
  }

  useEffect(() => {
    resize(
      window.innerWidth, 
      window.innerHeight, 
      scale.current
    );
  }, [aspect]);

  console.log("render");
  console.log("scale", scale.current);
  console.log("planeScale", planeScale);
  console.log("planePosition", planePosition);

  return (
    <div ref={target} style={{ height: `${height}px` }}>
      <div className="h-full max-w-full rounded-lg border-2 border-indigo-600">
        {title}
      </div>
      <r3f.In>
        <Object
          planePosition={planePosition}
          planeScale={planeScale}
          target={target.current!} 
          scale={scale} 
        />
      </r3f.In>
    </div>
  )
}