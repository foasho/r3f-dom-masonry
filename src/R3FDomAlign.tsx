import React, { useEffect, useMemo, useState, useRef, createContext, useContext } from "react";
import {
  Canvas,
  useFrame,
  useThree
} from "@react-three/fiber";
import { Color, ShaderMaterial, Vector2, Vector3, Mesh, PerspectiveCamera, Texture, TextureLoader } from "three";
import { r3f } from "./Helper";
import { Scene } from "./Scene";
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
];

export interface UniformsProps {
  [Key: string]: { value: number };
}

interface ObjectProps {
  target: HTMLDivElement;
  planePosition: React.MutableRefObject<Vector3>;
  planeScale: React.MutableRefObject<Vector3>;
  scale?: React.MutableRefObject<number>;
  radius?: number;
  texture?: string;
  textureAspect?: number;
}
const Object = (
  {
    target,
    planePosition,
    planeScale,
    scale = useRef<number>(1),
    radius = 20,
    texture = undefined,
    textureAspect = 1,
  }: ObjectProps
) => {
  const [tex, setTex] = useState<Texture|null>(null);
  const { offsetPx } = useContext(R3FDomAlignContext);
  const ref = useRef<Mesh>(null);
  const shaderMaterial = useMemo(() => {
    const colorIndex = [0, 1, 2, 3, 4];
    // ランダムで色を２つ取得
    let colorIndex1 = colorIndex.splice(Math.floor(colorIndex.length * Math.random()), 1)[0];
    let colorIndex2 = colorIndex.splice(Math.floor(colorIndex.length * Math.random()), 1)[0];

    const uniforms: {[x: string]: { value: any }} = {
      uTime: { value: Math.random() * 10 },
      uResolution: { value: new Vector2() },
      uBorderRadius: { value: radius },
      uTexture: { value: tex },
    };

    if (!tex){
      uniforms.uColor1 = { value: new Color(colors[colorIndex1]) };
      uniforms.uColor2 = { value: new Color(colors[colorIndex2]) };
      uniforms.uNoiseScale = { value: Math.random() };
    }
    else {
      uniforms.uTexture = { value: tex };
      uniforms.uImageAspect = { value: textureAspect };
      uniforms.uPlaneAspect = { value: 1.0 };
    }

    return new ShaderMaterial({
      uniforms: uniforms,
      vertexShader: tex? imageVert: snoiseVert,
      fragmentShader: tex? imageFrag: snoiseFrag,
      transparent: true,
    });
  }, [tex]);

  useEffect(() => {
    if (texture){
      new TextureLoader().load(texture, (tex) => {
        setTex(tex);
      });
    }
  }, [texture]);

  useFrame((_, delta) => {
    if (
      ref.current &&
      planePosition.current &&
      planeScale.current
    ){
      // scrollOffsetを考慮して、planeの位置を更新
      const newPosition = planePosition.current.clone();
      if (offsetPx.current > 1){
        newPosition.add(new Vector3(0, offsetPx.current * scale.current, 0));
      }
      ref.current.position.copy(newPosition);
      ref.current.scale.copy(planeScale.current);
    }
    // Resolutionを更新
    if (target){
      const rect = target.getBoundingClientRect();
      shaderMaterial.uniforms.uResolution.value.set(
        rect.width * scale.current, rect.height * scale.current
      );
      if (tex){
        shaderMaterial.uniforms.uPlaneAspect.value = rect.width  / rect.height;
      }
    }
    shaderMaterial.uniforms.uTime.value += delta;
    if (target){
      target.style.borderRadius = `${radius}px`;
    }
    if (!tex){
      shaderMaterial.uniforms.uBorderRadius.value = radius * scale.current;
    }
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
  isBorderRadius: boolean;
  borderRadius: number;
  borderColor: string;
  borderWidth: number;
  scale: React.MutableRefObject<number>;
  fov: number;
  aspect: number;
  rect: DOMRect | null;
  cameraPosition: Vector3;
  setCameraPosition: (position: Vector3) => void;
  offset: React.MutableRefObject<number>;
  offsetPx: React.MutableRefObject<number>;
}>({
  isBorderRadius: true,
  borderRadius: 5,
  borderColor: "#1f2a33",
  borderWidth: 2,
  scale: { current: 1 },
  fov: 52,
  aspect: 1,
  rect: null,
  cameraPosition: new Vector3(0, 0, 300),
  setCameraPosition: () => {},
  offset: { current: 0 },
  offsetPx: { current: 0 },
});

export interface R3FDomAlignProps {
  isBorderRadius?: boolean;
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;
  items: Array<DomItemProps>;
}

export const R3FDomAlign = ({ ...props }: R3FDomAlignProps) => {
  const isBorderRadius = props.isBorderRadius ? props.isBorderRadius : true;
  const borderRadius = props.borderRadius ? props.borderRadius : 5;
  const borderWidth = props.borderWidth ? props.borderWidth : 2;
  const borderColor = props.borderColor ? props.borderColor : "#1f2a33";
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const offset = useRef<number>(0);  // 0~1でスクロールの割合を保持
  const offsetPx = useRef<number>(0);  // pxでスクロールの割合を保持
  const scale = useRef<number>(1);
  const fov = 52;
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [aspect, setAspect] = useState<number>(1);
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
    let z = _h / Math.tan(fov * Math.PI / 360) * 0.5;


    setCameraPosition(new Vector3(0, 0, z));
    scale.current = 1;

    // 再レンダを発火させる
    setAspect(_w / _h);
    setRect(dom);
  }

  const handleScroll = () => {
    // Offsetの計算
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      offset.current = scrollTop / (scrollHeight - clientHeight);
      offsetPx.current = scrollTop;
    }
  };

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    handleScroll();
    // スクロールイベントの登録
    if (scrollRef.current) {
      scrollRef.current.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener("scroll", handleScroll);
      }
    };
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
      isBorderRadius: isBorderRadius,
      borderRadius: borderRadius,
      borderWidth: borderWidth,
      borderColor: borderColor,
      scale: scale,
      fov: fov,
      aspect: aspect,
      rect: rect,
      cameraPosition: cameraPosition,
      setCameraPosition: setCameraPosition,
      offset : offset,
      offsetPx: offsetPx,
    }}>
        <div 
          ref={ref} 
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
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
            <Scene>
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
              <div
                ref={scrollRef}
                id="R3FDomAlignScroll"
                style={{
                  overflowY: "auto",
                  overflowX: "hidden",
                  height: "100%",
                  width: "100%",
                  msOverflowStyle: "none", /* IE, Edge 対応 */
                  scrollbarWidth: "none",  /* Firefox 対応 */
                  WebkitOverflowScrolling: "touch",
                }}
              >
              <div className={"r3fDomAlignGrid"}>
                {chunkedItems.map((itemChunk, chunkIndex) => (
                  <div key={chunkIndex} style={
                    {
                      display: "grid",
                      gap: "1rem",
                      paddingTop: "2px",
                      margin: 0,
                    }
                  }>
                    {itemChunk.map((item: any, itemIndex: any) => (
                      <DomItem key={itemIndex} {...item} />
                    ))}
                  </div>
                ))}
              </div>
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
  type: "image" | "element";
  element?: React.JSX.Element;
  src?: string;
  vertexShader?: string;
  fragmentShader?: string;
}
const DomItem = ({...props}: DomItemProps) => {

  const { 
    isBorderRadius,
    borderRadius,
    borderWidth,
    borderColor,
    aspect,
    scale,
    rect: parentRect,
    offsetPx,
  } = useContext(R3FDomAlignContext);
  const [ready, setReady] = useState<boolean>(false);
  const planeScale = useRef<Vector3>(new Vector3(1, 1, 1));
  const planePosition = useRef<Vector3>(new Vector3(0, 0, 0));
  const target = useRef<HTMLDivElement>(null);
  const resolution = useRef<Vector2>(new Vector2(0, 0));
  const [textureAspect, setTextureAspect] = useState<number>(1);
  const { height, element, src } = props;

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
    const newPlanePositionX = (rect.left - parentRect.left + rect.width * 0.5 - w * 0.5) * s;
    let newPlanePositionY = (-rect.top + parentRect.top - rect.height * 0.5 + h * 0.5) * s;
    planePosition.current = 
      new Vector3(
        newPlanePositionX,
        newPlanePositionY,
        0
      );
    if (offsetPx.current > 1){
      planePosition.current.sub(new Vector3(0, offsetPx.current * scale.current, 0));
    }
  }

  useEffect(() => {
    if (!parentRect) return;
    resize(
      parentRect.width,
      parentRect.height,
      scale.current
    );
    (async () => {
      // テクスチャのアスペクト比を取得する
      if (src){
        const image = new Image();
        image.src = src;
        image.onload = () => {
          setTextureAspect(image.width / image.height);
          setReady(true);
        }
      }
      else {
        setReady(true);
      }
    })();
  }, [aspect, parentRect]);

  return (
    <div ref={target} style={{ height: `${height}px` }}>
      <div 
        style={{
          height: "100%",
          padding: "0 0.5rem",
          maxWidth: "100%",
          position: "relative",
          borderColor: borderColor,
          borderRadius: borderRadius,
          borderWidth: borderWidth,
          borderStyle: isBorderRadius? "solid": "none",
          outlineOffset: `-${borderWidth}px`,
        }}
      >
        {element}
      </div>
      <r3f.In>
        {ready && parentRect &&
          <Object
            planePosition={planePosition}
            planeScale={planeScale}
            target={target.current!} 
            scale={scale}
            radius={borderRadius}
            texture={src}
            textureAspect={textureAspect}
          />
        }
      </r3f.In>
    </div>
  )
}