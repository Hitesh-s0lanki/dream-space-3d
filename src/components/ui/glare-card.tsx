"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Glare Card (adapted from ui.aceternity.com/components/glare-card).
 *
 * The whole surface rotates in 3D while two stacked gradient layers — a hard
 * specular streak and a soft iridescent wash — sweep across it. Tuned warm here
 * (ivory / terracotta rather than the original neon) so it sits inside the
 * natural-materials palette.
 */
export function GlareCard({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  const isPointerInside = React.useRef(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const state = React.useRef({
    glare: { x: 50, y: 50 },
    background: { x: 50, y: 50 },
    rotate: { x: 0, y: 0 },
  });

  const setVars = (vars: Record<string, string>) => {
    const node = ref.current;
    if (!node) return;
    for (const [k, v] of Object.entries(vars)) node.style.setProperty(k, v);
  };

  const updateStyles = () => {
    const { rotate, glare, background } = state.current;
    setVars({
      "--m-x": `${glare.x}%`,
      "--m-y": `${glare.y}%`,
      "--r-x": `${rotate.x}deg`,
      "--r-y": `${rotate.y}deg`,
      "--bg-x": `${background.x}%`,
      "--bg-y": `${background.y}%`,
    });
  };

  return (
    <div
      style={
        {
          "--m-x": "50%",
          "--m-y": "50%",
          "--r-x": "0deg",
          "--r-y": "0deg",
          "--bg-x": "50%",
          "--bg-y": "50%",
          "--duration": "300ms",
          "--radius": "1.5rem",
          "--easing": "cubic-bezier(0.16, 1, 0.3, 1)",
          "--opacity": "0",
        } as React.CSSProperties
      }
      className={cn(
        "relative isolate [contain:layout_style] [perspective:900px] transition-transform duration-[var(--duration)] ease-[var(--easing)] will-change-transform",
        containerClassName,
      )}
      ref={ref}
      onPointerMove={(event) => {
        const node = ref.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const px = event.clientX - rect.left;
        const py = event.clientY - rect.top;
        const percentX = Math.min(Math.max((px / rect.width) * 100, 0), 100);
        const percentY = Math.min(Math.max((py / rect.height) * 100, 0), 100);
        const centerX = percentX - 50;
        const centerY = percentY - 50;

        state.current = {
          background: { x: 50 + percentX / 8 - 6.25, y: 50 + percentY / 6 - 8.33 },
          glare: { x: percentX, y: percentY },
          rotate: { x: -(centerX / 4), y: centerY / 5 },
        };
        updateStyles();
      }}
      onPointerEnter={() => {
        isPointerInside.current = true;
        setTimeout(() => {
          if (isPointerInside.current) {
            setVars({ "--duration": "0s", "--opacity": "1" });
          }
        }, 300);
      }}
      onPointerLeave={() => {
        isPointerInside.current = false;
        setVars({ "--duration": "300ms", "--opacity": "0" });
        state.current = {
          glare: { x: 50, y: 50 },
          background: { x: 50, y: 50 },
          rotate: { x: 0, y: 0 },
        };
        updateStyles();
      }}
    >
      <div className="h-full w-full rounded-[var(--radius)] [transform:rotateY(var(--r-x))_rotateX(var(--r-y))] transition-transform duration-[var(--duration)] ease-[var(--easing)] will-change-transform motion-reduce:[transform:none]">
        <div
          className={cn(
            "grid h-full w-full overflow-hidden rounded-[var(--radius)] border border-border/50 bg-card shadow-lg shadow-charcoal/10",
            "[&>*]:col-start-1 [&>*]:row-start-1",
            className,
          )}
        >
          <div className="h-full w-full">{children}</div>

          {/* Soft iridescent wash — warm ivory into terracotta */}
          <div
            className="pointer-events-none h-full w-full opacity-[var(--opacity)] mix-blend-soft-light transition-opacity duration-[var(--duration)]"
            style={{
              maskImage:
                "radial-gradient(circle at var(--m-x) var(--m-y), black 20%, transparent 80%)",
              backgroundImage:
                "radial-gradient(farthest-corner circle at var(--m-x) var(--m-y), oklch(0.99 0.02 85 / 0.9) 10%, oklch(0.72 0.11 42 / 0.35) 45%, transparent 75%)",
              backgroundPosition: "var(--bg-x) var(--bg-y)",
              backgroundSize: "220% 220%",
            }}
          />

          {/* Hard specular streak */}
          <div
            className="pointer-events-none h-full w-full opacity-[var(--opacity)] mix-blend-overlay transition-opacity duration-[var(--duration)]"
            style={{
              backgroundImage:
                "radial-gradient(farthest-corner circle at var(--m-x) var(--m-y), rgba(255,255,255,0.85) 8%, rgba(255,255,255,0.15) 26%, rgba(255,255,255,0) 62%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
