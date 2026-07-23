import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Box } from "lucide-react";

import type { Project } from "@/data";

/**
 * A project tile for portfolio grids. Shows the cover, a hover lift, and a
 * "3D" badge when the project ships an explorable model.
 */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/designers/${project.designerSlug}/${project.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-charcoal/5"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={project.cover}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {project.modelUrl && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-ivory/90 px-3 py-1 text-[0.7rem] font-medium tracking-wide text-charcoal backdrop-blur">
            <Box className="size-3.5" />
            3D
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-accent">
          <span>{project.spaceType}</span>
          <span className="text-muted-foreground/50">·</span>
          <span className="text-muted-foreground">{project.year}</span>
        </div>
        <h3 className="font-heading text-2xl leading-tight tracking-tight">
          {project.title}
        </h3>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
          {project.summary}
        </p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
          View case study
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
