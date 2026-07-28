import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Box } from "lucide-react";

import type { Project } from "@/data";
import { cn } from "@/lib/utils";

/**
 * Editorial tile for the full-bleed portfolio row: the image *is* the card, with
 * the label sitting on a scrim at the bottom edge. Height is fixed (rather than
 * an aspect ratio) so the row reads evenly whether it holds two tiles or five.
 */
function Tile({
  href,
  image,
  title,
  meta,
  badge,
  className,
}: {
  href: string;
  image: string;
  title: string;
  meta?: string;
  badge?: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative isolate block h-[360px] overflow-hidden bg-charcoal sm:h-[440px] lg:h-[540px]",
        className,
      )}
    >
      <Image
        src={image}
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
      />

      {/* Scrim carries the label; it deepens on hover so the meta line stays legible */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-charcoal/90 via-charcoal/35 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

      {badge}

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
        <div className="min-w-0">
          {meta && (
            <p className="mb-1.5 truncate text-[0.7rem] uppercase tracking-[0.2em] text-ivory/60 transition-colors duration-500 group-hover:text-ivory/80">
              {meta}
            </p>
          )}
          <h3 className="truncate font-heading text-2xl leading-tight tracking-tight text-ivory">
            {title}
          </h3>
          <span className="mt-2.5 block h-px w-10 origin-left scale-x-100 bg-ivory/40 transition-transform duration-500 ease-out group-hover:scale-x-[2.4]" />
        </div>
        <ArrowUpRight className="size-5 shrink-0 text-ivory transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

export function ProjectTile({ project }: { project: Project }) {
  return (
    <Tile
      href={`/designers/${project.designerSlug}/${project.slug}`}
      image={project.cover}
      title={project.title}
      meta={`${project.spaceType} · ${project.year}`}
      badge={
        project.modelUrl ? (
          <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-ivory/90 px-3 py-1 text-[0.7rem] font-medium tracking-wide text-charcoal backdrop-blur sm:left-6 sm:top-6">
            <Box className="size-3.5" />
            3D
          </span>
        ) : null
      }
    />
  );
}

/**
 * Closes the tile row with a way out to the wider catalogue. Its image is washed
 * back so the tile reads as an action rather than as one more project.
 */
export function BrowseAllTile({
  href,
  image,
  label = "Browse all",
  meta,
}: {
  href: string;
  image: string;
  label?: string;
  meta?: string;
}) {
  return (
    <Tile
      href={href}
      image={image}
      title={label}
      meta={meta}
      className="[&_img]:opacity-55 [&_img]:saturate-50"
    />
  );
}
