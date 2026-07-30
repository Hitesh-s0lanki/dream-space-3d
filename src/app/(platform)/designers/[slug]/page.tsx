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
import { ApproachSteps } from "@/components/approach-steps";
import { Badge } from "@/components/ui/badge";
import { AmbientDust, AmbientGlass } from "@/components/three/lazy";
import { CardBody, CardContainer, CardItem } from "@/components/ui/card-3d";
import { GridPattern } from "@/components/ui/background-grid";
import { ImagesSlider } from "@/components/ui/images-slider";
import { SpotlightNew } from "@/components/ui/spotlight";
import { WobbleCard } from "@/components/ui/wobble-card";
import { BrowseAllTile, ProjectTile } from "../../_components/project-tile";

type Params = { slug: string };

/** Tailwind needs the column class whole, so map the tile count to one. */
const LG_COLUMNS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
};

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
    title: `${designer.studioName} — ${designer.name} · Rumiva`,
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

  // Close the tile row with a "browse all" card unless the projects already
  // fill complete rows of four, so the row never ends on a ragged gap.
  const showBrowseAll = projects.length % 4 !== 0;
  const tileCount = projects.length + (showBrowseAll ? 1 : 0);
  const tileColumns = LG_COLUMNS[tileCount] ?? "lg:grid-cols-4";
  // An interior shot rather than a cover, so it doesn't echo the tile beside it.
  const browseAllImage =
    projects.at(-1)?.images.at(-1) ?? projects.at(-1)?.cover ?? designer.cover;

  // The hero cycles the studio's own covers, led by their chosen one. Deduped so a
  // designer whose cover *is* a project cover doesn't get a stalled frame.
  const heroImages = [
    ...new Set([designer.cover, ...projects.map((p) => p.cover)]),
  ];

  return (
    <>
      {/* Hero — the studio's work cycling behind an editorial scrim from the left.
          Each cover arrives on a Z-axis push rather than a crossfade, so the hero
          shows the whole portfolio instead of one frozen cover. */}
      <section className="relative min-h-[85svh] overflow-hidden">
        <ImagesSlider
          images={heroImages}
          className="absolute inset-0"
          autoplay
          interval={7000}
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-background via-background/80 to-background/20" />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
        <SpotlightNew />

        {/* The studio's name is held forward of its own work on a perspective
            stage, so the hero reads as type floating in front of the room */}
        <div
          className="relative mx-auto flex min-h-[85svh] max-w-6xl items-end px-6 pb-16 pt-40 sm:px-10"
          style={{ perspective: "1200px" }}
        >
          <div className="max-w-2xl space-y-6 transform-3d">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4" />
              {designer.city}
            </div>
            <h1
              className="text-balance font-heading text-5xl leading-[1.03] tracking-tight sm:text-7xl"
              style={{ transform: "translateZ(65px)" }}
            >
              {designer.studioName}
            </h1>
            <p
              className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground"
              style={{ transform: "translateZ(32px)" }}
            >
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

      {/* Stats band — a tilting plate per figure, the numeral furthest forward */}
      <section className="relative overflow-hidden border-y border-border/60 bg-secondary/40">
        <GridPattern className="opacity-60" size={48} />
        <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-2 px-6 py-6 sm:grid-cols-3 sm:px-10">
          {designer.stats.map((stat) => (
            <CardContainer
              key={stat.label}
              containerClassName="w-full"
              className="w-full"
              intensity={8}
            >
              <CardBody className="h-full rounded-2xl px-4 py-6 text-center">
                <CardItem
                  translateZ={55}
                  className="mx-auto font-heading text-4xl tracking-tight sm:text-5xl"
                >
                  {stat.value}
                </CardItem>
                <CardItem
                  translateZ={22}
                  className="mx-auto mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground"
                >
                  {stat.label}
                </CardItem>
              </CardBody>
            </CardContainer>
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

      {/* Featured work — a full-bleed tile row, image-first */}
      {projects.length > 0 && (
        <section className="bg-secondary/40 py-24 lg:py-32">
          <div className="mx-auto mb-14 grid max-w-6xl gap-6 px-6 sm:px-10 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-20">
            <Reveal className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-accent">
                Selected work
              </p>
              <h2 className="text-balance font-heading text-4xl leading-[1.08] tracking-tight sm:text-5xl">
                Projects, seen before they were built.
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="text-pretty leading-relaxed text-muted-foreground lg:pb-2">
                Each space below was resolved in 3D first — materials, light and
                proportion agreed on screen, long before anything was ordered or
                built.
              </p>
            </Reveal>
          </div>

          <div className={`grid gap-1 sm:grid-cols-2 ${tileColumns}`}>
            {projects.map((project, i) => (
              <Reveal key={project.slug} delay={i * 80}>
                <ProjectTile project={project} />
              </Reveal>
            ))}
            {showBrowseAll && (
              <Reveal delay={projects.length * 80}>
                <BrowseAllTile
                  href="/projects"
                  image={browseAllImage}
                  label="Browse all"
                  meta="The full catalogue"
                />
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* Approach — a process rail you can step through */}
      <section className="relative overflow-hidden bg-charcoal py-24 text-ivory lg:py-32">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <AmbientDust color="#f6efe4" count={420} spread={15} size={2} seed={63} />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 sm:px-10">
          <Reveal className="grid gap-5 lg:grid-cols-[minmax(0,16rem)_1fr] lg:gap-16">
            <p className="text-xs uppercase tracking-[0.3em] text-ivory/40">
              How we work
            </p>
            <h2 className="max-w-2xl text-balance font-heading text-4xl leading-[1.08] tracking-tight sm:text-5xl">
              Every project begins long before the first drawing.
            </h2>
          </Reveal>

          <Reveal delay={120} className="mt-16 lg:mt-20">
            <ApproachSteps steps={designer.approach} />
          </Reveal>
        </div>
      </section>

      {/* Contact CTA — its own volume between the dark rail above and the footer */}
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
                Have a space in mind?
              </h2>
              <p className="max-w-md text-pretty text-ivory/75">
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

            <ul className="space-y-4 text-sm text-ivory/70 lg:justify-self-end">
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
        </WobbleCard>
      </section>
    </>
  );
}
