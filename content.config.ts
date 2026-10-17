import { defineCollection, defineContentConfig, z } from "@nuxt/content";

// Frontmatter shared by Czech and English project pages
const projectSchema = z.object({
  image: z.string(),
  position: z.number(),
  type: z.string(),
  link: z.string().optional(),
  links: z.array(z.object({ url: z.string(), text: z.string() })).optional(),
});

export default defineContentConfig({
  collections: {
    // Czech projects
    projectsCs: defineCollection({
      type: "page",
      source: "cs/projects/*.md",
      schema: projectSchema,
    }),
    // English projects
    projectsEn: defineCollection({
      type: "page",
      source: "en/projects/*.md",
      schema: projectSchema,
    }),
    // Work experiences (one file per position, descriptions in both locales)
    experiences: defineCollection({
      type: "data",
      source: "experiences/*.yml",
      schema: z.object({
        order: z.number(),
        company: z.string(),
        position: z.object({ cs: z.string(), en: z.string() }),
        period: z.string(),
        current: z.boolean(),
        description: z.object({
          cs: z.array(z.string()),
          en: z.array(z.string()),
        }),
      }),
    }),
    // Logos of other projects shown in the logo loop
    otherProjects: defineCollection({
      type: "data",
      source: "other-projects/*.yml",
      schema: z.object({
        order: z.number(),
        name: z.string(),
        logo: z.string(),
        url: z.string(),
      }),
    }),
  },
});
