import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Hand, MapPin } from "lucide-react";

import { getDesigner, getProject, getProjects } from "@/data";
import { Reveal } from "@/components/reveal";
import { ModelViewer } from "@/components/three/model-viewer";
import { MediaGallery } from "../../../_components/media-gallery";

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
    title: `${project.title} — Ruumiva`,
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
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-14 pt-32 sm:px-10 sm:pt-40">
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
      </section>

      {/* Immersive 3D viewer — the centerpiece */}
      {project.modelUrl && (
        <section className="mx-auto max-w-6xl px-6 sm:px-10">
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-linear-to-b from-secondary/60 to-background">
            <ModelViewer
              src={project.modelUrl}
              className="h-[60svh] min-h-100 w-full"
            />
            <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-charcoal/80 px-4 py-2 text-xs text-ivory backdrop-blur">
              <Hand className="size-3.5" />
              Drag to orbit · scroll on the page to continue
            </div>
            <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-ivory/90 px-3 py-1 text-[0.7rem] font-medium tracking-wide text-charcoal backdrop-blur">
              Live 3D render
            </span>
          </div>
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

        {/* Meta row */}
        <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 sm:grid-cols-4">
          {meta.map((m) => (
            <div key={m.label} className="bg-card p-6">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {m.label}
              </div>
              <div className="mt-2 font-heading text-xl tracking-tight">
                {m.value}
              </div>
            </div>
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
          <MediaGallery
            images={project.images}
            video={project.video}
            poster={project.cover}
          />
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
                <li key={mat.name} className="flex items-center gap-4">
                  <span
                    className="size-14 shrink-0 rounded-2xl border border-border/60 shadow-sm"
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

      {/* Designer's notes */}
      <section className="bg-secondary/40 py-24 lg:py-28">
        <div className="mx-auto max-w-3xl px-6 sm:px-10">
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
        </div>
      </section>

      {/* Next step */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10">
        <Link
          href={`/designers/${designer.slug}`}
          className="group flex flex-col items-start justify-between gap-6 rounded-3xl border border-border/60 bg-card p-8 transition-colors hover:border-foreground/20 sm:flex-row sm:items-center sm:p-10"
        >
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
        </Link>
      </section>
    </>
  );
}
