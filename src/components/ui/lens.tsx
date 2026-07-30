"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Lens (adapted from ui.aceternity.com/components/lens).
 *
 * A circular magnifier that follows the pointer over an image. On a portfolio
 * this earns its place: it lets someone actually inspect a material, a joint, or
 * a finish inside a render instead of opening a lightbox.
 *
 * Children are duplicated inside a clipped, scaled layer — so whatever renders
 * (an `<Image>`, a `<video>`) magnifies without a second asset.
 */
export function Lens({
  children,
  zoomFactor = 1.7,
  lensSize = 190,
  className,
}: {
  children: React.ReactNode;
  zoomFactor?: number;
  lensSize?: number;
  className?: string;
}) {
  const [hovering, setHovering] = React.useState(false);
  const [pos, setPos] = React.useState({ x: 100, y: 100 });

  return (
    <div
      className={cn("relative z-20 overflow-hidden rounded-2xl", className)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
    >
      {children}

      <AnimatePresence>
        {hovering ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
            style={{
              maskImage: `radial-gradient(circle ${lensSize / 2}px at ${pos.x}px ${pos.y}px, black 100%, transparent 100%)`,
              WebkitMaskImage: `radial-gradient(circle ${lensSize / 2}px at ${pos.x}px ${pos.y}px, black 100%, transparent 100%)`,
              transformOrigin: `${pos.x}px ${pos.y}px`,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                transform: `scale(${zoomFactor})`,
                transformOrigin: `${pos.x}px ${pos.y}px`,
              }}
            >
              {children}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Rim light on the glass */}
      <AnimatePresence>
        {hovering ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute z-40 rounded-full ring-1 ring-ivory/50 shadow-[0_10px_30px_rgb(0_0_0/0.35)]"
            style={{
              width: lensSize,
              height: lensSize,
              left: pos.x - lensSize / 2,
              top: pos.y - lensSize / 2,
            }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
