"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

// WebGL can't render on the server — load the scene client-side only.
const Scene = dynamic(
  () => import("@/components/three/scene").then((m) => m.Scene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
        Loading experience…
      </div>
    ),
  }
);

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="relative min-h-svh overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Scene />
        </div>

        {/* Editorial scrims: cream from the left for text legibility, a soft
            fade at the bottom, keeping the room visible on the right. */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-r from-background via-background/70 to-transparent" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-t from-background/80 via-transparent to-transparent" />

        <div className="pointer-events-none mx-auto flex min-h-svh max-w-6xl items-center px-6 sm:px-10">
          <div className="max-w-xl space-y-6">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Interior Design Studio
            </p>
            <h1 className="text-balance text-5xl font-medium leading-[1.05] tracking-tight sm:text-7xl">
              See the space.
              <br />
              Explore the possibilities.
            </h1>
            <p className="max-w-md text-pretty text-lg text-muted-foreground">
              A premium studio experience with immersive home visualization.
            </p>
            <div className="pointer-events-auto flex items-center gap-3 pt-2">
              <Button size="lg">View Projects</Button>
              <Button size="lg" variant="outline" className="bg-background/40 backdrop-blur-sm">
                Book Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="flex min-h-svh items-center justify-center px-6">
        <p className="text-muted-foreground">
          Scroll works (Lenis). 3D works (R3F + drei). Ready to build.
        </p>
      </section>
    </main>
  );
}
