import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { getDesigners, getProjects } from "@/data";
import { Reveal } from "@/components/reveal";
import { ProjectsGallery } from "../_components/projects-gallery";
import { ScrollSpringGallery } from "./_components/scroll-spring-gallery";
import { showcaseItems } from "./_components/showcase";

export const metadata: Metadata = {
  title: "Projects — Rumiva",
  description:
    "Every space we've designed, explorable in immersive 3D. Filter by room type and walk through the ones that feel like home.",
};

export default function ProjectsPage() {
  const projects = getProjects();
  const designers = getDesigners();

  // slug → studio name, so each card can credit its studio.
  const designerNames = Object.fromEntries(
    designers.map((d) => [d.slug, d.studioName]),
  );

  const withModel = projects.filter((p) => p.modelUrl).length;

  const stats = [
    { value: String(projects.length), label: "Projects" },
    { value: String(designers.length), label: "Designers" },
    { value: String(withModel), label: "3D walkthroughs" },
  ];

  return (
    <>
      {/* Full-bleed scroll reel — owns the page's h1 and its own dark ground. */}
      <ScrollSpringGallery items={showcaseItems} />

      <div className="mx-auto max-w-6xl px-6 pb-28 pt-24 sm:px-10 sm:pt-32">
        {/* Section intro for the browsable catalogue below the reel */}
        <Reveal className="max-w-2xl space-y-5">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">
            The full catalogue
          </p>
          <h2 className="text-balance font-heading text-4xl leading-[1.05] tracking-tight sm:text-5xl">
            Browse every project
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Kitchens, living rooms, whole homes — each one seen before it was
            built. Filter by space and step inside the ones that speak to you.
          </p>
        </Reveal>

        {/* Stats band */}
        <Reveal
          delay={100}
          className="mt-12 grid grid-cols-3 divide-x divide-border/60 overflow-hidden rounded-3xl border border-border/60 bg-secondary/40"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="px-4 py-7 text-center sm:py-8">
              <div className="font-heading text-3xl tracking-tight sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1.5 text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground sm:text-xs">
                {stat.label}
              </div>
            </div>
          ))}
        </Reveal>

        {/* Filterable grid */}
        <div className="mt-16">
          <ProjectsGallery projects={projects} designerNames={designerNames} />
        </div>

        {/* CTA */}
        <Reveal className="mt-24 overflow-hidden rounded-3xl bg-charcoal px-8 py-14 text-ivory sm:px-14 sm:py-16">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-md space-y-4">
              <h2 className="text-balance font-heading text-3xl leading-[1.1] tracking-tight sm:text-4xl">
                Imagine your own space here.
              </h2>
              <p className="text-pretty text-ivory/70">
                Browse the designers behind these projects and start a
                conversation about your home.
              </p>
            </div>
            <Link
              href="/designers"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-ivory px-7 py-3.5 text-sm font-medium text-charcoal transition-transform duration-300 hover:-translate-y-0.5"
            >
              Meet the designers
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </div>
    </>
  );
}
