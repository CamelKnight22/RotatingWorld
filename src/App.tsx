import { Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ScrollControls,
  useScroll,
  useGLTF,
  useAnimations,
} from "@react-three/drei";
import * as THREE from "three";
import { MeshStandardMaterial } from "three";

export default function App() {
  return (
    <Canvas camera={{ position: [0, -8, 0], near: 0.1, far: 1000 }} shadows>
      <ambientLight intensity={1.5} />
      <spotLight
        angle={1}
        penumbra={1}
        color="white"
        position={[5, 0, 5]}
        castShadow
      />
      <fog attach="fog" args={["#000", 2, 10]} />
      <Suspense fallback={null}>
        {/* Wrap contents you want to scroll into <ScrollControls> */}
        <ScrollControls pages={5}>
          <TheModel
            scale={7}
            position={[0, 0, -5.5]}
            rotation-x={Math.PI * 0.6}
            castShadow
            receiveShadow
          />
        </ScrollControls>
      </Suspense>
    </Canvas>
  );
}

//onst GLB_PATH = "/portfolio test.glb";
const GLB_PATH = "/sphere port.glb";

function TheModel({ ...props }) {
  // This hook gives you offets, ranges and other useful things
  const scroll = useScroll();
  const { scene, animations } = useGLTF(GLB_PATH);
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    if (actions?.["Action 1"]) {
      actions["Action 1"].play().paused = true;
    }
  }, [actions]);

  useFrame((state, delta) => {
    const action = actions["Action 1"] as THREE.AnimationAction;
    // The offset is between 0 and 1, you can apply it to your models any way you like
    const offset = 1 * scroll.offset;
    action.time = THREE.MathUtils.damp(
      action.time,
      action.getClip().duration * offset,
      100,
      delta
    );
    state.camera.lookAt(0, 0, 0);
  });
  return <primitive object={scene} {...props} />;
}

useGLTF.preload(GLB_PATH);
