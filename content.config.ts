import { defineCollection, defineContentConfig } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    // Czech projects
    projectsCs: defineCollection({
      type: "page",
      source: "cs/projects/*.md",
    }),
    // English projects
    projectsEn: defineCollection({
      type: "page",
      source: "en/projects/*.md",
    }),
  },
});
