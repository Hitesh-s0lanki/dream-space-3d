import type { ReactNode } from "react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

// Chrome shared by every public platform route (the designer directory,
// portfolios, and project case studies). The fixed pill header floats over each
// page's own hero, so pages own their top spacing. The <html>/<body> shell and
// providers live in the root app/layout.tsx.
export default function PlatformLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">{children}</main>
      <SiteFooter />
    </>
  );
}
