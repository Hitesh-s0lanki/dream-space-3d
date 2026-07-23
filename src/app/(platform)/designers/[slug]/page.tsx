import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";

import {
  getDesigner,
  getDesigners,
  getFeaturedProjects,
  getProjectsByDesigner,
} from "@/data";
import { Reveal } from "@/components/reveal";
import { Badge } from "@/components/ui/badge";
import { ProjectCard } from "../../_components/project-card";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getDesigners().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const designer = getDesigner(slug);
  if (!designer) return {};
  return {
    title: `${designer.studioName} — ${designer.name} · Ruumiva`,
    description: designer.tagline,
  };
}

export default async function DesignerPortfolioPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const designer = getDesigner(slug);
  if (!designer) notFound();

  const featured = getFeaturedProjects(designer);
  const projects =
    featured.length > 0 ? featured : getProjectsByDesigner(designer.slug);

  return (
    <>
      {/* Hero — cover render with an editorial scrim from the left */}
      <section className="relative min-h-[85svh] overflow-hidden">
        <Image
          src={designer.cover}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-background via-background/80 to-background/20" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />

        <div className="relative mx-auto flex min-h-[85svh] max-w-6xl items-end px-6 pb-16 pt-40 sm:px-10">
          <div className="max-w-2xl space-y-6">
            <Link
              href="/designers"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground"
            >
              ← All designers
            </Link>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4" />
              {designer.city}
            </div>
            <h1 className="text-balance font-heading text-5xl leading-[1.03] tracking-tight sm:text-7xl">
              {designer.studioName}
            </h1>
            <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {designer.tagline}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {designer.styles.map((style) => (
                <Badge
                  key={style}
                  variant="secondary"
                  className="rounded-full font-normal"
                >
                  {style}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="border-y border-border/60 bg-secondary/40">
        <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-border/60 px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-10">
          {designer.stats.map((stat) => (
            <div key={stat.label} className="px-4 py-8 text-center sm:py-10">
              <div className="font-heading text-4xl tracking-tight sm:text-5xl">
                {stat.value}
              </div>
              <div className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Story / philosophy */}
      <section className="mx-auto max-w-6xl px-6 py-24 sm:px-10 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <Reveal className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">
              Our story
            </p>
            <p className="font-heading text-2xl leading-snug tracking-tight text-foreground">
              {designer.philosophy}
            </p>
          </Reveal>
          <Reveal delay={100} className="space-y-5">
            {designer.bio.split("\n\n").map((para, i) => (
              <p
                key={i}
                className="text-pretty text-base leading-relaxed text-muted-foreground"
              >
                {para}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Featured work */}
      <section className="bg-secondary/40 py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <Reveal className="mb-12 space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">
              Selected work
            </p>
            <h2 className="max-w-xl text-balance font-heading text-4xl leading-[1.08] tracking-tight sm:text-5xl">
              Projects, seen before they were built.
            </h2>
          </Reveal>

          <div className="grid gap-8 sm:grid-cols-2">
            {projects.map((project, i) => (
              <Reveal key={project.slug} delay={i * 80}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="mx-auto max-w-6xl px-6 py-24 sm:px-10 lg:py-32">
        <Reveal className="mb-14 space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">
            How we work
          </p>
          <h2 className="max-w-xl text-balance font-heading text-4xl leading-[1.08] tracking-tight sm:text-5xl">
            Every project begins long before the first drawing.
          </h2>
        </Reveal>
        <ol className="grid gap-px overflow-hidden rounded-3xl border border-border/60 bg-border/60 sm:grid-cols-2 lg:grid-cols-5">
          {designer.approach.map((step, i) => (
            <li key={step.title} className="flex flex-col gap-3 bg-card p-7">
              <span className="font-heading text-3xl text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-base font-medium">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Contact CTA */}
      <section className="bg-charcoal text-ivory">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 sm:px-10 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:py-24">
          <div className="space-y-5">
            <h2 className="text-balance font-heading text-4xl leading-[1.08] tracking-tight sm:text-5xl">
              Have a space in mind?
            </h2>
            <p className="max-w-md text-pretty text-ivory/70">
              Tell {designer.name.split(" ")[0]} about your home. Every project
              starts with a conversation about how you already live.
            </p>
            <Link
              href={`mailto:${designer.contact.email}`}
              className="group inline-flex items-center gap-2 rounded-full bg-ivory px-7 py-3.5 text-sm font-medium text-charcoal transition-transform duration-300 hover:-translate-y-0.5"
            >
              Start a project
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <ul className="space-y-4 text-sm text-ivory/80 lg:justify-self-end">
            {designer.contact.phone && (
              <li>
                <a
                  href={`tel:${designer.contact.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 transition-colors hover:text-ivory"
                >
                  <Phone className="size-4 text-ivory/40" />
                  {designer.contact.phone}
                </a>
              </li>
            )}
            <li>
              <a
                href={`mailto:${designer.contact.email}`}
                className="flex items-center gap-3 transition-colors hover:text-ivory"
              >
                <Mail className="size-4 text-ivory/40" />
                {designer.contact.email}
              </a>
            </li>
            {designer.contact.hours && (
              <li className="flex items-center gap-3">
                <MapPin className="size-4 text-ivory/40" />
                {designer.city} · {designer.contact.hours}
              </li>
            )}
          </ul>
        </div>
      </section>
    </>
  );
}
