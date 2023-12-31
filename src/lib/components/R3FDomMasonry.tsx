import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  createContext,
  useContext,
  Suspense,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Color,
  ShaderMaterial,
  Vector2,
  Vector3,
  Mesh,
  PerspectiveCamera,
  Texture,
  TextureLoader,
  MathUtils,
  ShaderMaterialParameters,
} from "three";
import { Scene } from "./Scene";
import snoiseFrag from "../glsl/snoise.frag";
import snoiseVert from "../glsl/snoise.vert";
import imageFrag from "../glsl/image.frag";
import imageVert from "../glsl/image.vert";
import initFrag from "../glsl/init.frag";
import initVert from "../glsl/init.vert";
import tunnel from "tunnel-rat";
import { Masonry } from "./Masonry";
import { Preload } from "@react-three/drei";
import {
  UniformsProps,
  appendFragShaderFromUniforms,
  appendVertShaderFromUniforms,
} from "../utils";

export const r3f = tunnel();

const colors = [0x5c6fff, 0xc48aff, 0xff94bd, 0xa9defe, 0xfed462];

type ObjectProps = {
  target: HTMLDivElement;
  planePosition: React.MutableRefObject<Vector3>;
  planeScale: React.MutableRefObject<Vector3>;
  scale?: React.MutableRefObject<number>;
  radius?: number;
  texture?: string;
  displaceTex?: string;
  textureAspect?: number;
  vertexShader?: string;
  fragmentShader?: string;
};
const Object = ({
  target,
  planePosition,
  planeScale,
  scale = useRef<number>(1),
  radius = 20,
  texture = undefined,
  displaceTex = "/displacement.png",
  textureAspect = 1,
  vertexShader = undefined,
  fragmentShader = undefined,
}: ObjectProps) => {
  const [image, setImage] = useState<Texture | null>(null);
  const [displacement, setDisplacement] = useState<Texture | null>(null);
  const { offsetPx, scrollRef, rect: parentRect } = useContext(R3FDomMasonryContext);
  const ref = useRef<Mesh>(null);
  const curScrollTop = useRef<number>(0);
  const shaderMaterial = useMemo(() => {
    const colorIndex = [0, 1, 2, 3, 4];
    // ランダムで色を２つ取得
    let colorIndex1 = colorIndex.splice(Math.floor(colorIndex.length * Math.random()), 1)[0];
    let colorIndex2 = colorIndex.splice(Math.floor(colorIndex.length * Math.random()), 1)[0];

    const uniforms: UniformsProps = {};

    // Common Uniforms
    uniforms.uTime = { value: Math.random() * 10 };
    uniforms.uResolution = { value: new Vector2() };
    uniforms.uBorderRadius = { value: radius };

    if (!image && !fragmentShader && !vertexShader) {
      // Sample Uniforms
      uniforms.uColor1 = { value: new Color(colors[colorIndex1]) };
      uniforms.uColor2 = { value: new Color(colors[colorIndex2]) };
      uniforms.uNoiseScale = { value: Math.random() };
    } else if (!fragmentShader && !vertexShader) {
      // Image Uniforms
      uniforms.uImage = { value: image as Texture };
      uniforms.uDisplacement = { value: image as Texture };
      uniforms.uImageAspect = { value: textureAspect };
      uniforms.uPlaneAspect = { value: 1.0 };
      uniforms.uProgress = { value: 0.0 };
    }
    if (displacement) {
      uniforms.uDisplacement = { value: displacement };
    }
    const shaderMaterial: ShaderMaterialParameters = {
      uniforms: uniforms,
      transparent: true,
    };

    let _f = fragmentShader
      ? appendFragShaderFromUniforms(fragmentShader, { ...uniforms })
      : initFrag;
    let _v = vertexShader ? appendVertShaderFromUniforms(vertexShader, { ...uniforms }) : initVert;

    if (vertexShader) {
      shaderMaterial.vertexShader = _v;
    } else {
      shaderMaterial.vertexShader = image ? imageVert : snoiseVert;
    }
    if (fragmentShader) {
      shaderMaterial.fragmentShader = _f;
    } else {
      shaderMaterial.fragmentShader = image ? imageFrag : snoiseFrag;
    }

    return new ShaderMaterial(shaderMaterial);
  }, [image, displacement, fragmentShader, vertexShader]);

  useEffect(() => {
    if (texture) {
      new TextureLoader().load(texture, (tex) => {
        setImage(tex);
      });
    }
    if (displaceTex) {
      new TextureLoader().load(displaceTex, (tex) => {
        setDisplacement(tex);
      });
    }
  }, [texture, displaceTex]);

  useFrame((_, delta) => {
    // パフォーマンスのため、targetのtopがparentRectのHeightを超えたら、描画しない
    if (target && parentRect && ref.current) {
      const rect = target.getBoundingClientRect();
      if (rect.top > parentRect.height * 1.5 && ref.current.visible) {
        ref.current.visible = false;
        return;
      } else if (!ref.current.visible) {
        ref.current.visible = true;
      }
    }

    // 大きさを合わせる
    if (ref.current && planePosition.current && planeScale.current) {
      // scrollOffsetを考慮して、planeの位置を更新
      const newPosition = planePosition.current.clone();
      if (offsetPx.current > 1) {
        newPosition.add(new Vector3(0, offsetPx.current * scale.current, 0));
      }
      ref.current.position.copy(newPosition);
      ref.current.scale.copy(planeScale.current);
    }

    // ScrollRefとcurScrollTopから、0~1のforceとして取得する
    let force = 0;
    if (scrollRef.current && image) {
      // forceをlerpでゆっくり変化させる
      force = MathUtils.lerp(0, scrollRef.current.scrollTop - curScrollTop.current, 0.1);
      // 0~1に 0~10の間で正規化する
      const uProgress = Math.min(Math.abs(force), 10) / 10;
      // uniformsに設定する
      shaderMaterial.uniforms.uProgress.value = uProgress;
      // 最新のscrollTopを更新
      curScrollTop.current = scrollRef.current.scrollTop;
    }

    // Resolutionを更新
    if (target) {
      const rect = target.getBoundingClientRect();
      shaderMaterial.uniforms.uResolution.value.set(
        rect.width * scale.current,
        rect.height * scale.current
      );
      if (image) {
        shaderMaterial.uniforms.uPlaneAspect.value = rect.width / rect.height;
      }
    }
    shaderMaterial.uniforms.uTime.value += delta;
    if (target) {
      target.style.borderRadius = `${radius}px`;
    }
    if (!image) {
      shaderMaterial.uniforms.uBorderRadius.value = radius * scale.current;
    }
  });

  return (
    <>
      {(!texture || (texture && image)) && (
        <mesh ref={ref}>
          <planeGeometry args={[1, 1]} />
          <primitive attach="material" object={shaderMaterial} />
        </mesh>
      )}
    </>
  );
};

const R3FDomMasonryContext = createContext<{
  isBorderRadius: boolean;
  borderRadius: number;
  borderColor: string;
  borderWidth: number;
  centerDom: boolean;
  scale: React.MutableRefObject<number>;
  fov: number;
  aspect: number;
  rect: DOMRect | null;
  cameraPosition: Vector3;
  offset: React.MutableRefObject<number>;
  offsetPx: React.MutableRefObject<number>;
  scrollRef: React.MutableRefObject<HTMLDivElement | null>;
}>({
  isBorderRadius: true,
  borderRadius: 5,
  borderColor: "#1f2a33",
  borderWidth: 2,
  centerDom: true,
  scale: { current: 1 },
  fov: 52,
  aspect: 1,
  rect: null,
  cameraPosition: new Vector3(0, 0, 300),
  offset: { current: 0 },
  offsetPx: { current: 0 },
  scrollRef: { current: null },
});

export type R3FDomMasonryProps = {
  isBorderRadius?: boolean;
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;
  items?: Array<DomItemProps>;
  columns?: [number, number, number]; // sm, md, lg
  gap?: [number, number, number]; // sm, md, lg
  media?: [number, number, number]; // sm, md, lg
  hideScrollBar?: boolean;
  centerDom?: boolean;
};

export const R3FDomMasonry = ({
  isBorderRadius = true,
  borderRadius = 5,
  borderColor = "#1f2a33",
  borderWidth = 2,
  items = [],
  columns = [1, 2, 3],
  gap = [18, 12, 6],
  media = [640, 768, 1024],
  hideScrollBar = true,
  centerDom = true,
}: R3FDomMasonryProps) => {
  const [renderCount, setRenderCount] = useState<number>(0);
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const offset = useRef<number>(0); // 0~1でスクロールの割合を保持
  const offsetPx = useRef<number>(0); // pxでスクロールの割合を保持
  const scale = useRef<number>(1);
  const fov = 52;
  // const [rect, setRect] = useState<DOMRect | null>(null);
  const [aspect, setAspect] = useState<number>(1);
  const rect = useRef<DOMRect | null>(null);
  // const aspect = useRef<number>(1);
  const cameraPosition = useRef<Vector3>(new Vector3(0, 0, 300));
  const dimentions = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  const initDimensions = useRef<{ width: number; height: number }>({ width: 0, height: 0 });

  const handleScroll = () => {
    // Offsetの計算
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      offset.current = scrollTop / (scrollHeight - clientHeight);
      offsetPx.current = scrollTop;
    }
  };

  const resize = (resizeHeight = false) => {
    if (!ref.current || !canvasRef.current) return;
    // parentとcanvasのサイズを確認
    const dom = ref.current.getBoundingClientRect();
    // dimensionsを更新
    dimentions.current.width = parseInt(dom.width.toFixed());
    dimentions.current.height = parseInt(dom.height.toFixed());

    const _w = dom.width;
    const _h = dom.height;

    // Zの位置を1/2Hを計算し、設定する
    let z = (_h / Math.tan((fov * Math.PI) / 360)) * 0.5;

    cameraPosition.current = new Vector3(0, 0, z);

    // setRect(dom);
    rect.current = dom;
    if (resizeHeight) {
      // 高さが変わる場合は、Canvasの再レンダを発火させる
      setRenderCount((prev) => prev + 1);
    }
    setAspect(_w / _h);
  };

  useEffect(() => {
    resize();
    if (ref.current && initDimensions.current.width === 0) {
      initDimensions.current.width = ref.current.getBoundingClientRect().width;
      initDimensions.current.height = ref.current.getBoundingClientRect().height;
    }
    handleScroll();
    window.addEventListener("resize", () => {
      if (!ref.current) return;
      // 縦幅が変わったときだけ、resizeHeightをtrueにする
      const dom = ref.current.getBoundingClientRect();
      const _dh = parseInt(dom.height.toFixed());
      const _dw = parseInt(dom.width.toFixed());
      if (_dh != dimentions.current.height) {
        resize(true);
      } else if (_dw != dimentions.current.width) {
        resize();
      }
    });
    // スクロールイベントの登録
    if (scrollRef.current) {
      scrollRef.current.addEventListener("scroll", handleScroll);
    }
    // ScrollBarの非表示
    let styleSheet: HTMLStyleElement | null = null;
    if (hideScrollBar) {
      styleSheet = document.createElement("style");
      styleSheet.innerText = "#R3FDomMasonryScroll::-webkit-scrollbar { display: none; }";
      document.head.appendChild(styleSheet);
    }
    const commonStyle = document.createElement("style");
    commonStyle.innerText = `
      *,
      ::before,
      ::after {
        box-sizing: border-box;
        border-width: 0;
        border-style: solid;
        border-color: #e5e7eb;
      }
    `;

    document.head.appendChild(commonStyle);
    return () => {
      window.removeEventListener("resize", () => resize);
      if (scrollRef.current) {
        scrollRef.current.removeEventListener("scroll", handleScroll);
      }
      if (hideScrollBar && styleSheet) {
        document.head.removeChild(styleSheet);
      }
      document.head.removeChild(commonStyle);
    };
  }, []);

  // itemsをグリッドに分割するロジック
  const chunkedItems: DomItemProps[][] = [];
  let chunk: DomItemProps[] = [];

  items.forEach((item, index) => {
    chunk.push(item);
    if ((index + 1) % 3 === 0 || index === items.length - 1) {
      chunkedItems.push(chunk);
      chunk = [];
    }
  });

  const loadingStyle: React.CSSProperties = {
    height: "100%",
    padding: "0 0.5rem",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <R3FDomMasonryContext.Provider
      value={{
        isBorderRadius: isBorderRadius,
        borderRadius: borderRadius,
        borderWidth: borderWidth,
        borderColor: borderColor,
        centerDom: centerDom,
        scale: scale,
        fov: fov,
        aspect: aspect,
        rect: rect.current,
        cameraPosition: cameraPosition.current,
        offset: offset,
        offsetPx: offsetPx,
        scrollRef: scrollRef,
      }}
    >
      <div
        ref={ref}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        <Suspense
          fallback={
            <div style={loadingStyle}>
              <img src={"/loading.gif"} />
            </div>
          }
        >
          <Canvas
            key={renderCount}
            ref={canvasRef}
            shadows
            gl={{
              antialias: true,
              alpha: true,
            }}
            camera={{
              fov: fov,
              aspect: aspect,
              near: 0.01,
              far: 10000,
              position: cameraPosition.current,
            }}
          >
            <Scene>
              <CanvasSystem />
              <r3f.Out />
              <Preload all />
            </Scene>
          </Canvas>
          {/** Dom */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 1,
              alignItems: "center",
            }}
          >
            <div
              ref={scrollRef}
              id="R3FDomMasonryScroll"
              style={{
                overflowY: "auto",
                overflowX: "hidden",
                height: "100%",
                width: "100%",
                msOverflowStyle: "none" /* IE, Edge 対応 */,
                scrollbarWidth: "none" /* Firefox 対応 */,
                WebkitOverflowScrolling: "touch",
              }}
            >
              <Masonry
                items={items}
                config={{
                  columns: columns,
                  gap: gap,
                  media: media,
                }}
                render={(item, index) => <DomItem key={index} {...item} />}
              ></Masonry>
            </div>
          </div>
        </Suspense>
      </div>
    </R3FDomMasonryContext.Provider>
  );
};

/**
 * CameraのAspectを更新するカメラシステムコンポネント
 */
const CanvasSystem = () => {
  const { camera } = useThree();
  const { aspect, rect } = useContext(R3FDomMasonryContext);

  useEffect(() => {
    (camera as PerspectiveCamera).aspect = aspect;
    camera.updateProjectionMatrix();
  }, [aspect, rect]);

  return <></>;
};

export type DomItemProps = {
  height?: number;
  element?: React.JSX.Element;
  src?: string;
  vertexShader?: string;
  fragmentShader?: string;
};
const DomItem = ({
  height = 250,
  element = <div></div>,
  src,
  vertexShader,
  fragmentShader,
}: DomItemProps) => {
  const {
    isBorderRadius,
    borderRadius,
    borderWidth,
    borderColor,
    centerDom,
    aspect,
    scale,
    rect: parentRect,
    offsetPx,
  } = useContext(R3FDomMasonryContext);
  const [ready, setReady] = useState<boolean>(false);
  const planeScale = useRef<Vector3>(new Vector3(1, 1, 1));
  const planePosition = useRef<Vector3>(new Vector3(0, 0, 0));
  const target = useRef<HTMLDivElement>(null);
  const resolution = useRef<Vector2>(new Vector2(0, 0));
  const [textureAspect, setTextureAspect] = useState<number>(1);

  const resize = (w: number, h: number, s: number) => {
    scale.current = s;
    if (!target.current || !parentRect) return;
    const rect = target.current.getBoundingClientRect();
    // Resolitionを更新する
    resolution.current.set(rect.width * s, rect.height * s);
    // rect.heightが変更されたときにScaleが合わない。
    planeScale.current = new Vector3(rect.width / s, rect.height / s, 1);

    // リサイズ時に、planeのPositionを再設定する
    // parentRectも考慮する
    const newPlanePositionX = (rect.left - parentRect.left + rect.width * 0.5 - w * 0.5) * s;
    let newPlanePositionY = (-rect.top + parentRect.top - rect.height * 0.5 + h * 0.5) * s;
    planePosition.current = new Vector3(newPlanePositionX, newPlanePositionY, 0);
    // scrollOffsetを考慮して、planeの位置を更新
    if (offsetPx.current > 1) {
      planePosition.current.sub(new Vector3(0, offsetPx.current * scale.current, 0));
    }
  };

  useEffect(() => {
    if (!parentRect) return;
    resize(parentRect.width, parentRect.height, scale.current);
    (async () => {
      // テクスチャのアスペクト比を取得する
      if (src) {
        const image = new Image();
        image.src = src;
        image.onload = () => {
          setTextureAspect(image.width / image.height);
          setReady(true);
        };
      } else {
        setReady(true);
      }
    })();
    return () => {
      setReady(false);
    };
  }, [aspect, parentRect]);

  let domStyle: React.CSSProperties = {
    height: "100%",
    padding: "0 0.5rem",
    position: "relative",
  };
  if (isBorderRadius) {
    domStyle = {
      ...domStyle,
      borderRadius: `${borderRadius}px`,
      borderWidth: `${borderWidth}px`,
      borderColor: `${borderColor}`,
      borderStyle: "solid",
    };
    // 中央配置にする
    if (centerDom) {
      domStyle.display = "flex";
      domStyle.justifyContent = "center";
      domStyle.alignItems = "center";
    }
  }

  return (
    <div ref={target} style={{ height: `${height}px` }}>
      {!ready && (
        <div style={domStyle}>
          <img src={"/loading.gif"} />
        </div>
      )}
      {ready && <div style={domStyle}>{element}</div>}
      <r3f.In>
        {ready && parentRect && (
          <Object
            planePosition={planePosition}
            planeScale={planeScale}
            target={target.current!}
            scale={scale}
            radius={borderRadius}
            texture={src}
            textureAspect={textureAspect}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
          />
        )}
      </r3f.In>
    </div>
  );
};
