"use client";

import * as React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import { createRandom } from "@/lib/random";
import { WebGLCanvas } from "./webgl-canvas";

/**
 * Ambient scene: dust in a shaft of light.
 *
 * The oldest trick in interior photography — motes suspended in sunlight give a
 * room air and scale. Here it's a single `THREE.Points` cloud with a small custom
 * shader: soft round sprites, size attenuated by depth, drifting upward and
 * wrapping so the field never empties. One draw call, no textures.
 *
 * Deliberately does *not* respond to the pointer: this layer sits under content,
 * and a background that reacts competes with the things that should.
 */
const VERTEX = /* glsl */ `
  uniform float u_time;
  uniform float u_size;
  uniform float u_spread;

  attribute float a_seed;

  varying float v_alpha;

  void main() {
    vec3 p = position;

    // Rise slowly and wrap back to the floor of the volume.
    float rise = mod(u_time * (0.06 + a_seed * 0.10), u_spread);
    p.y = mod(p.y + rise + u_spread * 0.5, u_spread) - u_spread * 0.5;

    // A lazy horizontal wander, each mote on its own phase.
    p.x += sin(u_time * 0.22 + a_seed * 8.0) * 0.28;
    p.z += cos(u_time * 0.18 + a_seed * 5.0) * 0.28;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = u_size * (1.0 + a_seed) * (12.0 / -mv.z);

    // Fade at the far edge of the volume so nothing pops in or out.
    v_alpha = smoothstep(u_spread * 0.5, u_spread * 0.15, abs(p.z));
  }
`;

const FRAGMENT = /* glsl */ `
  precision mediump float;

  uniform vec3 u_color;
  varying float v_alpha;

  void main() {
    // Soft round sprite from the point's own coordinates.
    float d = length(gl_PointCoord - vec2(0.5));
    float mask = 1.0 - smoothstep(0.28, 0.5, d);
    if (mask <= 0.001) discard;
    gl_FragColor = vec4(u_color, mask * v_alpha * 0.75);
  }
`;

function initialUniforms() {
  return {
    u_time: { value: 0 },
    u_size: { value: 2 },
    u_spread: { value: 14 },
    u_color: { value: new THREE.Color("#ffffff") },
  };
}

function Motes({
  count,
  color,
  spread,
  size,
  seed,
}: {
  count: number;
  color: string;
  spread: number;
  size: number;
  seed: number;
}) {
  const materialRef = React.useRef<THREE.ShaderMaterial>(null);
  const uniforms = React.useMemo(() => initialUniforms(), []);

  // Seeded, so the cloud is identical on the server and the client and doesn't
  // reshuffle if this ever re-renders.
  const { positions, seeds } = React.useMemo(() => {
    const random = createRandom(seed);
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (random() - 0.5) * spread * 1.6;
      positions[i * 3 + 1] = (random() - 0.5) * spread;
      positions[i * 3 + 2] = (random() - 0.5) * spread;
      seeds[i] = random();
    }
    return { positions, seeds };
  }, [count, spread, seed]);

  useFrame((_, delta) => {
    const material = materialRef.current;
    if (!material) return;
    const u = material.uniforms;
    u.u_time.value += delta;
    u.u_size.value = size;
    u.u_spread.value = spread;
    u.u_color.value.set(color);
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-a_seed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function DustField({
  count = 900,
  color = "#f6efe4",
  spread = 14,
  size = 2.2,
  seed = 1337,
  className,
}: {
  count?: number;
  /** Mote colour. Warm ivory on dark grounds, walnut on light ones. */
  color?: string;
  /** Size of the cubic volume the motes live in. */
  spread?: number;
  size?: number;
  /** Change to get a different scatter; same seed always gives the same cloud. */
  seed?: number;
  className?: string;
}) {
  return (
    <WebGLCanvas
      className={className}
      // One draw call, no framebuffer sampling — this is the cheapest scene on the
      // site and runs fine on the low tier. dpr and gl defaults come from the shell.
      camera={{ position: [0, 0, 10], fov: 45 }}
      fallback={null}
    >
      <Motes
        count={count}
        color={color}
        spread={spread}
        size={size}
        seed={seed}
      />
    </WebGLCanvas>
  );
}
