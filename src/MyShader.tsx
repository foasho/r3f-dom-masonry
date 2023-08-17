import { useFrame } from "@react-three/fiber";
import { ShaderMaterial } from "three";
import vertex from "./glsl/wave.vert";
import fragment from "./glsl/wave.frag";

export const MyShader = () => {

  const material = new ShaderMaterial({
    uniforms: {
      u_time: { value: 0 }
    },
    vertexShader: vertex,
    fragmentShader: fragment,
  });

  useFrame((state, delta) => {
    // 時間だけは更新させる
    material.uniforms.u_time.value = state.clock.getElapsedTime()
  })

  return (
    <mesh>
      <planeGeometry />
      <primitive attach="material" object={material} />
    </mesh>
  )
}