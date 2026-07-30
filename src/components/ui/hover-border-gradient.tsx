"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Hover Border Gradient (adapted from
 * ui.aceternity.com/components/hover-border-gradient).
 *
 * A soft highlight walks around the element's edge; on hover it stops walking
 * and lights the whole rim. Used for secondary actions and pills that should
 * read as raised without shouting like the primary CTA.
 */
type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

const MOVING: Record<Direction, string> = {
  TOP: "radial-gradient(20.7% 50% at 50% 0%, oklch(0.26 0.008 60 / 1) 0%, transparent 100%)",
  LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, oklch(0.26 0.008 60 / 1) 0%, transparent 100%)",
  BOTTOM:
    "radial-gradient(20.7% 50% at 50% 100%, oklch(0.26 0.008 60 / 1) 0%, transparent 100%)",
  RIGHT:
    "radial-gradient(16.2% 41.2% at 100% 50%, oklch(0.26 0.008 60 / 1) 0%, transparent 100%)",
};

const HIGHLIGHT =
  "radial-gradient(75% 181% at 50% 50%, var(--terracotta) 0%, transparent 100%)";

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  href,
  duration = 1,
  clockwise = true,
  ...props
}: {
  children: React.ReactNode;
  containerClassName?: string;
  className?: string;
  /** Renders a `next/link` instead of a button. */
  href?: string;
  duration?: number;
  clockwise?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}) {
  // The element is chosen in here rather than via an `as` prop, because a server
  // component cannot pass a component function across the client boundary — Next
  // rejects it at serialisation ("Functions cannot be passed directly to Client
  // Components"). An `href` string crosses fine.
  const Tag = href ? Link : "button";
  const [hovered, setHovered] = React.useState(false);
  const [direction, setDirection] = React.useState<Direction>("TOP");

  React.useEffect(() => {
    if (hovered) return;
    const order: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
    const id = setInterval(() => {
      setDirection((prev) => {
        const i = order.indexOf(prev);
        const next = clockwise
          ? (i - 1 + order.length) % order.length
          : (i + 1) % order.length;
        return order[next];
      });
    }, duration * 1000);
    return () => clearInterval(id);
  }, [hovered, clockwise, duration]);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...({ href } as any)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex h-min w-fit flex-col flex-nowrap content-center items-center justify-center gap-10 overflow-visible rounded-full border border-border/40 bg-foreground/5 p-px box-decoration-clone transition duration-500 hover:bg-foreground/10",
        containerClassName,
      )}
      {...props}
    >
      <div
        className={cn(
          "z-10 w-auto rounded-[inherit] bg-background px-5 py-2.5 text-sm text-foreground",
          className,
        )}
      >
        {children}
      </div>

      <motion.div
        className="absolute inset-0 z-0 h-full w-full flex-none overflow-hidden rounded-[inherit]"
        style={{ filter: "blur(2px)" }}
        initial={{ background: MOVING[direction] }}
        animate={{ background: hovered ? [MOVING[direction], HIGHLIGHT] : MOVING[direction] }}
        transition={{ ease: "linear", duration: duration ?? 1 }}
      />
      <div className="absolute inset-0.5 z-1 flex-none rounded-[100px] bg-background" />
    </Tag>
  );
}
