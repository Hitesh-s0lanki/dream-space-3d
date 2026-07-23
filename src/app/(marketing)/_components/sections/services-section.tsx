import { Reveal } from "@/components/reveal";
import {
  Card,
  Carousel,
  type CarouselCard,
} from "@/components/ui/apple-cards-carousel";

/**
 * What we do — the four service pillars, presented as an Apple-style cards
 * carousel (ui.aceternity.com/components/apple-cards-carousel). Each pillar is a
 * tall image card that expands into a full-detail overlay, so the section reads
 * as an immersive menu of the practice rather than a flat services grid.
 */
type Service = Omit<CarouselCard, "content"> & {
  copy: string;
  includes: string[];
};

const SERVICES: Service[] = [
  {
    category: "01 · Residential",
    title: "Residential Interiors",
    src: "/gallery/bedroom-02-1.jpg",
    copy: "Apartments, villas, and full-home design — from the first mood board to the final styled photograph. We shape light, material, and flow into rooms that feel unmistakably yours.",
    includes: [
      "Space planning & layout",
      "Material & finish direction",
      "Custom joinery & furniture",
      "Styling & final handover",
    ],
  },
  {
    category: "02 · Commercial",
    title: "Commercial Spaces",
    src: "/gallery/kitchen-1.jpg",
    copy: "Offices, retail, cafés, and restaurants that carry a brand into three dimensions. We design environments that work as hard as they look — for the people who use them daily and the ones passing through.",
    includes: [
      "Brand-led spatial concepts",
      "Operational flow & zoning",
      "Lighting & atmosphere",
      "Fit-out documentation",
    ],
  },
  {
    category: "03 · Visualization",
    title: "Immersive 3D Visualization",
    src: "/gallery/bedroom-01-2.jpg",
    copy: "Photoreal renders and real-time walkthroughs, so you see the space before a single wall is built. Every material, every fall of light, resolved on screen — decisions made with confidence, not guesswork.",
    includes: [
      "Photoreal still renders",
      "Real-time 3D walkthroughs",
      "Material & lighting studies",
      "Revision-ready iterations",
    ],
  },
  {
    category: "04 · Consultation",
    title: "Design Consultation",
    src: "/gallery/kitchen-5.jpg",
    copy: "Planning, material direction, and expert guidance for the details that matter. Whether you need a second eye or a full roadmap, we bring clarity to the choices that make or break a space.",
    includes: [
      "Layout & feasibility review",
      "Material & palette guidance",
      "Sourcing & vendor direction",
      "Phased project roadmap",
    ],
  },
];

function ServiceContent({ service }: { service: Service }) {
  return (
    <div className="space-y-8">
      <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
        {service.copy}
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {service.includes.map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 rounded-2xl border border-border/70 bg-secondary/40 px-5 py-4"
          >
            <span className="size-1.5 shrink-0 rounded-full bg-accent" />
            <span className="text-sm font-medium text-foreground">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ServicesSection() {
  const cards = SERVICES.map((service, index) => (
    <Card
      key={service.title}
      index={index}
      layout
      card={{
        ...service,
        content: <ServiceContent service={service} />,
      }}
    />
  ));

  return (
    <section id="services" className="relative overflow-hidden bg-background">
      <div className="mx-auto max-w-6xl px-6 pt-24 sm:px-10 lg:pt-24">
        <Reveal className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">
            What we do
          </p>
          <h2 className="max-w-xl text-balance text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl">
            A full-service studio, end to end.
          </h2>
        </Reveal>
      </div>

      <Reveal className="mt-10 lg:mt-8 mb-8">
        <Carousel items={cards} />
      </Reveal>
    </section>
  );
}
