"use client";

import * as React from "react";
import Image from "next/image";
import { Play } from "lucide-react";

import type { VideoClip } from "@/data";
import { cn } from "@/lib/utils";
import { ContainerScroll } from "@/components/ui/container-scroll";

/**
 * Walkthrough section for a case study — one large player with a poster frame
 * that only loads the video once the user asks for it, plus a thumbnail rail
 * when the project has more than one clip.
 *
 * The player sits on a plane that is laid back and rotates upright as the section
 * is scrolled to, so a flat video stands up into a room. Only the player rides the
 * plane — the thumbnail rail stays flat, because rotated buttons are harder to hit
 * and the plane's frame should read as the screen's own bezel.
 */
export function WalkthroughPlayer({
  clips,
  poster,
}: {
  clips: VideoClip[];
  /** Fallback poster (project cover) for clips without one of their own. */
  poster?: string;
}) {
  const [index, setIndex] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const active = clips[index];
  const activePoster = active.poster ?? poster;

  const select = (i: number) => {
    setIndex(i);
    setPlaying(true);
  };

  React.useEffect(() => {
    if (playing) videoRef.current?.play().catch(() => {});
  }, [playing, index]);

  return (
    <div className="space-y-6">
      {/* No border or radius of its own — the plane around it provides both. */}
      <ContainerScroll>
        <div className="relative bg-charcoal">
          <video
            ref={videoRef}
            key={active.src}
            src={playing ? active.src : undefined}
            poster={activePoster}
            controls={playing}
            playsInline
            preload="none"
            className="aspect-video w-full bg-charcoal object-cover"
          />

          {!playing && (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={active.label ?? "Play walkthrough"}
              className="group absolute inset-0 flex items-center justify-center bg-charcoal/10 transition-colors hover:bg-charcoal/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex size-16 items-center justify-center rounded-full bg-ivory/90 text-charcoal shadow-lg backdrop-blur transition-transform duration-300 group-hover:scale-110">
                <Play className="size-6 translate-x-0.5 fill-current" />
              </span>
            </button>
          )}

          <span className="pointer-events-none absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-ivory/90 px-3 py-1 text-[0.7rem] font-medium tracking-wide text-charcoal backdrop-blur">
            Rendered walkthrough
          </span>
        </div>
      </ContainerScroll>

      {clips.length > 1 && (
        <div className="flex flex-wrap gap-3">
          {clips.map((clip, i) => (
            <button
              key={clip.src}
              type="button"
              onClick={() => select(i)}
              aria-current={i === index}
              className={cn(
                "group flex items-center gap-3 rounded-2xl border p-1.5 pr-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                i === index
                  ? "border-foreground/25 bg-card"
                  : "border-border/60 hover:border-foreground/20",
              )}
            >
              <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                <Image
                  src={clip.poster ?? poster ?? ""}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-charcoal/25">
                  <Play className="size-3.5 fill-current text-ivory" />
                </span>
              </span>
              <span className="text-sm text-muted-foreground group-hover:text-foreground">
                {clip.label ?? `Walkthrough ${i + 1}`}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
