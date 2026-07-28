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
import { ServiceIcon } from "./_components/service-icon";

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
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-charcoal/5"
                >
                  <div className="relative aspect-16/10 overflow-hidden">
                    <Image
                      src={service.cover}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <span className="absolute left-5 top-5 inline-flex size-10 items-center justify-center rounded-full bg-ivory/90 text-charcoal backdrop-blur">
                      <ServiceIcon name={service.icon} className="size-4.5" />
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-7 sm:p-8">
                    <h2 className="font-heading text-2xl leading-tight tracking-tight sm:text-3xl">
                      {service.name}
                    </h2>
                    <p className="text-sm font-medium text-accent">
                      {service.tagline}
                    </p>
                    <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                      {service.summary}
                    </p>

                    <ul className="flex flex-wrap gap-x-2 gap-y-1.5 pt-2 text-xs text-muted-foreground">
                      {service.bestFor.map((item, j) => (
                        <li key={item} className="flex items-center gap-2">
                          {j > 0 && <span className="text-border">·</span>}
                          {item}
                        </li>
                      ))}
                    </ul>

                    <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-foreground">
                      Explore {service.shortName}
                      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What holds true across all four */}
      <section className="bg-charcoal py-24 text-ivory lg:py-32">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <Reveal className="grid gap-5 lg:grid-cols-[minmax(0,16rem)_1fr] lg:gap-16">
            <p className="text-xs uppercase tracking-[0.3em] text-ivory/40">
              Whichever you pick
            </p>
            <h2 className="max-w-2xl text-balance font-heading text-4xl leading-[1.08] tracking-tight sm:text-5xl">
              Four things that don&apos;t change.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-ivory/10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {COMMITMENTS.map((item, i) => (
              <div key={item.title} className="bg-charcoal p-7 sm:p-8">
                <span className="font-mono text-xs tracking-[0.2em] text-accent">
                  [{String(i + 1).padStart(2, "0")}]
                </span>
                <h3 className="mt-5 font-heading text-xl leading-tight tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-3 text-pretty text-sm leading-relaxed text-ivory/50">
                  {item.copy}
                </p>
              </div>
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
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((faq) => (
                <AccordionItem key={faq.q} value={faq.q}>
                  <AccordionTrigger className="text-left text-base">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-pretty text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-background">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 sm:px-10 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:py-24">
          <div className="space-y-5">
            <h2 className="text-balance font-heading text-4xl leading-[1.08] tracking-tight sm:text-5xl">
              Still deciding? Start with a conversation.
            </h2>
            <p className="max-w-md text-pretty text-muted-foreground">
              Tell us about the space and we&apos;ll point you at the right
              engagement — even if it turns out to be the smallest one.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 lg:justify-self-end">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background transition-transform duration-300 hover:-translate-y-0.5"
            >
              Book a consultation
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-accent"
            >
              See the work
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
