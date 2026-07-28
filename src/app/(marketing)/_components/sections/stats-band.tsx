import { getDesigners, getProjects } from "@/data";
import { Reveal } from "@/components/reveal";

/**
 * Trust band — big editorial numerals on a dark walnut ground, each figure
 * carrying a line of copy that turns it into an invitation.
 *
 * Every figure is platform-wide and read from the data layer, never typed in.
 * Deliberately no years-of-experience figure: that belongs to an individual
 * designer, and quoting one person's would read as the whole platform's.
 */
export function StatsBand() {
  const designers = getDesigners().length;
  const projects = getProjects().length;

  const stats = [
    {
      value: String(designers),
      label: designers === 1 ? "Designer on board" : "Designers on board",
      detail: "Each with a portfolio you can walk through.",
    },
    {
      value: String(projects),
      label: projects === 1 ? "Case study published" : "Case studies published",
      detail: "Explorable room by room, before and after.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-walnut text-ivory">
      {/* soft grain of light + a warm terracotta bloom overhead */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-black/25" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-terracotta/25 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
        <Reveal className="mb-14 text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-ivory/50">
            The studio, in numbers
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl text-balance text-2xl font-medium tracking-tight sm:text-3xl">
            Every room on here was seen before it was built.
          </h2>
        </Reveal>

        <dl className="grid grid-cols-1 divide-y divide-ivory/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          {stats.map((stat, i) => (
            <Reveal
              key={stat.label}
              delay={i * 80}
              className="flex flex-col items-center gap-3 px-6 py-10 text-center"
            >
              <dd className="font-heading text-6xl font-medium leading-none tracking-tight sm:text-7xl">
                {stat.value}
              </dd>
              <dt className="text-xs font-medium uppercase tracking-[0.18em] text-ivory/80">
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
