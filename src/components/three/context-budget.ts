"use client";

import { maxLiveContexts, type GpuTier } from "@/lib/webgl-capability";

/**
 * Rations live WebGL contexts across the page.
 *
 * The home page asks for five scenes — hero, stats dust, carousel, CTA glass,
 * footer dust — and every other page asks for two or three. Parking a scene's
 * render loop (`frameloop="never"`) stops it burning frames but does *not* give
 * the context back: the renderer, its programs and its render targets all stay
 * resident. Five simultaneous contexts is survivable on a desktop GPU and is not
 * survivable on Windows/ANGLE, where exceeding the cap force-loses the oldest
 * contexts and the affected canvases simply go black with no error to catch.
 *
 * So scenes don't own contexts, they *lease* them. Each canvas reports how badly
 * it wants one; the manager grants the top few and tells the rest to unmount,
 * which disposes their renderer for real.
 *
 * Want levels:
 *   0 — off-screen and not close. Give the context back.
 *   1 — approaching the viewport. Worth holding a context so it's warm on arrival.
 *   2 — on screen.
 *   3 — on screen and interactive (the hero, the model viewer). Never evicted by
 *       a decorative background.
 */
export type WantLevel = 0 | 1 | 2 | 3;

type Lease = {
  want: WantLevel;
  /** Registration order — a stable tiebreak so grants don't shuffle randomly. */
  seq: number;
  granted: boolean;
  onChange: (granted: boolean) => void;
};

const leases = new Set<Lease>();
let seqCounter = 0;
let tier: GpuTier = "low";

/**
 * The tier is discovered on the client after first paint, so the manager starts
 * pessimistic and is corrected once. Re-balances if the answer changed.
 */
export function setTier(next: GpuTier) {
  if (next === tier) return;
  tier = next;
  rebalance();
}

function rebalance() {
  const max = maxLiveContexts(tier);

  const contenders = [...leases].filter((lease) => lease.want > 0);
  contenders.sort(
    (a, b) =>
      // Strongest need first…
      b.want - a.want ||
      // …then whoever already holds a context. This is the hysteresis that keeps
      // scrolling from thrashing: an equally-deserving newcomer does not evict a
      // live scene, because tearing down and rebuilding a context costs shader
      // recompiles and shows as a visible hitch.
      Number(b.granted) - Number(a.granted) ||
      a.seq - b.seq,
  );

  const winners = new Set(contenders.slice(0, max));

  for (const lease of leases) {
    const granted = winners.has(lease);
    if (granted !== lease.granted) {
      lease.granted = granted;
      lease.onChange(granted);
    }
  }
}

/**
 * Claim a place in the queue. Returns a handle for updating how badly this
 * canvas wants a context, plus a release function for unmount.
 */
export function requestContext(onChange: (granted: boolean) => void) {
  const lease: Lease = {
    want: 0,
    seq: seqCounter++,
    granted: false,
    onChange,
  };
  leases.add(lease);

  return {
    setWant(want: WantLevel) {
      if (lease.want === want) return;
      lease.want = want;
      rebalance();
    },
    release() {
      leases.delete(lease);
      rebalance();
    },
  };
}
