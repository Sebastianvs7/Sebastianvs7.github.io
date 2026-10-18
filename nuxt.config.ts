import { readdirSync } from "node:fs";

// Prerender every project in both locales; some are only reachable via "show more"
function getProjectRoutes(): string[] {
  const projectsDir = new URL("./content/cs/projects", import.meta.url);
  const slugs = readdirSync(projectsDir).map((file) =>
    file.replace(/\.md$/, "")
  );

  return slugs.flatMap((slug) => [
    `/projekty/${slug}/`,
    `/en/projects/${slug}/`,
  ]);
}

const SITE_URL = "https://www.sebastiansanda.cz";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  // Configure static export
  ssr: true,

  // Enable experimental features for custom named routes
  experimental: {
    scanPageMeta: true,
  },

  // Enable static site generation with dynamic routes
  nitro: {
    preset: "static",
    prerender: {
      routes: [
        "/",
        "/en/",
        // Generate project pages for both locales
        ...getProjectRoutes(),
      ],
    },
  },

  // Modules
  modules: [
    "@nuxtjs/i18n",
    "@nuxt/content",
    "@nuxtjs/color-mode",
    "@nuxt/fonts",
    "@nuxtjs/sitemap",
    "@nuxt/eslint",
    "@nuxt/icon",
  ],

  // Inline SVG icons, bundled for the static client. Tech logos come from
  // simple-icons (CC0), LobeHub icons and Devicon (MIT), generic ones from
  // Lucide (ISC). They are referenced from content, so the scan can't see them
  icon: {
    mode: "svg",
    customCollections: [
      { prefix: "local", dir: "./app/assets/icons" },
      { prefix: "tech", dir: "./app/assets/tech-icons" },
    ],
    clientBundle: {
      includeCustomCollections: true,
      scan: true,
    },
  },

  // Use Node's built-in SQLite (Node 22.5+) instead of the native better-sqlite3 addon
  content: {
    experimental: {
      sqliteConnector: "native",
    },
  },

  // Site config used by the sitemap module
  site: {
    url: SITE_URL,
    trailingSlash: true,
  },

  // Color mode: adds `dark` / `light` class on <html> before hydration
  colorMode: {
    classSuffix: "",
    fallback: "light",
    storageKey: "color-mode",
  },

  // Self-hosted fonts; latin-ext is needed for Czech diacritics
  fonts: {
    defaults: {
      subsets: ["latin", "latin-ext"],
      styles: ["normal"],
    },
    families: [
      { name: "Inter", weights: [400, 600, 700] },
      { name: "Playfair Display", weights: [700] },
    ],
  },

  // i18n configuration
  i18n: {
    baseUrl: SITE_URL,
    // GitHub Pages serves folders, so URLs without the slash get a 301
    trailingSlash: true,
    locales: [
      { code: "en", language: "en-US", name: "English", file: "en.json" },
      { code: "cs", language: "cs-CZ", name: "Čeština", file: "cs.json" },
    ],
    defaultLocale: "cs",
    strategy: "prefix_except_default",
    // A static site can only redirect on the client, mid-hydration, which breaks
    // hydration and makes content query SQLite in the browser
    detectBrowserLanguage: false,
    customRoutes: "config",
    pages: {
      // Project pages
      "projects-slug": {
        en: "/projects/[slug]",
        cs: "/projekty/[slug]",
      },
    },
  },

  // CSS configuration
  css: ["~/styles/main.scss"],

  // App configuration
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    head: {
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "author", content: "Sebastian Šanda" },
      ],
      link: [{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" }],
    },
  },

  // Runtime config
  runtimeConfig: {
    public: {
      siteUrl: SITE_URL,
    },
  },
});
