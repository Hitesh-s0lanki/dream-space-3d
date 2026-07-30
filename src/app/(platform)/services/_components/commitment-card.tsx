"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

import { AmbientReveal } from "@/components/three/lazy";

/**
 * One of the four studio commitments, on the dark band of /services.
 *
 * On hover the card renders itself: a WebGL dot matrix wipes in behind the copy
 * (Aceternity's canvas reveal effect), which is the most on-the-nose expression of
 * what the studio sells — you watch the surface come into focus. The canvas is
 * mounted only while hovered, so four idle cards cost nothing; a page with four
 * always-live GL contexts would be indefensible for decoration.
 */
export function CommitmentCard({
  index,
  title,
  copy,
}: {
  index: number;
  title: string;
  copy: string;
}) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group/commitment relative h-full overflow-hidden bg-charcoal p-7 transition-transform duration-500 ease-out hover:-translate-y-1 sm:p-8"
    >
      <AnimatePresence>
        {hovered ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none absolute inset-0"
          >
            <AmbientReveal
              colors={["#c2683a", "#8a9a5b"]}
              dotSize={3}
              animationSpeed={0.6}
              reverse={index % 2 === 1}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="relative">
        <span className="font-mono text-xs tracking-[0.2em] text-accent">
          [{String(index + 1).padStart(2, "0")}]
        </span>
        <h3 className="mt-5 font-heading text-xl leading-tight tracking-tight text-ivory">
          {title}
        </h3>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-ivory/60 transition-colors duration-500 group-hover/commitment:text-ivory/80">
          {copy}
        </p>
      </div>
    </div>
  );
}
