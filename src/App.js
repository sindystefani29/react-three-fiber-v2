import "./styles.css";
import { Canvas } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Suspense, useEffect, useRef, useCallback } from "react";

const Model = () => {
  const meshRef = useRef()
  const gltf = useLoader(GLTFLoader, "https://assets.tokopedia.net/asts/pdp/webxr/N01_Oak.gltf");
  // useFrame(() => meshRef.current.rotation.y += 0.01)

  const animate = useCallback(() => {
    requestAnimationFrame(animate);

    meshRef.current.rotation.y += 0.01
  }, [meshRef])

  useEffect(() => {
    animate()
  }, [animate])

  return (
    <mesh ref={meshRef}>
      <primitive object={gltf.scene} scale={1} />
    </mesh>
  );
};

export default function App() {
  return (
    <div className="App">
      <Canvas>
        <Suspense fallback={null}>
          <Model />
          <OrbitControls />
          <ambientLight intensity={0.9} />
          <pointLight intensity={1.12} position={[0, 0, 0]} />
        </Suspense>
      </Canvas>
    </div>
  );
}
