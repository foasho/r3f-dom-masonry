varying vec2 vUv;
uniform float u_time;

void main() {
  vec2 uv = vUv;

  // 波紋エフェクトの中心
  vec2 center = vec2(0.5, 0.5);

  // エフェクトの距離と強度を計算
  float dist = distance(uv, center);
  float strength = 0.3 * sin(2.0 * 3.141592 * dist - u_time * 3.0) / dist;

  // 色を計算
  vec3 color = vec3(0.0, 0.0, 1.0) * strength + vec3(0.0, 0.0, 1.0);

  gl_FragColor = vec4(color, 1.0);
}