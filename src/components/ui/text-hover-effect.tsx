"use client";

import * as React from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Text Hover Effect (adapted from
 * ui.aceternity.com/components/text-hover-effect).
 *
 * The wordmark is drawn twice in SVG: once as a hairline outline, once filled
 * with a gradient that is only visible through a radial mask following the
 * pointer. Moving across it feels like wiping condensation off lettering — the
 * mark reads as engraved rather than typed.
 *
 * The stroke also draws itself in on mount, so the wordmark arrives rather than
 * appearing. Everything is percentage-based inside a `viewBox`, so one component
 * scales from a footer mark to a full-bleed headline.
 */
export function TextHoverEffect({
  text,
  className,
  /** Stroke thickness of the outline, in viewBox units. */
  strokeWidth = 0.4,
  /** Radius of the revealed area, as a percentage of the box. */
  radius = 22,
}: {
  text: string;
  className?: string;
  strokeWidth?: number;
  radius?: number;
}) {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = React.useState(false);
  const [cursor, setCursor] = React.useState({ x: 50, y: 50 });

  const id = React.useId().replace(/:/g, "");

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onPointerMove={(e) => {
        const rect = svgRef.current?.getBoundingClientRect();
        if (!rect) return;
        setCursor({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }}
      className={cn("select-none", className)}
      role="img"
      aria-label={text}
    >
      <defs>
        <linearGradient
          id={`grad-${id}`}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="300"
          y2="0"
        >
          <stop offset="0%" stopColor="var(--terracotta)" />
          <stop offset="50%" stopColor="var(--beige)" />
          <stop offset="100%" stopColor="var(--sage)" />
        </linearGradient>

        {/* Follows the pointer; parked and invisible when not hovered. */}
        <radialGradient
          id={`reveal-${id}`}
          gradientUnits="objectBoundingBox"
          r={`${radius}%`}
          cx={`${cursor.x}%`}
          cy={`${cursor.y}%`}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </radialGradient>

        <mask id={`mask-${id}`}>
          <rect
            x="0"
            y="0"
            width="300"
            height="100"
            fill={hovered ? `url(#reveal-${id})` : "black"}
          />
        </mask>
      </defs>

      {/* Outline — draws itself in on mount */}
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth={strokeWidth}
        className="fill-transparent stroke-current font-[helvetica] text-7xl font-bold opacity-40"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{ strokeDashoffset: 0, strokeDasharray: 1000 }}
        transition={{ duration: 3, ease: "easeInOut" }}
      >
        {text}
      </motion.text>

      {/* Gradient fill, visible only through the pointer mask */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke={`url(#grad-${id})`}
        strokeWidth={strokeWidth}
        mask={`url(#mask-${id})`}
        className="fill-transparent font-[helvetica] text-7xl font-bold"
      >
        {text}
      </text>
    </svg>
  );
}
