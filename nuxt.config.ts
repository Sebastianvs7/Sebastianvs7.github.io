// Helper function to generate project routes for static export
function getProjectRoutes(): string[] {
  // List of all project IDs (update this when adding new projects)
  const projectIds = [
    "koh-i-noor",
    "zoeto",
    "furnatura",
    "shop8-cms",
    "mobile-phone-museum",
    "elements",
    "biocultus",
    "joalis",
    "yogarden",
    "moonwood",
    "magnus-art",
    "mcled",
  ];

  const routes: string[] = [];

  // Generate routes for Czech (default locale - no prefix)
  projectIds.forEach((projectId) => {
    routes.push(`/projects/${projectId}`);
  });

  // Generate routes for English (with prefix)
  projectIds.forEach((projectId) => {
    routes.push(`/en/projects/${projectId}`);
  });

  return routes;
}

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  // Configure static export
  ssr: true,

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
  modules: ["@nuxtjs/i18n"],

  // i18n configuration
  i18n: {
    locales: [
      { code: "en", name: "English", file: "en.json" },
      { code: "cs", name: "Čeština", file: "cs.json" },
    ],
    defaultLocale: "cs",
    strategy: "prefix_except_default",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
  },

  // CSS configuration
  css: ["~/styles/main.scss"],

  // App configuration
  app: {
    head: {
      title: "Developer Portfolio - Sebastian Šanda",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Portfolio of Sebastian Šanda - Web Developer specializing in modern, scalable web applications.",
        },
        { name: "author", content: "Sebastian Šanda" },
        { name: "theme-color", content: "#f5f0e6" },
      ],
      link: [
        { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@700&display=swap",
        },
      ],
    },
  },

  // Runtime config
  runtimeConfig: {
    public: {
      siteUrl: "https://www.sebastiansanda.cz",
    },
  },
});
