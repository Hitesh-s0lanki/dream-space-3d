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
      <section className="relative flex min-h-svh flex-col items-center justify-center gap-8 px-6 text-center">
        <div className="absolute inset-0 -z-10">
          <Scene />
        </div>

        <div className="max-w-2xl space-y-4 rounded-2xl bg-background/60 p-8 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Interior Design Studio
          </p>
          <h1 className="text-balance text-4xl font-medium tracking-tight sm:text-6xl">
            See the space. Explore the possibilities.
          </h1>
          <p className="text-pretty text-muted-foreground">
            A premium studio experience with immersive home visualization.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button size="lg">View Projects</Button>
            <Button size="lg" variant="outline">
              Book Consultation
            </Button>
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
