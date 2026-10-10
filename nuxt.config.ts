// Helper function to generate project routes for static export
function getProjectRoutes(): string[] {
  // List of all project IDs (update this when adding new projects)
  const projectIds = [
    "koh-i-noor",
    "zoeto",
    "furnatura",
    "shop8-cms",
    "mobile-phone-museum",
    "mcled",
    "kristian",
    "nograys",
  ];

  const routes: string[] = [];

  // Generate routes for Czech (default locale - no prefix)
  projectIds.forEach((projectId) => {
    routes.push(`/projekty/${projectId}`);
  });

  // Generate routes for English (with prefix)
  projectIds.forEach((projectId) => {
    routes.push(`/en/projects/${projectId}`);
  });

  return routes;
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
    prerender: {
      routes: [
        "/",
        "/en",
        // Generate project pages for both locales
        ...getProjectRoutes(),
      ],
    },
  },

  // Modules
  modules: ["@nuxtjs/i18n", "@nuxt/content", "@nuxtjs/color-mode", "@nuxt/fonts", "nuxt-icons"],

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
    locales: [
      { code: "en", language: "en-US", name: "English", file: "en.json" },
      { code: "cs", language: "cs-CZ", name: "Čeština", file: "cs.json" },
    ],
    defaultLocale: "cs",
    strategy: "prefix_except_default",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
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
