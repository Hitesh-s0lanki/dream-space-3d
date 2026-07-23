import { Reveal } from "@/components/reveal";

/**
 * How it works — the studio journey as a numbered timeline, modelled on
 * Bonito's process ribbon. A connecting rule threads the steps on desktop.
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

export function ProcessSection() {
  return (
    <section id="process" className="relative bg-secondary/50">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10 lg:py-32">
        <Reveal className="max-w-xl space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">
            How it works
          </p>
          <h2 className="text-balance text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl">
            From first hello to move-in day.
          </h2>
        </Reveal>

        <div className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {/* connecting rule on desktop */}
          <div className="pointer-events-none absolute inset-x-0 top-5 hidden h-px bg-border lg:block" />
          {STEPS.map((s, i) => (
            <Reveal key={s.step} delay={i * 100} className="relative">
              <div className="relative z-10 flex size-10 items-center justify-center rounded-full border border-border bg-background font-mono text-sm text-walnut">
                {s.step}
              </div>
              <h3 className="mt-6 text-lg font-medium tracking-tight">
                {s.title}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {s.copy}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
