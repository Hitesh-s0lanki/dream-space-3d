"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Draggable Card (adapted from ui.aceternity.com/components/draggable-card).
 *
 * A card you can physically pick up and fling. It tilts toward the pointer while
 * hovered, takes a rotation kick from the velocity you release it at, and springs
 * back. Used for the mood-board stack on /about, where "pick it up and look" is
 * the whole point.
 *
 * Drag is constrained to the parent container, not the viewport as upstream does —
 * a print that can be thrown into the footer is a bug, not a feature.
 */
export function DraggableCardContainer({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("relative [perspective:2500px]", className)}>
      {children}
    </div>
  );
}

export function DraggableCardBody({
  className,
  children,
  /** Resting rotation, so a stack reads as dealt by hand. */
  rotate = 0,
}: {
  className?: string;
  children?: React.ReactNode;
  rotate?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const spring = { stiffness: 100, damping: 20, mass: 0.5 };

  const rotateX = useSpring(
    useTransform(pointerY, [-200, 200], [14, -14]),
    spring,
  );
  const rotateY = useSpring(
    useTransform(pointerX, [-200, 200], [-14, 14]),
    spring,
  );
  const glare = useSpring(
    useTransform(pointerX, [-200, 0, 200], [0.22, 0, 0.22]),
    spring,
  );

  // Fling: the rotation kick on release comes from how fast it was moving.
  const dragX = useMotionValue(0);
  const velocityX = useVelocity(dragX);
  const kick = useSpring(useMotionValue(0), { stiffness: 60, damping: 12 });

  return (
    <motion.div
      ref={ref}
      drag={reduced ? false : true}
      dragElastic={0.15}
      dragConstraints={{ top: -40, left: -60, right: 60, bottom: 40 }}
      dragMomentum
      style={{ x: dragX, rotateX, rotateY, rotate: kick, willChange: "transform" }}
      onDragEnd={() => {
        const speed = Math.abs(velocityX.get());
        kick.set(rotate);
        // A hard throw spins it a little further before it settles.
        if (speed > 400) kick.set(rotate + (velocityX.get() > 0 ? 8 : -8));
      }}
      onPointerMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        pointerX.set(e.clientX - (rect.left + rect.width / 2));
        pointerY.set(e.clientY - (rect.top + rect.height / 2));
      }}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
      whileHover={{ scale: 1.02, zIndex: 30 }}
      whileDrag={{ scale: 1.04, zIndex: 40 }}
      initial={{ rotate }}
      className={cn(
        "relative cursor-grab overflow-hidden rounded-2xl bg-card shadow-2xl shadow-charcoal/25 transform-3d active:cursor-grabbing",
        className,
      )}
    >
      {children}
      <motion.div
        aria-hidden
        style={{ opacity: glare }}
        className="pointer-events-none absolute inset-0 bg-white select-none"
      />
    </motion.div>
  );
}
