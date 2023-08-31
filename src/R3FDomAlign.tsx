import React, { useEffect, useMemo, useState, useRef, createContext, useContext } from "react";
import {
  Canvas,
  useFrame,
  useThree
} from "@react-three/fiber";
import { Color, ShaderMaterial, Vector2, Vector3, Mesh, PerspectiveCamera } from "three";
import { r3f } from "./Helper";
import { Scene } from "./Scene";
import { ScrollEventProvider } from "./useScrollEvent";
// 本家のSimplexNoize: 著(Nakano Misaki)
import snoiseFrag from "./glsl/snoise.frag";
import snoiseVert from "./glsl/snoise.vert";
// Image: 著(かまぼこ)
import imageFrag from "./glsl/image.frag";
import imageVert from "./glsl/image.vert";

const colors = [
  0x5c6fff,
  0xc48aff,
  0xff94bd,
  0xa9defe,
  0xfed462
]

interface ObjectProps {
  target: HTMLDivElement;
  planePosition: React.MutableRefObject<Vector3>;
  planeScale: React.MutableRefObject<Vector3>;
  scale?: React.MutableRefObject<number>;
  radius?: number;
}
const Object = (
  {
    target,
    planePosition,
    planeScale,
    scale = useRef<number>(1),
    radius = 20,
  }: ObjectProps
) => {

  const ref = useRef<Mesh>(null);
  const shaderMaterial = useMemo(() => {
    const colorIndex = [0, 1, 2, 3, 4];
    // ランダムで色を２つ取得
    let colorIndex1 = colorIndex.splice(Math.floor(colorIndex.length * Math.random()), 1)[0]
    let colorIndex2 = colorIndex.splice(Math.floor(colorIndex.length * Math.random()), 1)[0]

    return new ShaderMaterial({
      uniforms: {
        uTime: { value: Math.random() * 10 },
        uResolution: { value: new Vector2() },
        uNoiseScale: { value: Math.random() },
        uColor1: { value: new Color(colors[colorIndex1]) },
        uColor2: { value: new Color(colors[colorIndex2]) },
        uBorderRadius: { value: radius },
      },
      vertexShader: snoiseVert,
      fragmentShader: snoiseFrag,
      transparent: true,
    });
  }, []);

  useFrame((state, delta) => {
    if (
      ref.current &&
      planePosition.current &&
      planeScale.current
    ){
      ref.current.position.copy(planePosition.current);
      ref.current.scale.copy(planeScale.current);
    }
    // Resolutionを更新
    if (target){
      const rect = target.getBoundingClientRect();
      shaderMaterial.uniforms.uResolution.value.set(
        rect.width * scale.current, rect.height * scale.current
      );
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
      <primitive attach="material" object={shaderMaterial} />
    </mesh>
  )
}

const R3FDomAlignContext = createContext<{
  scale: React.MutableRefObject<number>;
  fov: number;
  aspect: number;
  rect: DOMRect | null;
  isCameraFixed: boolean;
  cameraPosition: Vector3;
  setCameraPosition: (position: Vector3) => void;
}>({
  scale: { current: 1 },
  fov: 52,
  aspect: 1,
  rect: null,
  isCameraFixed: false,
  cameraPosition: new Vector3(0, 0, 300),
  setCameraPosition: () => {},
});

export interface R3FDomAlignProps {
  isBorderRadius?: boolean;
  borderRadius?: number;
  borderColor?: string;
  items: Array<DomItemProps>;
}

export const R3FDomAlign = ({ ...props }: R3FDomAlignProps) => {
  
  const ref = useRef<HTMLDivElement>(null);
  const scale = useRef<number>(1);
  const fov = 52;
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [aspect, setAspect] = useState<number>(1);
  const [isCameraFixed, setIsCameraFixed] = useState<boolean>(false);
  const [cameraPosition, setCameraPosition] = useState<Vector3>(new Vector3(0, 0, 300));
  const dimensions = useRef<Vector2>(new Vector2(0, 0));

  const resize = () => {
    if (!ref.current) return;
    const { current } = ref;
    const dom = current.getBoundingClientRect();
    const _w = dom.width;
    const _h = dom.height;
    dimensions.current.set(_w, _h);

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
    setAspect(_w / _h);
    setRect(dom);
  }

  useEffect(() => {
    resize();
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
      rect: rect,
      isCameraFixed: isCameraFixed,
      cameraPosition: cameraPosition,
      setCameraPosition: setCameraPosition,
    }}>
      <ScrollEventProvider>
        <div ref={ref} className="w-full h-full relative">
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
            <Scene isOrbit={false} isGizmo={false}>
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
              width: "100%",
              height: "100vh",
              zIndex: 1,
              alignItems: "center",
            }}
          >
            <div className={`grid grid-cols-2 md:grid-cols-3 gap-4`}>
              {chunkedItems.map((itemChunk, chunkIndex) => (
                <div className="grid gap-4" key={chunkIndex}>
                  {itemChunk.map((item: any, itemIndex: any) => (
                    <DomItem key={itemIndex} {...item} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollEventProvider>
    </R3FDomAlignContext.Provider>
  )
}

/**
 * CameraのAspectを更新するシステムコンポネント
 */
const CanvasSystem = () => {

  const { camera } = useThree();
  const { aspect } = useContext(R3FDomAlignContext);

  useEffect(() => {
    (camera as PerspectiveCamera).aspect = aspect;
    camera.updateProjectionMatrix();
  }, [aspect]);

  return (<></>)
}

export interface DomItemProps {
  height: number;
  type: "image" | "element";
  element?: React.JSX.Element;
  src?: string;
  vertexShader?: string;
  fragmentShader?: string;
}
const DomItem = ({...props}: DomItemProps) => {

  const { 
    aspect,
    scale,
    rect: parentRect
  } = useContext(R3FDomAlignContext);

  const planeScale = useRef<Vector3>(new Vector3(1, 1, 1));
  const planePosition = useRef<Vector3>(new Vector3(0, 0, 0));
  const target = useRef<HTMLDivElement>(null);
  const resolution = useRef<Vector2>(new Vector2(0, 0));
  const { height, type, element, src, vertexShader, fragmentShader } = props;

  const resize = (w: number, h: number, s: number) => {
    scale.current = s;
    if (!target.current || !parentRect) return;
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
    // parentRectも考慮する
    planePosition.current = 
      new Vector3(
        (rect.left - parentRect.left + rect.width * 0.5 - w * 0.5) * s,
        (-rect.top + parentRect.top - rect.height * 0.5 + h * 0.5) * s,
        0
      );
  }

  useEffect(() => {
    if (!parentRect) return;
    resize(
      parentRect.width,
      parentRect.height,
      scale.current
    );
  }, [aspect, parentRect]);

  return (
    <div ref={target} style={{ height: `${height}px` }}>
      <div 
        className="h-full px-2 max-w-full border-2 border-indigo-600"
        style={{
          borderRadius: "20px",
        }}
      >
        {type === "element" && element &&
          element
        }
      </div>
      <r3f.In>
        {parentRect &&
          <Object
            planePosition={planePosition}
            planeScale={planeScale}
            target={target.current!} 
            scale={scale} 
          />
        }
      </r3f.In>
    </div>
  )
}