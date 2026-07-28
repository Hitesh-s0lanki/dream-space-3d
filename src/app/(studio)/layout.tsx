import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { logout } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";

/**
 * Chrome for the authenticated designer studio. The real auth gate lives in the
 * pages (via the DAL) and `src/proxy.ts`; this layout is just the top bar. The
 * log-out control is a plain form bound to the `logout` server action, so it
 * needs no client component.
 */
export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-muted/30">
      <header className="border-b border-border/60 bg-background">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/studio"
            className="flex items-center gap-2.5"
            aria-label="Rumiva Studio"
          >
            <Image
              src="/logo/studio_s_mark_transparent_walnut.png"
              alt="Rumiva"
              width={44}
              height={48}
              className="h-7 w-auto"
            />
            <span className="text-sm font-medium tracking-[0.05em] text-foreground">
              Rumiva Studio
            </span>
          </Link>

          <form action={logout}>
            <Button type="submit" variant="ghost" size="sm">
              Log out
            </Button>
          </form>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
        {children}
      </main>
    </div>
  );
}
