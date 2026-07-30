import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { AmbientGlass } from "@/components/three/lazy";
import { WobbleCard } from "@/components/ui/wobble-card";

/**
 * Closing call to action — a warm walnut panel that carries the eye from the
 * marketing story straight into booking a consultation.
 *
 * The panel is now a real volume: glass and ceramic solids drift inside it in
 * three.js (`GlassShapes`), and the whole card slides toward the pointer while its
 * contents slide the other way (`WobbleCard`), so the type appears to float above
 * the objects behind it. Wobble rather than tilt — a rotated plane would distort
 * type this large.
 */
export function CtaSection() {
  return (
    <section className="relative bg-background px-4 pb-24 sm:px-6 lg:py-32">
      <Reveal className="mx-auto max-w-6xl">
        <WobbleCard
          containerClassName="rounded-[2rem]"
          className="px-6 py-20 text-center text-ivory sm:px-10 sm:py-28"
        >
          {/* The volume inside the panel */}
          <div className="pointer-events-none absolute inset-0 opacity-80">
            <AmbientGlass tint="#e8dfd2" />
          </div>

          {/* subtle radial warmth + terracotta wash */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-terracotta/25 via-transparent to-black/40" />
          <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-terracotta/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 size-80 rounded-full bg-white/10 blur-3xl" />

          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6">
            <p className="text-xs uppercase tracking-[0.3em] text-ivory/70">
              Start your project
            </p>
            <h2 className="text-balance text-4xl font-medium leading-[1.05] tracking-tight sm:text-6xl">
              Showcase your work.
              <br />
              Design your version.
            </h2>
            <p className="max-w-md text-pretty text-lg text-ivory/80">
              Are you an interior designer? Join the platform, present your work
              in immersive 3D, and reach homeowners looking for their next space.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/join"
                className="group inline-flex items-center gap-2 rounded-full bg-ivory px-7 py-3.5 text-sm font-medium text-charcoal transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Join as a Designer
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-full border border-ivory/30 px-7 py-3.5 text-sm font-medium text-ivory backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-ivory/10"
              >
                Explore Home Designs
              </Link>
            </div>
          </div>
        </WobbleCard>
      </Reveal>
    </section>
  );
}
