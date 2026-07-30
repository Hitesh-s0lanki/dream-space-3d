"use client";

import * as React from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Container Scroll Animation (adapted from
 * ui.aceternity.com/components/container-scroll-animation).
 *
 * As the section scrolls into view, a laid-back plane rotates up to face the
 * reader — a drawing board being lifted upright. Used to reveal the rendered
 * walkthrough: the flat video literally stands up into a room you can look into.
 *
 * Unlike upstream, the plane has no fixed height — it takes its size from the
 * child. A walkthrough is 16:9 and a render is not, and hard-coding `40rem` letter-
 * boxed both.
 */
export function ContainerScroll({
  titleComponent,
  children,
  className,
  /** Degrees the plane is laid back before it rises. */
  tilt = 22,
}: {
  titleComponent?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  tilt?: number;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [tilt, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const translate = useTransform(scrollYProgress, [0, 1], [40, 0]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full", className)}
      style={{ perspective: "1200px" }}
    >
      {titleComponent ? (
        <Header translate={translate}>{titleComponent}</Header>
      ) : null}
      <Plane rotate={rotate} scale={scale}>
        {children}
      </Plane>
    </div>
  );
}

function Header({
  translate,
  children,
}: {
  translate: MotionValue<number>;
  children: React.ReactNode;
}) {
  return <motion.div style={{ translateY: translate }}>{children}</motion.div>;
}

function Plane({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        transformOrigin: "50% 100%",
        boxShadow:
          "0 9px 20px rgb(0 0 0 / 0.18), 0 37px 37px rgb(0 0 0 / 0.14), 0 84px 50px rgb(0 0 0 / 0.08)",
      }}
      className="w-full rounded-3xl border border-walnut/40 bg-walnut p-2 motion-reduce:!transform-none md:p-3"
    >
      <div className="overflow-hidden rounded-2xl">{children}</div>
    </motion.div>
  );
}
