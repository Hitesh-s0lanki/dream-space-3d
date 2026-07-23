import type { ReactNode } from "react";

// Layout shared by every route in the (marketing) group. The route group keeps
// these pages organized without adding a segment to the URL, so `page.tsx` here
// still renders at `/`. Marketing-wide chrome or metadata belongs here; the
// <html>/<body> shell and global providers live in the root app/layout.tsx.
export default function MarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
