/**
 * Deterministic pseudo-randomness.
 *
 * The 3D layers on this site need scatter — beam delays, dust positions, per-cell
 * jitter — but `Math.random()` is impure, so calling it while rendering gives a
 * different scene on the server than on the client (hydration noise) and a
 * different one again on every re-render. Seeding instead makes the scatter a
 * pure function of a number: stable across renders, identical on both sides of
 * hydration, and reproducible when something looks wrong.
 *
 * mulberry32 — 32-bit state, one multiply-xor round. Fast, and far better
 * distributed than the usual `sin(seed) * 43758.5453` fract trick.
 */
export function createRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
