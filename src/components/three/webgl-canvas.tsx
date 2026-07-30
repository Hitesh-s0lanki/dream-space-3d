"use client";

import * as React from "react";
import { Canvas, type CanvasProps } from "@react-three/fiber";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  maxDpr,
  tierMeets,
  useGpuTier,
  type GpuTier,
} from "@/lib/webgl-capability";
import { cn } from "@/lib/utils";
import { requestContext, setTier, type WantLevel } from "./context-budget";

/**
 * The shell every scene on this site sits inside.
 *
 * WebGL is the one part of this UI that can genuinely be *unavailable* — no
 * hardware acceleration, a lost context, a driver crash mid-session — and it is
 * also the one part that can be available but ruinously slow. Both are handled
 * here rather than re-implemented per scene:
 *
 *   1. a capability tier (see `webgl-capability`), so a software rasteriser is
 *      treated as "can't render" rather than "renders at 2fps",
 *   2. a leased context (see `context-budget`), so the page never holds more
 *      live renderers than the browser will tolerate — the canvas *unmounts*
 *      when it loses its lease, which is the only way to actually free one,
 *   3. an error boundary plus a `webglcontextlost` listener, because context
 *      loss arrives as a DOM event and never as a thrown error, so the boundary
 *      alone would leave a silently black canvas,
 *   4. a parked render loop while on-screen-but-idle, so a scene that still
 *      holds its lease isn't burning frames.
 */

/** Distance outside the viewport at which a scene starts warming up. */
const WARM_MARGIN = "600px";
/** Pause before rebuilding a context the driver took away. */
const CONTEXT_RETRY_MS = 1500;
/** After this many losses, stop asking and leave the caption up for good. */
const MAX_CONTEXT_LOSSES = 2;

class WebGLErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export type WebGLCanvasProps = Omit<CanvasProps, "children" | "className"> & {
  children: React.ReactNode;
  className?: string;
  /** Shown when the scene can't or shouldn't run. */
  fallback?: React.ReactNode;
  /**
   * Minimum tier this scene needs. Cheap point clouds are fine on `"low"`;
   * anything sampling the framebuffer (transmission, reflections, post) should
   * ask for `"high"`.
   */
  minTier?: GpuTier;
  /**
   * Decorative scenes are skipped entirely for readers who asked for reduced
   * motion. Set false for content the page is actually about, like the model
   * viewer, which still needs to render — just without the idle animation.
   */
  decorative?: boolean;
  /**
   * Interactive scenes outrank decorative ones when contexts are scarce, and
   * keep rendering while on screen even if something else wants a lease.
   */
  interactive?: boolean;
  /** Keep rendering even when scrolled out of view (rarely wanted). */
  alwaysOn?: boolean;
};

export function WebGLCanvas({
  children,
  className,
  fallback,
  minTier = "low",
  decorative = true,
  interactive = false,
  alwaysOn = false,
  dpr,
  gl,
  ...canvasProps
}: WebGLCanvasProps) {
  const tier = useGpuTier();
  const reducedMotion = usePrefersReducedMotion();
  const wrapRef = React.useRef<HTMLDivElement>(null);

  // Whether this canvas currently holds a context lease.
  const [leased, setLeased] = React.useState(false);
  // Whether it's actually on screen (drives the render loop, not the lease).
  const [onScreen, setOnScreen] = React.useState(false);
  // Set when the GPU takes the context away underneath us.
  const [contextLost, setContextLost] = React.useState(false);
  // How many times that has happened. A driver reset is worth retrying; a scene
  // this machine simply can't hold is not, and retrying forever would thrash.
  const [lossCount, setLossCount] = React.useState(0);

  const unrecoverable = lossCount > MAX_CONTEXT_LOSSES;
  const eligible =
    tier !== null &&
    tier !== "none" &&
    tierMeets(tier, minTier) &&
    !(decorative && reducedMotion) &&
    !unrecoverable;

  // Unmounting the canvas is what actually disposes the dead context; once it's
  // gone, remounting gets a fresh one. The pause gives a driver mid-reset time
  // to finish before we ask it for another.
  React.useEffect(() => {
    if (!contextLost || unrecoverable) return;
    const timer = setTimeout(() => setContextLost(false), CONTEXT_RETRY_MS);
    return () => clearTimeout(timer);
  }, [contextLost, unrecoverable]);

  React.useEffect(() => {
    if (tier) setTier(tier);
  }, [tier]);

  // Two observers: a wide one decides whether we deserve a context at all, a
  // tight one decides whether to spend frames on it.
  React.useEffect(() => {
    if (!eligible) return;
    const node = wrapRef.current;
    if (!node) return;

    const lease = requestContext(setLeased);

    // `alwaysOn` scenes still take a lease — they just never give it up, so they
    // sit at the top of the queue permanently.
    let near = alwaysOn;
    let visible = alwaysOn;

    const applyWant = () => {
      // While recovering from a loss we hold no claim — someone else may as well
      // use the slot for the second and a half we're sitting out.
      const want: WantLevel = contextLost
        ? 0
        : visible
          ? interactive
            ? 3
            : 2
          : near
            ? 1
            : 0;
      lease.setWant(want);
      setOnScreen(visible);
    };

    const warmObserver = new IntersectionObserver(
      ([entry]) => {
        near = alwaysOn || entry.isIntersecting;
        applyWant();
      },
      { rootMargin: WARM_MARGIN },
    );
    const visibleObserver = new IntersectionObserver(
      ([entry]) => {
        visible = alwaysOn || entry.isIntersecting;
        applyWant();
      },
      { rootMargin: "0px" },
    );

    warmObserver.observe(node);
    visibleObserver.observe(node);
    applyWant();

    return () => {
      warmObserver.disconnect();
      visibleObserver.disconnect();
      lease.release();
    };
  }, [eligible, alwaysOn, interactive, contextLost]);

  // Context loss arrives as a DOM event, never as a thrown error, so the error
  // boundary above would never see it — the canvas would just go black. This is
  // the only thing standing between a driver reset and a dead scene.
  const handleCreated = React.useCallback<NonNullable<CanvasProps["onCreated"]>>(
    (state) => {
      const canvas = state.gl.domElement;
      canvas.addEventListener("webglcontextlost", (event: Event) => {
        // Preventing the default is what makes restoration possible at all;
        // without it the browser writes the context off permanently.
        event.preventDefault();
        setContextLost(true);
        setLossCount((n) => n + 1);
      });
      canvasProps.onCreated?.(state);
    },
    // `onCreated` is read from the latest props at call time; re-subscribing on
    // every parent render would tear down the listener we just attached.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const caption = fallback ?? null;

  // Still probing — render nothing rather than flashing a fallback we may not need.
  if (tier === null) return null;
  // Genuinely can't run here. This is the only path that earns the caption:
  // "unavailable" is a claim about the machine, and a scene that is merely
  // queued behind a higher-priority one, or off-screen, or rebuilding after a
  // driver reset, is none of those things — it renders nothing and comes back.
  if (!eligible) return <>{caption}</>;

  // The wrapper always renders: it's the element the observers watch, so it has
  // to exist before the canvas can be granted a lease.
  return (
    <WebGLErrorBoundary fallback={caption}>
      <div ref={wrapRef} className={cn("h-full w-full", className)}>
        {leased && !contextLost ? (
          <Canvas
            frameloop={alwaysOn || onScreen ? "always" : "never"}
            dpr={dpr ?? [1, maxDpr(tier)]}
            gl={{
              antialias: false,
              alpha: true,
              // Never `"high-performance"` by default: on Windows laptops with
              // switchable graphics it forces the discrete GPU, which spins up
              // the fan for a background texture and, when several contexts ask
              // at once, is a common way to get no context at all.
              powerPreference: "default",
              ...gl,
            }}
            {...canvasProps}
            onCreated={handleCreated}
            className="h-full w-full"
          >
            {children}
          </Canvas>
        ) : null}
      </div>
    </WebGLErrorBoundary>
  );
}
