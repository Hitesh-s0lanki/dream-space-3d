import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, MapPin } from "lucide-react";

import { getDesigners, getProjectsByDesigner } from "@/data";
import { Reveal } from "@/components/reveal";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Meet the Designers — Ruumiva",
  description:
    "Browse the interior designers on Ruumiva and explore their portfolios in immersive 3D.",
};

export default function DesignersPage() {
  const designers = getDesigners();

  return (
    <div className="mx-auto max-w-6xl px-6 pb-28 pt-32 sm:px-10 sm:pt-40">
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

      <div className="mt-14 grid gap-8 sm:grid-cols-2">
        {designers.map((designer, i) => {
          const count = getProjectsByDesigner(designer.slug).length;
          return (
            <Reveal key={designer.slug} delay={i * 80}>
              <Link
                href={`/designers/${designer.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-charcoal/5"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={designer.cover}
                    alt={`${designer.studioName} work`}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-charcoal/60 via-charcoal/0 to-transparent" />
                  <div className="absolute bottom-4 left-5 flex items-center gap-1.5 text-sm text-ivory">
                    <MapPin className="size-3.5" />
                    {designer.city}
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-4 p-7">
                  <div className="space-y-1.5">
                    <h2 className="font-heading text-3xl leading-tight tracking-tight">
                      {designer.studioName}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {designer.name} · {count} project{count === 1 ? "" : "s"}
                    </p>
                  </div>

                  <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                    {designer.tagline}
                  </p>

                  <div className="mt-auto flex flex-wrap gap-2 pt-2">
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

                  <span className="inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-foreground">
                    View portfolio
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
