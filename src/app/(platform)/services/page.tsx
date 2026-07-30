import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { getServices } from "@/data";
import { Reveal } from "@/components/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AmbientGlass } from "@/components/three/lazy";
import { CardBody, CardContainer, CardItem } from "@/components/ui/card-3d";
import { GridPattern } from "@/components/ui/background-grid";
import { LampContainer } from "@/components/ui/lamp";
import { SpotlightCard, SpotlightNew } from "@/components/ui/spotlight";
import { WobbleCard } from "@/components/ui/wobble-card";
import { ServiceIcon } from "./_components/service-icon";
import { CommitmentCard } from "./_components/commitment-card";

export const metadata: Metadata = {
  title: "Services — Rumiva Interior Design Studio",
  description:
    "Residential interiors, commercial spaces, 3D visualization and design consultation — four ways to work with Rumiva, every one of them seen in 3D before it is built.",
  alternates: { canonical: "/services" },
};

/** What holds true whichever engagement you pick. */
const COMMITMENTS = [
  {
    title: "Seen before it's built",
    copy: "Every engagement includes a true-scale 3D model. You approve the room, not a drawing of it.",
  },
  {
    title: "One point of contact",
    copy: "The person who designs your space is the person you call. Nothing gets relayed through an account manager.",
  },
  {
    title: "Line-by-line pricing",
    copy: "An itemised estimate before work starts, and written re-pricing before anything changes.",
  },
  {
    title: "In-house visualization",
    copy: "Renders and walkthroughs are built by our own team, so a revision is a message rather than a re-brief.",
  },
];

const FAQS = [
  {
    q: "Which service do I actually need?",
    a: "If you're building or renovating a home, start with Residential. If it's a shop, office or restaurant, Commercial. If you already have a designer and just need the visuals, take 3D Visualization on its own. If you're not sure yet, book a Consultation — it's designed for exactly that.",
  },
  {
    q: "Can services be combined?",
    a: "Yes, and most projects do. A consultation often rolls into a residential project, and visualization is bundled into every design engagement by default.",
  },
  {
    q: "How does pricing work?",
    a: "Design engagements are scoped against your budget and quoted line by line before work begins. Visualization is priced per room set, and consultations are a flat fee credited back if you go ahead.",
  },
  {
    q: "Where do you work?",
    a: "Design and execution across Mumbai and Bengaluru, with on-site visits elsewhere by arrangement. Visualization work we take on from anywhere.",
  },
];

export default function ServicesPage() {
  const services = getServices();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-background pb-16 pt-32 sm:pb-20 sm:pt-40">
        <div className="pointer-events-none absolute -right-32 -top-24 size-96 rounded-full bg-terracotta/8 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 size-80 rounded-full bg-sage/10 blur-3xl" />
        <GridPattern className="opacity-70" size={72} />
        <SpotlightNew />

        <div className="relative mx-auto max-w-6xl px-6 sm:px-10">
          <Reveal className="space-y-5">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">
              Services
            </p>
            <h1 className="max-w-3xl text-balance font-heading text-4xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Four ways to work with us.
            </h1>
            <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              From a single consultation to a turnkey home, every engagement
              runs through the same visualization engine — so you see the space
              before you pay to build it.
            </p>
          </Reveal>
        </div>
      </section>

      {/* The four services */}
      <section className="pb-24 lg:pb-32">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <div className="grid gap-10 sm:grid-cols-2 lg:gap-12">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={i * 90}>
                {/* Each pillar is a stack of layers on a perspective stage: the
                    service icon rides highest, then the cover, then the name — so
                    the card gains depth from the parallax between them, not from a
                    drop shadow. No `overflow-hidden` on the body, which would
                    flatten `transform-style` and collapse the stack. */}
                <Link
                  href={`/services/${service.slug}`}
                  className="group block h-full"
                >
                  <CardContainer
                    containerClassName="h-full w-full"
                    className="h-full w-full"
                    intensity={10}
                  >
                    <CardBody className="relative flex h-full flex-col rounded-3xl border border-border/60 bg-card p-2 transition-shadow duration-500 group-hover:shadow-2xl group-hover:shadow-charcoal/10">
                      <CardItem
                        translateZ={40}
                        className="relative aspect-16/10 w-full overflow-hidden rounded-2xl"
                      >
                        <Image
                          src={service.cover}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      </CardItem>

                      <CardItem
                        translateZ={95}
                        className="absolute left-5 top-5 inline-flex size-10 items-center justify-center rounded-full bg-ivory/90 text-charcoal shadow-lg shadow-charcoal/20 backdrop-blur"
                      >
                        <ServiceIcon name={service.icon} className="size-4.5" />
                      </CardItem>

                      <div className="flex flex-1 flex-col gap-3 p-6 sm:p-7">
                        <CardItem
                          as="h2"
                          translateZ={55}
                          className="font-heading text-2xl leading-tight tracking-tight sm:text-3xl"
                        >
                          {service.name}
                        </CardItem>
                        <CardItem
                          as="p"
                          translateZ={35}
                          className="text-sm font-medium text-accent"
                        >
                          {service.tagline}
                        </CardItem>
                        <CardItem
                          as="p"
                          translateZ={20}
                          className="text-pretty text-sm leading-relaxed text-muted-foreground"
                        >
                          {service.summary}
                        </CardItem>

                        <CardItem
                          as="ul"
                          translateZ={15}
                          className="flex w-full flex-wrap gap-x-2 gap-y-1.5 pt-2 text-xs text-muted-foreground"
                        >
                          {service.bestFor.map((item, j) => (
                            <li key={item} className="flex items-center gap-2">
                              {j > 0 && <span className="text-border">·</span>}
                              {item}
                            </li>
                          ))}
                        </CardItem>

                        <CardItem
                          translateZ={45}
                          className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-foreground"
                        >
                          Explore {service.shortName}
                          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </CardItem>
                      </div>
                    </CardBody>
                  </CardContainer>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What holds true across all four. The heading sits under a pendant fixture
          — two conic sheets meeting at a hot line — which is the most literal
          "interior lighting as UI" moment on the site, and the reason this band
          reads as a room rather than a dark stripe. */}
      <section className="bg-charcoal pb-24 text-ivory lg:pb-32">
        <LampContainer className="pb-14 pt-44">
          <Reveal className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-ivory/40">
              Whichever you pick
            </p>
            <h2 className="mx-auto mt-4 max-w-2xl text-balance font-heading text-4xl leading-[1.08] tracking-tight sm:text-5xl">
              Four things that don&apos;t change.
            </h2>
          </Reveal>
        </LampContainer>

        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <div className="grid gap-px overflow-hidden rounded-3xl bg-ivory/10 sm:grid-cols-2 lg:grid-cols-4">
            {COMMITMENTS.map((item, i) => (
              <CommitmentCard
                key={item.title}
                index={i}
                title={item.title}
                copy={item.copy}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-secondary/40">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:py-32">
          <Reveal className="space-y-4 lg:sticky lg:top-28 lg:h-fit">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">
              Before you ask
            </p>
            <h2 className="text-balance font-heading text-4xl leading-[1.08] tracking-tight sm:text-5xl">
              Picking the right one.
            </h2>
          </Reveal>

          <Reveal delay={100}>
            <SpotlightCard className="px-6 py-2 shadow-lg shadow-charcoal/5 sm:px-8">
              <Accordion type="single" collapsible className="relative w-full">
                {FAQS.map((faq) => (
                  <AccordionItem
                    key={faq.q}
                    value={faq.q}
                    className="last:border-b-0"
                  >
                    <AccordionTrigger className="text-left text-base">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-pretty text-sm leading-relaxed text-muted-foreground">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </SpotlightCard>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-background px-6 py-20 sm:px-10 lg:py-24">
        <WobbleCard
          containerClassName="mx-auto max-w-6xl rounded-3xl bg-charcoal"
          className="px-8 py-14 sm:px-12 sm:py-16"
        >
          <div className="pointer-events-none absolute inset-0 opacity-70">
            <AmbientGlass tint="#d8cfc0" />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-charcoal via-charcoal/70 to-transparent" />

          <div className="relative grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div className="space-y-5 text-ivory">
              <h2 className="text-balance font-heading text-4xl leading-[1.08] tracking-tight sm:text-5xl">
                Still deciding? Start with a conversation.
              </h2>
              <p className="max-w-md text-pretty text-ivory/70">
                Tell us about the space and we&apos;ll point you at the right
                engagement — even if it turns out to be the smallest one.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 lg:justify-self-end">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-ivory px-7 py-3.5 text-sm font-medium text-charcoal transition-transform duration-300 hover:-translate-y-0.5"
              >
                Book a consultation
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/projects"
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-ivory transition-colors hover:text-accent"
              >
                See the work
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </WobbleCard>
      </section>
    </>
  );
}
