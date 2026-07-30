"use client";

import * as React from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Hero Highlight (adapted from ui.aceternity.com/components/hero-highlight).
 *
 * The drafting-paper ground, but alive: a second copy of the dot grid sits on top
 * in accent colour, revealed only through a radial mask that follows the pointer.
 * The paper appears to light up under your hand.
 *
 * The mask is driven by motion values rather than React state, so tracking the
 * pointer never re-renders the subtree — which matters here, because this wraps
 * whole page headers.
 */
const DOT = (color: string) =>
  `radial-gradient(${color} 1px, transparent 1px)`;

export function HeroHighlight({
  children,
  className,
  containerClassName,
  /** Radius of the lit pool, in px. */
  radius = 260,
  size = 22,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  radius?: number;
  size?: number;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const mask = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, black 0%, transparent 100%)`;

  return (
    <div
      className={cn("group/highlight relative", containerClassName)}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }}
    >
      {/* Resting grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: DOT(
            "color-mix(in oklab, var(--border) 90%, transparent)",
          ),
          backgroundSize: `${size}px ${size}px`,
          maskImage:
            "radial-gradient(ellipse at center, black 20%, transparent 75%)",
        }}
      />

      {/* Lit grid, revealed through the pointer-tracked mask */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/highlight:opacity-100"
        style={{
          backgroundImage: DOT("var(--terracotta)"),
          backgroundSize: `${size}px ${size}px`,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />

      <div className={cn("relative", className)}>{children}</div>
    </div>
  );
}
