"use client";

import * as THREE from "three";
import { useLenis } from "lenis/react";
import {
  Bounds,
  Center,
  ContactShadows,
  Environment,
  MeshReflectorMaterial,
  OrbitControls,
  useBounds,
  useGLTF,
  useProgress,
} from "@react-three/drei";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentRef,
  type ReactNode,
  type RefObject,
} from "react";
import { Expand, Minimize2, Minus, Plus, RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";
import { useGpuTier } from "@/lib/webgl-capability";
import { WebGLCanvas } from "./webgl-canvas";

// Same self-hosted HDR the hero uses — soft interior reflections without a
// blocking CDN fetch.
const ENV_URL = "/hdri/potsdamer_platz_1k.hdr";

/** World units every model's largest dimension is normalized to. */
const MODEL_SPAN = 4;
/** Orbit distance limits. Close enough to read a joint, far enough to see all. */
const MIN_DISTANCE = MODEL_SPAN * 0.08;
const MAX_DISTANCE = MODEL_SPAN * 6;
/** One click of the zoom buttons / +- keys. */
const ZOOM_STEP = 1.25;

/**
 * A generalized, self-contained 3D viewer for any GLB.
 *
 * Unlike the hero `Scene` (which knows the kitchen model's mesh names for
 * hover-outlines), this renders whatever scene graph the GLB ships with, fits
 * it to view, and gives the visitor orbit + zoom control. Used on project case
 * studies so every uploaded render is explorable in-browser.
 *
 * Zooming is the fiddly part on a long scrolling page: a canvas that eats the
 * wheel traps the reader, one that ignores it feels broken. So the viewer only
 * claims the wheel once the visitor has reached into it (a click or drag
 * inside), releases it when the pointer leaves or Esc is pressed, and always
 * offers wheel-free zoom — the on-canvas buttons, the +/- keys, and a
 * full-screen mode where there is no page left to scroll.
 */
type ModelViewerProps = {
  /** URL of the .glb/.gltf to load. */
  src: string;
  /** Slowly spin the model until the user interacts. */
  autoRotate?: boolean;
  className?: string;
};

type OrbitControlsRef = ComponentRef<typeof OrbitControls>;

function Model({ src }: { src: string }) {
  const { scene } = useGLTF(src);

  // Uploaded GLBs arrive at wildly different scales — millimetres, metres,
  // whatever the exporter chose. Normalizing to a fixed span lets one set of
  // zoom limits and clip planes suit every project. The scale goes on a wrapper
  // group, never on `scene` itself, since useGLTF caches that object and a
  // second mount would then measure its own scaled self.
  const scale = useMemo(() => {
    const size = new THREE.Box3()
      .setFromObject(scene)
      .getSize(new THREE.Vector3());
    return MODEL_SPAN / (Math.max(size.x, size.y, size.z) || 1);
  }, [scene]);

  // `top` seats the model's underside on y=0, where the contact shadow lives.
  return (
    <Center top>
      <group scale={scale}>
        <primitive object={scene} />
      </group>
    </Center>
  );
}

/** Exposes drei's refit-to-view to the DOM overlay outside the Canvas. */
function FitHandle({ fitRef }: { fitRef: RefObject<(() => void) | null> }) {
  const bounds = useBounds();
  useEffect(() => {
    fitRef.current = () => void bounds?.refresh().fit();
    return () => {
      fitRef.current = null;
    };
  }, [bounds, fitRef]);
  return null;
}

function Loader() {
  const { active, progress } = useProgress();
  if (!active) return null;
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
      Loading 3D render… {Math.round(progress)}%
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

/**
 * Polished floor under the model, on capable GPUs only.
 *
 * A reflector re-renders the scene into a buffer every frame, which is the one
 * thing a weak GPU cannot absorb. But unlike the ambient scenes, this viewer *is*
 * the page's content — refusing to draw it on a low tier would be worse than
 * drawing it plainly. So the tier gates the floor, not the viewer: everyone gets
 * the model and its contact shadow, and a real GPU also gets the reflection.
 *
 * Seated a hair below y=0: `Center top` puts the model's underside exactly on 0,
 * and a coplanar plane z-fights. Kept heavily blurred and low-mirror so it reads
 * as sealed floor, and so an uploaded GLB that ships its own floor doesn't look
 * doubled.
 */
function ReflectiveGround() {
  const tier = useGpuTier();
  if (tier !== "high") return null;

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[MODEL_SPAN * 12, MODEL_SPAN * 12]} />
      <MeshReflectorMaterial
        resolution={512}
        mirror={0.3}
        blur={[400, 120]}
        mixBlur={10}
        mixStrength={1.1}
        depthScale={1}
        minDepthThreshold={0.5}
        maxDepthThreshold={1.4}
        roughness={0.95}
        metalness={0.2}
        color="#e5ddd0"
      />
    </mesh>
  );
}

export function ModelViewer({
  src,
  autoRotate = true,
  className,
}: ModelViewerProps) {
  const lenis = useLenis();
  const controlsRef = useRef<OrbitControlsRef | null>(null);
  const fitRef = useRef<(() => void) | null>(null);

  /** Steps the camera along its own sight line, so zoom works without a wheel. */
  const dolly = (factor: number) => {
    const controls = controlsRef.current;
    if (!controls) return;
    const camera = controls.object;
    const offset = camera.position.clone().sub(controls.target);
    offset.setLength(
      THREE.MathUtils.clamp(offset.length() * factor, MIN_DISTANCE, MAX_DISTANCE),
    );
    camera.position.copy(controls.target).add(offset);
    controls.update();
  };
  const resetView = () => fitRef.current?.();

  // `engaged` is the viewer's claim on the wheel: off until the visitor reaches
  // in, so plain scrolling still carries the page past the viewer.
  const [engaged, setEngaged] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [spinning, setSpinning] = useState(autoRotate);
  const grabsWheel = engaged || expanded;

  const wrapRef = useRef<HTMLDivElement>(null);

  // Esc steps back out: full screen first, then the wheel claim.
  useEffect(() => {
    if (!grabsWheel) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (expanded) setExpanded(false);
      else setEngaged(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [grabsWheel, expanded]);

  // Lock the page behind the full-screen viewer.
  //
  // `overflow: hidden` on the body is not a lock when Lenis is driving: Lenis
  // translates the page from its own wheel listener and never consults the
  // body's overflow, so the article kept scrolling underneath the full-screen
  // viewer. Stopping Lenis is the actual lock; the overflow rule stays for the
  // reduced-motion path, where there is no Lenis instance to stop.
  useEffect(() => {
    if (!expanded) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis?.stop();
    return () => {
      document.body.style.overflow = previous;
      lenis?.start();
    };
  }, [expanded, lenis]);

  return (
    <>
      <div
        ref={wrapRef}
        tabIndex={0}
        role="group"
        aria-label="Interactive 3D render"
        // Lenis smooth-scrolls the page from a window-level wheel listener;
        // without this it would drag the article out from under the model even
        // while OrbitControls is zooming. Wheel only — touch scrolling stays
        // native, where OrbitControls' own preventDefault already handles it.
        {...(grabsWheel ? { "data-lenis-prevent-wheel": "" } : {})}
        className={cn(
          "relative outline-none",
          expanded
            ? "fixed inset-0 z-70 h-auto w-auto rounded-none bg-background"
            : className,
        )}
        onPointerDown={() => {
          setEngaged(true);
          setSpinning(false);
        }}
        // Only a departing mouse gives the wheel back. A touch "leaves" the
        // moment a finger lifts, and dropping the claim there would break pinch
        // zoom, which OrbitControls arms on touchstart.
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") setEngaged(false);
        }}
        onDoubleClick={resetView}
        onKeyDown={(e) => {
          if (e.key === "+" || e.key === "=") dolly(1 / ZOOM_STEP);
          else if (e.key === "-" || e.key === "_") dolly(ZOOM_STEP);
          else if (e.key === "0") resetView();
          else return;
          e.preventDefault();
        }}
      >
        <WebGLCanvas
          // The model *is* the content here: it keeps its context ahead of any
          // ambient background, and still renders under reduced motion — the
          // orbit controls just won't idle-spin.
          interactive
          decorative={false}
          shadows
          gl={{ antialias: true, powerPreference: "high-performance" }}
          fallback={<Fallback />}
          // Near plane sits close in: at full zoom the camera is nearly inside
          // the geometry, and a default 0.1 would slice the walls open.
          camera={{ position: [4, 2, 6], fov: 40, near: 0.02, far: 400 }}
          className="h-full w-full"
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
          }}
        >
          <ambientLight intensity={0.6 * Math.PI} />
          <directionalLight position={[5, 8, 3]} intensity={0.6} />
          <Suspense fallback={null}>
            <Bounds fit observe margin={1.1}>
              <FitHandle fitRef={fitRef} />
              <Model src={src} />
            </Bounds>
            <ContactShadows
              position={[0, 0, 0]}
              opacity={0.35}
              scale={MODEL_SPAN * 4}
              blur={2.5}
              far={MODEL_SPAN}
            />
            <ReflectiveGround />
            <Environment files={ENV_URL} />
          </Suspense>
          <OrbitControls
            ref={controlsRef}
            makeDefault
            autoRotate={spinning}
            autoRotateSpeed={0.6}
            // Wheel and pinch only bite once the viewer has the visitor's
            // attention; the buttons and keys work either way.
            enableZoom={grabsWheel}
            enablePan={grabsWheel}
            zoomSpeed={0.9}
            zoomToCursor
            minDistance={MIN_DISTANCE}
            maxDistance={MAX_DISTANCE}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 1.9}
          />
        </WebGLCanvas>

        <Loader />

        {/* Controls sit on the glass rather than under it, so zoom is reachable
            without having to guess at a gesture. */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-0.5 rounded-full border border-ivory/10 bg-charcoal/80 p-1 text-ivory shadow-lg shadow-charcoal/20 backdrop-blur">
          <ControlButton label="Zoom in" onClick={() => dolly(1 / ZOOM_STEP)}>
            <Plus className="size-4" />
          </ControlButton>
          <ControlButton label="Zoom out" onClick={() => dolly(ZOOM_STEP)}>
            <Minus className="size-4" />
          </ControlButton>
          <ControlButton label="Reset view" onClick={resetView}>
            <RotateCcw className="size-4" />
          </ControlButton>
          <ControlButton
            label={expanded ? "Exit full screen" : "View full screen"}
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? (
              <Minimize2 className="size-4" />
            ) : (
              <Expand className="size-4" />
            )}
          </ControlButton>
        </div>

        <p className="pointer-events-none absolute bottom-4 left-1/2 hidden -translate-x-1/2 rounded-full bg-charcoal/80 px-4 py-2 text-xs text-ivory backdrop-blur sm:block">
          {grabsWheel
            ? expanded
              ? "Drag to orbit · scroll to zoom · right-drag to pan · Esc to exit"
              : "Drag to orbit · scroll to zoom · Esc to release the page"
            : "Click the render to explore · drag to orbit, then scroll to zoom"}
        </p>
      </div>
    </>
  );
}

function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-ivory/15 focus:outline-none focus-visible:bg-ivory/15"
    >
      {children}
    </button>
  );
}
