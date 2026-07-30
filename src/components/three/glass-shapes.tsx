"use client";

import * as React from "react";
import { useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  Lightformer,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import { easing } from "maath";

import { WebGLCanvas } from "./webgl-canvas";

/**
 * Ambient scene: a slow drift of glass and ceramic solids.
 *
 * Modelled on the pmndrs "frosted glass" / "glass flower" examples, pared back to
 * what a page background can afford: five primitives, one shared transmission
 * material, and a hand-built lighting rig of `Lightformer`s instead of a heavy
 * HDR fetch. The camera eases toward the pointer, which is what sells the depth —
 * the shapes themselves barely move.
 *
 * Used behind dark panels (CTA, contact, auth) where a photograph would compete
 * with the type but a flat colour would feel empty.
 */
const SHAPES: {
  geometry: "torus" | "box" | "sphere" | "cone" | "capsule";
  position: [number, number, number];
  scale: number;
  speed: number;
  rotationIntensity: number;
}[] = [
  { geometry: "torus", position: [-2.6, 0.6, -1], scale: 0.9, speed: 1.1, rotationIntensity: 1.4 },
  { geometry: "box", position: [2.4, -0.9, -0.5], scale: 0.75, speed: 0.9, rotationIntensity: 1.1 },
  { geometry: "sphere", position: [1.2, 1.5, -2], scale: 0.6, speed: 1.4, rotationIntensity: 0.6 },
  { geometry: "capsule", position: [-1.6, -1.4, 0.4], scale: 0.55, speed: 1.2, rotationIntensity: 1.6 },
  { geometry: "cone", position: [0.2, -0.2, -3.2], scale: 0.8, speed: 0.8, rotationIntensity: 1.2 },
];

function Geometry({ kind }: { kind: (typeof SHAPES)[number]["geometry"] }) {
  switch (kind) {
    case "torus":
      return <torusGeometry args={[0.9, 0.32, 16, 32]} />;
    case "box":
      return <boxGeometry args={[1.2, 1.2, 1.2]} />;
    case "sphere":
      return <sphereGeometry args={[0.9, 24, 16]} />;
    case "capsule":
      return <capsuleGeometry args={[0.45, 1, 6, 16]} />;
    case "cone":
      return <coneGeometry args={[0.85, 1.6, 24]} />;
  }
}

function Solids({ tint }: { tint: string }) {
  return (
    <>
      {SHAPES.map((shape, i) => (
        <Float
          key={i}
          speed={shape.speed}
          rotationIntensity={shape.rotationIntensity}
          floatIntensity={1.4}
          floatingRange={[-0.25, 0.25]}
        >
          <mesh position={shape.position} scale={shape.scale}>
            <Geometry kind={shape.geometry} />
            {/* `transmissionSampler` is the whole performance story of this file.
                Left off, every one of these materials re-renders the entire scene
                into a private framebuffer inside its own `useFrame` — five solids
                meant six full scene renders per frame, for a decorative backdrop,
                on seven pages. Switched on, they all read three.js's built-in
                shared transmission pass instead: one extra render, no matter how
                many transmissive meshes are in the scene.

                Thickness and attenuation are deliberately low. Transmission
                samples what's *behind* the mesh, and behind it here is a dark
                ground — so a thick, strongly-attenuating glass turns into a black
                blob rather than glass. Thin bodies plus a bright rig keep the
                shapes reading as edges and highlights. */}
            <MeshTransmissionMaterial
              transmissionSampler
              samples={4}
              resolution={128}
              thickness={0.35}
              roughness={0.1}
              chromaticAberration={0.1}
              anisotropy={0.3}
              ior={1.35}
              distortion={0.2}
              distortionScale={0.3}
              temporalDistortion={0.1}
              color={tint}
              attenuationColor={tint}
              attenuationDistance={8}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

/** Eases the camera toward the pointer — the parallax that reads as depth. */
function PointerCamera() {
  useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [state.pointer.x * 1.2, 0.4 + state.pointer.y * 0.7, 7],
      0.4,
      delta,
    );
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export function GlassShapes({
  tint = "#e8dfd2",
  className,
}: {
  /** Body tint of the glass. Warm ivory by default. */
  tint?: string;
  className?: string;
}) {
  return (
    <WebGLCanvas
      className={className}
      // Transmission samples the scene behind each mesh, so this needs a real GPU;
      // on a software rasteriser it would crawl. dpr comes from the tier.
      minTier="high"
      // Wide enough that each solid reads as a whole object rather than a crop
      // of one, which is what sells them as things in a room.
      camera={{ position: [0, 0.4, 7], fov: 40 }}
      // Nothing to say when it can't run — the panel behind it reads fine alone.
      fallback={null}
    >
      <color attach="background" args={["#3b342a"]} />
      <ambientLight intensity={1.4} />
      <spotLight
        position={[6, 8, 4]}
        angle={0.5}
        penumbra={1}
        intensity={6}
        color="#f6efe4"
      />
      <directionalLight position={[-5, 3, 4]} intensity={1.6} color="#e6c9a8" />

      <React.Suspense fallback={null}>
        <Solids tint={tint} />

        {/* Hand-built studio rig: a soft top box plus two rim strips. Cheaper
            and more controllable than loading an HDR for a background. */}
        <Environment resolution={128}>
          <Lightformer
            intensity={7}
            form="rect"
            position={[0, 5, -6]}
            scale={[12, 6, 1]}
            color="#fff6e6"
          />
          <Lightformer
            intensity={4}
            form="circle"
            position={[-6, 1, 2]}
            scale={4}
            color="#e09a62"
          />
          <Lightformer
            intensity={3.2}
            form="circle"
            position={[6, -1, 2]}
            scale={4}
            color="#a8b57c"
          />
          <Lightformer
            intensity={2.4}
            form="rect"
            position={[0, -5, 3]}
            scale={[10, 4, 1]}
            color="#fff2df"
          />
        </Environment>
      </React.Suspense>

      <PointerCamera />
      <fog attach="fog" args={["#3b342a", 9, 18]} />
    </WebGLCanvas>
  );
}
