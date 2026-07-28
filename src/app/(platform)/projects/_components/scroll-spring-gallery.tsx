"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useSyncExternalStore, type CSSProperties } from "react";

import styles from "./scroll-spring-gallery.module.css";

export type ShowcaseItem = {
  src: string;
  title: string;
  description: string;
  /** Short label shown as a pill on the card, e.g. "Bedroom". */
  spaceType?: string;
  /** When present the whole card becomes a link to the case study. */
  href?: string;
};

/** Spring feel for every card transform. Lower stiffness = heavier, slower. */
const SPRING = { stiffness: 75, damping: 18, mass: 0.75 } as const;

/**
 * Share of total scroll progress the cards occupy. The tail (1 - REEL) is the
 * hold at the end, where the last card sits centre stage before the section
 * releases the scroll.
 */
const REEL = 0.9;

type FloatingCardProps = {
  item: ShowcaseItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
  /** Multiplier on the sideways swing, so cards stay on stage on narrow screens. */
  drift: number;
};

/**
 * One card in the reel. Every transform is a keyframe track over the same three
 * scroll positions — enter (below, tilted, off to one side), centre (upright and
 * enlarged), exit (lifted up and away) — then run through a spring so the card
 * overshoots and settles instead of tracking the scrollbar rigidly.
 */
function FloatingCard({
  item,
  index,
  total,
  progress,
  drift,
}: FloatingCardProps) {
  const sectionSize = REEL / total;
  const start = index * sectionSize;
  const enter = Math.max(0, start - 0.1);
  const centre = start + sectionSize * 0.85;
  const end = Math.min(start + 0.4, 1);

  const range = [enter, centre, end];

  // Alternate which side each card swings in from.
  const dir = index % 2 === 0 ? 1 : -1;
  // Rotation reads the same at any width; only the sideways travel is scaled.
  const swing = dir * drift;

  /**
   * The last card never exits — it parks centre stage for the hold at the end
   * of the reel, so the section releases on an image rather than an empty
   * stage. Every track therefore ends on its centre value instead of its exit.
   */
  const isLast = index === total - 1;
  const track = (enterVal: number, centreVal: number, exitVal: number) =>
    [enterVal, centreVal, isLast ? centreVal : exitVal] as number[];

  const rawY = useTransform(progress, range, track(500, 0, -500));
  const rawX = useTransform(
    progress,
    range,
    track(swing * 260, swing * 55, swing * -170),
  );
  const rawScale = useTransform(progress, range, track(0.65, 1.06, 0.78));
  const rawRotateX = useTransform(progress, range, track(28, 0, -22));
  const rawRotateY = useTransform(progress, range, track(dir * 32, dir * -4, dir * -25));
  const rawRotateZ = useTransform(progress, range, track(dir * 10, dir * -2, dir * -8));

  const opacity = useTransform(
    progress,
    isLast ? [enter, centre] : [enter, centre, end - 0.03, end],
    isLast ? [0, 1] : [0, 1, 1, 0],
  );

  const y = useSpring(rawY, SPRING);
  const x = useSpring(rawX, SPRING);
  const scale = useSpring(rawScale, SPRING);
  const rotateX = useSpring(rawRotateX, SPRING);
  const rotateY = useSpring(rawRotateY, SPRING);
  const rotateZ = useSpring(rawRotateZ, SPRING);

  return (
    <motion.article
      className={styles.card}
      style={{ x, y, scale, rotateX, rotateY, rotateZ, opacity, zIndex: index + 1 }}
    >
      <div className={styles.cardGlow} />
      <CardFace item={item} index={index} priority={index === 0} />
    </motion.article>
  );
}

/** The card's visual content, shared by the animated and reduced-motion trees. */
function CardFace({
  item,
  index,
  priority,
}: {
  item: ShowcaseItem;
  index: number;
  priority: boolean;
}) {
  return (
    <div className={styles.imageWrapper}>
      <Image
        src={item.src}
        alt={item.title}
        fill
        sizes="(max-width: 768px) 86vw, 620px"
        className={styles.image}
        priority={priority}
      />

      <div className={styles.imageOverlay} />

      <div className={styles.cardContent}>
        <span className={styles.number}>
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className={styles.cardText}>
          <h2>{item.title}</h2>
          <p>{item.description}</p>
        </div>

        {item.spaceType && <span className={styles.tag}>{item.spaceType}</span>}
      </div>

      {item.href && (
        <Link
          href={item.href}
          className={styles.cardLink}
          aria-label={`View ${item.title}`}
        />
      )}
    </div>
  );
}

/**
 * Full-bleed scroll reel for the top of /projects.
 *
 * `prefers-reduced-motion` is only readable in the browser, so the reel is what
 * gets server-rendered and hydrated; the static grid takes over right after.
 * Each mode is its own subtree so that swapping unmounts the reel's `useScroll`
 * with it, rather than leaving it holding a ref to a section no longer rendered.
 */
export function ScrollSpringGallery({ items }: { items: ShowcaseItem[] }) {
  const reduceMotion = usePrefersReducedMotion();

  return reduceMotion ? (
    <StaticReel items={items} />
  ) : (
    <AnimatedReel items={items} />
  );
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * The server snapshot is `false` so hydration always matches the reel that was
 * server-rendered; React re-reads the client snapshot immediately afterwards
 * and swaps in the static grid if the preference is set.
 */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

function subscribeToResize(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

/**
 * The card offsets are authored against a 1440px stage. Narrower viewports scale
 * them down, or a card would swing most of the way off screen before it lands.
 * Floored so the reel keeps its diagonal drift even on a phone.
 */
function useDriftScale() {
  return useSyncExternalStore(
    subscribeToResize,
    () => Math.min(1, Math.max(0.35, window.innerWidth / 1440)),
    () => 1,
  );
}

/** The scroll-driven reel: a tall track wrapping a sticky 100vh stage. */
function AnimatedReel({ items }: { items: ShowcaseItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const drift = useDriftScale();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /**
   * Not a no-op. When `useScroll` is given a `target`, motion tags the returned
   * value so that any keyframe-array `useTransform` of it — and any accelerable
   * property it drives (opacity, transform) — is handed off to a native
   * ViewTimeline animation. That timeline measures the *section's* travel
   * through the viewport, which does not match `scrollYProgress` once the
   * content is inside a sticky stage: opacities then drift out of step with the
   * sprung transforms, which are never accelerated.
   *
   * Passing the value through a function-form transform drops the tag (see
   * framer-motion's `useTransform`), keeping every track on the same JS-driven
   * scroll position.
   */
  const progress = useTransform(scrollYProgress, (v) => v);

  const headingY = useTransform(progress, [0, 0.2], [0, -80]);
  const headingOpacity = useTransform(progress, [0, 0.12, 0.25], [1, 1, 0]);
  const orbRotate = useTransform(progress, [0, 1], [0, 45]);
  const orbScale = useTransform(progress, [0, 0.5, 1], [1, 1.3, 1.1]);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      style={{ "--card-count": items.length } as CSSProperties}
    >
      <div className={styles.sticky}>
        <div className={styles.backgroundGrid} />

        <motion.div
          className={styles.backgroundOrb}
          style={{ rotate: orbRotate, scale: orbScale }}
        />

        <div className={styles.particles} />
        <div className={styles.noise} />

        <motion.div
          className={styles.intro}
          style={{ y: headingY, opacity: headingOpacity }}
        >
          <Intro />
        </motion.div>

        <div className={styles.gallery}>
          {items.map((item, index) => (
            <FloatingCard
              key={item.src}
              item={item}
              index={index}
              total={items.length}
              progress={progress}
              drift={drift}
            />
          ))}
        </div>

        <div className={styles.scrollIndicator}>
          <span />
          Scroll
        </div>

        <div className={styles.progressRail}>
          <motion.div
            className={styles.progressBar}
            style={{ scaleX: progress }}
          />
        </div>
      </div>
    </section>
  );
}

/** Reduced-motion fallback: the same cards, laid out flat with nothing moving. */
function StaticReel({ items }: { items: ShowcaseItem[] }) {
  return (
    <section className={styles.staticSection}>
      <div className={styles.backgroundGrid} />
      <div className={styles.noise} />

      <div className={styles.staticIntro}>
        <Intro />
      </div>

      <div className={styles.staticGrid}>
        {items.map((item, i) => (
          <article key={item.src} className={styles.staticCard}>
            <CardFace item={item} index={i} priority={i < 2} />
          </article>
        ))}
      </div>
    </section>
  );
}

function Intro() {
  return (
    <div className={styles.introContent}>
      <span className={styles.eyebrow}>Selected work</span>
      <h1>
        Every room,
        <br />
        <span>before it was built.</span>
      </h1>
      <p>Scroll to move through the reel</p>
    </div>
  );
}
