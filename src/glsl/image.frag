uniform float uTime;
uniform vec2 uResolution;
uniform float uImageAspect;
uniform float uPlaneAspect;
uniform float uBorderRadius;
uniform sampler2D uTexture;
varying vec2 vUv;

void main(){
  // 画像のアスペクトとプレーンオブジェクトのアスペクトを比較し、短い方に合わせる
  vec2 ratio=vec2(
    min(uPlaneAspect/uImageAspect,1.),
    min((1./uPlaneAspect)/(1./uImageAspect),1.)
  );
  // vec2 ratio = uResolution.xy / min(uResolution.x, uResolution.y);
  
  // 計算結果を用いてテクスチャを中央に配置
  vec2 fixedUv=vec2(
    (vUv.x-.5)*ratio.x+.5,
    (vUv.y-.5)*ratio.y+.5
  );
  
  vec2 os=vec2(0.,uTime*.0005);
  float r=texture2D(uTexture,fixedUv+os).r;
  float g=texture2D(uTexture,fixedUv+os*.5).g;
  float b=texture2D(uTexture,fixedUv).b;
  vec3 texture=vec3(r,g,b);
  
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
  
  gl_FragColor=vec4(texture,alpha);
}