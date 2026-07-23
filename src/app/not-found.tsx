import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

/**
 * Global 404. In the App Router this catches both unmatched URLs and any
 * `notFound()` thrown by a page (e.g. an unknown designer or project slug). It
 * renders inside the root layout, so it carries its own minimal chrome rather
 * than a route-group header.
 */
export default function NotFound() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background px-6 text-center">
      {/* Oversized ghost numeral behind the content */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center font-heading text-[40vw] leading-none text-foreground/[0.04] sm:text-[28rem]"
      >
        404
      </span>

      <div className="relative flex flex-col items-center gap-6">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label="Ruumiva — home"
        >
          <Image
            src="/logo/studio_s_mark_transparent_walnut.png"
            alt="Ruumiva"
            width={44}
            height={48}
            priority
            className="h-8 w-auto"
          />
        </Link>

        <p className="text-xs uppercase tracking-[0.3em] text-accent">
          Page not found
        </p>
        <h1 className="max-w-xl text-balance font-heading text-4xl leading-[1.08] tracking-tight sm:text-5xl">
          This room doesn&apos;t exist — yet.
        </h1>
        <p className="max-w-md text-pretty text-lg text-muted-foreground">
          The page you&apos;re looking for may have been moved, renamed, or is
          still on the drawing board.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 pt-2">
          {/* Primary: walnut pill with the terracotta sweep, matching the hero CTA */}
          <Link
            href="/"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span className="absolute inset-0 translate-y-full bg-accent transition-transform duration-400 ease-out group-hover:translate-y-0" />
            <ArrowLeft className="relative z-10 size-4 transition-all duration-300 group-hover:-translate-x-1 group-hover:text-accent-foreground" />
            <span className="relative z-10 transition-colors duration-300 group-hover:text-accent-foreground">
              Back to home
            </span>
          </Link>

          <Link
            href="/designers"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            Browse designers
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
