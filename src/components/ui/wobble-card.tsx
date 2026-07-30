"use client";

import * as React from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Wobble Card (adapted from ui.aceternity.com/components/wobble-card).
 *
 * The card body slides a few pixels toward the pointer while its contents slide
 * the opposite way — a cheap, very readable parallax that makes a large panel
 * feel like it has depth without any tilt at all. Good for wide feature panels
 * where a tilt would distort the type.
 */
export function WobbleCard({
  children,
  containerClassName,
  className,
  noise = true,
}: {
  children: React.ReactNode;
  containerClassName?: string;
  className?: string;
  noise?: boolean;
}) {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = React.useState(false);

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY } = event;
    const rect = event.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (clientX - (rect.left + rect.width / 2)) / 22,
      y: (clientY - (rect.top + rect.height / 2)) / 22,
    });
  };

  return (
    <motion.section
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      style={{
        transform: isHovering
          ? `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0) scale3d(1.014, 1.014, 1)`
          : "translate3d(0px, 0px, 0) scale3d(1, 1, 1)",
        transition: "transform 0.15s ease-out",
      }}
      className={cn(
        "relative mx-auto w-full overflow-hidden rounded-3xl bg-walnut motion-reduce:!transform-none",
        containerClassName,
      )}
    >
      <div
        className="relative h-full overflow-hidden [background-image:radial-gradient(88%_100%_at_top,oklch(1_0_0/0.28),transparent)] sm:mx-0 sm:rounded-3xl"
        style={{
          boxShadow:
            "0 10px 32px rgba(34,42,53,0.12), 0 1px 1px rgba(0,0,0,0.05), 0 0 0 1px rgba(34,42,53,0.05), 0 4px 6px rgba(34,42,53,0.08), 0 24px 108px rgba(47,48,55,0.10)",
        }}
      >
        <motion.div
          style={{
            transform: isHovering
              ? `translate3d(${-mousePosition.x}px, ${-mousePosition.y}px, 0) scale3d(1.03, 1.03, 1)`
              : "translate3d(0px, 0px, 0) scale3d(1, 1, 1)",
            transition: "transform 0.15s ease-out",
          }}
          className={cn("h-full px-6 py-16 sm:px-10", className)}
        >
          {noise ? <Noise /> : null}
          {children}
        </motion.div>
      </div>
    </motion.section>
  );
}

/** Fine film grain, so the flat walnut ground reads as a material. */
function Noise() {
  return (
    <div
      className="pointer-events-none absolute inset-0 h-full w-full scale-[1.2] transform opacity-[0.06] [mask-image:radial-gradient(#fff,transparent,75%)]"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundSize: "160px 160px",
      }}
    />
  );
}
