export interface SiteLinks {
  cv: Record<"cs" | "en", string>;
  email: string;
  github: string;
  linkedin: string;
}

// Contact details shared across sections
const siteLinks: Readonly<SiteLinks> = Object.freeze({
  cv: {
    cs: "/cv/sebastian-sanda-cs.pdf",
    en: "/cv/sebastian-sanda-en.pdf",
  },
  email: "info@sebastiansanda.cz",
  github: "https://github.com/Sebastianvs7",
  linkedin: "https://www.linkedin.com/in/sebastian-sanda/",
});

export const useSiteLinks = (): Readonly<SiteLinks> => siteLinks;
