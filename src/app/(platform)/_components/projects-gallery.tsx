"use client";

import * as React from "react";
import { Box, SearchX } from "lucide-react";

import type { Project } from "@/data";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/reveal";
import { ProjectCard } from "./project-card";

const ALL = "All";

/**
 * The filterable body of the /projects index. Filters run client-side over the
 * full project set passed from the server — space-type chips plus a "3D only"
 * toggle. Designer names are supplied as a slug→studio map so cards can credit
 * the studio without each card re-reading the data layer.
 */
export function ProjectsGallery({
  projects,
  designerNames,
}: {
  projects: Project[];
  designerNames: Record<string, string>;
}) {
  const [space, setSpace] = React.useState<string>(ALL);
  const [threeDOnly, setThreeDOnly] = React.useState(false);

  // Space-type chips, derived from the data so the bar grows with the catalogue.
  const spaceTypes = React.useMemo(() => {
    const set = new Set(projects.map((p) => p.spaceType));
    return [ALL, ...[...set].sort()];
  }, [projects]);

  const hasModels = React.useMemo(
    () => projects.some((p) => p.modelUrl),
    [projects],
  );

  const visible = projects.filter((p) => {
    if (space !== ALL && p.spaceType !== space) return false;
    if (threeDOnly && !p.modelUrl) return false;
    return true;
  });

  return (
    <div>
      {/* Filter bar */}
      <div className="sticky top-24 z-10 -mx-6 mb-12 flex flex-wrap items-center gap-x-6 gap-y-4 border-b border-border/60 bg-background/80 px-6 py-4 backdrop-blur-md sm:top-28 sm:mx-0 sm:rounded-full sm:border sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          {spaceTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSpace(type)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                space === type
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
              )}
            >
              {type}
            </button>
          ))}
        </div>

        {hasModels && (
          <button
            type="button"
            onClick={() => setThreeDOnly((v) => !v)}
            aria-pressed={threeDOnly}
            className={cn(
              "ml-auto inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              threeDOnly
                ? "border-accent bg-accent/10 text-accent"
                : "border-border/60 text-muted-foreground hover:border-foreground/30 hover:text-foreground",
            )}
          >
            <Box className="size-3.5" />
            3D walkthroughs
          </button>
        )}
      </div>

      {/* Result count */}
      <p className="mb-8 text-sm text-muted-foreground">
        {visible.length} project{visible.length === 1 ? "" : "s"}
        {space !== ALL && (
          <>
            {" "}
            in <span className="text-foreground">{space}</span>
          </>
        )}
      </p>

      {visible.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project, i) => (
            <Reveal key={`${project.designerSlug}/${project.slug}`} delay={i * 60}>
              <ProjectCard
                project={project}
                designerName={designerNames[project.designerSlug]}
              />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border/60 px-6 py-24 text-center">
          <SearchX className="size-8 text-muted-foreground/60" />
          <p className="text-pretty text-muted-foreground">
            No projects match these filters yet.
          </p>
          <button
            type="button"
            onClick={() => {
              setSpace(ALL);
              setThreeDOnly(false);
            }}
            className="text-sm font-medium text-accent underline-offset-4 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
