"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SiteHeader } from "./_components/site-header";
import { SiteFooter } from "./_components/site-footer";
import { StatsBand } from "./_components/sections/stats-band";
import { ServicesSection } from "./_components/sections/services-section";
import { ProcessSection } from "./_components/sections/process-section";
import { GallerySection } from "./_components/sections/gallery-section";
import { FaqSection } from "./_components/sections/faq-section";
import { CtaSection } from "./_components/sections/cta-section";

// WebGL can't render on the server — load the scenes client-side only.
const Scene = dynamic(
  () => import("@/components/three/scene").then((m) => m.Scene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
        Loading experience…
      </div>
    ),
  },
);

// const CardsCarousel = dynamic(
//   () =>
//     import("@/components/three/cards-carousel").then((m) => m.CardsCarousel),
//   {
//     ssr: false,
//     loading: () => (
//       <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
//         Loading gallery…
//       </div>
//     ),
//   },
// );

export default function Home() {
  return (
    <>
    <main className="flex flex-1 flex-col">
      <section className="relative min-h-svh overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Scene />
        </div>

        <SiteHeader />

        {/* Editorial scrims: cream from the left for text legibility, a soft
            fade at the bottom, keeping the room visible on the right. */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-r from-background via-background/70 to-transparent" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-t from-background/80 via-transparent to-transparent" />

        <div className="pointer-events-none mx-auto flex min-h-svh max-w-6xl items-center px-6 sm:px-10">
          <div className="max-w-xl space-y-6">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Interior Design Studio
            </p>
            <h1 className="text-balance text-[2.5rem] font-medium leading-[1.08] tracking-tight sm:text-6xl md:text-7xl">
              See the space.
              <br />
              Explore the possibilities.
            </h1>
            <p className="max-w-md text-pretty text-lg text-muted-foreground">
              A premium studio experience with immersive home visualization.
            </p>

            <div className="pointer-events-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-2">
              {/* Primary: walnut pill with a terracotta fill that sweeps up on hover */}
              <Link
                href="#projects"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <span className="absolute inset-0 translate-y-full bg-accent transition-transform duration-400 ease-out group-hover:translate-y-0" />
                <span className="relative z-10 transition-colors duration-300 group-hover:text-accent-foreground">
                  Explore the Portfolio
                </span>
                <ArrowRight className="relative z-10 size-4 transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent-foreground" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Marketing story — trust, philosophy, services, work, process, FAQ, CTA */}
      <StatsBand />
      <ServicesSection />
      <ProcessSection />
      <GallerySection />
      <FaqSection />
      <CtaSection />

      {/* <section className="relative h-svh">
        <div className="absolute inset-0">
          <CardsCarousel />
        </div>
      </section> */}
    </main>

    <SiteFooter />
    </>
  );
}
