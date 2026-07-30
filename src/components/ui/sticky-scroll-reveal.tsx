"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Sticky Scroll Reveal (adapted from
 * ui.aceternity.com/components/sticky-scroll-reveal).
 *
 * Copy scrolls past a pinned panel; whichever block crosses the reading line swaps
 * what the panel shows. Used for a service's scope — each item of the deliverable
 * gets its own render instead of the whole scope arriving as one grid to skim.
 *
 * Driven by an IntersectionObserver on the text blocks rather than by mapping
 * scroll progress to an index: the blocks have different heights, so an even split
 * of progress would desync the panel from what is actually being read. And unlike
 * upstream, the page does the scrolling — an inner scroll container traps the
 * wheel and hides content from the page's own scrollbar.
 */
export type StickyScrollItem = {
  title: string;
  description: string;
  /** Image shown in the pinned panel while this item is active. */
  image?: string;
};

export function StickyScroll({
  content,
  className,
  panelClassName,
}: {
  content: StickyScrollItem[];
  className?: string;
  panelClassName?: string;
}) {
  const [active, setActive] = React.useState(0);
  const refs = React.useRef<(HTMLDivElement | null)[]>([]);

  React.useEffect(() => {
    const nodes = refs.current.filter(Boolean) as HTMLDivElement[];
    if (!nodes.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        // The entry closest to the reading line (40% down the viewport) wins.
        const line = window.innerHeight * 0.4;
        let best: { index: number; distance: number } | null = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = nodes.indexOf(entry.target as HTMLDivElement);
          const box = entry.boundingClientRect;
          const distance = Math.abs(box.top + box.height / 2 - line);
          if (!best || distance < best.distance) best = { index, distance };
        }
        if (best) setActive(best.index);
      },
      { rootMargin: "-20% 0px -40% 0px", threshold: [0, 0.5, 1] },
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [content.length]);

  return (
    <div
      className={cn(
        "grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-16",
        className,
      )}
    >
      <div>
        {content.map((item, index) => (
          <div
            key={item.title}
            ref={(node) => {
              refs.current[index] = node;
            }}
            className="py-12 first:pt-0 last:pb-0"
          >
            <motion.h3
              animate={{ opacity: active === index ? 1 : 0.35 }}
              transition={{ duration: 0.3 }}
              className="font-heading text-2xl tracking-tight text-foreground sm:text-3xl"
            >
              <span className="mr-3 font-mono text-sm tracking-[0.2em] text-accent">
                [{String(index + 1).padStart(2, "0")}]
              </span>
              {item.title}
            </motion.h3>
            <motion.p
              animate={{ opacity: active === index ? 1 : 0.35 }}
              transition={{ duration: 0.3 }}
              className="mt-4 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground"
            >
              {item.description}
            </motion.p>
          </div>
        ))}
      </div>

      {/* The pinned panel. Hidden below lg, where there is no room to pin it and
          the copy alone reads fine. */}
      <div
        className={cn(
          "sticky top-32 hidden aspect-4/3 overflow-hidden rounded-3xl border border-border/60 bg-secondary shadow-xl shadow-charcoal/10 lg:block",
          panelClassName,
        )}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={content[active]?.image ?? active}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            {content[active]?.image ? (
              <Image
                src={content[active].image}
                alt=""
                fill
                sizes="(max-width: 1024px) 0px, 45vw"
                className="object-cover"
              />
            ) : null}
          </motion.div>
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-charcoal/80 to-transparent p-6 pt-16">
          <p className="text-sm font-medium text-ivory">
            {content[active]?.title}
          </p>
        </div>
      </div>
    </div>
  );
}
