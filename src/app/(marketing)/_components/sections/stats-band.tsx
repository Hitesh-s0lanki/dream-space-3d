import { Reveal } from "@/components/reveal";

/**
 * Trust band — retuned for a studio at its very beginning. Rather than pad the
 * grid with borrowed numbers, we lean into an honest two-up statement on a dark
 * walnut ground: big editorial numerals, a hairline divider, and a line of copy
 * that turns each figure into an invitation.
 */
const STATS: { value: string; label: string; detail: string }[] = [
  {
    value: "0",
    label: "Homes designed",
    detail: "The next one could be yours.",
  },
  {
    value: "1",
    label: "In-house designer",
    detail: "Every project, personally led.",
  },
];

export function StatsBand() {
  return (
    <section className="relative overflow-hidden bg-walnut text-ivory">
      {/* soft grain of light + a warm terracotta bloom overhead */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-black/25" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-terracotta/25 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-6 py-20 sm:px-10 sm:py-28">
        <Reveal className="mb-14 text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-ivory/50">
            The studio, honestly
          </p>
          <h2 className="mt-4 text-balance text-2xl font-medium tracking-tight sm:text-3xl">
            A new studio, with everything still to prove.
          </h2>
        </Reveal>

        <dl className="grid grid-cols-1 divide-y divide-ivory/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          {STATS.map((stat, i) => (
            <Reveal
              key={stat.label}
              delay={i * 80}
              className="flex flex-col items-center gap-3 px-6 py-10 text-center sm:py-4"
            >
              <dd className="font-heading text-7xl font-medium leading-none tracking-tight sm:text-8xl">
                {stat.value}
              </dd>
              <dt className="text-sm font-medium uppercase tracking-[0.18em] text-ivory/80">
                {stat.label}
              </dt>
              <p className="max-w-[22ch] text-pretty text-sm text-ivory/55">
                {stat.detail}
              </p>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
