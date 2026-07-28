import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getOptionalAccount } from "@/lib/auth/dal";

/**
 * Chrome for the designer auth screens (login / onboarding). Kept separate from
 * the marketing + platform layouts — no site header or footer here, just a
 * centered card. Anyone already signed in is bounced straight to the studio.
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
    <div className="flex min-h-dvh flex-col items-center justify-center bg-muted/40 px-4 py-12">
      <Link
        href="/"
        className="mb-8 flex items-center gap-2.5"
        aria-label="Rumiva — home"
      >
        <Image
          src="/logo/studio_s_mark_transparent_walnut.png"
          alt="Rumiva"
          width={44}
          height={48}
          priority
          className="h-8 w-auto"
        />
        <span className="text-base font-medium tracking-[0.05em] text-foreground">
          Rumiva
        </span>
      </Link>

      <div className="w-full max-w-md rounded-2xl border border-border/60 bg-background p-6 shadow-lg shadow-charcoal/5 sm:p-8">
        {children}
      </div>

      <p className="mt-6 max-w-md text-center text-xs text-muted-foreground">
        For interior designers joining the Rumiva directory. By continuing you
        agree to showcase your work responsibly.
      </p>
    </div>
  );
}
