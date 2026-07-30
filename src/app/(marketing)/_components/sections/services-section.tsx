import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getServices } from "@/data";
import { Reveal } from "@/components/reveal";
import { Card, Carousel } from "@/components/ui/apple-cards-carousel";
import { CometCard } from "@/components/ui/comet-card";
import { GridPattern } from "@/components/ui/background-grid";

/**
 * What we do — the service pillars as an Apple-style cards carousel
 * (ui.aceternity.com/components/apple-cards-carousel). Cards are built from the
 * services data layer and link straight to their own page, so this section and
 * /services can never drift apart.
 *
 * Each card additionally rides a spring-damped tilt with a moving specular sheen
 * (`CometCard`), so the rail reads as a row of laminated boards catching the light
 * as you move along it rather than a set of flat panels.
 */
export function ServicesSection() {
  const services = getServices();

  const cards = services.map((service, index) => (
    <CometCard key={service.slug} rotateDepth={11} translateDepth={9}>
      <Card
        index={index}
        layout
        card={{
          category: `${String(index + 1).padStart(2, "0")} · ${service.shortName}`,
          title: service.name,
          src: service.cover,
          href: `/services/${service.slug}`,
        }}
      />
    </CometCard>
  ));

  return (
    <section id="services" className="relative overflow-hidden bg-background">
      {/* Drafting grid behind the rail — the plane the cards sit above */}
      <GridPattern className="opacity-60" size={72} />

      <div className="relative mx-auto max-w-6xl px-6 pt-24 sm:px-10 lg:pt-24">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">
              What we do
            </p>
            <h2 className="max-w-xl text-balance text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl">
              A full-service studio, end to end.
            </h2>
          </div>

          <Link
            href="/services"
            className="group inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-accent"
          >
            All services
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>

      <Reveal className="relative mb-8 mt-10 lg:mt-8">
        <Carousel items={cards} />
      </Reveal>
    </section>
  );
}
