import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Box } from "lucide-react";

import type { Project } from "@/data";
import { CardBody, CardContainer, CardItem } from "@/components/ui/card-3d";

/**
 * A project tile for portfolio grids. Shows the cover, a hover lift, and a
 * "3D" badge when the project ships an explorable model. Pass `designerName`
 * on cross-designer listings (e.g. the global /projects index) to credit the
 * studio; omit it on a designer's own portfolio where that context is implied.
 *
 * The card is a stack of layers on a perspective stage rather than a flat
 * rectangle: it tilts toward the pointer, and each element is lifted a different
 * distance out of the card plane — the 3D badge highest, then the cover, then the
 * title, then the body copy. The parallax between those layers is what makes it
 * read as an object, and it matches what the product actually sells.
 */
export function ProjectCard({
  project,
  designerName,
}: {
  project: Project;
  designerName?: string;
}) {
  return (
    <Link
      href={`/designers/${project.designerSlug}/${project.slug}`}
      className="group block h-full"
    >
      <CardContainer
        containerClassName="h-full w-full"
        className="h-full w-full"
        intensity={10}
      >
        {/* No `overflow-hidden` on the body: it would force `transform-style`
            back to flat and collapse every layer below into one plane. The cover
            clips itself instead. */}
        <CardBody className="relative flex h-full flex-col rounded-3xl border border-border/60 bg-card p-2 transition-shadow duration-500 group-hover:shadow-2xl group-hover:shadow-charcoal/10">
          <CardItem
            translateZ={40}
            className="relative aspect-4/3 w-full overflow-hidden rounded-2xl"
          >
            <Image
              src={project.cover}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </CardItem>

          {project.modelUrl && (
            <CardItem
              translateZ={90}
              className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-ivory/90 px-3 py-1 text-[0.7rem] font-medium tracking-wide text-charcoal shadow-lg shadow-charcoal/20 backdrop-blur"
            >
              <Box className="size-3.5" />
              3D
            </CardItem>
          )}

          <div className="flex flex-1 flex-col gap-2 p-5">
            <CardItem
              translateZ={30}
              className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-accent"
            >
              <span>{project.spaceType}</span>
              <span className="text-muted-foreground/50">·</span>
              <span className="text-muted-foreground">{project.year}</span>
            </CardItem>

            <CardItem
              as="h3"
              translateZ={55}
              className="font-heading text-2xl leading-tight tracking-tight"
            >
              {project.title}
            </CardItem>

            {designerName && (
              <CardItem
                as="p"
                translateZ={25}
                className="text-xs text-muted-foreground"
              >
                by <span className="text-foreground/80">{designerName}</span>
              </CardItem>
            )}

            <CardItem
              as="p"
              translateZ={18}
              className="text-pretty text-sm leading-relaxed text-muted-foreground"
            >
              {project.summary}
            </CardItem>

            <CardItem
              translateZ={45}
              className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-medium text-foreground"
            >
              View case study
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>
    </Link>
  );
}
