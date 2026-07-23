import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";

/* This build of lucide-react ships no brand marks, so social glyphs are drawn
   inline. Each fills currentColor and inherits the link's sizing. */
function InstagramIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 3.08A6.76 6.76 0 1 0 18.76 12 6.76 6.76 0 0 0 12 5.24Zm0 11.15A4.39 4.39 0 1 1 16.39 12 4.39 4.39 0 0 1 12 16.39Zm6.85-11.42a1.58 1.58 0 1 0 1.58 1.58 1.58 1.58 0 0 0-1.58-1.58Z" />
    </svg>
  );
}

function LinkedinIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.78C.8 0 0 .78 0 1.75v20.5C0 23.22.8 24 1.78 24h20.44c.98 0 1.78-.78 1.78-1.75V1.75C24 .78 23.2 0 22.22 0Z" />
    </svg>
  );
}

function YoutubeIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.08 0 12 0 12s0 3.92.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.81ZM9.6 15.6V8.4l6.26 3.6L9.6 15.6Z" />
    </svg>
  );
}

/**
 * Site footer — a dark charcoal ground that closes the page, with link
 * columns, contact details, a newsletter capture, and social row, following
 * the structure of Bonito's footer but pared to the studio's needs.
 */
const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] =
  [
    {
      heading: "Studio",
      links: [
        { label: "Our Story", href: "/about" },
        { label: "Design Process", href: "/process" },
        { label: "Meet the Designers", href: "/designers" },
        { label: "Careers", href: "/careers" },
      ],
    },
    {
      heading: "Explore",
      links: [
        { label: "Sample Homes", href: "/explore/homes" },
        { label: "Room Designs", href: "/explore/rooms" },
        { label: "3D Tours", href: "/explore/tours" },
        { label: "Floor Plans", href: "/explore/layouts" },
      ],
    },
    {
      heading: "Services",
      links: [
        { label: "Residential", href: "/services/residential" },
        { label: "Commercial", href: "/services/commercial" },
        { label: "3D Visualization", href: "/services/visualization" },
        { label: "Consultation", href: "/services/consultation" },
      ],
    },
  ];

const SOCIALS: {
  label: string;
  href: string;
  icon: (props: React.ComponentProps<"svg">) => React.ReactElement;
}[] = [
  { label: "Instagram", href: "#", icon: InstagramIcon },
  { label: "LinkedIn", href: "#", icon: LinkedinIcon },
  { label: "YouTube", href: "#", icon: YoutubeIcon },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-charcoal text-ivory">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        {/* Top: brand + newsletter */}
        <div className="grid gap-12 border-b border-white/10 py-16 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div className="space-y-6">
            <Link
              href="/"
              className="flex items-center gap-2.5"
              aria-label="Ruumiva — home"
            >
              <Image
                src="/logo/studio_s_mark_transparent_dark_background_version.png"
                alt="Ruumiva"
                width={44}
                height={48}
                className="h-8 w-auto"
              />
              <span className="flex flex-col leading-none">
                <span className="text-base font-medium tracking-[0.32em]">
                  RUMIVA
                </span>
                <span className="mt-1 text-[0.55rem] uppercase tracking-[0.26em] text-ivory/50">
                  Interior Design + 3D
                </span>
              </span>
            </Link>
            <p className="max-w-sm text-pretty text-sm leading-relaxed text-ivory/60">
              We bring spaces to life before they are built — a premium studio
              practice pairing interior design with immersive 3D visualization.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Design notes, in your inbox</h3>
            <p className="text-sm text-ivory/60">
              Occasional guides on materials, light, and living well. No noise.
            </p>
            <form className="flex max-w-md items-center gap-2 rounded-full border border-white/15 bg-white/5 p-1.5 pl-5">
              <Mail className="size-4 shrink-0 text-ivory/50" />
              <input
                type="email"
                required
                placeholder="you@email.com"
                aria-label="Email address"
                className="min-w-0 flex-1 bg-transparent text-sm text-ivory placeholder:text-ivory/40 focus:outline-none"
              />
              <button
                type="submit"
                className="group inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ivory px-4 py-2 text-sm font-medium text-charcoal transition-transform duration-300 hover:-translate-y-px"
              >
                Subscribe
                <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Middle: link columns + contact */}
        <div className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.heading} className="space-y-4">
              <h3 className="text-xs uppercase tracking-[0.2em] text-ivory/40">
                {col.heading}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-ivory/70 transition-colors hover:text-ivory"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] text-ivory/40">
              Get in touch
            </h3>
            <ul className="space-y-3 text-sm text-ivory/70">
              <li>
                <a
                  href="tel:+911800000000"
                  className="flex items-center gap-2.5 transition-colors hover:text-ivory"
                >
                  <Phone className="size-4 shrink-0 text-ivory/40" />
                  +91 1800 000 000
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@ruumiva.com"
                  className="flex items-center gap-2.5 transition-colors hover:text-ivory"
                >
                  <Mail className="size-4 shrink-0 text-ivory/40" />
                  hello@ruumiva.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-ivory/40" />
                <span>
                  Design Studio, Indiranagar
                  <br />
                  Bengaluru, 560038
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-6 border-t border-white/10 py-8 sm:flex-row">
          <p className="text-xs text-ivory/50">
            © {2026} Ruumiva Design Studio. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="inline-flex size-9 items-center justify-center rounded-full border border-white/15 text-ivory/70 transition-colors hover:border-white/40 hover:text-ivory"
              >
                <s.icon className="size-4" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-5 text-xs text-ivory/50">
            <Link href="/privacy" className="transition-colors hover:text-ivory">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-ivory">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
