export interface SiteData {
  email: string;
  linkedin: string;
  github: string;
  cv: string;
}

// Contact details shared across sections
const data: Readonly<SiteData> = Object.freeze({
  email: "info@sebastiansanda.cz",
  linkedin: "https://www.linkedin.com/in/sebastian-sanda/",
  github: "https://github.com/Sebastianvs7",
  // Czech only for now, both locales link to it
  cv: "/cv/sebastian-sanda-cs.pdf",
});

export const useData = (): Readonly<SiteData> => data;
