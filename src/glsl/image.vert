varying vec2 vUv;
uniform float uTime;

float PI = 3.1415926535897932384626433832795;

void main(){
    vUv = uv;
    vec3 pos = position;

    // 横方向
    float amp = 0.03; // 振幅（の役割） 大きくすると波が大きくなる
    float freq = 0.01 * uTime; // 振動数（の役割） 大きくすると波が細かくなる

    // 縦方向
    float tension = -0.001 * uTime; // 上下の張り具合

    pos.x = pos.x + sin(pos.y * PI  * freq) * amp;
    pos.y = pos.y + (cos(pos.x * PI) * tension);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}