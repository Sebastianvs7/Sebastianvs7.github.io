export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  // Enable static site generation
  nitro: {
    prerender: {
      routes: ["/cs", "/en"],
    },
  },

  // Configure static export
  ssr: false,

  // Modules
  modules: ["@nuxtjs/i18n"],

  // i18n configuration
  i18n: {
    locales: [
      { code: "en", name: "English", file: "en.json" },
      { code: "cs", name: "Čeština", file: "cs.json" },
    ],
    defaultLocale: "cs",
    strategy: "prefix",
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
