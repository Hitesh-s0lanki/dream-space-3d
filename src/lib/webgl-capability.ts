"use client";

import { useSyncExternalStore } from "react";

/**
 * What this machine can actually afford to render.
 *
 * The old check only asked "does `getContext('webgl')` return something?" — which
 * is true on a Windows box with hardware acceleration switched off, where Chrome
 * quietly hands back a *software* renderer (SwiftShader). Software WebGL will
 * happily accept a transmission material and a seven-pass post stack and run the
 * page at two frames a second, so "supported" was the wrong question. What we
 * need is a budget.
 *
 *   "none" — no GL at all, or a software rasteriser, or the reader asked their
 *            browser to save data. Render the caption instead.
 *   "low"  — phones, tablets, thin laptops. Cheap scenes only, low DPR.
 *   "high" — a real GPU. Everything is on the table.
 */
export type GpuTier = "none" | "low" | "high";

const TIER_RANK: Record<GpuTier, number> = { none: 0, low: 1, high: 2 };

/** True when `tier` is good enough to run something that needs `required`. */
export function tierMeets(tier: GpuTier, required: GpuTier): boolean {
  return TIER_RANK[tier] >= TIER_RANK[required];
}

/**
 * Renderer strings that mean "the CPU is drawing this".
 *
 * SwiftShader is Chrome's fallback when the GPU is blocklisted or acceleration
 * is off — extremely common on Windows, and the single biggest reason this site
 * crawled there. `llvmpipe` is the Mesa equivalent on Linux, and "Microsoft
 * Basic Render Driver" is what you get on a Windows VM or with a broken driver.
 */
const SOFTWARE_RENDERER =
  /swiftshader|llvmpipe|softpipe|basic render|software|generic renderer|paravirtual/i;

function detectTier(): GpuTier {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return "none";
  }

  // An explicit request to not burn the reader's data plan. Ambient geometry is
  // exactly the sort of thing Save-Data is asking us to drop.
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  if (connection?.saveData) return "none";

  let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
  try {
    const canvas = document.createElement("canvas");
    gl = (canvas.getContext("webgl2") ??
      canvas.getContext("webgl")) as WebGL2RenderingContext | null;
  } catch {
    return "none";
  }
  if (!gl) return "none";

  // Chrome masks RENDERER behind a generic string unless the debug extension is
  // present, so try the extension first and fall back to the plain parameter.
  const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
  const renderer = String(
    (debugInfo && gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)) ||
      gl.getParameter(gl.RENDERER) ||
      "",
  );

  // The probe context is a real context and counts against the browser's
  // per-page limit. Hand it back immediately — three of these were being leaked
  // on the home page alone, which on Windows is a meaningful slice of the budget.
  gl.getExtension("WEBGL_lose_context")?.loseContext();

  if (SOFTWARE_RENDERER.test(renderer)) return "none";

  const cores = navigator.hardwareConcurrency ?? 4;
  const memory =
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  if (coarsePointer || cores <= 4 || memory <= 4) return "low";
  return "high";
}

// Detection allocates a context and reads media queries, so it runs once and the
// answer is memoised. `useSyncExternalStore` also requires a referentially stable
// snapshot — re-detecting per render would loop.
let cached: GpuTier | null = null;

function noopSubscribe() {
  return () => {};
}

function getSnapshot(): GpuTier {
  cached ??= detectTier();
  return cached;
}

/** SSR has no GPU to ask; `null` means "not decided yet". */
function getServerSnapshot(): null {
  return null;
}

/**
 * The machine's render budget, or `null` during SSR / the first paint.
 *
 * Callers should treat `null` as "render nothing yet" rather than "render the
 * fallback" — flashing a caption we're about to replace is worse than a beat of
 * empty background.
 */
export function useGpuTier(): GpuTier | null {
  return useSyncExternalStore(noopSubscribe, getSnapshot, getServerSnapshot);
}

/**
 * How many WebGL contexts we allow to be alive at once.
 *
 * Browsers cap live contexts per page (Chrome ~16, and far fewer in practice on
 * Windows/ANGLE, where hitting the cap force-loses the *oldest* contexts — which
 * is why background scenes were going blank there rather than erroring). Each
 * context also carries its own renderer, program cache and render targets, so a
 * low cap is a memory win as much as a correctness one.
 */
export function maxLiveContexts(tier: GpuTier): number {
  if (tier === "none") return 0;
  return tier === "high" ? 4 : 1;
}

/** Upper bound on device pixel ratio. Fill rate is the usual bottleneck. */
export function maxDpr(tier: GpuTier): number {
  return tier === "high" ? 1.5 : 1;
}
