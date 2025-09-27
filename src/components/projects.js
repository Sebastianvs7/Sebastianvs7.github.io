import { projectsData } from "../data/projects.js";

// Helper function to render project links
const renderProjectLinks = (project, t) => {
  if (project.links) {
    return `
      <div class="project-links">
        ${project.links
          .map(
            (link) => `
            <a href="${link.url}" target="_blank" class="project-link">
              ${link.text}
            </a>
          `
          )
          .join("")}
      </div>
    `;
  } else if (project.link) {
    return `
      <a href="${project.link}" target="_blank" class="project-link">
        ${t("projects.viewProject")}
      </a>
    `;
  }
  return "";
};

// Helper function to render contributions text
const renderContributions = (contributions) => {
  if (!contributions) return "";

  const lines = contributions.split("\n").filter((line) => line.trim());
  return `
    <div class="project-contributions">
      ${lines
        .map((line) => {
          if (line.trim().endsWith(":")) {
            return `<h4>${line.trim()}</h4>`;
          } else if (line.trim()) {
            return `<p>${line.trim()}</p>`;
          }
          return "";
        })
        .join("")}
    </div>
  `;
};

// Helper function to render project description with truncation
const renderProjectDescription = (description, projectId) => {
  return `
    <div class="project-description-container" data-project="${projectId}">
      <p class="project-description truncated">${description}</p>
      <button class="show-more-desc-btn" data-project="${projectId}">
        <span class="show-more-desc-text">Zobrazit více</span>
        <span class="show-less-desc-text hidden">Zobrazit méně</span>
      </button>
    </div>
  `;
};

// Helper function to render a single project card
const renderProjectCard = (project, t) => {
  const gradientOverlay = project.gradientColors
    ? `background: linear-gradient(135deg, ${project.gradientColors[0]}CC, ${project.gradientColors[1]}CC);`
    : "background: linear-gradient(135deg, #333C, #222C);";

  return `
    <div class="project-card ${!project.visible ? "hidden-project" : ""}">
      <div class="project-image">
        ${
          project.image
            ? `
          <img 
            src="${project.image}" 
            alt="${project.title}" 
            loading="lazy"
            onerror="this.style.display='none'"
          />
        `
            : ""
        }
        <div class="image-gradient-overlay" style="${gradientOverlay}"></div>
      </div>
      <div class="project-content">
        <h3>${project.title}</h3>
        ${renderProjectDescription(project.description, project.id)}
        ${renderContributions(project.contributions)}
        ${renderProjectLinks(project, t)}
      </div>
    </div>
  `;
};

export const projectsComponent = (t) => `
  <section id="projects" tabindex="-1" aria-label="Projects">
    <div class="projects-header">
      <h2>${t("sections.projects")}</h2>
      <p class="projects-subtitle">${t("projects.subtitle")}</p>
    </div>

    <div class="projects-grid" id="projects-grid">
      ${projectsData.map((project) => renderProjectCard(project, t)).join("")}
    </div>

    <div class="show-more-container">
      <button
        id="show-more-projects"
        class="show-more-btn"
        aria-label="Show more projects"
      >
        <span class="show-more-text">${t("projects.showMore")}</span>
        <span class="show-less-text hidden">${t("projects.showLess")}</span>
      </button>
    </div>
  </section>
`;
