"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

/**
 * Wraps the app in Lenis smooth scrolling.
 *
 * Three things this has to get right, all of which it previously didn't:
 *
 * `lenis/dist/lenis.css` is not optional. Lenis sets `height: auto` on the
 * scroll container through that stylesheet, and the root layout puts `h-full`
 * (height: 100%) on `<html>` — without the stylesheet the two disagree about how
 * tall the document is and the wheel fights the page. The same file is what makes
 * `[data-lenis-prevent]` work (the model viewer relies on it to keep the wheel
 * while you're zooming) and what locks the page behind an open dialog. It's
 * imported in the root layout.
 *
 * Anchors need `anchors: true`. Lenis swallows the wheel, and with it the
 * browser's native `#hash` jump — the hero's "Explore the Portfolio" link is an
 * in-page anchor and simply did nothing.
 *
 * Reduced motion means no interpolation at all. Easing the viewport is precisely
 * the kind of vestibular motion the setting exists to switch off, so we hand the
 * page back to the browser rather than lowering the lerp.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        // 0.1 reads as drift rather than momentum, and on a frame-starved page
        // it turns into visible lag between the wheel and the pixels. A touch
        // firmer keeps the smoothing without the rubber band.
        lerp: 0.14,
        smoothWheel: true,
        // Touch devices already have momentum scrolling in hardware, off the
        // main thread. Interposing JS only makes it worse.
        syncTouch: false,
        // Restores in-page `#hash` navigation that smooth scrolling breaks.
        anchors: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
