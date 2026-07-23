"use client";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import {
  Bounds,
  Center,
  ContactShadows,
  Environment,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import {
  Component,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

// Same self-hosted HDR the hero uses — soft interior reflections without a
// blocking CDN fetch.
const ENV_URL = "/hdri/potsdamer_platz_1k.hdr";

/**
 * A generalized, self-contained 3D viewer for any GLB.
 *
 * Unlike the hero `Scene` (which knows the kitchen model's mesh names for
 * hover-outlines), this renders whatever scene graph the GLB ships with, fits
 * it to view, and gives the visitor orbit + zoom control. Used on project case
 * studies so every uploaded render is explorable in-browser.
 */
type ModelViewerProps = {
  /** URL of the .glb/.gltf to load. */
  src: string;
  /** Slowly spin the model until the user interacts. */
  autoRotate?: boolean;
  /** Allow scroll-to-zoom. Off by default so it doesn't hijack page scroll. */
  enableZoom?: boolean;
  className?: string;
};

function Model({ src }: { src: string }) {
  const { scene } = useGLTF(src);
  return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
}

function Loader() {
  return (
    <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
      Loading 3D render…
    </div>
  );
}

function Fallback() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
      3D preview unavailable — enable hardware acceleration in your browser
      settings to explore this render in 3D.
    </div>
  );
}

/** Detects whether the browser can create a WebGL context. */
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

/** Keeps a renderer crash from taking down the surrounding page. */
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

export function ModelViewer({
  src,
  autoRotate = true,
  enableZoom = false,
  className,
}: ModelViewerProps) {
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => setSupported(hasWebGL()), []);

  // Pause the render loop while the viewer is off-screen.
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "100px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [supported]);

  if (supported === null) return null;
  if (!supported) return <Fallback />;

  return (
    <WebGLErrorBoundary>
      <div ref={wrapRef} className={className}>
        <Canvas
          dpr={[1, 1.5]}
          frameloop={active ? "always" : "never"}
          shadows
          gl={{ antialias: true, powerPreference: "high-performance" }}
          camera={{ position: [4, 2, 6], fov: 40 }}
          className="h-full w-full"
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
          }}
        >
          <ambientLight intensity={0.6 * Math.PI} />
          <directionalLight position={[5, 8, 3]} intensity={0.6} />
          <Suspense fallback={null}>
            <Bounds fit clip observe margin={1.1}>
              <Model src={src} />
            </Bounds>
            <ContactShadows
              position={[0, -1.2, 0]}
              opacity={0.35}
              scale={14}
              blur={2.5}
              far={4}
            />
            <Environment files={ENV_URL} />
          </Suspense>
          <OrbitControls
            makeDefault
            autoRotate={autoRotate}
            autoRotateSpeed={0.6}
            enableZoom={enableZoom}
            enablePan={false}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 1.9}
          />
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  );
}
