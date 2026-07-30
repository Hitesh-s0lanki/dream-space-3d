"use client";

import * as React from "react";
import { motion } from "motion/react";

import { createRandom } from "@/lib/random";
import { cn } from "@/lib/utils";

/**
 * Background Beams (adapted from
 * ui.aceternity.com/components/background-beams).
 *
 * Light travels along a fan of curved paths — read here as service ducting or
 * sightlines threading a plan drawing. The gradient on each stroke is animated
 * rather than the path itself, so the whole field costs one SVG and no layout.
 */
const PATHS = [
  "M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875",
  "M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867",
  "M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859",
  "M-359 -213C-359 -213 -291 192 173 319C637 446 705 851 705 851",
  "M-352 -221C-352 -221 -284 184 180 311C644 438 712 843 712 843",
  "M-345 -229C-345 -229 -277 176 187 303C651 430 719 835 719 835",
  "M-338 -237C-338 -237 -270 168 194 295C658 422 726 827 726 827",
  "M-331 -245C-331 -245 -263 160 201 287C665 414 733 819 733 819",
  "M-324 -253C-324 -253 -256 152 208 279C672 406 740 811 740 811",
  "M-317 -261C-317 -261 -249 144 215 271C679 398 747 803 747 803",
  "M-310 -269C-310 -269 -242 136 222 263C686 390 754 795 754 795",
];

/**
 * Per-beam timing, drawn once from a fixed seed. Computed at module scope so the
 * scatter is identical on the server and the client — animating a *different*
 * random schedule after hydration is the classic way this kind of background
 * flickers on first paint.
 */
const BEAM_TIMINGS = (() => {
  const random = createRandom(0x5eed);
  return PATHS.map(() => ({
    y2: `${93 + random() * 8}%`,
    duration: 6 + random() * 6,
    repeatDelay: 1 + random() * 3,
    delay: random() * 6,
  }));
})();

export function BackgroundBeams({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden",
        className,
      )}
      aria-hidden
    >
      <svg
        className="pointer-events-none absolute z-0 h-full w-full"
        width="100%"
        height="100%"
        viewBox="0 0 696 316"
        fill="none"
      >
        {PATHS.map((d, i) => (
          <path
            key={`static-${i}`}
            d={d}
            stroke="currentColor"
            className="text-stone/25"
            strokeOpacity="0.6"
            strokeWidth="0.5"
          />
        ))}

        {PATHS.map((d, i) => (
          <motion.path
            key={`beam-${i}`}
            d={d}
            stroke={`url(#beam-grad-${i})`}
            strokeWidth="1.6"
            strokeLinecap="round"
            className="motion-reduce:hidden"
          />
        ))}

        <defs>
          {PATHS.map((_, i) => (
            <motion.linearGradient
              key={`grad-${i}`}
              id={`beam-grad-${i}`}
              gradientUnits="userSpaceOnUse"
              initial={{ x1: "0%", x2: "0%", y1: "0%", y2: "0%" }}
              animate={{
                x1: ["0%", "100%"],
                x2: ["0%", "95%"],
                y1: ["0%", "100%"],
                y2: ["0%", BEAM_TIMINGS[i].y2],
              }}
              transition={{
                duration: BEAM_TIMINGS[i].duration,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: BEAM_TIMINGS[i].repeatDelay,
                delay: BEAM_TIMINGS[i].delay,
              }}
            >
              <stop stopColor="var(--terracotta)" stopOpacity="0" />
              <stop stopColor="var(--terracotta)" />
              <stop offset="32.5%" stopColor="var(--olive)" />
              <stop offset="100%" stopColor="var(--sage)" stopOpacity="0" />
            </motion.linearGradient>
          ))}
        </defs>
      </svg>
    </div>
  );
}
