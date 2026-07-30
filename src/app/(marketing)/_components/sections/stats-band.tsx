import { getDesigners, getProjects } from "@/data";
import { Reveal } from "@/components/reveal";
import { AmbientDust } from "@/components/three/lazy";
import { CardBody, CardContainer, CardItem } from "@/components/ui/card-3d";

/**
 * Trust band — big editorial numerals on a dark walnut ground, each figure
 * carrying a line of copy that turns it into an invitation.
 *
 * Every figure is platform-wide and read from the data layer, never typed in.
 * Deliberately no years-of-experience figure: that belongs to an individual
 * designer, and quoting one person's would read as the whole platform's.
 *
 * Each figure sits in its own tilting card: the numeral is pushed furthest
 * forward on the Z axis, the label behind it, the caption behind that — so the
 * hierarchy is literal depth rather than only type size. Dust drifts through the
 * walnut behind them (three.js `DustField`).
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
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <AmbientDust color="#f6efe4" count={420} spread={15} size={2} seed={21} />
      </div>

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
            <Reveal key={stat.label} delay={i * 80}>
              <CardContainer
                containerClassName="py-4"
                className="w-full"
                intensity={9}
              >
                <CardBody className="flex flex-col items-center gap-3 px-6 py-8 text-center">
                  <CardItem
                    as="dd"
                    translateZ={70}
                    className="mx-auto font-heading text-6xl font-medium leading-none tracking-tight sm:text-7xl"
                  >
                    {stat.value}
                  </CardItem>
                  <CardItem
                    as="dt"
                    translateZ={40}
                    className="mx-auto text-xs font-medium uppercase tracking-[0.18em] text-ivory/80"
                  >
                    {stat.label}
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ={20}
                    className="mx-auto max-w-[22ch] text-pretty text-sm text-ivory/55"
                  >
                    {stat.detail}
                  </CardItem>
                </CardBody>
              </CardContainer>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
