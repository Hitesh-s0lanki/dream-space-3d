/**
 * Data accessors for the designer platform.
 *
 * Data currently lives in colocated JSON (designers.json / projects.json) and is
 * read synchronously — these functions are the single seam the pages import from,
 * so swapping JSON for a real store later is a change here only.
 */
import type { Designer, Project } from "./types";
import designersData from "./designers.json";
import projectsData from "./projects.json";

const designers = designersData as Designer[];
const projects = projectsData as Project[];

export function getDesigners(): Designer[] {
  return designers;
}

export function getDesigner(slug: string): Designer | undefined {
  return designers.find((d) => d.slug === slug);
}

export function getProjects(): Project[] {
  return projects;
}

export function getProjectsByDesigner(designerSlug: string): Project[] {
  return projects.filter((p) => p.designerSlug === designerSlug);
}

export function getProject(
  designerSlug: string,
  projectSlug: string,
): Project | undefined {
  return projects.find(
    (p) => p.designerSlug === designerSlug && p.slug === projectSlug,
  );
}

/** Featured projects for a designer, in the order listed on their profile. */
export function getFeaturedProjects(designer: Designer): Project[] {
  return designer.featured
    .map((slug) => getProject(designer.slug, slug))
    .filter((p): p is Project => Boolean(p));
}

export type { Designer, Project } from "./types";
