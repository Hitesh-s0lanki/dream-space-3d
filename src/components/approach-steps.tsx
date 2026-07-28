"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type Step = { title: string; description: string };

/** Canvas the rail is drawn in; the SVG scales to the row's width. */
const VIEW_W = 1000;
const VIEW_H = 240;
const AUTOPLAY_MS = 3600;

/** Catmull-Rom through the points, emitted as cubic beziers — one smooth line. */
function smoothPath(points: [number, number][]) {
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6}`;
    d += ` ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6}`;
    d += ` ${p2[0]},${p2[1]}`;
  }
  return d;
}

/**
 * One crest per step, climbing to the right, with a dip between each — the line
 * reads as a journey rather than a chart. Derived from the step count so the
 * rail redraws itself if the data grows.
 */
function buildRail(count: number) {
  const band = VIEW_W / count;
  const crests: [number, number][] = Array.from({ length: count }, (_, i) => [
    band * (i + 0.5),
    168 - (i * 96) / Math.max(count - 1, 1),
  ]);

  const points: [number, number][] = [[0, 200]];
  crests.forEach((crest, i) => {
    points.push(crest);
    const next = crests[i + 1];
    if (next) {
      points.push([(crest[0] + next[0]) / 2, (crest[1] + next[1]) / 2 + 34]);
    }
  });
  points.push([VIEW_W, crests[count - 1][1] - 30]);

  return { crests, d: smoothPath(points) };
}

export function ApproachSteps({ steps }: { steps: Step[] }) {
  const [active, setActive] = React.useState(0);
  /** Autoplay runs until the visitor takes over, then never resumes. */
  const [engaged, setEngaged] = React.useState(false);
  const [inView, setInView] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const pathRef = React.useRef<SVGPathElement | null>(null);

  const { crests, d } = React.useMemo(
    () => buildRail(steps.length),
    [steps.length],
  );

  // How far along the rail each crest sits, as a 0–1 fraction of its length —
  // the accent stroke uses it directly since the path is normalised to 1.
  const [marks, setMarks] = React.useState<number[]>([]);
  React.useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const total = path.getTotalLength();
    setMarks(
      crests.map(([cx]) => {
        let lo = 0;
        let hi = total;
        for (let i = 0; i < 22; i++) {
          const mid = (lo + hi) / 2;
          if (path.getPointAtLength(mid).x < cx) lo = mid;
          else hi = mid;
        }
        return lo / total;
      }),
    );
  }, [crests, d]);

  React.useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (engaged || !inView) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % steps.length),
      AUTOPLAY_MS,
    );
    return () => window.clearInterval(id);
  }, [engaged, inView, steps.length]);

  const select = (i: number) => {
    setEngaged(true);
    setActive(i);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const delta =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0;
    if (!delta) return;
    event.preventDefault();
    const next = (active + delta + steps.length) % steps.length;
    select(next);
    rootRef.current
      ?.querySelectorAll<HTMLButtonElement>("[data-step]")
      [next]?.focus();
  };

  const progress = marks[active] ?? (active + 1) / steps.length;

  return (
    <div ref={rootRef} onKeyDown={onKeyDown}>
      {/* The rail — desktop only; below lg the steps carry their own spine */}
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        aria-hidden
        className="hidden w-full lg:block"
      >
        {/* Active band, so the highlight runs up through the illustration too */}
        {steps.map((_, i) => (
          <rect
            key={`band-${i}`}
            x={(VIEW_W / steps.length) * i}
            y={0}
            width={VIEW_W / steps.length}
            height={VIEW_H}
            className={cn(
              "fill-ivory/4 transition-opacity duration-500",
              i === active ? "opacity-100" : "opacity-0",
            )}
          />
        ))}

        {/* Cell dividers, continuing the ones between the step cards below */}
        {steps.slice(1).map((_, i) => (
          <line
            key={i}
            x1={(VIEW_W / steps.length) * (i + 1)}
            x2={(VIEW_W / steps.length) * (i + 1)}
            y1={0}
            y2={VIEW_H}
            className="stroke-ivory/10"
            strokeWidth={1}
          />
        ))}

        <path
          ref={pathRef}
          d={d}
          fill="none"
          className="stroke-ivory/20"
          strokeWidth={1.25}
        />
        <path
          d={d}
          fill="none"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - progress}
          strokeLinecap="round"
          className="stroke-accent transition-[stroke-dashoffset] duration-[900ms] ease-out motion-reduce:transition-none"
          strokeWidth={1.75}
        />

        {crests.map(([cx, cy], i) => (
          <g key={i}>
            <circle
              cx={cx}
              cy={cy}
              r={13}
              fill="none"
              strokeWidth={1}
              className={cn(
                "stroke-accent transition-opacity duration-500",
                i === active ? "opacity-45" : "opacity-0",
              )}
            />
            <circle
              cx={cx}
              cy={cy}
              r={4}
              className={cn(
                "transition-colors duration-500",
                i <= active ? "fill-accent" : "fill-ivory/25",
              )}
            />
          </g>
        ))}
      </svg>

      {/* Steps */}
      <div className="grid lg:auto-cols-fr lg:grid-flow-col lg:divide-x lg:divide-ivory/10">
        {steps.map((step, i) => (
          <button
            key={step.title}
            type="button"
            data-step
            aria-current={i === active}
            onMouseEnter={() => select(i)}
            onFocus={() => select(i)}
            onClick={() => select(i)}
            className={cn(
              "relative flex flex-col items-start gap-3 py-7 text-left transition-colors duration-500 lg:px-7",
              // Below lg each step hangs off a shared vertical spine.
              "border-l border-ivory/10 pl-7 lg:border-l-0",
              i === active && "lg:bg-ivory/4",
            )}
          >
            {/* Spine node for the stacked layout */}
            <span
              className={cn(
                "absolute left-0 top-9 size-2 -translate-x-1/2 rounded-full transition-colors duration-500 lg:hidden",
                i <= active ? "bg-accent" : "bg-ivory/25",
              )}
            />
            <span
              className={cn(
                "font-mono text-xs tracking-[0.2em] transition-colors duration-500",
                i === active ? "text-accent" : "text-ivory/35",
              )}
            >
              [{String(i + 1).padStart(2, "0")}]
            </span>
            <h3
              className={cn(
                // Two-line floor so every body copy starts on the same baseline.
                "font-heading text-2xl leading-tight tracking-tight transition-colors duration-500 lg:min-h-15",
                i === active ? "text-accent" : "text-ivory/75",
              )}
            >
              {step.title}
            </h3>
            <p
              className={cn(
                "text-pretty text-sm leading-relaxed transition-colors duration-500",
                i === active ? "text-ivory/75" : "text-ivory/40",
              )}
            >
              {step.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
