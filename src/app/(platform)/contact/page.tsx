import type { Metadata } from "next";
import { Mail, MapPin, Phone, Clock, ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { ContactForm } from "./_components/contact-form";

export const metadata: Metadata = {
  title: "Contact — Rumiva Interior Design Studio",
  description:
    "Get in touch with Rumiva for residential interiors, commercial spaces, 3D visualization, and design consultations in Bengaluru.",
};

const CONTACT_INFO = [
  {
    icon: Phone,
    label: "Phone",
    value: "+91 1800 000 000",
    href: "tel:+911800000000",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@rumiva.in",
    href: "mailto:hello@rumiva.in",
  },
  {
    icon: MapPin,
    label: "Studio",
    value: "Design Studio, Indiranagar\nBengaluru, 560038",
    href: "#",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon – Sat: 10 AM – 7 PM\nSunday: By appointment",
    href: undefined,
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-background pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-terracotta/8 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 size-80 rounded-full bg-sage/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 sm:px-10">
          <Reveal className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">
              Let&apos;s talk
            </p>
            <h1 className="max-w-lg text-balance text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Start your space,
              <br />
              right here.
            </h1>
            <p className="max-w-md text-pretty text-lg text-muted-foreground">
              Tell us about your project and we&apos;ll get back to you within
              24 hours. No commitment, just a conversation about what&apos;s
              possible.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Form + Contact Info */}
      <section className="relative bg-background pb-24 sm:pb-32">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <div className="grid gap-16 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
            {/* Left: Form */}
            <Reveal>
              <div className="rounded-3xl border border-border/60 bg-card p-6 sm:p-10">
                <div className="mb-8 space-y-1.5">
                  <h2 className="text-2xl font-medium tracking-tight">
                    Send us a message
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Fields marked with <span className="text-accent">*</span>{" "}
                    are required.
                  </p>
                </div>
                <ContactForm />
              </div>
            </Reveal>

            {/* Right: Info */}
            <div className="space-y-10">
              <Reveal delay={100}>
                <div className="space-y-1.5">
                  <h2 className="text-2xl font-medium tracking-tight">
                    Get in touch
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Reach out directly or visit us at the studio.
                  </p>
                </div>
              </Reveal>

              <div className="space-y-6">
                {CONTACT_INFO.map((item, i) => (
                  <Reveal key={item.label} delay={150 + i * 80}>
                    <div className="flex items-start gap-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                        <item.icon className="size-4.5 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          {item.label}
                        </p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-accent"
                          >
                            {item.value.split("\n")[0]}
                            {item.value.includes("\n") && (
                              <>
                                <br />
                                <span className="font-normal text-muted-foreground">
                                  {item.value.split("\n")[1]}
                                </span>
                              </>
                            )}
                            <ArrowUpRight className="size-3.5 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                          </a>
                        ) : (
                          <p className="whitespace-pre-line text-sm font-medium text-foreground">
                            {item.value}
                          </p>
                        )}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              {/* Decorative accent card */}
              <Reveal delay={500}>
                <div className="relative overflow-hidden rounded-3xl bg-walnut p-8 text-ivory">
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-terracotta/25 via-transparent to-black/30" />
                  <div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-terracotta/20 blur-3xl" />

                  <div className="relative space-y-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-ivory/60">
                      Prefer a call?
                    </p>
                    <p className="text-lg font-medium leading-snug">
                      Book a free 30-minute consultation to discuss your vision.
                    </p>
                    <a
                      href="tel:+911800000000"
                      className="group mt-2 inline-flex items-center gap-2 rounded-full bg-ivory px-6 py-3 text-sm font-medium text-charcoal transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      Call Now
                      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
