// Projects are stored per locale, Czech is the default
export const getProjectsCollection = (
  locale: string
): "projectsCs" | "projectsEn" =>
  locale === "en" ? "projectsEn" : "projectsCs";
