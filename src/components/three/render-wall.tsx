"use client";

import * as React from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Image as DreiImage, MeshReflectorMaterial } from "@react-three/drei";
import { easing } from "maath";

import { createRandom } from "@/lib/random";
import { WebGLCanvas } from "./webgl-canvas";

/**
 * Ambient scene: a wall of renders standing on a polished floor.
 *
 * Adapted from the pmndrs "image gallery" / "ground reflections" examples. Two
 * staggered rows of framed planes recede into fog while the floor mirrors them, and
 * the camera eases along the wall with the pointer — so moving your hand walks you
 * down a gallery rather than scrubbing a carousel.
 *
 * The reflector is the expensive part (it re-renders the scene into a buffer each
 * frame), so its resolution is kept low and blurred heavily; at this scale the
 * blur is what makes it read as polished concrete anyway.
 */
type Frame = {
  url: string;
  position: [number, number, number];
  scale: [number, number];
};

function useFrames(images: string[]): Frame[] {
  return React.useMemo(() => {
    if (!images.length) return [];
    const random = createRandom(0xa11ce);
    const frames: Frame[] = [];
    const perRow = Math.max(3, Math.ceil(images.length / 2));

    images.forEach((url, i) => {
      const row = i % 2;
      const col = Math.floor(i / 2);
      // Slight per-frame jitter in height and depth so the wall isn't a grid.
      const h = 1.5 + random() * 0.5;
      frames.push({
        url,
        position: [
          (col - (perRow - 1) / 2) * 2.6 + (row === 1 ? 1.3 : 0),
          row === 0 ? h / 2 + 0.15 : h / 2 + 0.15,
          row === 0 ? 0 : -1.6 - random() * 0.4,
        ],
        scale: [h * 1.4, h],
      });
    });
    return frames;
  }, [images]);
}

/** One framed render. Fades in when its texture is ready. */
function FrameMesh({ frame }: { frame: Frame }) {
  const ref = React.useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!ref.current) return;
    // A gentle sway, phase-offset by world position so the wall breathes.
    const t = state.clock.elapsedTime + frame.position[0];
    ref.current.rotation.y = Math.sin(t * 0.2) * 0.04;
    easing.damp(ref.current.position, "y", frame.position[1], 0.5, delta);
  });

  return (
    <group ref={ref} position={frame.position}>
      {/* Mount board behind the print, so each frame has a physical edge */}
      <mesh position={[0, 0, -0.03]}>
        <planeGeometry args={[frame.scale[0] + 0.12, frame.scale[1] + 0.12]} />
        <meshStandardMaterial color="#2b241c" roughness={0.7} />
      </mesh>
      <DreiImage
        url={frame.url}
        scale={frame.scale}
        transparent
        toneMapped={false}
      />
    </group>
  );
}

/** Eases the camera along the wall with the pointer. */
function Rig() {
  const { viewport } = useThree();
  useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [state.pointer.x * (viewport.width > 8 ? 3.5 : 1.5), 1.5, 7.2],
      0.5,
      delta,
    );
    // Aimed a little low, so the floor and its reflection are in frame rather
    // than cropped off the bottom of the band.
    state.camera.lookAt(0, 0.75, -1);
  });
  return null;
}

export function RenderWall({
  images,
  className,
}: {
  images: string[];
  className?: string;
}) {
  const frames = useFrames(images);

  return (
    <WebGLCanvas
      className={className}
      // The floor is a `MeshReflectorMaterial`, which re-renders the scene into a
      // buffer every frame — squarely in "needs a real GPU" territory. Let the
      // shell pick dpr from the tier rather than pinning it here.
      minTier="high"
      gl={{ antialias: true }}
      camera={{ position: [0, 1.4, 7.5], fov: 40, near: 0.1, far: 40 }}
      fallback={null}
    >
      <color attach="background" args={["#1c1712"]} />
      {/* Loose enough that the far end of the wall fades rather than vanishes */}
      <fog attach="fog" args={["#1c1712", 10, 24]} />

      <ambientLight intensity={1.3} />
      <spotLight
        position={[0, 7, 4]}
        angle={0.7}
        penumbra={1}
        intensity={40}
        color="#fff3e2"
      />
      {/* Aimed down and forward: without it the floor is unlit, and an unlit
          reflector reflects nothing you can see. */}
      <spotLight
        position={[0, 4, 5]}
        target-position={[0, 0, 0]}
        angle={1}
        penumbra={1}
        intensity={26}
        color="#f6e6cf"
      />
      <pointLight position={[-6, 2, 2]} intensity={12} color="#d98a52" />
      <pointLight position={[6, 2, 2]} intensity={10} color="#93a06a" />

      <React.Suspense fallback={null}>
        {frames.map((frame) => (
          <FrameMesh key={frame.url + frame.position[0]} frame={frame} />
        ))}
      </React.Suspense>

      {/* Polished floor. Blur stays high — a sharp mirror at this scale reads as
          a glitch, a blurred one as sealed concrete — but the mirror and mix have
          to be strong enough to actually see, or the bottom half of the band is
          just black. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.8]}>
        <planeGeometry args={[60, 24]} />
        <MeshReflectorMaterial
          resolution={512}
          mirror={0.8}
          blur={[300, 80]}
          mixBlur={5}
          mixStrength={2.6}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          roughness={0.7}
          color="#3a322a"
          metalness={0.45}
        />
      </mesh>

      <Rig />
    </WebGLCanvas>
  );
}
