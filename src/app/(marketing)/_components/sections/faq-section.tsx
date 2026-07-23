import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/reveal";

/**
 * FAQ — the questions every prospective client asks before booking, in a
 * collapsible list beside a sticky heading, mirroring Bonito's FAQ block.
 */
const FAQS: { q: string; a: string }[] = [
  {
    q: "What does an end-to-end project include?",
    a: "Everything from the first concept and 3D visualization through material selection, execution, installation, and final styling. One studio, one point of contact, start to finish.",
  },
  {
    q: "How long does a full home take?",
    a: "Most residential projects move in within 45 to 90 days of design sign-off, depending on scope and site conditions. We share a firm timeline before work begins.",
  },
  {
    q: "Can I see my home before it is built?",
    a: "Yes — every project includes photoreal renders and an immersive real-time walkthrough, so you can explore and refine each space before a single wall moves.",
  },
  {
    q: "How is pricing structured?",
    a: "We scope each project transparently against your budget, with a detailed line-item estimate up front. No surprises, no hidden charges.",
  },
  {
    q: "Do you offer a warranty?",
    a: "All of our workmanship carries a 10-year warranty, backed by an in-house team rather than subcontracted labour.",
  },
  {
    q: "Which cities do you work in?",
    a: "We currently take on projects across major metros and are expanding. Book a consultation and we will confirm availability for your location.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="relative bg-secondary/50">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:py-32">
        <Reveal className="lg:sticky lg:top-28 lg:h-fit">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">
            Good to know
          </p>
          <h2 className="mt-4 text-balance text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl">
            Questions, answered.
          </h2>
          <p className="mt-5 max-w-xs text-pretty text-sm text-muted-foreground">
            Still curious? A quick consultation clears up the rest — and it is
            entirely free.
          </p>
        </Reveal>

        <Reveal>
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f) => (
              <AccordionItem key={f.q} value={f.q} className="border-border/70">
                <AccordionTrigger className="py-5 text-base font-medium hover:no-underline sm:text-lg">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
