export interface SiteData {
  email: string;
  linkedin: string;
}

// Contact details shared across sections
const data: Readonly<SiteData> = Object.freeze({
  email: "info@sebastiansanda.cz",
  linkedin: "https://linkedin.com/in/sebastian-sanda",
});

export const useData = (): Readonly<SiteData> => data;
