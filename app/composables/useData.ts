export interface SiteData {
  email: string;
  linkedin: string;
  github: string;
}

// Contact details shared across sections
const data: Readonly<SiteData> = Object.freeze({
  email: "info@sebastiansanda.cz",
  linkedin: "https://www.linkedin.com/in/sebastian-sanda/",
  github: "https://github.com/Sebastianvs7",
});

export const useData = (): Readonly<SiteData> => data;
