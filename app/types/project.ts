import type { ProjectsCsCollectionItem } from "@nuxt/content";

type ProjectLink = NonNullable<ProjectsCsCollectionItem["links"]>[number];

// Project as shown on a card in the projects section
export type ProjectSummary = Pick<
  ProjectsCsCollectionItem,
  "description" | "image" | "role" | "tags" | "title" | "type"
> & {
  links: ProjectLink[];
  slug: string;
};
