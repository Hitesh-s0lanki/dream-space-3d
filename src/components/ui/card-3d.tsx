"use client";

import * as React from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * 3D Card Effect (adapted from ui.aceternity.com/components/3d-card-effect).
 *
 * `CardContainer` establishes the perspective and tilts `CardBody` toward the
 * pointer. Children wrapped in `CardItem` are lifted out of the card plane on
 * the Z axis, so a card reads as a stack of floating layers rather than a flat
 * rectangle. Restyled to the studio's walnut/ivory tokens and kept dependency
 * free — a couple of transform writes on pointermove, no animation library.
 *
 * Reduced motion is respected: the tilt is skipped and the Z lift is flattened.
 */

const MouseEnterContext = React.createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined);

export function CardContainer({
  children,
  className,
  containerClassName,
  /** Degrees of tilt at the far edge. Lower reads calmer / more editorial. */
  intensity = 12,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  intensity?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [isMouseEntered, setIsMouseEntered] = React.useState(false);
  const reduced = usePrefersReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || reduced) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = ((e.clientX - left - width / 2) / (width / 2)) * intensity;
    const y = ((e.clientY - top - height / 2) / (height / 2)) * intensity;
    ref.current.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
  };

  const handleMouseEnter = () => setIsMouseEntered(true);

  const handleMouseLeave = () => {
    setIsMouseEntered(false);
    if (ref.current) ref.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
  };

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        className={cn("flex items-center justify-center", containerClassName)}
        style={{ perspective: "1200px" }}
      >
        <div
          ref={ref}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "relative flex items-center justify-center transition-transform duration-200 ease-out",
            className,
          )}
          style={{ transformStyle: "preserve-3d" }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
}

export function CardBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "h-full w-full transform-3d *:transform-3d",
        className,
      )}
    >
      {children}
    </div>
  );
}

type CardItemProps<T extends React.ElementType> = {
  as?: T;
  children: React.ReactNode;
  className?: string;
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function CardItem<T extends React.ElementType = "div">({
  as,
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}: CardItemProps<T>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag: any = as ?? "div";
  const ref = React.useRef<HTMLElement>(null);
  const [isMouseEntered] = useMouseEnter();
  const reduced = usePrefersReducedMotion();

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduced) {
      node.style.transform = "none";
      return;
    }
    node.style.transform = isMouseEntered
      ? `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`
      : `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
  }, [
    isMouseEntered,
    reduced,
    translateX,
    translateY,
    translateZ,
    rotateX,
    rotateY,
    rotateZ,
  ]);

  return (
    <Tag
      ref={ref}
      className={cn(
        "w-fit transition-transform duration-200 ease-out",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function useMouseEnter() {
  const context = React.useContext(MouseEnterContext);
  if (context === undefined) {
    throw new Error("useMouseEnter must be used within a CardContainer");
  }
  return context;
}
