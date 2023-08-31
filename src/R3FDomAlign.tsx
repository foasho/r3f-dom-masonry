import React, { useEffect, useMemo, useState, useRef, createContext, useContext } from "react";
import {
  Canvas,
  useFrame,
  useThree
} from "@react-three/fiber";
import { Color, ShaderMaterial, Vector2, Vector3, Mesh, PerspectiveCamera } from "three";
import { r3f } from "./Helper";
import { Scene } from "./Scene";

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
      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
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
        varying vec2 vUv;
        
        
        vec4 permute(vec4 x){return mod(x*x*34.0+x,289.);}
        vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
        
        float snoise3D(vec3 v){
          const vec2  C = vec2(0.166666667, 0.33333333333) ;
          const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i  = floor(v + dot(v, C.yyy) );
          vec3 x0 = v - i + dot(i, C.xxx) ;
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min( g.xyz, l.zxy );
          vec3 i2 = max( g.xyz, l.zxy );
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod(i,289.);
          vec4 p = permute( permute( permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
          vec3 ns = 0.142857142857 * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = floor(j - 7.0 * x_ ) *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4( x.xy, y.xy );
          vec4 b1 = vec4( x.zw, y.zw );
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
          vec3 p0 = vec3(a0.xy,h.x);
          vec3 p1 = vec3(a0.zw,h.y);
          vec3 p2 = vec3(a1.xy,h.z);
          vec3 p3 = vec3(a1.zw,h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m * m;
          return 42.0 * dot( m, vec4( dot(p0,x0), dot(p1,x1),dot(p2,x2), dot(p3,x3) ) );
        }
        
        
        void main(){
          // Colorを作成する
          vec2 aspect = uResolution / max(uResolution.x, uResolution.y);
          float speed = 0.5;
          float time = uTime * speed;
          vec2 st = vUv;
          // st -= 0.5;
          // st *= aspect;
          // st *= mix(0.5, 1.0, uNoiseScale);
          // st += 0.5;
          float noise = snoise3D(vec3(st, time));
          float colorFactor = noise * 0.5 + 0.5;
          vec3 color = mix(uColor1, uColor2, colorFactor);

          // 上下左右のSquare
          vec2 alphaUv = vUv - 0.5;
          float borderRadius = min(uBorderRadius, min(uResolution.x, uResolution.y) * 0.5);
          vec2 offset = vec2(borderRadius) / uResolution;
          vec2 alphaXY = smoothstep(vec2(0.5 - offset), vec2(0.5 - offset - 0.001), abs(alphaUv));
          float alpha = min(1.0, alphaXY.x + alphaXY.y);
        
          // 角のborderRadius
          vec2 alphaUv2 = abs(vUv - 0.5);
          float radius = borderRadius / max(uResolution.x, uResolution.y);
          alphaUv2 = (alphaUv2 - 0.5) * aspect + radius;
          float roundAlpha = smoothstep(radius + 0.001, radius, length(alphaUv2));
        
          alpha = min(1.0, alpha + roundAlpha);
        
          gl_FragColor = vec4(color, alpha);
        }
      `,
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
  type: "image" | "video" | "element";
  element?: React.JSX.Element;
  src?: string;
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
  const { height, type, element, src } = props;

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