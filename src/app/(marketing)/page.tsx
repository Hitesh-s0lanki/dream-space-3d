"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, Box, MousePointer2 } from "lucide-react";
import { motion } from "motion/react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SpotlightNew } from "@/components/ui/spotlight";
import { TextGenerateEffect } from "@/components/ui/text-effects";
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

export default function Home() {
  return (
    <>
      <main className="flex flex-1 flex-col">
        {/* ── Hero ───────────────────────────────────────────────────────────
            The room itself is the background: a real-time three.js kitchen the
            reader can hover to light up individual pieces. Everything in front of
            it sits on a perspective stage and is pushed forward on the Z axis, so
            the type reads as glass panels held above the space rather than a
            caption printed on top of it. */}
        <section className="relative min-h-svh overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <Scene />
          </div>

          <SiteHeader />

          {/* Editorial scrims: cream from the left for text legibility, a soft
              fade at the bottom, keeping the room visible on the right. */}
          <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-r from-background via-background/70 to-transparent" />
          <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-t from-background/80 via-transparent to-transparent" />

          {/* Drifting light sheets — a lighting rig over the whole hero */}
          <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
            <SpotlightNew />
          </div>

          <div
            className="pointer-events-none mx-auto flex min-h-svh max-w-6xl items-center px-6 sm:px-10"
            style={{ perspective: "1200px" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, rotateX: 12 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformStyle: "preserve-3d" }}
              className="max-w-xl space-y-6"
            >
              <p
                className="text-xs uppercase tracking-[0.3em] text-muted-foreground"
                style={{ transform: "translateZ(20px)" }}
              >
                Interior Design Studio
              </p>

              <h1
                className="text-balance text-[2.5rem] font-medium leading-[1.08] tracking-tight sm:text-6xl md:text-7xl"
                style={{ transform: "translateZ(60px)" }}
              >
                <TextGenerateEffect words="See the space." />
                <TextGenerateEffect
                  words="Explore the possibilities."
                  delay={0.5}
                />
              </h1>

              <p
                className="max-w-md text-pretty text-lg text-muted-foreground"
                style={{ transform: "translateZ(30px)" }}
              >
                A premium studio experience with immersive home visualization.
              </p>

              <div
                className="pointer-events-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-2"
                style={{ transform: "translateZ(45px)" }}
              >
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

                {/* The background is interactive and nothing else says so */}
                <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-4 py-2 text-xs text-muted-foreground backdrop-blur">
                  <Box className="size-3.5 text-accent" />
                  Live 3D — hover the room to inspect a piece
                </span>
              </div>
            </motion.div>
          </div>

          {/* Scroll cue, bottom centre */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.24em] text-muted-foreground"
            >
              <MousePointer2 className="size-3.5" />
              Scroll
            </motion.div>
          </motion.div>
        </section>

        {/* Marketing story — trust, philosophy, services, work, process, FAQ, CTA */}
        <StatsBand />
        <ServicesSection />
        <ProcessSection />
        <GallerySection />
        <FaqSection />
        <CtaSection />
      </main>

      <SiteFooter />
    </>
  );
}
