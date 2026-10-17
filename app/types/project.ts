export interface ProjectLink {
  text: string;
  url: string;
}

// Project as shown on a card in the projects section
export interface ProjectSummary {
  description: string;
  image: string;
  link?: string;
  links?: ProjectLink[];
  role: string;
  slug: string;
  tags: string[];
  title: string;
  type: string;
}
