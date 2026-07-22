"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Component, type ReactNode, useEffect, useRef, useState } from "react";
import type { Mesh } from "three";

function SpinningBox() {
  const mesh = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += delta * 0.3;
    mesh.current.rotation.y += delta * 0.5;
  });

  return (
    <mesh ref={mesh} castShadow>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color="#a3915f" roughness={0.35} metalness={0.1} />
    </mesh>
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

/**
 * Minimal R3F scene to verify the 3D stack is wired up.
 * Replace with the real "Explore Spaces" room later.
 */
export function Scene() {
  // Probe for WebGL on the client only (avoids SSR/hydration mismatch).
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => setSupported(hasWebGL()), []);

  if (supported === null) return null;
  if (!supported) return <Fallback />;

  return (
    <WebGLErrorBoundary>
      <Canvas
        shadows
        camera={{ position: [3, 2, 4], fov: 45 }}
        className="h-full w-full"
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
        <SpinningBox />
        <Environment preset="apartment" />
        <OrbitControls enablePan={false} />
      </Canvas>
    </WebGLErrorBoundary>
  );
}
