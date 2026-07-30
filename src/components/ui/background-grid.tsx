"use client";

import { cn } from "@/lib/utils";

/**
 * Grid / Dot backgrounds (adapted from
 * ui.aceternity.com/components/grid-and-dot-backgrounds).
 *
 * The quiet drafting-paper grounds used under most light sections. Both fade to
 * nothing at the edges by default, so they read as paper texture rather than as a
 * table. Purely decorative — hence `aria-hidden` and `pointer-events-none`.
 */
export function GridPattern({
  className,
  size = 56,
  fade = true,
}: {
  className?: string;
  size?: number;
  fade?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage:
          "linear-gradient(to right, color-mix(in oklab, var(--border) 55%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--border) 55%, transparent) 1px, transparent 1px)",
        backgroundSize: `${size}px ${size}px`,
        maskImage: fade
          ? "radial-gradient(ellipse at center, black 25%, transparent 75%)"
          : undefined,
      }}
    />
  );
}

export function DotPattern({
  className,
  size = 22,
  fade = true,
}: {
  className?: string;
  size?: number;
  fade?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage:
          "radial-gradient(color-mix(in oklab, var(--border) 90%, transparent) 1px, transparent 1px)",
        backgroundSize: `${size}px ${size}px`,
        maskImage: fade
          ? "radial-gradient(ellipse at center, black 20%, transparent 75%)"
          : undefined,
      }}
    />
  );
}
