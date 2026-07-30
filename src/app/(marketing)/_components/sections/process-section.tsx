import { Reveal } from "@/components/reveal";
import { Timeline, type TimelineEntry } from "@/components/ui/timeline";
import { SpotlightCard } from "@/components/ui/spotlight";
import { DotPattern } from "@/components/ui/background-grid";

/**
 * How it works — the studio journey, modelled on Bonito's process ribbon.
 *
 * The four steps now run down a rail whose light travels with the reader
 * (Aceternity's timeline): each step arrives as its own raised card, lit by a
 * pointer-tracked pool of light, so the process is something being built up in
 * front of you rather than four columns of text read at once. On desktop the
 * step number stays pinned in the gutter beside the card it belongs to.
 */
const STEPS: { step: string; title: string; copy: string }[] = [
  {
    step: "01",
    title: "Say hello",
    copy: "Share your space, your budget, and the life you picture inside it.",
  },
  {
    step: "02",
    title: "Dream together",
    copy: "We translate your brief into mood, material, and a considered 3D concept.",
  },
  {
    step: "03",
    title: "See it come alive",
    copy: "Walk your future home in immersive 3D and refine every detail with us.",
  },
  {
    step: "04",
    title: "Move in smiling",
    copy: "We execute, install, and style — then hand you the keys to it all.",
  },
];

const ENTRIES: TimelineEntry[] = STEPS.map((s) => ({
  title: s.step,
  content: (
    <SpotlightCard className="p-8 transition-transform duration-500 ease-out hover:-translate-y-1 sm:p-10">
      <div className="relative flex items-start gap-5">
        {/* The number, on its own raised puck */}
        <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-background font-mono text-sm text-walnut shadow-[0_6px_16px_rgb(0_0_0/0.08)]">
          {s.step}
        </span>
        <div className="space-y-2">
          <h3 className="font-heading text-2xl leading-tight tracking-tight">
            {s.title}
          </h3>
          <p className="max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
            {s.copy}
          </p>
        </div>
      </div>
    </SpotlightCard>
  ),
}));

export function ProcessSection() {
  return (
    <section id="process" className="relative overflow-hidden bg-secondary/50">
      <DotPattern className="opacity-70" />

      <div className="relative mx-auto max-w-6xl px-6 pt-24 sm:px-10 lg:pt-32">
        <Reveal className="max-w-xl space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">
            How it works
          </p>
          <h2 className="text-balance text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl">
            From first hello to move-in day.
          </h2>
        </Reveal>
      </div>

      <Timeline data={ENTRIES} className="relative px-6 sm:px-10" />
    </section>
  );
}
