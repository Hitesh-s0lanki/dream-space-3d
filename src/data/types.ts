/**
 * Domain types for the designer platform.
 *
 * NOTE: data currently lives in colocated JSON (designers.json / projects.json)
 * and is read synchronously at build time. These shapes are the contract the
 * pages depend on, so when the data moves to a real store later, only the
 * accessors in `./index.ts` need to change — not the pages.
 */

export type Material = {
  /** Display name, e.g. "Walnut". */
  name: string;
  /** Hex swatch shown as a colour chip. */
  swatch: string;
  /** Optional one-line note on where/how it's used. */
  note?: string;
};

export type BeforeAfter = {
  before: string;
  after: string;
};

export type Designer = {
  slug: string;
  name: string;
  /** Studio / brand name (may differ from the person's name). */
  studioName: string;
  tagline: string;
  /** Short philosophy line used on the portfolio hero. */
  philosophy: string;
  /** Longer bio / "our story". Paragraphs split on "\n\n". */
  bio: string;
  /** Optional portrait; falls back to initials when absent. */
  avatar?: string;
  /** Cover image for the portfolio hero + directory card. */
  cover: string;
  city: string;
  yearsActive: number;
  styles: string[];
  services: string[];
  /** How they work, step by step. */
  approach: { title: string; description: string }[];
  contact: {
    email: string;
    phone?: string;
    hours?: string;
    instagram?: string;
    linkedin?: string;
  };
  stats: { label: string; value: string }[];
  /** Project slugs to feature first on the portfolio. */
  featured: string[];
};

export type Project = {
  slug: string;
  designerSlug: string;
  title: string;
  /** One-line summary shown on cards + case-study hero. */
  summary: string;
  year: number;
  location: string;
  spaceType: string;
  style: string;
  cover: string;
  images: string[];
  /** Optional walkthrough video (mp4/webm in /public or a URL). */
  video?: string;
  /** Optional GLB — when present the case study renders an immersive 3D viewer. */
  modelUrl?: string;
  beforeAfter?: BeforeAfter;
  floorPlan?: string;
  materials: Material[];
  /** The design brief — the problem, the people, the constraints. */
  brief: string;
  /** The designer's notes on the finished space. Paragraphs split on "\n\n". */
  notes: string;
};
