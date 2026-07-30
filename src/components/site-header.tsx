"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { ArrowRight, Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

/**
 * Primary navigation, per the Information Architecture in the PRD (§8.1):
 *   Home | Explore (the project catalogue) | Designers | Services | About | Contact
 * Secondary destinations (Process, Insights…) are folded into dropdowns to keep
 * the first-level menu compact. "Home" is the logo; the "Book Consultation" CTA
 * maps to Contact / lead generation. Explore Spaces is parked until those routes
 * exist — the footer still links to them.
 *
 * Brand: RUMIVA — Interior Design + Immersive 3D.
 * "We bring spaces to life before they are built."
 *
 * The bar is a physical object rather than a strip of chrome: it sits on a
 * perspective stage, contracts and settles closer to the page as you scroll
 * (Aceternity's resizable navbar), carries a lit top edge, and moves its hover
 * state as one sliding panel behind the links instead of tinting each one. The
 * dropdowns hinge open on the X axis — see `nav-unfold` in globals.css.
 */
type NavChild = { label: string; href: string; description: string };
type NavLink = { label: string; href: string; children?: NavChild[] };

const NAV_LINKS: NavLink[] = [
  { label: "Explore", href: "/projects" },
  { label: "Designers", href: "/designers" },
  {
    label: "Services",
    href: "/services",
    children: [
      {
        label: "Residential Interiors",
        href: "/services/residential",
        description: "Apartments, villas, and full-home design.",
      },
      {
        label: "Commercial Spaces",
        href: "/services/commercial",
        description: "Offices, retail, cafes, and restaurants.",
      },
      {
        label: "3D Visualization",
        href: "/services/visualization",
        description: "Photoreal renders and immersive previews.",
      },
      {
        label: "Design Consultation",
        href: "/services/consultation",
        description: "Planning, guidance, and material direction.",
      },
    ],
  },
  {
    label: "About",
    href: "/about",
    children: [
      {
        label: "Our Story",
        href: "/about#story",
        description: "How the studio started, and the two people behind it.",
      },
      {
        label: "Design Process",
        href: "/about#process",
        description: "How a space goes from brief to finished build.",
      },
      {
        label: "Journal & Insights",
        href: "/about#journal",
        description: "Guides, materials, and planning advice.",
      },
    ],
  },
];

export function SiteHeader() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = React.useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 60);
  });

  return (
    <header
      className="fixed inset-x-0 top-0 z-30 px-4 pt-4 sm:px-6 sm:pt-5"
      style={{ perspective: "1400px" }}
    >
      <motion.div
        // Contracts and drops closer to the page once you leave the hero: the
        // bar reads as settling onto the content rather than floating over it.
        animate={{
          maxWidth: scrolled ? "56rem" : "64rem",
          y: scrolled ? -4 : 0,
          scale: scrolled ? 0.98 : 1,
        }}
        transition={{ type: "spring", stiffness: 220, damping: 30 }}
        className={cn(
          "relative mx-auto flex w-full items-center justify-between gap-10 rounded-full border px-6 py-2.5 backdrop-blur-md transition-colors duration-500 sm:px-8 lg:gap-16",
          scrolled
            ? "border-border/70 bg-beige/90 shadow-xl shadow-charcoal/10"
            : "border-border/50 bg-beige/70 shadow-lg shadow-charcoal/5",
        )}
      >
        {/* Lit top edge — the highlight a real raised surface catches */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-ivory to-transparent"
        />

        {/* Home — logo mark + wordmark */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5"
          aria-label="Rumiva — home"
        >
          <Image
            src="/logo/studio_s_mark_transparent_walnut.png"
            alt="Rumiva"
            width={44}
            height={48}
            priority
            className="h-7 w-auto transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-[-6deg]"
          />
          <span className="hidden flex-col leading-none sm:flex">
            <span className="text-sm font-medium tracking-[0.05em] text-foreground">
              Rumiva
            </span>
            <span className="mt-0.5 text-[0.65rem] tracking-[0.02em] text-muted-foreground">
              Interior Design Studio
            </span>
          </span>
        </Link>

        <DesktopNav />

        <div className="flex items-center gap-2">
          {/* Desktop CTA — the PRD's lead-generation action, previously only
              reachable from the mobile sheet. */}
          <Link
            href="/contact"
            className="group relative hidden overflow-hidden rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg lg:inline-flex lg:items-center lg:gap-1.5"
          >
            <span className="absolute inset-0 translate-y-full bg-accent transition-transform duration-400 ease-out group-hover:translate-y-0" />
            <span className="relative z-10 transition-colors duration-300 group-hover:text-accent-foreground">
              Connect
            </span>
            <ArrowRight className="relative z-10 size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>

          <MobileNav />
        </div>
      </motion.div>
    </header>
  );
}

/**
 * Desktop links. The hover highlight is a single element that animates between
 * items via `layoutId`, so it slides rather than cross-fades.
 */
function DesktopNav() {
  const [hovered, setHovered] = React.useState<string | null>(null);

  return (
    <NavigationMenu viewport={false} className="hidden lg:flex">
      <NavigationMenuList
        className="gap-1.5"
        onMouseLeave={() => setHovered(null)}
      >
        {NAV_LINKS.map((link) =>
          link.children ? (
            <NavigationMenuItem
              key={link.label}
              onMouseEnter={() => setHovered(link.label)}
            >
              <NavigationMenuTrigger
                className={cn(
                  navigationMenuTriggerStyle(),
                  "relative bg-transparent px-3 text-sm font-medium text-foreground/80 hover:bg-transparent hover:text-foreground focus:bg-transparent data-open:bg-transparent data-popup-open:bg-transparent",
                )}
              >
                <HoverPanel active={hovered === link.label} />
                <span className="relative z-10">{link.label}</span>
              </NavigationMenuTrigger>

              <NavigationMenuContent className="rounded-2xl origin-top data-open:animate-nav-unfold!">
                <ul className="grid w-88 gap-0.5 p-2">
                  {link.children.map((child) => (
                    <li key={child.label}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={child.href}
                          className="group/item flex flex-col items-start gap-1 rounded-xl px-3 py-2.5 transition-all duration-300 hover:translate-x-0.5 hover:bg-muted focus:bg-muted"
                        >
                          <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                            {child.label}
                            <ArrowRight className="size-3 -translate-x-1 opacity-0 transition-all duration-300 group-hover/item:translate-x-0 group-hover/item:opacity-100" />
                          </span>
                          <span className="text-xs leading-snug text-muted-foreground">
                            {child.description}
                          </span>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem
              key={link.label}
              onMouseEnter={() => setHovered(link.label)}
            >
              <NavigationMenuLink asChild>
                <Link
                  href={link.href}
                  className="relative inline-flex h-9 w-max items-center rounded-lg px-3 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                >
                  <HoverPanel active={hovered === link.label} />
                  <span className="relative z-10">{link.label}</span>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ),
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function HoverPanel({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active ? (
        <motion.span
          layoutId="nav-hover-panel"
          aria-hidden
          className="absolute inset-0 rounded-lg bg-foreground/[0.07]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        />
      ) : null}
    </AnimatePresence>
  );
}

function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 gap-0">
        <SheetHeader>
          <SheetTitle className="tracking-[0.3em]">RUMIVA</SheetTitle>
        </SheetHeader>

        {/* Each row hinges in from the right edge, staggered — the sheet reads as
            a stack of cards being dealt rather than a list appearing. */}
        <nav
          className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 pb-4"
          style={{ perspective: "900px" }}
        >
          <MobileRow index={0}>
            <SheetClose asChild>
              <Link
                href="/"
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                Home
              </Link>
            </SheetClose>
          </MobileRow>

          {NAV_LINKS.map((link, i) => (
            <MobileRow key={link.label} index={i + 1}>
              <div className="py-1">
                <SheetClose asChild>
                  <Link
                    href={link.href}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                  >
                    {link.label}
                  </Link>
                </SheetClose>
                {link.children ? (
                  <div className="mt-0.5 flex flex-col border-l border-border/60 pl-3">
                    {link.children.map((child) => (
                      <SheetClose asChild key={child.label}>
                        <Link
                          href={child.href}
                          className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          {child.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                ) : null}
              </div>
            </MobileRow>
          ))}
        </nav>

        <div className="flex flex-col gap-2 border-t border-border/60 p-4">
          <SheetClose asChild>
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              Book Consultation
              <ArrowRight className="size-4" />
            </Link>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MobileRow({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24, rotateY: -18 }}
      animate={{ opacity: 1, x: 0, rotateY: 0 }}
      transition={{ delay: 0.04 * index, duration: 0.35, ease: "easeOut" }}
      style={{ transformOrigin: "right center" }}
    >
      {children}
    </motion.div>
  );
}
