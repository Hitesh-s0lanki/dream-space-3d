"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Text,
  Float,
  MeshReflectorMaterial,
  OrbitControls,
  Environment,
  Sparkles,
  Center,
} from "@react-three/drei";
import { Component, type ReactNode, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export type MaterialPreset = "gold" | "chrome" | "emerald" | "neon";
export type CameraViewPreset = "hero" | "front" | "iso" | "wide";
export type LightTheme = "light" | "warm" | "cyber" | "dark";

interface SceneProps {
  materialPreset?: MaterialPreset;
  cameraView?: CameraViewPreset;
  autoRotate?: boolean;
  lightTheme?: LightTheme;
  showArchitecturalElements?: boolean;
}

/** Dynamic Camera Controller to animate between perspective view presets */
function CameraController({ view }: { view: CameraViewPreset }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 1, 6.5));

  useEffect(() => {
    switch (view) {
      case "front":
        targetPos.current.set(0, 0.5, 5.8);
        break;
      case "iso":
        targetPos.current.set(4.5, 4.0, 5.5);
        break;
      case "wide":
        targetPos.current.set(0, 3.2, 9.5);
        break;
      case "hero":
      default:
        targetPos.current.set(0, 1.0, 6.5);
        break;
    }
  }, [view]);

  useFrame(() => {
    camera.position.lerp(targetPos.current, 0.05);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/** 3D Typography component rendering "See the space." & "Explore the possibilities." */
function Text3DGroup({ materialPreset }: { materialPreset: MaterialPreset }) {
  const groupRef = useRef<THREE.Group>(null);

  // Subtle floating wobble / mouse tilt
  useFrame(({ pointer }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      pointer.x * 0.15,
      0.05
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -pointer.y * 0.1,
      0.05
    );
  });

  // Material properties selector
  const getMaterialProps = () => {
    switch (materialPreset) {
      case "chrome":
        return {
          color: "#f0f4f8",
          metalness: 1.0,
          roughness: 0.08,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1,
        };
      case "emerald":
        return {
          color: "#10b981",
          emissive: "#022c22",
          metalness: 0.3,
          roughness: 0.15,
          transmission: 0.4,
          ior: 1.5,
        };
      case "neon":
        return {
          color: "#00f0ff",
          emissive: "#00e1ff",
          emissiveIntensity: 0.6,
          metalness: 0.1,
          roughness: 0.2,
        };
      case "gold":
      default:
        return {
          color: "#e2b866",
          emissive: "#3a2505",
          metalness: 0.9,
          roughness: 0.2,
          clearcoat: 0.8,
        };
    }
  };

  const matProps = getMaterialProps();

  return (
    <group ref={groupRef}>
      <Center position={[0, 0.3, 0]}>
        <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.5}>
          {/* Main 3D Title */}
          <Text
            fontSize={1.6}
            letterSpacing={-0.02}
            lineHeight={1}
            position={[0, 0, 0]}
            castShadow
            receiveShadow
          >
            3D view
            <meshPhysicalMaterial {...matProps} />
          </Text>
        </Float>
      </Center>
    </group>
  );
}

/** Floating architectural 3D structures giving depth to the interior studio space */
function ArchitecturalElements({ lightTheme }: { lightTheme: LightTheme }) {
  const glassPanel1 = useRef<THREE.Mesh>(null);
  const glassPanel2 = useRef<THREE.Mesh>(null);
  const frameRing = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (glassPanel1.current) glassPanel1.current.rotation.y += delta * 0.1;
    if (glassPanel2.current) glassPanel2.current.rotation.y -= delta * 0.12;
    if (frameRing.current) frameRing.current.rotation.z += delta * 0.08;
  });

  const isDark = lightTheme === "dark";

  return (
    <group position={[0, -0.2, -1.5]}>
      {/* Floating 3D Geometric Ring */}
      <mesh ref={frameRing} position={[0, 0.5, -2]}>
        <torusGeometry args={[3.8, 0.04, 16, 100]} />
        <meshStandardMaterial
          color={isDark ? "#ffffff" : "#3b82f6"}
          metalness={0.9}
          roughness={0.1}
          wireframe
        />
      </mesh>

      {/* Floating Translucent Spatial Glass Panel Left */}
      <mesh
        ref={glassPanel1}
        position={[-3.8, 0.8, -1.2]}
        rotation={[0.2, 0.4, 0]}
      >
        <boxGeometry args={[1.8, 3.2, 0.08]} />
        <meshPhysicalMaterial
          color="#ffffff"
          roughness={0.1}
          metalness={0.1}
          transmission={0.85}
          ior={1.4}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Floating Translucent Spatial Glass Panel Right */}
      <mesh
        ref={glassPanel2}
        position={[3.8, 0.8, -1.2]}
        rotation={[-0.2, -0.4, 0]}
      >
        <boxGeometry args={[1.8, 3.2, 0.08]} />
        <meshPhysicalMaterial
          color="#ffffff"
          roughness={0.1}
          metalness={0.1}
          transmission={0.85}
          ior={1.4}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Glowing Ambient Light Pillars */}
      <mesh position={[-2.5, 0, -2]}>
        <cylinderGeometry args={[0.08, 0.08, 4, 32]} />
        <meshStandardMaterial
          color={lightTheme === "cyber" ? "#00ffff" : "#f59e0b"}
          emissive={lightTheme === "cyber" ? "#00ffff" : "#f59e0b"}
          emissiveIntensity={1.5}
        />
      </mesh>
      <mesh position={[2.5, 0, -2]}>
        <cylinderGeometry args={[0.08, 0.08, 4, 32]} />
        <meshStandardMaterial
          color={lightTheme === "cyber" ? "#ff00ff" : "#f59e0b"}
          emissive={lightTheme === "cyber" ? "#ff00ff" : "#f59e0b"}
          emissiveIntensity={1.5}
        />
      </mesh>
    </group>
  );
}

/** WebGL Capability probe */
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
      settings to view the immersive 3D experience.
    </div>
  );
}

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

export function Scene({
  materialPreset = "gold",
  cameraView = "hero",
  autoRotate = false,
  lightTheme = "light",
  showArchitecturalElements = true,
}: SceneProps) {
  const [supported, setSupported] = useState<boolean | null>(null);
  const orbitRef = useRef<OrbitControlsImpl>(null);

  useEffect(() => setSupported(hasWebGL()), []);

  if (supported === null) return null;
  if (!supported) return <Fallback />;

  // Lighting configuration based on theme
  const getLighting = () => {
    switch (lightTheme) {
      case "light":
        return {
          ambientIntensity: 0.95,
          dirColor: "#ffffff",
          dirIntensity: 2.2,
          bgColor: "#f8fafc",
          groundColor: "#cbd5e1",
          isLight: true,
        };
      case "warm":
        return {
          ambientIntensity: 0.7,
          dirColor: "#ffedd5",
          dirIntensity: 1.8,
          bgColor: "#0c0a09",
          groundColor: "#1c1917",
          isLight: false,
        };
      case "cyber":
        return {
          ambientIntensity: 0.5,
          dirColor: "#38bdf8",
          dirIntensity: 2.2,
          bgColor: "#030712",
          groundColor: "#0f172a",
          isLight: false,
        };
      case "dark":
      default:
        return {
          ambientIntensity: 0.5,
          dirColor: "#ffffff",
          dirIntensity: 1.6,
          bgColor: "#09090b",
          groundColor: "#141417",
          isLight: false,
        };
    }
  };

  const light = getLighting();

  return (
    <WebGLErrorBoundary>
      <Canvas
        shadows
        camera={{ position: [0, 1, 6.5], fov: 45 }}
        className="h-full w-full"
        style={{ background: light.bgColor }}
      >
        <CameraController view={cameraView} />

        {/* Ambient & Key Lights */}
        <ambientLight intensity={light.ambientIntensity} />
        <directionalLight
          position={[6, 8, 6]}
          intensity={light.dirIntensity}
          color={light.dirColor}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={15}
          shadow-camera-left={-6}
          shadow-camera-right={6}
          shadow-camera-top={6}
          shadow-camera-bottom={-6}
        />
        <pointLight position={[-6, -2, -4]} intensity={0.8} color="#3b82f6" />

        {/* 3D Typography Title & Subtitle */}
        <Text3DGroup materialPreset={materialPreset} />

        {/* Spatial Architectural Room Background */}
        {showArchitecturalElements && (
          <ArchitecturalElements lightTheme={lightTheme} />
        )}

        {/* Reflective Ground Floor */}
        <mesh
          position={[0, -1.35, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[50, 50]} />
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={1024}
            mirror={light.isLight ? 0.45 : 0.65}
            mixBlur={0.8}
            mixStrength={1.5}
            roughness={light.isLight ? 0.3 : 0.4}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color={light.groundColor}
            metalness={light.isLight ? 0.2 : 0.6}
          />
        </mesh>

        {/* Ambient Spatial Sparkles / Particles */}
        <Sparkles
          count={60}
          scale={10}
          size={2.5}
          speed={0.4}
          opacity={light.isLight ? 0.4 : 0.6}
          color={
            lightTheme === "cyber"
              ? "#00ffff"
              : lightTheme === "light"
              ? "#d97706"
              : "#fbbf24"
          }
        />

        {/* HDRI Studio Lighting Environment */}
        <Environment preset="city" />

        {/* Interactive Camera Orbit Controls */}
        <OrbitControls
          ref={orbitRef}
          enablePan={false}
          enableZoom={true}
          minDistance={3.5}
          maxDistance={12}
          maxPolarAngle={Math.PI / 2 + 0.05}
          autoRotate={autoRotate}
          autoRotateSpeed={1.5}
        />
      </Canvas>
    </WebGLErrorBoundary>
  );
}

