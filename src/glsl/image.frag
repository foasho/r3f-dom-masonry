uniform float uTime;
uniform vec2 uResolution;
uniform float uImageAspect;
uniform float uPlaneAspect;
uniform float uBorderRadius;
uniform float uProgress;
uniform sampler2D uImage;
uniform sampler2D uDisplacement;
varying vec2 vUv;

void main(){
  float progress = uProgress;
  vec4 displace = texture2D(uDisplacement, vUv.yx);
  
  vec2 displacedUV = vec2(
    vUv.x,
    vUv.y
  );
  
  displacedUV.y = mix(vUv.y, displace.r - .2, uProgress);
  
  // 画像のアスペクトとプレーンオブジェクトのアスペクトを比較し、短い方に合わせる
  vec2 ratio=vec2(
    min(uPlaneAspect/uImageAspect,1.),
    min((1./uPlaneAspect)/(1./uImageAspect),1.)
  );

  // 計算結果を用いてテクスチャを中央に配置
  vec2 fixedUv=vec2(
    (vUv.x-.5)*ratio.x+.5,
    (vUv.y-.5)*ratio.y+.5
  );
  
  vec4 color = texture2D(uImage, displacedUV);
  color.r = texture2D(uImage, displacedUV+vec2(0,.005)*progress).r;
  color.g = texture2D(uImage, displacedUV+vec2(0,.01)*progress).g;
  color.b = texture2D(uImage, displacedUV+vec2(0,.02)*progress).b;
  
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
  
  gl_FragColor=vec4(color.rgb, alpha);
}