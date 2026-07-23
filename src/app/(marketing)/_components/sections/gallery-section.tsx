"use client";

import dynamic from "next/dynamic";

import { Reveal } from "@/components/reveal";

/**
 * The Render Gallery — the studio's full library of photoreal renders, pulled
 * from three project catalogs (two bedroom suites + a kitchen) and shuffled into
 * a single rotating 3D carousel of curved cards. WebGL can't render on the
 * server, so the carousel loads client-side only.
 */
const CardsCarousel = dynamic(
  () =>
    import("@/components/three/cards-carousel").then((m) => m.CardsCarousel),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
        Loading gallery…
      </div>
    ),
  },
);

export function GallerySection() {
  return (
    <section id="gallery" className="relative overflow-hidden bg-background">
      <div className="mx-auto max-w-6xl px-6 pt-24 sm:px-10 lg:pt-32">
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">
              The render gallery
            </p>
            <h2 className="max-w-xl text-balance text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl">
              Every room, seen before it&apos;s built.
            </h2>
          </div>
        </Reveal>
      </div>

      {/* Rotating 3D carousel of every render, mixed across all three catalogs */}
      <div className="relative h-[70svh] min-h-112 w-full">
        <CardsCarousel />
      </div>
    </section>
  );
}
