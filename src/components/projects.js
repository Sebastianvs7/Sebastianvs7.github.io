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
              ${`${link.text}`}
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

// Helper function to render project description with truncation
const renderProjectDescription = (
  description,
  projectId,
  t,
  currentLanguage
) => {
  const descriptionText =
    typeof description === "object"
      ? description[currentLanguage]
      : description;
  return `
    <div class="project-description-container" data-project="${projectId}">
      <p class="project-description truncated">${descriptionText}</p>
      <button class="show-more-desc-btn" data-project="${projectId}">
        <span class="show-more-desc-text">${t("projects.showMore")}</span>
        <span class="show-less-desc-text hidden">${t(
          "projects.showLess"
        )}</span>
      </button>
    </div>
  `;
};

// Helper function to render a single project card
const renderProjectCard = (project, t, currentLanguage) => {
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
        <div class="image-gradient-overlay"></div>
      </div>
      <div class="project-content">
        <h3>${project.title}</h3>
        ${renderProjectDescription(
          project.description,
          project.id,
          t,
          currentLanguage
        )}
        ${renderProjectLinks(project, t)}
      </div>
    </div>
  `;
};

export const projectsComponent = (t, currentLanguage = "cs") => `
  <section id="projects" tabindex="-1" aria-label="Projects">
    <div class="projects-header">
      <h2>${t("sections.projects")}</h2>
    </div>

    <div class="projects-grid" id="projects-grid">
      ${projectsData
        .sort((a, b) => a.position - b.position)
        .map((project) => renderProjectCard(project, t, currentLanguage))
        .join("")}
    </div>

    <div class="show-more-container">
      <button
        id="show-more-projects"
        class="show-more-btn"
        aria-label="Show more projects"
      >
        <span class="show-more-text">${t("projects.showMoreButton")}</span>
        <span class="show-less-text hidden">${t(
          "projects.showLessButton"
        )}</span>
      </button>
    </div>
  </section>
`;
