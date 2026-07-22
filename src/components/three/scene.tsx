"use client";

import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sky, Bvh, useGLTF, useEnvironment } from "@react-three/drei";
import {
  EffectComposer,
  Selection,
  Select,
  Outline,
  N8AO,
  TiltShift2,
  BrightnessContrast,
  HueSaturation,
  Vignette,
  ToneMapping,
} from "@react-three/postprocessing";
import {
  Component,
  Suspense,
  useCallback,
  useState,
  type ReactNode,
  useEffect,
} from "react";

const MODEL_URL = "/kitchen-transformed.glb";

/**
 * Kitchen interior from the pmndrs "shopping" example, adapted as an ambient
 * hero background. Auto-generated with gltfjsx; original 134MB → 2.1MB draco.
 * Hovering a furniture group glows its outline and shows the product label.
 */
type GLTFResult = {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, THREE.Material>;
};

function Kitchen(props: React.ComponentProps<"group">) {
  const { nodes, materials } = useGLTF(MODEL_URL) as unknown as GLTFResult;
  // Environment map used only on the reflective pieces (chairs, sink, glass).
  const env = useEnvironment({ preset: "city" });
  const [hovered, setHovered] = useState<string | null>(null);
  const over = useCallback(
    (name: string) => (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      setHovered(name);
    },
    []
  );
  const out = useCallback(() => setHovered(null), []);

  return (
    <>
      <group {...props}>
        <mesh geometry={nodes.vase1.geometry} material={materials.gray} material-envMap={env} />
        <mesh geometry={nodes.bottle.geometry} material={materials.gray} material-envMap={env} />
        <mesh geometry={nodes.walls_1.geometry} material={materials.floor} />
        <mesh geometry={nodes.walls_2.geometry} material={materials.walls} />
        <mesh geometry={nodes.plant_1.geometry} material={materials.potted_plant_01_leaves} />
        <mesh geometry={nodes.plant_2.geometry} material={materials.potted_plant_01_pot} />
        <mesh geometry={nodes.cuttingboard.geometry} material={materials.walls} />
        <mesh geometry={nodes.bowl.geometry} material={materials.walls} />

        <Select enabled={hovered === "BRÖNDEN"} onPointerOver={over("BRÖNDEN")} onPointerOut={out}>
          <mesh geometry={nodes.carpet.geometry} material={materials.carpet} />
        </Select>
        <Select enabled={hovered === "VOXLÖV"} onPointerOver={over("VOXLÖV")} onPointerOut={out}>
          <mesh geometry={nodes.table.geometry} material={materials.walls} material-envMap={env} material-envMapIntensity={0.5} />
        </Select>
        <Select enabled={hovered === "FANBYN"} onPointerOver={over("FANBYN")} onPointerOut={out}>
          <mesh geometry={nodes.chairs_1.geometry} material={materials.walls} />
          <mesh geometry={nodes.chairs_2.geometry} material={materials.plastic} material-color="#1a1a1a" material-envMap={env} material-envMapIntensity={0.35} />
        </Select>
        <Select enabled={hovered === "LIVSVERK"} onPointerOver={over("LIVSVERK")} onPointerOut={out}>
          <mesh geometry={nodes.vase.geometry} material={materials.gray} material-envMap={env} />
        </Select>
        <Select enabled={hovered === "SKAFTET"} onPointerOver={over("SKAFTET")} onPointerOut={out}>
          <mesh geometry={nodes.lamp_socket.geometry} material={materials.gray} material-envMap={env} />
          <mesh geometry={nodes.lamp.geometry} material={materials.gray} />
          <mesh geometry={nodes.lamp_cord.geometry} material={materials.gray} material-envMap={env} />
        </Select>

        <mesh geometry={nodes.kitchen.geometry} material={materials.walls} />
        <mesh geometry={nodes.sink.geometry} material={materials.chrome} material-envMap={env} />
      </group>
    </>
  );
}

useGLTF.preload(MODEL_URL);

/**
 * Post-processing stack + pointer-parallax camera. Lives in its own component
 * so it can read the canvas size (needed for the outline blur width).
 */
function Effects() {
  const { size } = useThree();
  useFrame((state, delta) => {
    const { camera, pointer } = state;
    const damp = THREE.MathUtils.damp;
    camera.position.x = damp(camera.position.x, pointer.x, 3, delta);
    camera.position.y = damp(camera.position.y, 1 + pointer.y / 2, 3, delta);
    camera.position.z = damp(camera.position.z, 8 + Math.atan(pointer.x * 2), 3, delta);
    camera.lookAt(camera.position.x * 0.9, 0, -4);
  });
  return (
    <EffectComposer stencilBuffer autoClear={false} multisampling={4}>
      <N8AO aoSamples={16} denoiseSamples={4} aoRadius={0.6} distanceFalloff={1} intensity={1.8} />
      <Outline visibleEdgeColor={0xffffff} hiddenEdgeColor={0xffffff} blur width={size.width * 1.25} edgeStrength={10} />
      <TiltShift2 samples={5} blur={0.06} />
      <ToneMapping />
      <BrightnessContrast brightness={-0.03} contrast={0.08} />
      <HueSaturation saturation={0.06} />
      <Vignette eskil={false} offset={0.35} darkness={0.55} />
    </EffectComposer>
  );
}

/** Detects whether the browser can actually create a WebGL context. */
function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

function Fallback() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
      3D preview unavailable — enable hardware acceleration in your browser
      settings to view the immersive experience.
    </div>
  );
}

/** Catches runtime failures from the WebGL renderer so the page never breaks. */
class WebGLErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? <Fallback /> : this.props.children;
  }
}

export function Scene() {
  // Probe for WebGL on the client only (avoids SSR/hydration mismatch).
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => setSupported(hasWebGL()), []);

  if (supported === null) return null;
  if (!supported) return <Fallback />;

  return (
    <WebGLErrorBoundary>
      <Canvas
        flat
        dpr={[1, 1.5]}
        gl={{ antialias: false }}
        camera={{ position: [0, 1, 6], fov: 25, near: 1, far: 20 }}
        className="h-full w-full"
      >
        <ambientLight intensity={0.85 * Math.PI} />
        <directionalLight position={[4, 8, 3]} intensity={0.45} />
        <Sky sunPosition={[80, 40, 100]} turbidity={10} rayleigh={1.5} />
        <Bvh firstHitOnly>
          <Selection>
            <Effects />
            <Suspense fallback={null}>
              <Kitchen rotation={[0, Math.PI / 2, 0]} position={[0, -1, -0.85]} />
            </Suspense>
          </Selection>
        </Bvh>
      </Canvas>
    </WebGLErrorBoundary>
  );
}
