import type { ShowcaseItem } from "./scroll-spring-gallery";

/**
 * The hero reel for /projects — curated stills pulled from the studio's
 * project archive in `public/projects/` and re-encoded into `public/showcase/`
 * at web resolution. Ordered for contrast as you scroll: warm daylight rooms
 * alternate with the dark, lit interiors so no two neighbouring cards read
 * the same.
 *
 * `href` is optional — set it once a still has a published case study.
 */
export const showcaseItems: ShowcaseItem[] = [
  {
    src: "/showcase/01-living-gilded.jpg",
    title: "The Gilded Living Room",
    description: "Brass filigree, bouclé curves — Mumbai",
    spaceType: "Living",
  },
  {
    src: "/showcase/02-lounge-neon.jpg",
    title: "After Hours Lounge",
    description: "Ribbed ceiling, neon and velvet — Andheri",
    spaceType: "Hospitality",
  },
  {
    src: "/showcase/03-bedroom-panelled.jpg",
    title: "The Panelled Bedroom",
    description: "Warm veneer and low pendant light",
    spaceType: "Bedroom",
  },
  {
    src: "/showcase/04-dining-marble.jpg",
    title: "Marble & Millwork",
    description: "An open dining wall that holds the evening",
    spaceType: "Dining",
  },
  {
    src: "/showcase/05-lounge-afterhours.jpg",
    title: "The Long Room",
    description: "Banquette seating under a lit canopy",
    spaceType: "Hospitality",
  },
  {
    src: "/showcase/06-bedroom-daylight.jpg",
    title: "Morning Side Bedroom",
    description: "Full-height joinery, nothing left on show",
    spaceType: "Bedroom",
  },
];
