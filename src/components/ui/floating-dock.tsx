"use client";

import * as React from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Floating Dock (adapted from ui.aceternity.com/components/floating-dock).
 *
 * Icons swell as the pointer nears them, driven by distance from each item's
 * centre — the classic macOS dock magnification. Used for the persistent
 * quick-actions bar (book a call, jump to the 3D tour, socials).
 */
export type DockItem = {
  title: string;
  icon: React.ReactNode;
  href: string;
};

export function FloatingDock({
  items,
  className,
  itemClassName,
}: {
  items: DockItem[];
  className?: string;
  /** Styling for each puck — needed on dark grounds, where `bg-card` is wrong. */
  itemClassName?: string;
}) {
  const mouseX = useMotionValue(Infinity);

  return (
    <div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto flex h-16 items-end gap-4 rounded-2xl border border-border/50 bg-secondary/80 px-4 pb-3 backdrop-blur-md",
        className,
      )}
    >
      {items.map((item) => (
        <DockIcon
          mouseX={mouseX}
          key={item.title}
          className={itemClassName}
          {...item}
        />
      ))}
    </div>
  );
}

function DockIcon({
  mouseX,
  title,
  icon,
  href,
  className,
}: DockItem & { mouseX: MotionValue<number>; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = React.useState(false);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: 0,
    };
    return val - bounds.x - bounds.width / 2;
  });

  const spring = { mass: 0.1, stiffness: 150, damping: 12 };
  const width = useSpring(
    useTransform(distance, [-150, 0, 150], [40, 76, 40]),
    spring,
  );
  const height = useSpring(
    useTransform(distance, [-150, 0, 150], [40, 76, 40]),
    spring,
  );
  const iconSize = useSpring(
    useTransform(distance, [-150, 0, 150], [20, 38, 20]),
    spring,
  );

  return (
    <Link href={href} aria-label={title}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "relative flex aspect-square items-center justify-center rounded-full bg-card text-foreground/80 shadow-sm",
          className,
        )}
      >
        <AnimatePresence>
          {hovered ? (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="absolute -top-8 left-1/2 w-fit rounded-md border border-border/60 bg-card px-2 py-0.5 text-xs whitespace-pre text-foreground"
            >
              {title}
            </motion.div>
          ) : null}
        </AnimatePresence>
        <motion.div
          style={{ width: iconSize, height: iconSize }}
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>
      </motion.div>
    </Link>
  );
}
