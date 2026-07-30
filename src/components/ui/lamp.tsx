"use client";

import * as React from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Lamp Effect (adapted from ui.aceternity.com/components/lamp-effect).
 *
 * Two conic sheets meet at a hot line and open downward into the page, lighting
 * whatever sits below. Reads as a pendant fixture washing a wall — the most
 * literal piece of "interior lighting as UI" on the site, so it heads the darkest
 * band on /services.
 *
 * Restructured from the original: upstream stacks the fixture in flow and then
 * yanks the content back up with a large negative translate, which only lands
 * correctly at full viewport height. Here the fixture is absolutely positioned
 * and the content flows normally, so the component drops into a section of any
 * height without the heading sliding out of the band.
 */
export function LampContainer({
  children,
  className,
  /** Height of the fixture and its throw, from the top edge. */
  fixtureHeight = "22rem",
}: {
  children: React.ReactNode;
  className?: string;
  fixtureHeight?: string;
}) {
  return (
    <div
      className={cn(
        "relative isolate z-0 flex w-full flex-col items-center overflow-hidden bg-charcoal",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 flex justify-center"
        style={{ height: fixtureHeight }}
      >
        {/* Left sheet */}
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{
            backgroundImage:
              "conic-gradient(var(--conic-position), var(--tw-gradient-stops))",
          }}
          className="absolute right-1/2 top-0 h-56 w-[30rem] overflow-visible from-terracotta via-transparent to-transparent opacity-50 [--conic-position:from_70deg_at_center_top]"
        >
          <div className="absolute bottom-0 left-0 z-20 h-40 w-full bg-charcoal [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute bottom-0 left-0 z-20 h-full w-40 bg-charcoal [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>

        {/* Right sheet */}
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{
            backgroundImage:
              "conic-gradient(var(--conic-position), var(--tw-gradient-stops))",
          }}
          className="absolute left-1/2 top-0 h-56 w-[30rem] from-transparent via-transparent to-terracotta opacity-50 [--conic-position:from_290deg_at_center_top]"
        >
          <div className="absolute bottom-0 right-0 z-20 h-full w-40 bg-charcoal [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute bottom-0 right-0 z-20 h-40 w-full bg-charcoal [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>

        {/* Haze under the fixture, then the bloom, then the hot filament line */}
        <div className="absolute top-40 h-48 w-full scale-x-150 bg-charcoal blur-2xl" />
        <div className="absolute top-4 h-36 w-[28rem] rounded-full bg-terracotta opacity-40 blur-3xl" />
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "16rem" }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute top-6 h-28 w-64 rounded-full bg-terracotta/80 blur-2xl"
        />
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute top-0 h-0.5 w-[30rem] bg-terracotta"
        />
      </div>

      <div className="relative z-50 flex flex-col items-center px-5">
        {children}
      </div>
    </div>
  );
}
