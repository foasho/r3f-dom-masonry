import { Canvas } from "@react-three/fiber";
import { MyShader } from "./MyShader";
import { Scene } from "./Scene";

function App() {
  return (
    <>
      <Canvas 
        shadows
        camera={
          {
            fov: 30,
          }
        }
      >
        <Scene>
          <MyShader />
        </Scene>
      </Canvas>
    </>
  )
}

export default App
