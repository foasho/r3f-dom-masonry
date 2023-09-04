uniform float uTime;
uniform vec2 uResolution;
uniform float uNoiseScale;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uBorderRadius;
varying vec2 vUv;

vec4 permute(vec4 x){return mod(x*x*34.+x,289.);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}

float snoise3D(vec3 v){
  const vec2 C=vec2(.166666667,.33333333333);
  const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod(i,289.);
  vec4 p=permute(permute(permute(
        i.z+vec4(0.,i1.z,i2.z,1.))
        +i.y+vec4(0.,i1.y,i2.y,1.))
        +i.x+vec4(0.,i1.x,i2.x,1.));
        vec3 ns=.142857142857*D.wyz-D.xzx;
        vec4 j=p-49.*floor(p*ns.z*ns.z);
        vec4 x_=floor(j*ns.z);
        vec4 x=x_*ns.x+ns.yyyy;
        vec4 y=floor(j-7.*x_)*ns.x+ns.yyyy;
        vec4 h=1.-abs(x)-abs(y);
        vec4 b0=vec4(x.xy,y.xy);
        vec4 b1=vec4(x.zw,y.zw);
        vec4 s0=floor(b0)*2.+1.;
        vec4 s1=floor(b1)*2.+1.;
        vec4 sh=-step(h,vec4(0.));
        vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
        vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
        vec3 p0=vec3(a0.xy,h.x);
        vec3 p1=vec3(a0.zw,h.y);
        vec3 p2=vec3(a1.xy,h.z);
        vec3 p3=vec3(a1.zw,h.w);
        vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
        p0*=norm.x;
        p1*=norm.y;
        p2*=norm.z;
        p3*=norm.w;
        vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
        m=m*m*m;
        return 42.*dot(m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
      }
      
      void main(){
        // Colorを作成する
        vec2 aspect=uResolution/max(uResolution.x,uResolution.y);
        float speed=.5;
        float time=uTime*speed;
        vec2 st=vUv;
        // st -= 0.5;
        // st *= aspect;
        // st *= mix(0.5, 1.0, uNoiseScale);
        // st += 0.5;
        float noise=snoise3D(vec3(st,time));
        float colorFactor=noise*.5+.5;
        vec3 color=mix(uColor1,uColor2,colorFactor);
        
        // 上下左右のSquare
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
        
        alpha=min(1.,alpha+roundAlpha);
        
        gl_FragColor=vec4(color,alpha);
      }