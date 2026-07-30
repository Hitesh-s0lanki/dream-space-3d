"use client";

import * as React from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Comet Card (adapted from ui.aceternity.com/components/comet-card).
 *
 * A spring-damped 3D tilt with a moving specular sheen — the card feels like a
 * physical laminated print catching the light. Unlike `CardContainer`, the tilt
 * here is springy and the whole surface lifts, which suits image-led tiles.
 */
export function CometCard({
  rotateDepth = 14,
  translateDepth = 14,
  className,
  children,
}: {
  rotateDepth?: number;
  translateDepth?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const spring = { stiffness: 100, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useMotionValue(0), spring);
  const rotateY = useSpring(useMotionValue(0), spring);
  const translateX = useSpring(useMotionValue(0), spring);
  const translateY = useSpring(useMotionValue(0), spring);
  const glareOpacity = useSpring(useMotionValue(0), spring);

  const glareBackground = useMotionTemplate`radial-gradient(farthest-corner circle at ${x}% ${y}%, rgba(255,255,255,0.75) 8%, rgba(255,255,255,0.28) 22%, rgba(255,255,255,0) 62%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    x.set(px * 100);
    y.set(py * 100);
    rotateX.set((py - 0.5) * -rotateDepth);
    rotateY.set((px - 0.5) * rotateDepth);
    translateX.set((px - 0.5) * translateDepth);
    translateY.set((py - 0.5) * translateDepth);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    translateX.set(0);
    translateY.set(0);
    glareOpacity.set(0);
  };

  return (
    <div style={{ perspective: "1000px" }} className={cn("relative", className)}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => glareOpacity.set(0.55)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          translateX,
          translateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.015 }}
        transition={{ type: "spring", stiffness: 200, damping: 24 }}
        className="relative h-full w-full motion-reduce:!transform-none"
      >
        {children}
        <motion.div
          className="pointer-events-none absolute inset-0 z-30 mix-blend-soft-light"
          style={{
            background: glareBackground,
            opacity: glareOpacity,
            borderRadius: "inherit",
          }}
        />
      </motion.div>
    </div>
  );
}
