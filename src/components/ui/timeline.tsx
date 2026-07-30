"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Timeline (adapted from ui.aceternity.com/components/timeline).
 *
 * Entries stack against a rail whose light travels down as you scroll, so the
 * process reads as something being built up in front of you rather than a static
 * list. Each node sits on its own raised puck.
 */
export type TimelineEntry = {
  /** Short label pinned in the gutter — a step number, phase, or year. */
  title: string;
  content: React.ReactNode;
};

export function Timeline({
  data,
  className,
}: {
  data: TimelineEntry[];
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const measure = () => setHeight(node.getBoundingClientRect().height);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className={cn("w-full", className)} ref={containerRef}>
      <div ref={ref} className="relative mx-auto max-w-6xl pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:gap-10 md:pt-32"
          >
            {/* Sticky node + gutter label */}
            <div className="sticky top-32 z-20 flex max-w-xs flex-col items-center self-start md:w-full md:flex-row lg:max-w-sm">
              <div className="absolute left-3 flex size-10 items-center justify-center rounded-full bg-background shadow-[0_2px_10px_rgb(0_0_0/0.08)] md:left-3">
                <div className="size-4 rounded-full border border-border bg-secondary p-2" />
              </div>
              <h3 className="hidden text-xl font-medium text-muted-foreground md:block md:pl-20 md:text-4xl">
                {item.title}
              </h3>
            </div>

            <div className="relative w-full pr-4 pl-20 md:pl-4">
              <h3 className="mb-4 block text-left text-2xl font-medium text-muted-foreground md:hidden">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}

        {/* The rail, and the travelling light inside it */}
        <div
          style={{ height: height + "px" }}
          className="absolute top-0 left-8 w-[2px] overflow-hidden bg-linear-to-b from-transparent from-0% via-border to-transparent to-99% [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] md:left-8"
        >
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-linear-to-t from-terracotta from-0% via-olive via-10% to-transparent"
          />
        </div>
      </div>
    </div>
  );
}
