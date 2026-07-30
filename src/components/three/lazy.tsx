"use client";

import dynamic from "next/dynamic";

/**
 * Client-only entry points for the ambient 3D layers.
 *
 * WebGL cannot render on the server, so every scene has to be pulled in with
 * `ssr: false` — and that call itself only works inside a client component.
 * Collecting the wrappers here means server components (most pages and the
 * footer) can drop a scene into their markup with a plain import, and three.js
 * still stays out of the initial bundle for anyone who never scrolls to it.
 *
 * All of them render nothing while loading: they sit *behind* content, so a
 * spinner would be worse than a beat of plain background.
 */
export const AmbientDust = dynamic(
  () => import("./dust-field").then((m) => m.DustField),
  { ssr: false, loading: () => null },
);

export const AmbientGlass = dynamic(
  () => import("./glass-shapes").then((m) => m.GlassShapes),
  { ssr: false, loading: () => null },
);

export const AmbientReveal = dynamic(
  () => import("./canvas-reveal-effect").then((m) => m.CanvasRevealEffect),
  { ssr: false, loading: () => null },
);

export const AmbientRenderWall = dynamic(
  () => import("./render-wall").then((m) => m.RenderWall),
  { ssr: false, loading: () => null },
);
