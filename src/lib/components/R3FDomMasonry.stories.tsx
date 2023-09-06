import React from "react";
import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import { R3FDomMasonry, R3FDomMasonryProps } from "./R3FDomMasonry";

const meta: Meta<typeof R3FDomMasonry> = {
  title: "R3FDomMasonry",
  component: R3FDomMasonry,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    borderColor: {
      control: {
        type: "color",
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          height: "90vh",
          width: "90vw",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof R3FDomMasonry>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultProps: R3FDomMasonryProps = {
  items: [
    {
      element: <div>Dom1</div>,
    },
    {
      element: <div>Dom2</div>,
    },
    {
      element: <div>Dom3</div>,
    },
    {
      element: <div>Dom4</div>,
    },
    {
      element: <div>Dom5</div>,
    },
    {
      element: <div>Dom6</div>,
    },
    {
      element: <div>Dom7</div>,
    },
    {
      element: <div>Dom8</div>,
    },
    {
      element: <div>Dom9</div>,
    },
    {
      element: <div>Dom10</div>,
    },
    {
      element: <div>Dom11</div>,
    },
    {
      element: <div>Dom12</div>,
    },
    {
      element: <div>Dom13</div>,
    },
    {
      element: <div>Dom14</div>,
    },
    {
      element: <div>Dom15</div>,
    },
    {
      element: <div>Dom16</div>,
    },
    {
      element: <div>Dom17</div>,
    },
    {
      element: <div>Dom18</div>,
    },
    {
      element: <div>Dom19</div>,
    },
  ],
  borderColor: "#1f2a33",
  borderWidth: 2,
  borderRadius: 20,
};

const imageItemProps: R3FDomMasonryProps = {
  items: [
    {
      src: "https://picsum.photos/200/300",
    },
    {
      src: "https://picsum.photos/300/300",
    },
    {
      src: "https://picsum.photos/300/200",
    },
    {
      src: "https://picsum.photos/500/300",
    },
    {
      src: "https://picsum.photos/400/300",
    },
    {
      src: "https://picsum.photos/200/300",
    },
    {
      src: "https://picsum.photos/200/300",
    },
    {
      src: "https://picsum.photos/300/300",
    },
    {
      src: "https://picsum.photos/300/200",
    },
    {
      src: "https://picsum.photos/500/300",
    },
    {
      src: "https://picsum.photos/400/300",
    },
    {
      src: "https://picsum.photos/200/300",
    },
    {
      src: "https://picsum.photos/200/300",
    },
    {
      src: "https://picsum.photos/300/300",
    },
    {
      src: "https://picsum.photos/300/200",
    },
    {
      src: "https://picsum.photos/500/300",
    },
    {
      src: "https://picsum.photos/400/300",
    },
    {
      src: "https://picsum.photos/200/300",
    },
    {
      src: "https://picsum.photos/200/300",
    },
    {
      src: "https://picsum.photos/300/300",
    },
    {
      src: "https://picsum.photos/300/200",
    },
    {
      src: "https://picsum.photos/500/300",
    },
    {
      src: "https://picsum.photos/400/300",
    },
    {
      src: "https://picsum.photos/200/300",
    },
  ],
};

const customShaderProps: R3FDomMasonryProps = {
  items: [
    {
      height: 110,
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
      uniform float uBorderRadius;
      varying vec2 vUv;

      void main() {

        // 上下左右のSquare
        vec2 aspect=uResolution/max(uResolution.x,uResolution.y);
        vec2 alphaUv=vUv-.5;
        float borderRadius=min(uBorderRadius,min(uResolution.x,uResolution.y)*.5);
        vec2 offset=vec2(borderRadius)/uResolution;
        vec2 alphaXY=smoothstep(vec2(.5-offset),vec2(.5-offset-.001),abs(alphaUv));
        float alpha=min(1.,alphaXY.x+alphaXY.y);
        
        // 角のborderRadius
        vec2 alphaUv2=abs(vUv-.5);
        float radius=borderRadius/max(uResolution.x,uResolution.y);
        alphaUv2=(alphaUv2-.5)*aspect+radius;
        float roundAlpha=smoothstep(radius+.001,radius,length(alphaUv2));
      
        // 2つを足し合わせる
        alpha=min(1.,alpha+roundAlpha);

        gl_FragColor = vec4(1.0, 0.8, 0.2, alpha);
      }
      `,
    },
    {
      height: 240,
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
      uniform float uBorderRadius;
      varying vec2 vUv;

      /**
       * Line関数
       * @params uv     位置データ
       * @params speed  波の速さ
       * @params height 周波数の高さ
       * @params col    色データ
       */
      vec4 Line(vec2 uv, float speed, float height, vec3 col){
        uv.y += smoothstep(1., 0., abs(uv.x)) * sin(uTime * speed + uv.x * height) * .2;
        return vec4(
          smoothstep(
            .06 * smoothstep(.2, .9, abs(uv.x)), 
            0., 
            abs(uv.y) - .004
          ) * col, 
          1.0) * smoothstep(1., .3, abs(uv.x));
      }

      void main() {

        // 上下左右のSquare
        vec2 aspect=uResolution/max(uResolution.x,uResolution.y);
        vec2 alphaUv=vUv-.5;
        float borderRadius=min(uBorderRadius,min(uResolution.x,uResolution.y)*.5);
        vec2 offset=vec2(borderRadius)/uResolution;
        vec2 alphaXY=smoothstep(vec2(.5-offset),vec2(.5-offset-.001),abs(alphaUv));
        float alpha=min(1.,alphaXY.x+alphaXY.y);
        
        // 角のborderRadius
        vec2 alphaUv2=abs(vUv-.5);
        float radius=borderRadius/max(uResolution.x,uResolution.y);
        alphaUv2=(alphaUv2-.5)*aspect+radius;
        float roundAlpha=smoothstep(radius+.001,radius,length(alphaUv2));
      
        // 2つを足し合わせる
        alpha=min(1.,alpha+roundAlpha);

        vec2 uv = vUv;
        uv -= 0.5; // 中心
        uv.x *= 1.6; // [0:1.6]区画にスケール
        vec4 color = vec4(0.);
        float lattice = 5.0;
        for (float i = 0.; i <= lattice; i += 1.) {
          float lattice = 5.0;
          float t = i / lattice; // [0, 0.25, 0.50, 0.75, 1.0]
          color += Line(
            uv, 
            1. + t,
            4. + t, 
            vec3(
              .2 + t * .7, 
              .2 + t * .4, 
              0.3
            )
          );
        }

        gl_FragColor = vec4(color.rgb, alpha);
      }
      `,
    },
    {
      height: 320,
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
      uniform float uBorderRadius;
      varying vec2 vUv;

      void main() {

        // 上下左右のSquare
        vec2 aspect=uResolution/max(uResolution.x,uResolution.y);
        vec2 alphaUv=vUv-.5;
        float borderRadius=min(uBorderRadius,min(uResolution.x,uResolution.y)*.5);
        vec2 offset=vec2(borderRadius)/uResolution;
        vec2 alphaXY=smoothstep(vec2(.5-offset),vec2(.5-offset-.001),abs(alphaUv));
        float alpha=min(1.,alphaXY.x+alphaXY.y);
        
        // 角のborderRadius
        vec2 alphaUv2=abs(vUv-.5);
        float radius=borderRadius/max(uResolution.x,uResolution.y);
        alphaUv2=(alphaUv2-.5)*aspect+radius;
        float roundAlpha=smoothstep(radius+.001,radius,length(alphaUv2));
      
        // 2つを足し合わせる
        alpha=min(1.,alpha+roundAlpha);

        vec2 uv = vUv;
        // 階段数
        float n = 4.0;
        // 階段数分だけスケールする
        uv *= n;
        // 時間(sin)で境を滑らかに補間したりくっきりしたりする
        float thr = 0.25 * sin(uTime);
        uv = floor(uv) + smoothstep(0.25 + thr, 0.75 - thr, fract(uv));
        // 再び0~1に正規化
        uv /= n;
        // 任意の色リストを作る
        vec3[4] col4 = vec3[](
          vec3(1.0, 1.0, 0.0),
          vec3(0.0, 0.0, 1.0),
          vec3(1.0, 0.0, 1.0),
          vec3(0.0, 1.0, 1.0)
        );
        vec3 col = mix(
          mix(col4[0], col4[1], uv.x),
          mix(col4[2], col4[3], uv.x),
          uv.y
        );

        gl_FragColor = vec4(col, alpha);
      }
      `,
    },
    {
      height: 210,
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
      uniform float uBorderRadius;
      varying vec2 vUv;

      void main() {

        // 上下左右のSquare
        vec2 aspect=uResolution/max(uResolution.x,uResolution.y);
        vec2 alphaUv=vUv-.5;
        float borderRadius=min(uBorderRadius,min(uResolution.x,uResolution.y)*.5);
        vec2 offset=vec2(borderRadius)/uResolution;
        vec2 alphaXY=smoothstep(vec2(.5-offset),vec2(.5-offset-.001),abs(alphaUv));
        float alpha=min(1.,alphaXY.x+alphaXY.y);
        
        // 角のborderRadius
        vec2 alphaUv2=abs(vUv-.5);
        float radius=borderRadius/max(uResolution.x,uResolution.y);
        alphaUv2=(alphaUv2-.5)*aspect+radius;
        float roundAlpha=smoothstep(radius+.001,radius,length(alphaUv2));
      
        // 2つを足し合わせる
        alpha=min(1.,alpha+roundAlpha);

        vec2 uv = vUv;
        // 線形補間グラデーション
        vec3 RED = vec3(1.0, 0.0, 0.0);
        vec3 BLUE = vec3(0.0, 0.0, 1.0);
        // X方向(⇒)に赤から青へ
        vec3 col = mix(RED, BLUE, uv.x);

        gl_FragColor = vec4(col, alpha);
      }
      `,
    },
    {
      height: 360,
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
      uniform float uBorderRadius;
      varying vec2 vUv;

      void main() {

        vec2 uv = vUv;

        // 上下左右のSquare
        vec2 aspect=uResolution/max(uResolution.x,uResolution.y);
        vec2 alphaUv=vUv-.5;
        float borderRadius=min(uBorderRadius,min(uResolution.x,uResolution.y)*.5);
        vec2 offset=vec2(borderRadius)/uResolution;
        vec2 alphaXY=smoothstep(vec2(.5-offset),vec2(.5-offset-.001),abs(alphaUv));
        float alpha=min(1.,alphaXY.x+alphaXY.y);
        
        // 角のborderRadius
        vec2 alphaUv2=abs(vUv-.5);
        float radius=borderRadius/max(uResolution.x,uResolution.y);
        alphaUv2=(alphaUv2-.5)*aspect+radius;
        float roundAlpha=smoothstep(radius+.001,radius,length(alphaUv2));
      
        // 2つを足し合わせる
        alpha=min(1.,alpha+roundAlpha);

        gl_FragColor = vec4(uv.x, uv.y, 1.0, alpha);
      }
      `,
    },
    {
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
      uniform float uBorderRadius;
      varying vec2 vUv;

      void main() {

        // 上下左右のSquare
        vec2 aspect=uResolution/max(uResolution.x,uResolution.y);
        vec2 alphaUv=vUv-.5;
        float borderRadius=min(uBorderRadius,min(uResolution.x,uResolution.y)*.5);
        vec2 offset=vec2(borderRadius)/uResolution;
        vec2 alphaXY=smoothstep(vec2(.5-offset),vec2(.5-offset-.001),abs(alphaUv));
        float alpha=min(1.,alphaXY.x+alphaXY.y);
        
        // 角のborderRadius
        vec2 alphaUv2=abs(vUv-.5);
        float radius=borderRadius/max(uResolution.x,uResolution.y);
        alphaUv2=(alphaUv2-.5)*aspect+radius;
        float roundAlpha=smoothstep(radius+.001,radius,length(alphaUv2));
      
        // 2つを足し合わせる
        alpha=min(1.,alpha+roundAlpha);

        vec2 uv = vUv;
        vec3[4] col4 = vec3[](
          vec3(1.0, 0.3, 0.2), // 左下
          vec3(0.8, 0.7, 0.5), // 右下
          vec3(0.2, 0.5, 0.7), // 左上
          vec3(1.0, 1.0, 0.9)  // 右上
        );
        vec3 col = mix(
          mix(col4[0], col4[1], uv.x), 
          mix(col4[2], col4[3], uv.x), 
          uv.y // Y方向に沿って1つ目のMixと2つ目のMixを変化
        );

        gl_FragColor = vec4(col, alpha);
      }
      `,
    },

    {
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
      uniform float uBorderRadius;
      varying vec2 vUv;

      float PI = 3.1415926;

      /**
       * 偏角を取得
       */
      float atan2(float y, float x){
        if (x == 0.0){
          // Xが0のとき、無限になるため、yが正なら2π、負なら-2π
          return sign(y) * PI / 2.0;
        }
        else {
          return atan(y, x);
        }
      }

      /**
       * 直交座標⇒極座標
       */
      vec2 xy2pol(vec2 xy){
        // length関数は、動径tを取得できる組み込み関数
        return vec2(atan2(xy.y, xy.x), length(xy));
      }

      /**
       * 極座標⇒直交座標
       */
      vec2 pol2xy(vec2 pol){
        return pol.y * vec2(cos(pol.x), sin(pol.x));
      }

      /**
       * プロシージャルテクスチャ
       * s: 偏角 t: 動径
       */
      vec3 tex(vec2 st){
        vec3[3] col3 = vec3[](
          vec3(0.2, 0.6, 1.0),
          vec3(0.4, 0.5, 0.9),
          vec3(fract(cos(uTime*0.5)), 0.7, fract(sin(uTime*0.5)))
        );
        // 偏角の範囲を[0, 2)区間に変換
        st.s = st.s / PI + 1.0;
        // 偏角を配列のインデックスに対応
        int ind = int(st.s);
        // 偏角に沿って、赤、青、赤を補間
        vec3 col = mix(
          col3[ind % 2],
          col3[(ind + 1) % 2],
          fract(st.s)
        );
        return mix(col3[2], col, st.t);
      }

      void main() {

        // 上下左右のSquare
        vec2 aspect=uResolution/max(uResolution.x,uResolution.y);
        vec2 alphaUv=vUv-.5;
        float borderRadius=min(uBorderRadius,min(uResolution.x,uResolution.y)*.5);
        vec2 offset=vec2(borderRadius)/uResolution;
        vec2 alphaXY=smoothstep(vec2(.5-offset),vec2(.5-offset-.001),abs(alphaUv));
        float alpha=min(1.,alphaXY.x+alphaXY.y);
        
        // 角のborderRadius
        vec2 alphaUv2=abs(vUv-.5);
        float radius=borderRadius/max(uResolution.x,uResolution.y);
        alphaUv2=(alphaUv2-.5)*aspect+radius;
        float roundAlpha=smoothstep(radius+.001,radius,length(alphaUv2));
      
        // 2つを足し合わせる
        alpha=min(1.,alpha+roundAlpha);

        vec2 uv = vUv;
        // フラグメント座標範囲を[-1, 1]区間に変換
        uv = 2.0 * uv.xy - vec2(1.0);
        uv = xy2pol(uv);

        gl_FragColor = vec4(tex(uv), alpha);
      }
      `,
    },
    {
      height: 320,
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
      uniform float uBorderRadius;
      varying vec2 vUv;
      float PI = 3.1415926;

      /**
       * 偏角を取得
       */
      float atan2(float y, float x){
        if (x == 0.0){
          // Xが0のとき、無限になるため、yが正なら2π、負なら-2π
          return sign(y) * PI / 2.0;
        }
        else {
          return atan(y, x);
        }
      }
      
      /**
       * 直交座標⇒極座標
       */
      vec2 xy2pol(vec2 xy){
        // length関数は、動径tを取得できる組み込み関数
        return vec2(atan2(xy.y, xy.x), length(xy));
      }
      
      /**
       * 極座標⇒直交座標
       */
      vec2 pol2xy(vec2 pol){
        return pol.y * vec2(cos(pol.x), sin(pol.x));
      }
      
      /**
       * プロシージャルテクスチャ
       * s: 偏角 t: 動径
       */
      vec3 tex(vec2 st){
        float speed = 0.2;
        float time = speed * uTime;
        vec3 circ = vec3(pol2xy(vec2(time, 0.5)) + 0.5, 1.0);
        // スウィズル演算子を使ってcircの成分をずらして3つの色を指定
        vec3[3] col3 = vec3[](
          circ.rgb,
          circ.gbr,
          circ.brg
        );
        // 偏角の範囲を[0, 2)区間に変換
        st.s = st.s / PI + 1.0;
        // 偏角を時間とともに動かす
        st.s += time;
        // 偏角を配列のインデックスに対応
        int ind = int(st.s);
        // 偏角に沿って、赤、青、赤を補間
        vec3 col = mix(
          col3[ind % 2],
          col3[(ind + 1) % 2],
          fract(st.s)
        );
        return mix(col3[2], col, st.t);
      }

      void main() {

        // 上下左右のSquare
        vec2 aspect=uResolution/max(uResolution.x,uResolution.y);
        vec2 alphaUv=vUv-.5;
        float borderRadius=min(uBorderRadius,min(uResolution.x,uResolution.y)*.5);
        vec2 offset=vec2(borderRadius)/uResolution;
        vec2 alphaXY=smoothstep(vec2(.5-offset),vec2(.5-offset-.001),abs(alphaUv));
        float alpha=min(1.,alphaXY.x+alphaXY.y);
        
        // 角のborderRadius
        vec2 alphaUv2=abs(vUv-.5);
        float radius=borderRadius/max(uResolution.x,uResolution.y);
        alphaUv2=(alphaUv2-.5)*aspect+radius;
        float roundAlpha=smoothstep(radius+.001,radius,length(alphaUv2));
      
        // 2つを足し合わせる
        alpha=min(1.,alpha+roundAlpha);

        vec2 uv = vUv;
        // フラグメント座標範囲を[-1, 1]区間に変換
        uv = 2.0 * uv.xy - vec2(1.0);
        uv = xy2pol(uv);
        gl_FragColor = vec4(tex(uv), alpha);
      }
      `,
    },

  ],
};

const Template: StoryFn<typeof R3FDomMasonry> = (args: R3FDomMasonryProps) => (
  <R3FDomMasonry {...args} />
);

const RandomHeightsTemplate: StoryFn<typeof R3FDomMasonry> = (args: R3FDomMasonryProps) => {
  const items = args.items!.map((item) => {
    let randomHeight = Math.random() * 520;
    if (randomHeight < 240) {
      randomHeight = 240;
    }
    return {
      ...item,
      height: randomHeight,
    };
  });
  return <R3FDomMasonry {...args} items={items} />;
};

const ImageTemplate: StoryFn<typeof R3FDomMasonry> = (args: R3FDomMasonryProps) => (
  <R3FDomMasonry {...args} />
);

const ImageRandomHeightsTemplate: StoryFn<typeof R3FDomMasonry> = (args: R3FDomMasonryProps) => {
  const items = args.items!.map((item) => {
    let randomHeight = Math.random() * 520;
    if (randomHeight < 240) {
      randomHeight = 240;
    }
    return {
      ...item,
      height: randomHeight,
    };
  });
  return <R3FDomMasonry {...args} items={items} isBorderRadius={false} />;
};

const ImageDomRandomHeightsTemplate: StoryFn<typeof R3FDomMasonry> = (args: R3FDomMasonryProps) => {
  const items = args.items!.map((item, idx) => {
    let randomHeight = Math.random() * 520;
    if (randomHeight < 240) {
      randomHeight = 240;
    }
    return {
      ...item,
      height: randomHeight,
      element: <div>{`DOM${idx + 1}`}</div>,
    };
  });
  return <R3FDomMasonry {...args} items={items} />;
};

const CustomShaderTemplate: StoryFn<typeof R3FDomMasonry> = (args: R3FDomMasonryProps) => {
  return <R3FDomMasonry {...args} />;
};

/**
 * Plane Geometry && Dom Alignment
 */
export const Default: Story = {
  render: Template,
  args: {
    ...defaultProps,
  },
};

/**
 * Random Heights && Dom Alignment
 */
export const RandomHeights: Story = {
  render: RandomHeightsTemplate,
  args: {
    ...defaultProps,
  },
};

/**
 * Image && Dom Alignment
 */
export const Image: Story = {
  render: ImageTemplate,
  args: {
    ...imageItemProps,
  },
};

/**
 * Image && Random Heights && Dom Alignment
 */
export const ImageRandomHeights: Story = {
  render: ImageRandomHeightsTemplate,
  args: {
    ...imageItemProps,
  },
};

/**
 * Image and Dom Random Heights
 */
export const ImageDomRandomHeights: Story = {
  render: ImageDomRandomHeightsTemplate,
  args: {
    ...imageItemProps,
  },
};

/**
 * Custom Shader
 */
export const CustomShader: Story = {
  render: CustomShaderTemplate,
  args: {
    ...customShaderProps,
  },
};
