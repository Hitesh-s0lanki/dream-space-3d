import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getOptionalAccount } from "@/lib/auth/dal";
import { AmbientGlass } from "@/components/three/lazy";
import { GridPattern } from "@/components/ui/background-grid";
import { SpotlightCard } from "@/components/ui/spotlight";

/**
 * Chrome for the designer auth screens (login / onboarding). Kept separate from
 * the marketing + platform layouts — no site header or footer here, just a
 * centered card. Anyone already signed in is bounced straight to the studio.
 *
 * The empty space around that card is where this site would otherwise fall flat,
 * so it becomes the deepest scene on it: glass and ceramic solids drift behind a
 * drafting grid in three.js, and the card floats above them on a perspective
 * stage, lit by a pool of light that follows the pointer.
 */
export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (await getOptionalAccount()) {
    redirect("/studio");
  }

  return (
    // `dark` scopes the whole screen to the dark token set. The forms inside are
    // built from semantic tokens (`text-foreground`, `bg-input`…), so flipping the
    // variables is what keeps them legible on this ground — hard-coding ivory on
    // each control would drift the moment a field is added.
    //
    // `text-foreground` here is load-bearing, not decoration: `<body>` sits
    // outside this subtree, so its `color` was already computed against the light
    // tokens and *inherits* down as a concrete charcoal. Anything that doesn't set
    // its own colour — form labels, for one — would render charcoal-on-charcoal.
    // Re-declaring it inside the `.dark` scope recomputes it.
    <div
      className="dark relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background px-4 py-12 text-foreground"
      style={{ perspective: "1400px" }}
    >
      <div className="pointer-events-none absolute inset-0">
        <AmbientGlass tint="#e8dfd2" />
      </div>
      <GridPattern className="opacity-[0.07]" size={64} fade={false} />
      {/* Scrim only where the type sits — the shapes stay legible at the edges */}
      <div className="pointer-events-none absolute inset-0 bg-radial-[at_50%_50%] from-background/85 via-background/45 to-background/15" />

      <Link
        href="/"
        className="group relative mb-8 flex items-center gap-2.5"
        aria-label="Rumiva — home"
      >
        <Image
          src="/logo/studio_s_mark_transparent_dark_background_version.png"
          alt="Rumiva"
          width={44}
          height={48}
          priority
          className="h-8 w-auto transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:-rotate-6"
        />
        <span className="text-base font-medium tracking-wider text-foreground">
          Rumiva
        </span>
      </Link>

      <SpotlightCard className="relative w-full max-w-md border-white/10 bg-card/70 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl transition-transform duration-500 hover:transform-[translateZ(24px)] sm:p-8">
        <div className="relative">{children}</div>
      </SpotlightCard>

      <p className="relative mt-6 max-w-md text-center text-xs text-muted-foreground">
        For interior designers joining the Rumiva directory. By continuing you
        agree to showcase your work responsibly.
      </p>
    </div>
  );
}
