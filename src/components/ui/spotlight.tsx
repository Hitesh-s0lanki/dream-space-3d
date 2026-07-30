"use client";

import * as React from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Lighting, in two forms (adapted from ui.aceternity.com/components/spotlight-new
 * and .../card-spotlight).
 *
 * `SpotlightNew` is a pair of drifting conic sheets — a lighting rig over a whole
 * hero. `SpotlightCard` is the same idea at component scale: a warm pool of light
 * that follows the pointer inside a bordered surface.
 */
export function SpotlightNew({
  gradientFirst = "radial-gradient(68.54% 68.72% at 55.02% 31.46%, oklch(0.72 0.11 42 / 0.10) 0, oklch(0.72 0.11 42 / 0.04) 50%, transparent 80%)",
  gradientSecond = "radial-gradient(50% 50% at 50% 50%, oklch(0.99 0.02 85 / 0.08) 0, oklch(0.72 0.11 42 / 0.03) 80%, transparent 100%)",
  gradientThird = "radial-gradient(50% 50% at 50% 50%, oklch(0.99 0.02 85 / 0.06) 0, oklch(0.62 0.06 118 / 0.03) 80%, transparent 100%)",
  translateY = -350,
  width = 560,
  height = 1380,
  smallWidth = 240,
  duration = 8,
  xOffset = 100,
}: {
  gradientFirst?: string;
  gradientSecond?: string;
  gradientThird?: string;
  translateY?: number;
  width?: number;
  height?: number;
  smallWidth?: number;
  duration?: number;
  xOffset?: number;
} = {}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden"
      aria-hidden
    >
      <motion.div
        animate={{ x: [0, xOffset, 0] }}
        transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-0 z-40 h-screen w-screen pointer-events-none"
      >
        <div
          style={{
            transform: `translateY(${translateY}px) rotate(-45deg)`,
            background: gradientFirst,
            width: `${width}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 left-0"
        />
        <div
          style={{
            transform: "rotate(-45deg) translate(5%, -50%)",
            background: gradientSecond,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 left-0 origin-top-left"
        />
        <div
          style={{
            transform: "rotate(-45deg) translate(-180%, -70%)",
            background: gradientThird,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 left-0 origin-top-left"
        />
      </motion.div>

      <motion.div
        animate={{ x: [0, -xOffset, 0] }}
        transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 z-40 h-screen w-screen pointer-events-none"
      >
        <div
          style={{
            transform: `translateY(${translateY}px) rotate(45deg)`,
            background: gradientFirst,
            width: `${width}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 right-0"
        />
        <div
          style={{
            transform: "rotate(45deg) translate(-5%, -50%)",
            background: gradientSecond,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 right-0 origin-top-right"
        />
        <div
          style={{
            transform: "rotate(45deg) translate(180%, -70%)",
            background: gradientThird,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 right-0 origin-top-right"
        />
      </motion.div>
    </motion.div>
  );
}

/**
 * Card Spotlight (adapted from ui.aceternity.com/components/card-spotlight):
 * a warm pool of light that follows the pointer inside a bordered surface.
 */
export function SpotlightCard({
  children,
  className,
  radius = 340,
  color = "oklch(0.72 0.11 42 / 0.16)",
}: {
  children: React.ReactNode;
  className?: string;
  radius?: number;
  color?: string;
}) {
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "group/spotlight relative overflow-hidden rounded-3xl border border-border/60 bg-card",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(${radius}px circle at ${pos.x}px ${pos.y}px, ${color}, transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
}
