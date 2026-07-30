"use client";

import * as React from "react";
import { motion, stagger, useAnimate } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Text treatments, consolidated (both adapted from ui.aceternity.com):
 *   TextGenerateEffect — words blur in one after another
 *   Highlight          — a sweeping accent wash behind a phrase
 *
 * Kept in one file because they share the same word-splitting concerns and are
 * almost always used together in a heading.
 */

/* ── Text Generate Effect ─────────────────────────────────────────────── */

export function TextGenerateEffect({
  words,
  className,
  filter = true,
  duration = 0.6,
  delay = 0,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  delay?: number;
}) {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");

  React.useEffect(() => {
    animate(
      "span",
      { opacity: 1, filter: filter ? "blur(0px)" : "none" },
      { duration, delay: stagger(0.09, { startDelay: delay }) },
    );
  }, [animate, delay, duration, filter]);

  // Spans, not divs: this is used *inside* headings, where a block-level child
  // would be invalid markup. `block` keeps each call on its own line.
  return (
    <motion.span ref={scope} className={cn("block", className)}>
      {wordsArray.map((word, idx) => (
        <motion.span
          key={word + idx}
          // Inline, not inline-block — trailing whitespace inside an
          // inline-block is trimmed, which would run the words together.
          className="opacity-0"
          style={{ filter: filter ? "blur(10px)" : "none" }}
        >
          {word}
          {idx < wordsArray.length - 1 ? " " : null}
        </motion.span>
      ))}
    </motion.span>
  );
}

/* ── Highlight ────────────────────────────────────────────────────────── */

export function Highlight({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.span
      initial={{ backgroundSize: "0% 100%" }}
      whileInView={{ backgroundSize: "100% 100%" }}
      viewport={{ once: true }}
      transition={{ duration: 1.6, ease: "linear", delay: 0.4 }}
      style={{
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
        display: "inline",
      }}
      className={cn(
        "relative inline-block rounded-lg bg-linear-to-r from-terracotta/35 to-sage/35 px-1 pb-1",
        className,
      )}
    >
      {children}
    </motion.span>
  );
}
