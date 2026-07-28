import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { ApproachSteps } from "@/components/approach-steps";
import { FounderCard, type Founder } from "./_components/founder-card";

export const metadata: Metadata = {
  title: "About — Rumiva Interior Design Studio",
  description:
    "Rumiva is an interior design studio with a visualization engine at its core — founded by an interior designer and a software engineer. Our story, our process, and notes from the studio.",
  alternates: { canonical: "/about" },
};

const STATS = [
  { value: "40+", label: "Projects delivered" },
  { value: "100%", label: "Previewed in 3D" },
  { value: "2", label: "Cities · Mumbai, Bengaluru" },
];

const FOUNDERS: Founder[] = [
  {
    name: "Nikhil Solanki",
    role: "Co-founder · Interior Designer",
    image: "/team/nikhil-solanki.jpg",
    owns: ["Space planning", "Materials", "Detailing", "Site execution"],
    bio: "Nikhil designs the space. Forty-odd homes in, his read on a room starts with the people in it — how they cook, where they drop their keys, which corner gets the good light at 4 PM. Proportion and circulation get resolved before a single finish is chosen.\n\nHis approach grew out of a family renovation, watching how alignment, material and execution quietly decide whether a room feels right. He runs the studio's design practice out of Mumbai and stays on site through handover.",
    link: { href: "/designers/nikhil", label: "See Nikhil's portfolio" },
  },
  {
    name: "Hitesh Solanki",
    role: "Co-founder · Software Engineer",
    image: "/team/hitesh-solanki.jpg",
    owns: ["3D pipeline", "Real-time walkthroughs", "Platform", "Tooling"],
    bio: "Hitesh builds the part you walk through. Every Rumiva project ships as an explorable model, and the pipeline behind it — geometry, lighting, true-scale materials, and the real-time viewer in your browser — is his.\n\nHe came to interiors sideways, from software, and kept the standards: if a client can't open their home on a phone in a few seconds and move through it without instructions, it isn't finished. Visualization stays in-house for exactly that reason.",
    link: { href: "/projects", label: "Explore the 3D projects" },
  },
];

const BELIEFS = [
  {
    title: "Show, don't describe.",
    copy: "Mood boards ask you to imagine. A walkthrough doesn't. If we can't show it, we haven't designed it yet.",
  },
  {
    title: "Proportion before decoration.",
    copy: "A room works because of how it's planned, not what's placed in it. We settle the plan first, always.",
  },
  {
    title: "Materials at true scale.",
    copy: "Stone, veneer and fabric mapped at real dimensions, tested against each other — so the render tells the truth.",
  },
  {
    title: "Built as visualised.",
    copy: "The model is the brief. We coordinate on site against it so the finished room matches what you signed off.",
  },
];

const PROCESS = [
  {
    title: "Listen",
    description:
      "We start with how you already live — routines, storage, who's home when, and what you'd never give up.",
  },
  {
    title: "Plan",
    description:
      "Circulation, proportion and daylight resolved on the plan, long before anything gets styled.",
  },
  {
    title: "Visualise",
    description:
      "The space modelled, lit and dressed at true scale. You walk it in your browser before anything is ordered.",
  },
  {
    title: "Refine",
    description:
      "Change the stone, the joinery, the light temperature. On screen, iterations cost nothing but an evening.",
  },
  {
    title: "Build",
    description:
      "Site coordination and turnkey delivery, executed exactly as the model you approved.",
  },
];

const JOURNAL = [
  {
    category: "Materials",
    title: "Reading a stone slab before you buy it",
    excerpt:
      "Veining runs where it wants to. What to look for at the yard, and why the sample board lies about scale.",
    read: "6 min",
  },
  {
    category: "Light",
    title: "Why your ceiling lights are doing all the wrong work",
    excerpt:
      "Layering ambient, task and accent light — and the daylight study that should come before any of it.",
    read: "8 min",
  },
  {
    category: "Planning",
    title: "The kitchen triangle is dead. Plan for zones instead.",
    excerpt:
      "How two people actually move through a kitchen at 8 PM, and what that means for your island.",
    read: "5 min",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-background pb-16 pt-32 sm:pb-20 sm:pt-40">
        <div className="pointer-events-none absolute -right-32 -top-24 size-96 rounded-full bg-terracotta/8 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 size-80 rounded-full bg-sage/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 sm:px-10">
          <Reveal className="space-y-5">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">
              About Rumiva
            </p>
            <h1 className="max-w-3xl text-balance font-heading text-4xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              We bring spaces to life before they are built.
            </h1>
            <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Rumiva is an interior design studio with a visualization engine at
              its core — founded by an interior designer and a software
              engineer who got tired of asking people to imagine.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Stats band */}
      <section className="border-y border-border/60 bg-secondary/40">
        <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-border/60 px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-10">
          {STATS.map((stat) => (
            <div key={stat.label} className="px-4 py-8 text-center sm:py-10">
              <div className="font-heading text-4xl tracking-tight sm:text-5xl">
                {stat.value}
              </div>
              <div className="mt-2 text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Our story */}
      <section id="story" className="scroll-mt-28">
        <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
            <Reveal>
              <div className="relative aspect-4/5 overflow-hidden rounded-3xl">
                <Image
                  src="/gallery/bedroom-02-1.jpg"
                  alt="A Rumiva bedroom interior"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
            </Reveal>

            <Reveal delay={100} className="space-y-6 lg:pt-6">
              <p className="text-xs uppercase tracking-[0.3em] text-accent">
                Our story
              </p>
              <h2 className="text-balance font-heading text-4xl leading-[1.08] tracking-tight sm:text-5xl">
                It started with a renovation and a misunderstanding.
              </h2>
              <div className="space-y-5 text-pretty leading-relaxed text-muted-foreground">
                <p>
                  A family home was being redone. The drawings were fine, the
                  references were fine, everyone nodded — and the finished room
                  still surprised everybody. Not because the taste was wrong,
                  but because no one had actually seen it. A plan asks you to
                  hold a space in your head, and almost nobody can.
                </p>
                <p>
                  That gap is where Rumiva began. One of us kept designing
                  rooms; the other kept building software. Between the two, the
                  fix was obvious: stop asking clients to imagine, and hand them
                  the room instead — modelled, lit, and dressed at true scale,
                  months before the first order goes out.
                </p>
                <p>
                  Today every project we take on is resolved in 3D first. You
                  walk it in your browser, change the stone, move the island,
                  live with it for a week. By the time we break ground, the
                  decisions are already made — and the finished space is the one
                  you approved.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Founders */}
      <section id="founders" className="scroll-mt-28 bg-secondary/40">
        <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10 lg:py-32">
          <Reveal className="grid gap-5 lg:grid-cols-[minmax(0,16rem)_1fr] lg:gap-16">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">
              The founders
            </p>
            <div className="space-y-5">
              <h2 className="max-w-2xl text-balance font-heading text-4xl leading-[1.08] tracking-tight sm:text-5xl">
                Two disciplines, one studio.
              </h2>
              <p className="max-w-xl text-pretty leading-relaxed text-muted-foreground">
                Most studios outsource the visuals. Ours are built in-house, by
                the person who writes the software, alongside the person who
                designs the room. Nothing gets lost between the two.
              </p>
            </div>
          </Reveal>

          <div className="mt-16 grid gap-14 sm:grid-cols-2 sm:gap-10 lg:mt-20 lg:gap-16">
            {FOUNDERS.map((founder, i) => (
              <Reveal key={founder.name} delay={i * 120}>
                <FounderCard founder={founder} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What we believe */}
      <section id="beliefs" className="scroll-mt-28">
        <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10 lg:py-32">
          <Reveal className="grid gap-5 lg:grid-cols-[minmax(0,16rem)_1fr] lg:gap-16">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">
              What we believe
            </p>
            <h2 className="max-w-2xl text-balance font-heading text-4xl leading-[1.08] tracking-tight sm:text-5xl">
              Four rules we don&apos;t bend.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-border/60 bg-border/60 sm:grid-cols-2">
            {BELIEFS.map((belief, i) => (
              <div key={belief.title} className="bg-card p-8 sm:p-10">
                <span className="font-mono text-xs tracking-[0.2em] text-accent">
                  [{String(i + 1).padStart(2, "0")}]
                </span>
                <h3 className="mt-5 font-heading text-2xl leading-tight tracking-tight">
                  {belief.title}
                </h3>
                <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
                  {belief.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Design process — the interactive rail */}
      <section
        id="process"
        className="scroll-mt-28 bg-charcoal py-24 text-ivory lg:py-32"
      >
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <Reveal className="grid gap-5 lg:grid-cols-[minmax(0,16rem)_1fr] lg:gap-16">
            <p className="text-xs uppercase tracking-[0.3em] text-ivory/40">
              Design process
            </p>
            <div className="space-y-5">
              <h2 className="max-w-2xl text-balance font-heading text-4xl leading-[1.08] tracking-tight sm:text-5xl">
                From first hello to the day you move in.
              </h2>
              <p className="max-w-xl text-pretty leading-relaxed text-ivory/50">
                Five stages, the same on every project. Step through them.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120} className="mt-16 lg:mt-20">
            <ApproachSteps steps={PROCESS} />
          </Reveal>
        </div>
      </section>

      {/* Journal & insights */}
      <section id="journal" className="scroll-mt-28 bg-secondary/40">
        <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10 lg:py-32">
          <Reveal className="grid gap-5 lg:grid-cols-[minmax(0,16rem)_1fr] lg:gap-16">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">
              Journal &amp; insights
            </p>
            <div className="space-y-5">
              <h2 className="max-w-2xl text-balance font-heading text-4xl leading-[1.08] tracking-tight sm:text-5xl">
                Notes from the studio.
              </h2>
              <p className="max-w-xl text-pretty leading-relaxed text-muted-foreground">
                What we learn on site, written down — materials, light, and the
                planning decisions that quietly make or break a room. The full
                journal opens shortly; these are the first three.
              </p>
            </div>
          </Reveal>

          <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-border/60 bg-border/60 lg:grid-cols-3">
            {JOURNAL.map((post) => (
              <li
                key={post.title}
                className="flex flex-col gap-3 bg-card p-8 sm:p-9"
              >
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-accent">
                  {post.category}
                  <span className="text-muted-foreground/50">·</span>
                  <span className="text-muted-foreground">{post.read}</span>
                </div>
                <h3 className="text-balance font-heading text-2xl leading-tight tracking-tight">
                  {post.title}
                </h3>
                <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
                <span className="mt-auto pt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground/70">
                  Coming soon
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-background">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 sm:px-10 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:py-24">
          <div className="space-y-5">
            <h2 className="text-balance font-heading text-4xl leading-[1.08] tracking-tight sm:text-5xl">
              Let&apos;s design something you can walk through.
            </h2>
            <p className="max-w-md text-pretty text-muted-foreground">
              Tell us about your space. We&apos;ll come back within a day with a
              read on what it could become.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 lg:justify-self-end">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background transition-transform duration-300 hover:-translate-y-0.5"
            >
              Book a consultation
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-accent"
            >
              See the work
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
