import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";

import { getOtherServices, getService, getServices } from "@/data";
import { Reveal } from "@/components/reveal";
import { ApproachSteps } from "@/components/approach-steps";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ServiceIcon } from "../_components/service-icon";

type Params = { service: string };

export function generateStaticParams(): Params[] {
  return getServices().map((s) => ({ service: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { service: slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: `${service.name} — Rumiva`,
    description: service.summary,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { service: slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const others = getOtherServices(service.slug);

  return (
    <>
      {/* Hero — cover render behind an editorial scrim */}
      <section className="relative min-h-[70svh] overflow-hidden">
        <Image
          src={service.cover}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-background via-background/85 to-background/25" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />

        <div className="relative mx-auto flex min-h-[70svh] max-w-6xl items-end px-6 pb-16 pt-40 sm:px-10">
          <div className="max-w-2xl space-y-5">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-accent transition-colors hover:text-foreground"
            >
              <ServiceIcon name={service.icon} className="size-4" />
              Services
            </Link>
            <h1 className="text-balance font-heading text-4xl leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
              {service.name}
            </h1>
            <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {service.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* Facts band */}
      <section className="border-y border-border/60 bg-secondary/40">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-border/60 px-6 sm:px-10 lg:grid-cols-4 lg:divide-y-0">
          {service.facts.map((fact) => (
            <div key={fact.label} className="px-4 py-8 text-center sm:py-10">
              <div className="font-heading text-2xl tracking-tight sm:text-3xl">
                {fact.value}
              </div>
              <div className="mt-2 text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
                {fact.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Overview + who it's for */}
      <section className="mx-auto max-w-6xl px-6 py-24 sm:px-10 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <Reveal className="space-y-6">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">
              The engagement
            </p>
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Best for
              </p>
              <ul className="space-y-2">
                {service.bestFor.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-foreground/80"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={100} className="space-y-5">
            {service.overview.split("\n\n").map((para, i) => (
              <p
                key={i}
                className="text-pretty text-base leading-relaxed text-muted-foreground first:text-lg first:text-foreground/85"
              >
                {para}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* What's included */}
      <section className="bg-secondary/40 py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <Reveal className="grid gap-5 lg:grid-cols-[minmax(0,16rem)_1fr] lg:gap-16">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">
              What&apos;s included
            </p>
            <h2 className="max-w-2xl text-balance font-heading text-4xl leading-[1.08] tracking-tight sm:text-5xl">
              Everything the scope covers.
            </h2>
          </Reveal>

          {/* Hairlines are drawn as outlines rather than grid gaps, so a scope
              that doesn't fill its last row leaves no orphan cell behind. */}
          <div className="mt-14 grid overflow-hidden rounded-3xl bg-card outline-1 outline-border/60 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {service.includes.map((item, i) => (
              <div
                key={item.title}
                className="p-7 outline-1 -outline-offset-[0.5px] outline-border/60 sm:p-8"
              >
                <span className="font-mono text-xs tracking-[0.2em] text-accent">
                  [{String(i + 1).padStart(2, "0")}]
                </span>
                <h3 className="mt-5 font-heading text-xl leading-tight tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
                  {item.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process — the interactive rail */}
      <section className="bg-charcoal py-24 text-ivory lg:py-32">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <Reveal className="grid gap-5 lg:grid-cols-[minmax(0,16rem)_1fr] lg:gap-16">
            <p className="text-xs uppercase tracking-[0.3em] text-ivory/40">
              How it runs
            </p>
            <div className="space-y-5">
              <h2 className="max-w-2xl text-balance font-heading text-4xl leading-[1.08] tracking-tight sm:text-5xl">
                {service.process.length} stages, every time.
              </h2>
              <p className="max-w-xl text-pretty leading-relaxed text-ivory/50">
                Step through them — the same sequence runs on every{" "}
                {service.shortName.toLowerCase()} project we take on.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120} className="mt-16 lg:mt-20">
            <ApproachSteps steps={service.process} />
          </Reveal>
        </div>
      </section>

      {/* Deliverables + gallery */}
      <section className="mx-auto max-w-6xl px-6 py-24 sm:px-10 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal className="space-y-8">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-accent">
                What you receive
              </p>
              <h2 className="text-balance font-heading text-4xl leading-[1.08] tracking-tight sm:text-5xl">
                Things you can hold.
              </h2>
            </div>

            <ul className="grid gap-y-3 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-1">
              {service.deliverables.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 border-b border-border/50 pb-3 text-sm text-foreground/80"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Gallery — one tall frame beside two stacked */}
          <Reveal delay={120} className="grid grid-cols-2 gap-3">
            <div className="relative col-span-2 aspect-16/10 overflow-hidden rounded-2xl">
              <Image
                src={service.gallery[0]}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {service.gallery.slice(1, 3).map((src) => (
              <div
                key={src}
                className="relative aspect-square overflow-hidden rounded-2xl"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-secondary/40">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:py-32">
          <Reveal className="space-y-4 lg:sticky lg:top-28 lg:h-fit">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">
              Questions
            </p>
            <h2 className="text-balance font-heading text-4xl leading-[1.08] tracking-tight sm:text-5xl">
              The ones we get asked.
            </h2>
          </Reveal>

          <Reveal delay={100}>
            <Accordion type="single" collapsible className="w-full">
              {service.faqs.map((faq) => (
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

      {/* Other services */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10 lg:py-24">
        <Reveal className="mb-10 space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">
            Also from the studio
          </p>
          <h2 className="text-balance font-heading text-3xl leading-[1.1] tracking-tight sm:text-4xl">
            Not quite what you need?
          </h2>
        </Reveal>

        <div className="grid gap-px overflow-hidden rounded-3xl border border-border/60 bg-border/60 sm:grid-cols-3">
          {others.map((other) => (
            <Link
              key={other.slug}
              href={`/services/${other.slug}`}
              className="group flex flex-col gap-3 bg-card p-7 transition-colors hover:bg-secondary/60"
            >
              <ServiceIcon
                name={other.icon}
                className="size-5 text-muted-foreground transition-colors group-hover:text-accent"
              />
              <h3 className="font-heading text-xl leading-tight tracking-tight">
                {other.name}
              </h3>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                {other.tagline}
              </p>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium text-foreground">
                Explore
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA — light, so it doesn't merge into the dark footer below */}
      <section className="bg-background">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 sm:px-10 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:py-24">
          <div className="space-y-5">
            <h2 className="text-balance font-heading text-4xl leading-[1.08] tracking-tight sm:text-5xl">
              Ready to start?
            </h2>
            <p className="max-w-md text-pretty text-muted-foreground">
              Tell us about the space. We&apos;ll come back within a day with a
              read on scope, timeline and what it would cost.
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
