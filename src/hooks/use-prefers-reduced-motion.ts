"use client";

import { useSyncExternalStore } from "react";

/**
 * Tracks the `prefers-reduced-motion` media query.
 *
 * Written with `useSyncExternalStore` rather than an effect + setState pair: the
 * query is external state we're subscribing to, so this is both the idiomatic
 * shape and the one that avoids a render-then-correct flash. The server snapshot
 * is `false` — SSR has no media query to read, and rendering the motion-enabled
 * markup first means a reduced-motion reader sees a single corrective render
 * rather than animation that starts and stops.
 */
const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
