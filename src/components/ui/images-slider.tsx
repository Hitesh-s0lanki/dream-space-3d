"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Images Slider (adapted from ui.aceternity.com/components/images-slider).
 *
 * Full-bleed covers that swap on a Z-axis push rather than a crossfade: the
 * outgoing frame recedes and blurs while the next rises into place. On a portfolio
 * hero this turns one static cover into the studio's whole body of work.
 *
 * Every frame is preloaded before the first transition — a slider that swaps to a
 * half-decoded image reads as broken, and the covers here are large.
 */
export function ImagesSlider({
  images,
  children,
  className,
  overlayClassName,
  autoplay = true,
  /** ms between slides. */
  interval = 6000,
  direction = "up",
}: {
  images: string[];
  children?: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  autoplay?: boolean;
  interval?: number;
  direction?: "up" | "down";
}) {
  const [current, setCurrent] = React.useState(0);
  const [loaded, setLoaded] = React.useState(false);
  const reduced = usePrefersReducedMotion();

  const next = React.useCallback(
    () => setCurrent((i) => (i + 1) % images.length),
    [images.length],
  );
  const prev = React.useCallback(
    () => setCurrent((i) => (i - 1 + images.length) % images.length),
    [images.length],
  );

  // Decode everything up front, then allow transitions.
  React.useEffect(() => {
    let cancelled = false;
    Promise.all(
      images.map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new window.Image();
            img.src = src;
            img.onload = () => resolve();
            img.onerror = () => resolve();
          }),
      ),
    ).then(() => {
      if (!cancelled) setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [images]);

  React.useEffect(() => {
    if (!autoplay || !loaded || reduced || images.length < 2) return;
    const id = setInterval(next, interval);
    return () => clearInterval(id);
  }, [autoplay, loaded, reduced, images.length, interval, next]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const enter =
    direction === "up"
      ? { opacity: 0, y: "6%", scale: 1.06 }
      : { opacity: 0, y: "-6%", scale: 1.06 };
  const exit =
    direction === "up"
      ? { opacity: 0, y: "-4%", scale: 0.96, filter: "blur(6px)" }
      : { opacity: 0, y: "4%", scale: 0.96, filter: "blur(6px)" };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <AnimatePresence initial={false}>
        <motion.div
          key={images[current]}
          initial={reduced ? { opacity: 0 } : enter}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={reduced ? { opacity: 0 } : exit}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={images[current]}
            alt=""
            fill
            priority={current === 0}
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {overlayClassName ? (
        <div className={cn("pointer-events-none absolute inset-0", overlayClassName)} />
      ) : null}

      {children}

      {/* Progress ticks — also the only affordance saying there is more than one */}
      {images.length > 1 ? (
        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-1.5">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === current}
              className={cn(
                "h-0.5 rounded-full transition-all duration-500",
                i === current
                  ? "w-8 bg-ivory"
                  : "w-4 bg-ivory/40 hover:bg-ivory/70",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
