"use client";

import * as React from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

import { cn } from "@/lib/utils";
import { WebGLCanvas } from "./webgl-canvas";

/**
 * Canvas Reveal Effect (adapted from
 * ui.aceternity.com/components/canvas-reveal-effect).
 *
 * A GPU dot matrix that wipes in from one edge with per-dot randomised delay and
 * opacity — the "render coming into focus" motif, in an actual WebGL layer. Used
 * behind service and pillar cards on hover, so the card literally renders itself.
 *
 * Written as a single full-screen-quad shader rather than the original's
 * instanced approach: one draw call, no geometry to build, and it scales to any
 * card size for free.
 */
const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy * 2.0, 0.0, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  precision mediump float;

  varying vec2 vUv;

  uniform float u_time;
  uniform vec2  u_resolution;
  uniform float u_dotSize;
  uniform float u_speed;
  uniform vec3  u_colorA;
  uniform vec3  u_colorB;
  uniform float u_reverse;

  float rand(vec2 co) {
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 px = vUv * u_resolution;
    vec2 cell = floor(px / u_dotSize);
    vec2 local = fract(px / u_dotSize) - 0.5;

    // Dot mask — a soft disc inside each cell.
    float dot_ = 1.0 - smoothstep(0.16, 0.34, length(local));
    if (dot_ <= 0.001) discard;

    // Each cell gets its own start offset, biased so the wipe travels
    // diagonally across the card rather than appearing all at once.
    float bias = mix(vUv.x, 1.0 - vUv.x, u_reverse) * 0.6 + vUv.y * 0.25;
    float jitter = rand(cell) * 0.55;
    float intro = clamp((u_time * u_speed) - bias - jitter, 0.0, 1.0);

    // Steady twinkle once a dot has arrived, so the field never goes static.
    float twinkle = 0.72 + 0.28 * sin(u_time * 1.6 + rand(cell + 3.1) * 6.28);

    vec3 color = mix(u_colorA, u_colorB, rand(cell + 1.7));
    float alpha = dot_ * intro * twinkle;

    gl_FragColor = vec4(color, alpha);
  }
`;

/**
 * Uniforms are created once and then driven entirely through the material ref
 * inside `useFrame` — the standard R3F way to avoid re-rendering React 60 times
 * a second, and the reason props are re-synced per frame rather than in effects.
 */
function initialUniforms() {
  return {
    u_time: { value: 0 },
    u_resolution: { value: new THREE.Vector2(1, 1) },
    u_dotSize: { value: 4 },
    u_speed: { value: 0.5 },
    u_colorA: { value: new THREE.Color("#ffffff") },
    u_colorB: { value: new THREE.Color("#ffffff") },
    u_reverse: { value: 0 },
  };
}

function DotMatrix({
  colors,
  dotSize,
  speed,
  reverse,
}: {
  colors: [string, string];
  dotSize: number;
  speed: number;
  reverse: boolean;
}) {
  const { viewport } = useThree();
  const ref = React.useRef<THREE.ShaderMaterial>(null);
  const uniforms = React.useMemo(() => initialUniforms(), []);

  useFrame((state, delta) => {
    const material = ref.current;
    if (!material) return;
    const u = material.uniforms;
    u.u_time.value += delta;
    u.u_dotSize.value = dotSize;
    u.u_speed.value = speed;
    u.u_reverse.value = reverse ? 1 : 0;
    u.u_colorA.value.set(colors[0]);
    u.u_colorB.value.set(colors[1]);
    u.u_resolution.value.set(
      state.size.width * viewport.dpr,
      state.size.height * viewport.dpr,
    );
  });

  return (
    <mesh>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={ref}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniforms}
        transparent
        depthTest={false}
      />
    </mesh>
  );
}

export function CanvasRevealEffect({
  colors = ["#c2683a", "#8a9a5b"],
  dotSize = 4,
  animationSpeed = 0.5,
  reverse = false,
  showGradient = true,
  containerClassName,
}: {
  /** Two hexes the dots are randomly mixed between. */
  colors?: [string, string];
  /** Dot pitch in device pixels. */
  dotSize?: number;
  animationSpeed?: number;
  /** Wipe from the right instead of the left. */
  reverse?: boolean;
  /** Fade the bottom of the field into the card so type stays readable. */
  showGradient?: boolean;
  containerClassName?: string;
}) {
  return (
    <div className={cn("relative h-full w-full bg-charcoal", containerClassName)}>
      {/* Through the shell, not a bare `<Canvas>`: these mount on hover, several
          cards sit in one row, and without a context lease a few quick passes
          along the row can leave the page holding more live renderers than the
          browser allows. */}
      <div className="absolute inset-0">
        {/* Interactive: this only exists because someone is hovering the card
            right now, so it has to outrank the idle backgrounds already holding
            leases — otherwise the hover reads as broken. */}
        <WebGLCanvas interactive fallback={null}>
          <DotMatrix
            colors={colors}
            dotSize={dotSize}
            speed={animationSpeed}
            reverse={reverse}
          />
        </WebGLCanvas>
      </div>
      {showGradient ? (
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-charcoal to-84%" />
      ) : null}
    </div>
  );
}
