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
import { AmbientDust, AmbientGlass } from "@/components/three/lazy";
import { CardBody, CardContainer, CardItem } from "@/components/ui/card-3d";
import { CometCard } from "@/components/ui/comet-card";
import { GridPattern } from "@/components/ui/background-grid";
import { Lens } from "@/components/ui/lens";
import { SpotlightCard, SpotlightNew } from "@/components/ui/spotlight";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { WobbleCard } from "@/components/ui/wobble-card";
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
        <SpotlightNew />

        {/* Content held forward of the cover on a perspective stage, so the type
            reads as a glass panel above the render rather than printed on it */}
        <div
          className="relative mx-auto flex min-h-[70svh] max-w-6xl items-end px-6 pb-16 pt-40 sm:px-10"
          style={{ perspective: "1200px" }}
        >
          <div className="max-w-2xl space-y-5 transform-3d">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-accent transition-colors hover:text-foreground"
            >
              <ServiceIcon name={service.icon} className="size-4" />
              Services
            </Link>
            <h1
              className="text-balance font-heading text-4xl leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl"
              style={{ transform: "translateZ(60px)" }}
            >
              {service.name}
            </h1>
            <p
              className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground"
              style={{ transform: "translateZ(30px)" }}
            >
              {service.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* Facts band — separate tilting plates instead of a divided strip */}
      <section className="relative overflow-hidden border-y border-border/60 bg-secondary/40">
        <GridPattern className="opacity-60" size={48} />
        <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-2 px-6 py-6 sm:px-10 lg:grid-cols-4">
          {service.facts.map((fact) => (
            <CardContainer
              key={fact.label}
              containerClassName="w-full"
              className="w-full"
              intensity={8}
            >
              <CardBody className="h-full rounded-2xl px-4 py-6 text-center">
                <CardItem
                  translateZ={45}
                  className="mx-auto font-heading text-2xl tracking-tight sm:text-3xl"
                >
                  {fact.value}
                </CardItem>
                <CardItem
                  translateZ={20}
                  className="mx-auto mt-2 text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground"
                >
                  {fact.label}
                </CardItem>
              </CardBody>
            </CardContainer>
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

          {/* The scope reads one item at a time against a pinned panel that swaps
              renders as you go, rather than as a grid to skim. Panel images cycle
              through this service's own gallery, so each promise arrives with
              evidence beside it. */}
          <StickyScroll
            className="mt-14 lg:mt-16"
            content={service.includes.map((item, i) => ({
              title: item.title,
              description: item.copy,
              image: service.gallery[i % service.gallery.length],
            }))}
          />
        </div>
      </section>

      {/* Process — the interactive rail */}
      <section className="relative overflow-hidden bg-charcoal py-24 text-ivory lg:py-32">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <AmbientDust color="#f6efe4" count={420} spread={15} size={2} seed={41} />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 sm:px-10">
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

          {/* Gallery — one wide frame above two square. Each frame tilts with a
              specular sheen, and the lead frame carries a magnifier so a finish
              can be inspected without opening a lightbox. */}
          <Reveal delay={120} className="grid grid-cols-2 gap-3">
            <CometCard className="col-span-2" rotateDepth={9} translateDepth={7}>
              <Lens lensSize={200} zoomFactor={1.9} className="rounded-2xl">
                <div className="relative aspect-16/10 w-full">
                  <Image
                    src={service.gallery[0]}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </Lens>
            </CometCard>

            {service.gallery.slice(1, 3).map((src) => (
              <CometCard key={src} rotateDepth={12} translateDepth={9}>
                <div className="relative aspect-square overflow-hidden rounded-2xl">
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
              </CometCard>
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
            <SpotlightCard className="px-6 py-2 shadow-lg shadow-charcoal/5 sm:px-8">
              <Accordion type="single" collapsible className="relative w-full">
                {service.faqs.map((faq) => (
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

        <div className="grid gap-3 sm:grid-cols-3">
          {others.map((other) => (
            <Link
              key={other.slug}
              href={`/services/${other.slug}`}
              className="group block h-full"
            >
              <CardContainer
                containerClassName="h-full w-full"
                className="h-full w-full"
                intensity={11}
              >
                <CardBody className="flex h-full flex-col gap-3 rounded-3xl border border-border/60 bg-card p-7 transition-shadow duration-500 group-hover:shadow-xl group-hover:shadow-charcoal/10">
                  <CardItem translateZ={60}>
                    <ServiceIcon
                      name={other.icon}
                      className="size-5 text-muted-foreground transition-colors group-hover:text-accent"
                    />
                  </CardItem>
                  <CardItem
                    as="h3"
                    translateZ={45}
                    className="font-heading text-xl leading-tight tracking-tight"
                  >
                    {other.name}
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ={20}
                    className="text-pretty text-sm leading-relaxed text-muted-foreground"
                  >
                    {other.tagline}
                  </CardItem>
                  <CardItem
                    translateZ={40}
                    className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium text-foreground"
                  >
                    Explore
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </CardItem>
                </CardBody>
              </CardContainer>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA — its own volume, kept off the dark footer by the page's own ground */}
      <section className="bg-background px-6 py-20 sm:px-10 lg:py-24">
        <WobbleCard
          containerClassName="mx-auto max-w-6xl rounded-3xl bg-walnut"
          className="px-8 py-14 sm:px-12 sm:py-16"
        >
          <div className="pointer-events-none absolute inset-0 opacity-70">
            <AmbientGlass tint="#e8dfd2" />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-walnut via-walnut/70 to-transparent" />

          <div className="relative grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div className="space-y-5 text-ivory">
              <h2 className="text-balance font-heading text-4xl leading-[1.08] tracking-tight sm:text-5xl">
                Ready to start?
              </h2>
              <p className="max-w-md text-pretty text-ivory/75">
                Tell us about the space. We&apos;ll come back within a day with a
                read on scope, timeline and what it would cost.
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
