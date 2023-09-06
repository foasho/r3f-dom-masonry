uniform float uTime;
uniform vec2 uResolution;
uniform float uBorderRadius;
varying vec2 vUv;

void main(){
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

  // Gray
  gl_FragColor=vec4(.8,.8,.8, alpha);
}