import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";

import { getDesigner, getProject, getProjects } from "@/data";
import { Reveal } from "@/components/reveal";
import { ModelViewer } from "@/components/three/model-viewer";
import { CardBody, CardContainer, CardItem } from "@/components/ui/card-3d";
import { GridPattern } from "@/components/ui/background-grid";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import { SpotlightCard } from "@/components/ui/spotlight";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { MediaGallery } from "../../../_components/media-gallery";
import { WalkthroughPlayer } from "../../../_components/walkthrough-player";

type Params = { slug: string; project: string };

export function generateStaticParams(): Params[] {
  return getProjects().map((p) => ({
    slug: p.designerSlug,
    project: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug, project: projectSlug } = await params;
  const project = getProject(slug, projectSlug);
  if (!project) return {};
  return {
    title: `${project.title} — Rumiva`,
    description: project.summary,
    openGraph: { images: [project.cover] },
  };
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug, project: projectSlug } = await params;
  const project = getProject(slug, projectSlug);
  const designer = getDesigner(slug);
  if (!project || !designer) notFound();

  const meta = [
    { label: "Space", value: project.spaceType },
    { label: "Style", value: project.style },
    { label: "Year", value: String(project.year) },
    { label: "Location", value: project.location },
  ];

  return (
    <>
      {/* Hero. The drafting paper behind it lights up under the pointer, so the
          page answers to the reader before they have scrolled anything. */}
      <HeroHighlight
        containerClassName="mx-auto w-full max-w-6xl px-6 pb-14 pt-32 sm:px-10 sm:pt-40"
        radius={300}
      >
        <Reveal className="space-y-6">
          <Link
            href={`/designers/${designer.slug}`}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            {designer.studioName}
          </Link>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-accent">
            <span>{project.spaceType}</span>
            <span className="text-muted-foreground/50">·</span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="size-3.5" />
              {project.location}
            </span>
          </div>
          <h1 className="max-w-3xl text-balance font-heading text-5xl leading-[1.03] tracking-tight sm:text-7xl">
            {project.title}
          </h1>
          <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {project.summary}
          </p>
        </Reveal>
      </HeroHighlight>

      {/* Immersive 3D viewer — the centerpiece. Wider than the reading column and
          nearly the full viewport tall: the render is the point of the page, not
          an illustration beside it. */}
      {/* `w-full` below is required, not tidiness: the route's <main> is a column
          flexbox, and an item with auto side margins shrinks to fit its content
          instead of stretching. Every other section is saved by its text having an
          intrinsic width — this one holds only a canvas, so without w-full it
          collapses to ~300px. */}
      {project.modelUrl && (
        <section className="mx-auto w-full max-w-[110rem] px-4 sm:px-6">
          {/* The model sits in a lit vitrine: a hairline grid on the floor of the
              frame, a highlight along the top edge, and a soft shadow under it, so
              the geometry reads as an object on display rather than an embed. */}
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-linear-to-b from-secondary/60 to-background shadow-xl shadow-charcoal/5">
            <GridPattern className="opacity-50" size={48} />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-16 top-0 z-10 h-px bg-linear-to-r from-transparent via-ivory to-transparent"
            />
            <ModelViewer
              src={project.modelUrl}
              className="relative h-[82svh] min-h-140 w-full"
            />
            <span className="absolute left-5 top-5 z-10 inline-flex items-center gap-1.5 rounded-full bg-ivory/90 px-3 py-1 text-[0.7rem] font-medium tracking-wide text-charcoal shadow-lg shadow-charcoal/20 backdrop-blur">
              Live 3D render
            </span>
          </div>
        </section>
      )}

      {/* Walkthrough — the rendered video tour, where one exists. The player is
          laid back and rotates upright as you scroll to it, so the flat video
          stands up into a room. */}
      {project.videos && project.videos.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-6 pt-16 sm:px-10">
          <Reveal className="mb-8 space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">
              The walkthrough
            </p>
            <h2 className="max-w-xl text-balance font-heading text-3xl leading-[1.08] tracking-tight sm:text-4xl">
              Walk the space before it was built.
            </h2>
          </Reveal>
          <WalkthroughPlayer clips={project.videos} poster={project.cover} />
        </section>
      )}

      {/* Brief */}
      <section className="mx-auto max-w-6xl px-6 py-24 sm:px-10 lg:py-28">
        <div className="grid gap-6 lg:grid-cols-[0.5fr_1.5fr] lg:gap-20">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">
              The brief
            </p>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-balance font-heading text-2xl leading-snug tracking-tight sm:text-3xl">
              {project.brief}
            </p>
          </Reveal>
        </div>

        {/* Meta row — four separate tilting plates rather than one divided slab,
            so the facts read as index cards laid out on the page */}
        <div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {meta.map((m) => (
            <CardContainer
              key={m.label}
              containerClassName="w-full"
              className="w-full"
              intensity={9}
            >
              <CardBody className="h-full rounded-2xl border border-border/60 bg-card p-6">
                <CardItem
                  translateZ={22}
                  className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
                >
                  {m.label}
                </CardItem>
                <CardItem
                  translateZ={48}
                  className="mt-2 font-heading text-xl tracking-tight"
                >
                  {m.value}
                </CardItem>
              </CardBody>
            </CardContainer>
          ))}
        </div>
      </section>

      {/* Media gallery */}
      <section className="bg-secondary/40 py-24 lg:py-28">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <Reveal className="mb-12 space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">
              The gallery
            </p>
            <h2 className="max-w-xl text-balance font-heading text-4xl leading-[1.08] tracking-tight sm:text-5xl">
              Every render, up close.
            </h2>
          </Reveal>
          <MediaGallery images={project.images} poster={project.cover} />
        </div>
      </section>

      {/* Materials */}
      <section className="mx-auto max-w-6xl px-6 py-24 sm:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.5fr_1.5fr] lg:gap-20">
          <Reveal className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">
              Materials
            </p>
            <h2 className="font-heading text-3xl leading-tight tracking-tight">
              A calm, warm palette.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <ul className="grid gap-5 sm:grid-cols-2">
              {project.materials.map((mat) => (
                <li
                  key={mat.name}
                  className="group flex items-center gap-4 transition-transform duration-500 ease-out hover:-translate-y-0.5"
                >
                  {/* Swatches read as physical chips: a rim, an inner highlight,
                      and a shadow that deepens as the chip lifts */}
                  <span
                    className="size-14 shrink-0 rounded-2xl border border-border/60 shadow-sm ring-1 ring-inset ring-white/25 transition-shadow duration-500 group-hover:shadow-lg group-hover:shadow-charcoal/15"
                    style={{ backgroundColor: mat.swatch }}
                    aria-hidden
                  />
                  <div>
                    <div className="text-base font-medium">{mat.name}</div>
                    {mat.note && (
                      <div className="text-sm text-muted-foreground">
                        {mat.note}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Designer's notes — a beam draws itself down the margin as you read, so
          long-form copy has a sense of progress and depth */}
      <section className="bg-secondary/40 py-24 lg:py-28">
        <TracingBeam className="max-w-3xl px-6 sm:px-10">
          <Reveal className="space-y-6">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">
              Designer&apos;s notes
            </p>
            {project.notes.split("\n\n").map((para, i) => (
              <p
                key={i}
                className="text-pretty text-lg leading-relaxed text-foreground/90"
              >
                {para}
              </p>
            ))}
            <div className="flex items-center gap-3 pt-4">
              <div className="flex size-11 items-center justify-center rounded-full bg-walnut text-sm font-medium text-ivory">
                {designer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <div className="text-sm font-medium">{designer.name}</div>
                <div className="text-xs text-muted-foreground">
                  {designer.studioName}
                </div>
              </div>
            </div>
          </Reveal>
        </TracingBeam>
      </section>

      {/* Next step */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10">
        <Link href={`/designers/${designer.slug}`} className="group block">
          <SpotlightCard className="flex flex-col items-start justify-between gap-6 p-8 transition-all duration-500 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-xl hover:shadow-charcoal/10 sm:flex-row sm:items-center sm:p-10">
            <div className="space-y-1.5">
              <p className="text-xs uppercase tracking-[0.3em] text-accent">
                Keep exploring
              </p>
              <p className="font-heading text-2xl tracking-tight sm:text-3xl">
                See more from {designer.studioName}
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform duration-300 group-hover:-translate-y-0.5">
              View portfolio
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </SpotlightCard>
        </Link>
      </section>
    </>
  );
}
