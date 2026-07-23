"use client";

import * as THREE from "three";
import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Canvas,
  useFrame,
  useThree,
  extend,
  type ThreeElement,
} from "@react-three/fiber";
import { Image } from "@react-three/drei";
import { easing } from "maath";

/**
 * Rotating carousel of curved image cards, adapted from the pmndrs
 * "cards-with-border-radius" example (https://cydstumpel.nl/).
 * The scroll-driven rotation + PMNDRS banner are dropped in favour of a
 * gentle auto-rotation so it works as an ambient page section.
 */

// Curved plane geometry — Paul West (@prisoner849)
// https://discourse.threejs.org/t/simple-curved-plane/26647/10
class BentPlaneGeometry extends THREE.PlaneGeometry {
  constructor(
    radius: number,
    ...args: [
      width?: number,
      height?: number,
      widthSegments?: number,
      heightSegments?: number
    ]
  ) {
    super(...args);
    const p = this.parameters;
    const hw = p.width * 0.5;
    const a = new THREE.Vector2(-hw, 0);
    const b = new THREE.Vector2(0, radius);
    const c = new THREE.Vector2(hw, 0);
    const ab = new THREE.Vector2().subVectors(a, b);
    const bc = new THREE.Vector2().subVectors(b, c);
    const ac = new THREE.Vector2().subVectors(a, c);
    const r =
      (ab.length() * bc.length() * ac.length()) /
      (2 * Math.abs(ab.cross(ac)));
    const center = new THREE.Vector2(0, radius - r);
    const baseV = new THREE.Vector2().subVectors(a, center);
    const baseAngle = baseV.angle() - Math.PI * 0.5;
    const arc = baseAngle * 2;
    const uv = this.attributes.uv;
    const pos = this.attributes.position;
    const mainV = new THREE.Vector2();
    for (let i = 0; i < uv.count; i++) {
      const uvRatio = 1 - uv.getX(i);
      const y = pos.getY(i);
      mainV.copy(c).rotateAround(center, arc * uvRatio);
      pos.setXYZ(i, mainV.x, y, -mainV.y);
    }
    pos.needsUpdate = true;
  }
}

extend({ BentPlaneGeometry });

declare module "@react-three/fiber" {
  interface ThreeElements {
    bentPlaneGeometry: ThreeElement<typeof BentPlaneGeometry>;
  }
}

/**
 * Reads the app's `--background` CSS variable and drives the scene background
 * + fog from it, so the 3D section always matches the site theme (and updates
 * live if the theme class ever toggles). The variable is `oklch(...)`, which
 * THREE can't parse — a canvas 2D context normalises it to an sRGB hex first.
 */
function resolveCssVar(name: string): THREE.Color {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d");
  const color = new THREE.Color();
  if (!ctx) return color.set("#ffffff");
  // Paint the (possibly oklch/lab) colour and read back real sRGB bytes —
  // THREE can't parse modern colour models, but a painted pixel is plain sRGB.
  ctx.fillStyle = raw || "#ffffff";
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return color.setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace);
}

function ThemeBackground() {
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    const apply = () => {
      const color = resolveCssVar("--background");
      scene.background = color;
      if (scene.fog) scene.fog.color.copy(color);
    };
    apply();
    // Re-apply if the theme class/style on <html> changes.
    const observer = new MutationObserver(apply);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
    return () => observer.disconnect();
  }, [scene]);
  return null;
}

function Rig(props: React.ComponentProps<"group">) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state, delta) => {
    ref.current.rotation.y += delta * 0.15; // gentle auto-rotate
    state.events.update?.(); // raycast every frame so hover works while turning

    // Responsive framing: fov is vertical, so on a narrow (portrait/phone)
    // viewport the horizontal view collapses and the ring would clip at the
    // sides. Scale the whole ring down to fit its front arc to the viewport
    // width (never upscaling past the designed size). Scaling — rather than
    // dollying the camera back — keeps the fog distance right, so the cards
    // don't fade out on mobile.
    const aspect = state.size.width / state.size.height;
    const visibleHalfW = 10 * Math.tan(((FOV * Math.PI) / 180) / 2) * aspect;
    const frameHalfW = (1.35 * RADIUS + 1) / 2;
    ref.current.scale.setScalar(Math.min(1, visibleHalfW / frameHalfW));

    easing.damp3(
      state.camera.position,
      [-state.pointer.x * 2, state.pointer.y + 1.5, 10],
      0.3,
      delta
    );
    state.camera.lookAt(0, 0, 0);
  });
  return <group ref={ref} {...props} />;
}

type CardProps = {
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
};

function Card({ url, ...props }: CardProps) {
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const over = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setHovered(true);
  };
  const out = () => setHovered(false);
  useFrame((_, delta) => {
    easing.damp3(ref.current.scale, hovered ? 1.15 : 1, 0.1, delta);
    const material = ref.current.material as THREE.Material & {
      radius: number;
      zoom: number;
    };
    easing.damp(material, "radius", hovered ? 0.25 : 0.1, 0.2, delta);
    easing.damp(material, "zoom", hovered ? 1 : 1.5, 0.2, delta);
  });
  return (
    <Image
      ref={ref}
      url={url}
      transparent
      side={THREE.DoubleSide}
      onPointerOver={over}
      onPointerOut={out}
      {...props}
    >
      <bentPlaneGeometry args={[0.1, 1, 1, 20, 20]} />
    </Image>
  );
}

/**
 * Render library, grouped by its three project catalogs (two bedroom suites +
 * a kitchen). Each visit the ring shows a fresh, random selection of ten
 * cards — guaranteeing at least one render from every catalog so all three are
 * always represented, then filling the rest at random. Safe to use Math.random
 * here: the carousel is client-only (ssr:false), so there's no server render to
 * mismatch against.
 */
const CATALOGS: { prefix: string; count: number }[] = [
  { prefix: "bedroom-01", count: 4 },
  { prefix: "bedroom-02", count: 7 },
  { prefix: "kitchen", count: 10 },
];

const BY_CATALOG = CATALOGS.map((c) =>
  Array.from({ length: c.count }, (_, i) => `/gallery/${c.prefix}-${i + 1}.jpg`),
);

const VISIBLE = 10;

// Ring radius, shared by the card layout and the camera so framing stays in
// sync. Per-card arc spacing is held constant, so the ring sizes to the count.
const FOV = 15;
const RADIUS = (VISIBLE * 1.1) / (2 * Math.PI);

function pickRandom<T>(pool: T[]): T {
  return pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
}

/** Five random renders, one from each catalog first, then filled from the rest. */
function pickCards(): string[] {
  const pools = BY_CATALOG.map((a) => [...a]);
  const picks = pools.map(pickRandom); // one guaranteed per catalog
  const rest = pools.flat();
  while (picks.length < VISIBLE && rest.length) picks.push(pickRandom(rest));
  // Shuffle so the guaranteed picks aren't locked to catalog order.
  for (let i = picks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [picks[i], picks[j]] = [picks[j], picks[i]];
  }
  return picks;
}

function Carousel() {
  // Choose once per mount so the selection is stable across re-renders.
  const cards = useMemo(pickCards, []);
  const count = cards.length;
  return cards.map((url, i) => (
    <Card
      key={url}
      url={url}
      position={[
        Math.sin((i / count) * Math.PI * 2) * RADIUS,
        0,
        Math.cos((i / count) * Math.PI * 2) * RADIUS,
      ]}
      rotation={[0, Math.PI + (i / count) * Math.PI * 2, 0]}
    />
  ));
}

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
      settings to view the gallery.
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

export function CardsCarousel() {
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => setSupported(hasWebGL()), []);

  // Pause the auto-rotating render loop while the gallery is off-screen.
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
      <div ref={wrapRef} className="h-full w-full">
        <Canvas
          flat
          frameloop={active ? "always" : "never"}
          camera={{ position: [0, 0, 100], fov: 15 }}
          className="h-full w-full"
        >
          <fog attach="fog" args={["#ffffff", 8.5, 12]} />
          <ThemeBackground />
          <Suspense fallback={null}>
            <Rig rotation={[0, 0, 0.15]}>
              <Carousel />
            </Rig>
          </Suspense>
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  );
}
