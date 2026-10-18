export interface SiteData {
  email: string;
  linkedin: string;
  github: string;
  cv: Record<"cs" | "en", string>;
}

// Contact details shared across sections
const data: Readonly<SiteData> = Object.freeze({
  email: "info@sebastiansanda.cz",
  linkedin: "https://www.linkedin.com/in/sebastian-sanda/",
  github: "https://github.com/Sebastianvs7",
  cv: {
    cs: "/cv/sebastian-sanda-cs.pdf",
    en: "/cv/sebastian-sanda-en.pdf",
  },
});

export const useData = (): Readonly<SiteData> => data;
