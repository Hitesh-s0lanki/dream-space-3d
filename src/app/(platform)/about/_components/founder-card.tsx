"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export type Founder = {
  name: string;
  /** Job title — what they trained as. */
  role: string;
  /** What they own inside the studio, shown as a short list. */
  owns: string[];
  /** Paragraphs, split on "\n\n". */
  bio: string;
  /** Portrait in /public. Falls back to a monogram until the file exists. */
  image: string;
  link?: { href: string; label: string };
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Founder profile — portrait over a short bio and the disciplines they own.
 * The portrait degrades to a monogram plate if the image is missing, so the
 * page reads correctly before the real photography lands.
 */
export function FounderCard({ founder }: { founder: Founder }) {
  const [failed, setFailed] = React.useState(false);

  return (
    <article className="group flex flex-col">
      <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-secondary">
        {failed ? (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-secondary via-muted to-stone/40">
            <span className="font-heading text-7xl tracking-tight text-walnut/30">
              {initials(founder.name)}
            </span>
          </div>
        ) : (
          <Image
            src={founder.image}
            alt={founder.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            onError={() => setFailed(true)}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        )}
      </div>

      <div className="mt-7 space-y-4">
        <div className="space-y-1.5">
          <h3 className="font-heading text-3xl leading-tight tracking-tight">
            {founder.name}
          </h3>
          <p className="text-xs uppercase tracking-[0.2em] text-accent">
            {founder.role}
          </p>
        </div>

        <div className="space-y-4">
          {founder.bio.split("\n\n").map((para) => (
            <p
              key={para.slice(0, 24)}
              className="text-pretty text-sm leading-relaxed text-muted-foreground"
            >
              {para}
            </p>
          ))}
        </div>

        <ul className="flex flex-wrap gap-x-2 gap-y-1.5 pt-1 text-xs text-muted-foreground">
          {founder.owns.map((item, i) => (
            <li key={item} className="flex items-center gap-2">
              {i > 0 && <span className="text-border">·</span>}
              {item}
            </li>
          ))}
        </ul>

        {founder.link && (
          <Link
            href={founder.link.href}
            className="group/link inline-flex items-center gap-1.5 pt-1 text-sm font-medium text-foreground transition-colors hover:text-accent"
          >
            {founder.link.label}
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
          </Link>
        )}
      </div>
    </article>
  );
}
