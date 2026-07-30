"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Lens } from "@/components/ui/lens";

/**
 * Unified media gallery for a project — photoreal renders plus an optional
 * walkthrough video, opened in a shared lightbox with keyboard + arrow nav.
 * A video, when present, leads the grid with a play affordance and plays inline
 * in the lightbox; every other tile is a still.
 *
 * Two changes make this feel like inspecting physical prints rather than browsing
 * thumbnails. Each still carries a `Lens` — a circular magnifier that follows the
 * pointer — so a material, a joint, or a finish can be examined without leaving
 * the grid. And the lightbox arrives *through* the page: it scales up out of the
 * plane on a perspective stage instead of cross-fading in flat.
 */
type MediaItem =
  | { type: "image"; src: string }
  | { type: "video"; src: string; poster: string };

export function MediaGallery({
  images,
  video,
  poster,
}: {
  images: string[];
  video?: string;
  /** Poster frame for the video tile — usually the project cover. */
  poster?: string;
}) {
  const items: MediaItem[] = React.useMemo(() => {
    const list: MediaItem[] = [];
    if (video) list.push({ type: "video", src: video, poster: poster ?? images[0] });
    for (const src of images) list.push({ type: "image", src });
    return list;
  }, [images, video, poster]);

  const [open, setOpen] = React.useState<number | null>(null);
  const close = React.useCallback(() => setOpen(null), []);
  const prev = React.useCallback(
    () => setOpen((i) => (i === null ? i : (i - 1 + items.length) % items.length)),
    [items.length],
  );
  const next = React.useCallback(
    () => setOpen((i) => (i === null ? i : (i + 1) % items.length)),
    [items.length],
  );

  React.useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    // Lock body scroll while the lightbox is open.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close, prev, next]);

  const active = open === null ? null : items[open];

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {items.map((item, i) => (
          <button
            key={`${item.type}-${item.src}`}
            type="button"
            onClick={() => setOpen(i)}
            className="group relative block w-full rounded-2xl bg-muted transition-transform duration-500 ease-out hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={
              item.type === "video"
                ? "Play walkthrough video"
                : `View render ${i + 1}`
            }
          >
            {/* Stills get the magnifier; the video tile keeps its play target,
                where a lens would just fight the affordance. */}
            {item.type === "image" ? (
              <Lens lensSize={180} zoomFactor={1.8} className="rounded-2xl">
                <Tile src={item.src} />
              </Lens>
            ) : (
              <div className="relative overflow-hidden rounded-2xl">
                <Tile src={item.poster} />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex size-14 items-center justify-center rounded-full bg-ivory/90 text-charcoal shadow-lg backdrop-blur transition-transform duration-300 group-hover:scale-110">
                    <Play className="size-5 translate-x-0.5 fill-current" />
                  </span>
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/90 backdrop-blur-sm"
            style={{ perspective: "1600px" }}
            role="dialog"
            aria-modal="true"
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 inline-flex size-11 items-center justify-center rounded-full bg-ivory/10 text-ivory transition-colors hover:bg-ivory/20"
            >
              <X className="size-5" />
            </button>

            <NavButton side="left" onClick={prev} />
            <NavButton side="right" onClick={next} />

            {/* Keyed on the active index so stepping through the set re-runs the
                arrival: each render comes up out of the plane in turn. */}
            <motion.div
              key={open}
              initial={{ opacity: 0, scale: 0.9, rotateX: 12 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex max-h-[85vh] w-full max-w-5xl items-center justify-center px-4"
              onClick={(e) => e.stopPropagation()}
            >
              {active.type === "image" ? (
                <Image
                  src={active.src}
                  alt=""
                  width={1600}
                  height={1200}
                  className="max-h-[85vh] w-auto rounded-xl object-contain shadow-2xl"
                  priority
                />
              ) : (
                <video
                  src={active.src}
                  poster={active.poster}
                  controls
                  autoPlay
                  className="max-h-[85vh] w-auto rounded-xl shadow-2xl"
                />
              )}
            </motion.div>

            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs tracking-[0.2em] text-ivory/60">
              {open! + 1} / {items.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** One masonry still. Intrinsic size is unknown, so height follows the width. */
function Tile({ src }: { src: string }) {
  return (
    <>
      <Image
        src={src}
        alt=""
        width={800}
        height={600}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="h-auto w-full object-cover"
      />
      <span className="absolute inset-0 bg-charcoal/0 transition-colors duration-300 group-hover:bg-charcoal/10" />
    </>
  );
}

function NavButton({
  side,
  onClick,
}: {
  side: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={side === "left" ? "Previous" : "Next"}
      className={cn(
        "absolute top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/10 text-ivory transition-colors hover:bg-ivory/20",
        side === "left" ? "left-4" : "right-4",
      )}
    >
      {side === "left" ? (
        <ChevronLeft className="size-5" />
      ) : (
        <ChevronRight className="size-5" />
      )}
    </button>
  );
}
