export const useExperiencesData = () => {
  const experiencesData = ref([
    {
      id: "cruxo",
      company: "CRUXO",
      position: "Full-Stack Developer",
      period: "2026 - ",
      current: true,
      description: {
        cs: "Full-stack vývoj webových aplikací v TypeScriptu.\nVývoj frontendu v Reactu a tvorba knihovny komponent ve Storybooku.\nPráce s NestJS, GraphQL API, PostgreSQL, Docker.",
        en: "Full-stack development of web applications in TypeScript.\nFrontend development in React and building a component library in Storybook.\nWorking with NestJS, GraphQL APIs, PostgreSQL, Docker.",
      },
    },
    {
      id: "code8",
      company: "Code8",
      position: "Frontend Developer",
      period: "2020 - 2025",
      current: false,
      description: {
        cs: "Vývoj a údržba webových aplikací a interních systémů v React, Next.js, TypeScript a Angular.\nPráce v prostředí monorepo (Nx) pro správu rozsáhlejších projektů.\nIntegrace REST API a GraphQL pro efektivní práci s daty.\nVývoj mobilních aplikací v React Native (Expo, Firebase, push notifikace).\nOptimalizace výkonu a SEO; testování pomocí Cypress, konfigurace Webpacku a ESlint.",
        en: "Development and maintenance of web applications and internal systems using React, Next.js, TypeScript, and Angular.\nWorking in a monorepo environment (Nx) for managing large-scale projects.\nIntegration of REST API and GraphQL for efficient data handling.\nDevelopment of mobile applications in React Native (Expo, Firebase, push notifications).\nPerformance and SEO optimization; testing with Cypress, configuration of Webpack and ESlint.",
      },
    },
    {
      id: "mcled",
      company: "MCLED S.R.O.",
      position: "Webmaster",
      period: "2018 - 2020",
      current: false,
      description: {
        cs: "Správa a rozvoj firemního e-shopu.\nKódování HTML, CSS a JavaScript, implementace nových funkcí.\nZpracování produktové fotografie a úprava obsahu pro web.\nPráce s CRM a logistickými systémy v souvislosti s e-shopem.",
        en: "Management and development of the company’s e-commerce store.\nCoding in HTML, CSS, and JavaScript, implementation of new features.\nProduct photography and content editing for the website.\nWorking with CRM and logistics systems in connection with the e-shop.",
      },
    },
    {
      id: "kristian",
      company: "Kristián S.R.O.",
      position: "Webdesigner, Grafik, Kodér",
      period: "2016 - 2018",
      current: false,
      description: {
        cs: "Návrh a realizace webů a microsites.\nKódování HTML, CSS a JavaScript.\nPráce s October CMS při tvorbě webů a funkcionalit.\nSpolupráce s grafickým oddělením na tvorbě vizuální identity.",
        en: "Design and development of websites and microsites.\nCoding in HTML, CSS, and JavaScript.\nWorking with October CMS to build websites and functionalities.\nCollaboration with the graphic design department on visual identity creation.",
      },
    },
  ]);

  return {
    experiencesData,
  };
};
