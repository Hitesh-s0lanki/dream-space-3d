"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
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
 *   Home | Projects | Explore Spaces | Services | About | Contact
 * Secondary destinations (Process, Insights, Designers…) are folded into
 * dropdowns to keep the first-level menu compact. "Home" is the logo; the
 * "Book Consultation" CTA maps to Contact / lead generation.
 *
 * Brand: RUUMIVA — Interior Design + Immersive 3D.
 * "We bring spaces to life before they are built."
 */
type NavChild = { label: string; href: string; description: string };
type NavLink = { label: string; href: string; children?: NavChild[] };

const NAV_LINKS: NavLink[] = [
  { label: "Projects", href: "/projects" },
  {
    label: "Explore Spaces",
    href: "/explore",
    children: [
      {
        label: "Sample Homes",
        href: "/explore/homes",
        description: "Walk through fully designed sample homes.",
      },
      {
        label: "Room Designs",
        href: "/explore/rooms",
        description: "Browse individual rooms by style and space type.",
      },
      {
        label: "Interactive 3D Tours",
        href: "/explore/tours",
        description: "Immersive, real-time walkthroughs of every space.",
      },
      {
        label: "Floor Plans & Layouts",
        href: "/explore/layouts",
        description: "See circulation, storage, and how furniture fits.",
      },
    ],
  },
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
        href: "/about",
        description: "The studio's philosophy, mission, and founder.",
      },
      {
        label: "Design Process",
        href: "/process",
        description: "How a space goes from brief to finished build.",
      },
      {
        label: "Meet the Designers",
        href: "/designers",
        description: "The people who bring each project to life.",
      },
      {
        label: "Journal & Insights",
        href: "/journal",
        description: "Guides, materials, and planning advice.",
      },
    ],
  },
];

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 px-4 pt-4 sm:px-6 sm:pt-5">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-6 rounded-full border border-border/60 bg-beige/80 px-6 py-2.5 shadow-lg shadow-charcoal/5 backdrop-blur-md sm:px-8 sm:py-2.5">
        {/* Home — logo mark + wordmark */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5"
          aria-label="Ruumiva — home"
        >
          <Image
            src="/logo/studio_s_mark_transparent_walnut.png"
            alt="Ruumiva"
            width={44}
            height={48}
            priority
            className="h-7 w-auto transition-transform duration-300 group-hover:-translate-y-0.5"
          />
          <span className="hidden flex-col leading-none sm:flex">
            <span className="text-sm font-medium tracking-[0.32em] text-foreground">
              Ruumiva
            </span>
            <span className="mt-0.5 text-[0.55rem] uppercase tracking-[0.26em] text-muted-foreground">
              Interior Design
            </span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <NavigationMenu viewport={false} className="hidden lg:flex">
          <NavigationMenuList className="gap-1.5">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <NavigationMenuItem key={link.label}>
                  <NavigationMenuTrigger
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent px-3 text-sm font-medium text-foreground/80 hover:bg-foreground/5 hover:text-foreground focus:bg-foreground/5 data-open:bg-foreground/5 data-popup-open:bg-foreground/5",
                    )}
                  >
                    {link.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="rounded-2xl">
                    <ul className="grid w-88 gap-0.5 p-2">
                      {link.children.map((child) => (
                        <li key={child.label}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={child.href}
                              className="flex flex-col items-start gap-1 rounded-xl px-3 py-2.5 transition-colors hover:bg-muted focus:bg-muted"
                            >
                              <span className="text-sm font-medium text-foreground">
                                {child.label}
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
                <NavigationMenuItem key={link.label}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={link.href}
                      className="inline-flex h-9 w-max items-center rounded-lg px-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-foreground/5 hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ),
            )}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile menu */}
        <MobileNav />
      </div>
    </header>
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
          <SheetTitle className="tracking-[0.3em]">RUUMIVA</SheetTitle>
        </SheetHeader>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 pb-4">
          <SheetClose asChild>
            <Link
              href="/"
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
            >
              Home
            </Link>
          </SheetClose>

          {NAV_LINKS.map((link) => (
            <div key={link.label} className="py-1">
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
          ))}
        </nav>

        <div className="border-t border-border/60 p-4">
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
