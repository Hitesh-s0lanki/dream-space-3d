"use client";

import * as React from "react";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";
import { useOutsideClick } from "@/hooks/use-outside-click";

/**
 * Apple-style cards carousel (adapted from ui.aceternity.com). A horizontally
 * scrolling rail of tall image cards; tapping a card expands it into a full
 * overlay with its detail content. Restyled to the studio's walnut/ivory tokens
 * and wired to lucide + motion (the packages already in this project).
 */

export type CarouselCard = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
};

type CarouselContextValue = {
  onCardClose: (index: number) => void;
  currentIndex: number;
};

export const CarouselContext = createContext<CarouselContextValue>({
  onCardClose: () => {},
  currentIndex: 0,
});

export function Carousel({
  items,
  initialScroll = 0,
}: {
  items: React.ReactElement[];
  initialScroll?: number;
}) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  const isMobile = () =>
    typeof window !== "undefined" && window.innerWidth < 768;

  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = isMobile() ? 230 : 384; // matches md:w-96
      const gap = isMobile() ? 16 : 16;
      const scrollPosition = (cardWidth + gap) * (index + 1);
      carouselRef.current.scrollTo({ left: scrollPosition, behavior: "smooth" });
      setCurrentIndex(index);
    }
  };

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex }}
    >
      <div className="relative w-full">
        <div
          className="flex w-full scroll-smooth overflow-x-scroll overscroll-x-auto scrollbar-none py-6 md:py-8"
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          {/* Right-edge fade so cards dissolve into the section background */}
          <div className="pointer-events-none absolute right-0 z-20 h-full w-16 bg-linear-to-l from-background to-transparent" />

          {/* Left inset matches the max-w-6xl (72rem) page container, so the
              first card lines up with the section heading above it. */}
          <div className="flex flex-row justify-start gap-4 pl-[max(1.5rem,calc((100%-72rem)/2+1.5rem))] sm:pl-[max(2.5rem,calc((100%-72rem)/2+2.5rem))]">
            {items.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{
                  duration: 0.5,
                  delay: 0.15 * index,
                  ease: "easeOut",
                }}
                key={"card" + index}
                className="rounded-3xl last:pr-6 sm:last:pr-10"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mr-6 mt-2 flex justify-end gap-2 sm:mr-10">
          <button
            type="button"
            aria-label="Scroll left"
            className="relative z-40 flex size-10 items-center justify-center rounded-full bg-secondary text-foreground/70 transition-colors hover:bg-walnut hover:text-ivory disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-secondary disabled:hover:text-foreground/70"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
          >
            <ArrowLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            className="relative z-40 flex size-10 items-center justify-center rounded-full bg-secondary text-foreground/70 transition-colors hover:bg-walnut hover:text-ivory disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-secondary disabled:hover:text-foreground/70"
            onClick={scrollRight}
            disabled={!canScrollRight}
          >
            <ArrowRight className="size-5" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
}

export function Card({
  card,
  index,
  layout = false,
}: {
  card: CarouselCard;
  index: number;
  layout?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose } = useContext(CarouselContext);

  const handleClose = React.useCallback(() => {
    setOpen(false);
    onCardClose(index);
  }, [index, onCardClose]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") handleClose();
    }

    document.body.style.overflow = open ? "hidden" : "auto";
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose]);

  useOutsideClick(containerRef, () => {
    if (open) handleClose();
  });

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 h-screen overflow-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 h-full w-full bg-charcoal/80 backdrop-blur-lg"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              ref={containerRef}
              layoutId={layout ? `card-${card.title}` : undefined}
              className="relative z-60 mx-auto my-10 h-fit max-w-5xl rounded-3xl border border-border/70 bg-card p-6 md:p-10"
            >
              <button
                type="button"
                aria-label="Close"
                className="sticky right-0 top-4 ml-auto flex size-8 items-center justify-center rounded-full bg-foreground text-background"
                onClick={handleClose}
              >
                <X className="size-5" />
              </button>
              <motion.p
                layoutId={layout ? `category-${card.title}` : undefined}
                className="text-xs uppercase tracking-[0.3em] text-accent"
              >
                {card.category}
              </motion.p>
              <motion.p
                layoutId={layout ? `title-${card.title}` : undefined}
                className="mt-4 text-3xl font-medium tracking-tight text-foreground md:text-5xl"
              >
                {card.title}
              </motion.p>
              <div className="py-8 md:py-10">{card.content}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={() => setOpen(true)}
        className="relative z-10 flex h-72 w-60 flex-col items-start justify-start overflow-hidden rounded-3xl bg-secondary md:h-112 md:w-80"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-2/3 bg-linear-to-b from-charcoal/60 to-transparent" />
        <div className="relative z-40 p-6">
          <motion.p
            layoutId={layout ? `category-${card.category}` : undefined}
            className="text-left text-[0.7rem] font-medium uppercase tracking-[0.25em] text-ivory/90"
          >
            {card.category}
          </motion.p>
          <motion.p
            layoutId={layout ? `title-${card.title}` : undefined}
            className="mt-2 max-w-xs text-balance text-left text-lg font-medium tracking-tight text-ivory md:text-2xl"
          >
            {card.title}
          </motion.p>
        </div>
        <BlurImage
          src={card.src}
          alt={card.title}
          className="absolute inset-0 z-10 object-cover"
        />
      </motion.button>
    </>
  );
}

export function BlurImage({
  src,
  className,
  alt,
  ...rest
}: React.ComponentProps<"img">) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Cached images can finish loading before React attaches onLoad, which would
  // otherwise leave the image permanently faded out — reconcile on mount.
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      className={cn(
        "h-full w-full transition-opacity duration-500",
        loaded ? "opacity-100" : "opacity-0",
        className,
      )}
      onLoad={() => setLoaded(true)}
      src={src}
      loading="lazy"
      decoding="async"
      alt={alt ?? "Interior render"}
      {...rest}
    />
  );
}
