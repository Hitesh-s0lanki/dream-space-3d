"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Fades + lifts its children into view the first time they cross the viewport.
 * Respects prefers-reduced-motion (renders visible immediately). Kept dependency
 * free — a single IntersectionObserver, unobserved after the first reveal.
 */
export function Reveal({
  as,
  className,
  delay = 0,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  as?: React.ElementType;
  delay?: number;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag: any = as ?? "div";
  const ref = React.useRef<HTMLElement | null>(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
      className={cn(
        "transition-all duration-700 ease-out will-change-[opacity,transform] motion-reduce:transition-none",
        shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
