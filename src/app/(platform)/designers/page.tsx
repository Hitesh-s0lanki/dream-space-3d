import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, MapPin } from "lucide-react";

import { getDesigners, getProjects, getProjectsByDesigner } from "@/data";
import { Reveal } from "@/components/reveal";
import { Badge } from "@/components/ui/badge";
import { AmbientRenderWall } from "@/components/three/lazy";
import { CardBody, CardContainer, CardItem } from "@/components/ui/card-3d";
import { HeroHighlight } from "@/components/ui/hero-highlight";

export const metadata: Metadata = {
  title: "Meet the Designers — Rumiva",
  description:
    "Browse the interior designers on Rumiva and explore their portfolios in immersive 3D.",
};

export default function DesignersPage() {
  const designers = getDesigners();
  // Every cover on the platform, hung on the wall below the header.
  const covers = getProjects().map((p) => p.cover);

  return (
    <>
      <HeroHighlight
        containerClassName="mx-auto w-full max-w-6xl px-6 pt-32 pb-16 sm:px-10 sm:pt-40"
        radius={300}
      >
        <Reveal className="max-w-2xl space-y-5">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">
            The studio collective
          </p>
          <h1 className="text-balance font-heading text-5xl leading-[1.05] tracking-tight sm:text-6xl">
            Meet the designers
          </h1>
          <p className="text-pretty text-lg text-muted-foreground">
            Independent interior designers, each with a portfolio you can walk
            through in 3D. Find the one whose eye feels like home.
          </p>
        </Reveal>
      </HeroHighlight>

      {/* The collective's work as an actual room: framed prints standing on a
          polished floor in three.js, lit from above, the camera walking the wall
          with the pointer. Full-bleed, because a gallery with margins is a
          thumbnail strip. */}
      <section
        aria-label="Gallery of work from the collective"
        className="relative h-[62svh] min-h-112 w-full overflow-hidden border-y border-border/60 bg-charcoal"
      >
        <AmbientRenderWall images={covers} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-charcoal to-transparent" />
        <p className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 text-[0.7rem] uppercase tracking-[0.24em] text-ivory/50">
          Move your cursor to walk the wall
        </p>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-6 pb-28 pt-20 sm:grid-cols-2 sm:px-10">
        {designers.map((designer, i) => {
          const count = getProjectsByDesigner(designer.slug).length;
          return (
            <Reveal key={designer.slug} delay={i * 80}>
              {/* A stack of layers on a perspective stage: the city tag rides
                  highest over the cover, then the studio name, then the copy —
                  depth doing the work a drop shadow used to. */}
              <Link
                href={`/designers/${designer.slug}`}
                className="group block h-full"
              >
                <CardContainer
                  containerClassName="h-full w-full"
                  className="h-full w-full"
                  intensity={10}
                >
                  <CardBody className="relative flex h-full flex-col rounded-3xl border border-border/60 bg-card p-2 transition-shadow duration-500 group-hover:shadow-2xl group-hover:shadow-charcoal/10">
                    <CardItem
                      translateZ={40}
                      className="relative aspect-16/10 w-full overflow-hidden rounded-2xl"
                    >
                      <Image
                        src={designer.cover}
                        alt={`${designer.studioName} work`}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-charcoal/60 via-charcoal/0 to-transparent" />
                      {/* Stays inside the cover rather than lifting on its own:
                          the clipping needed for the rounded corners would flatten
                          any 3D layer nested here anyway. */}
                      <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-sm text-ivory drop-shadow-md">
                        <MapPin className="size-3.5" />
                        {designer.city}
                      </div>
                    </CardItem>

                    <div className="flex flex-1 flex-col gap-4 p-6">
                      <div className="space-y-1.5">
                        <CardItem
                          as="h2"
                          translateZ={58}
                          className="font-heading text-3xl leading-tight tracking-tight"
                        >
                          {designer.studioName}
                        </CardItem>
                        <CardItem
                          as="p"
                          translateZ={28}
                          className="text-sm text-muted-foreground"
                        >
                          {designer.name} · {count} project
                          {count === 1 ? "" : "s"}
                        </CardItem>
                      </div>

                      <CardItem
                        as="p"
                        translateZ={20}
                        className="text-pretty text-sm leading-relaxed text-muted-foreground"
                      >
                        {designer.tagline}
                      </CardItem>

                      <CardItem
                        translateZ={35}
                        className="mt-auto flex w-full flex-wrap gap-2 pt-2"
                      >
                        {designer.styles.map((style) => (
                          <Badge
                            key={style}
                            variant="secondary"
                            className="rounded-full font-normal"
                          >
                            {style}
                          </Badge>
                        ))}
                      </CardItem>

                      <CardItem
                        translateZ={48}
                        className="inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-foreground"
                      >
                        View portfolio
                        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </CardItem>
                    </div>
                  </CardBody>
                </CardContainer>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </>
  );
}
