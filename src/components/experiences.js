import { experiencesData, briefcaseIcon } from "../data/experiences.js";

// Helper function to render experience role as list or paragraph
const renderExperienceRole = (role) => {
  if (role.includes("\n")) {
    const items = role.split("\n").filter((item) => item.trim());
    return `
      <ul class="experience-role-list">
        ${items.map((item) => `<li>${item.trim()}</li>`).join("")}
      </ul>
    `;
  }
  return `<p class="experience-role">${role}</p>`;
};

// Helper function to render a single experience item
const renderExperienceItem = (experience) => `
  <div class="experience-item">
    <div class="experience-content ${experience.position}">
      <h3>${experience.company}</h3>
      ${renderExperienceRole(experience.role)}
      <p class="experience-date">${experience.period}</p>
    </div>
    <div class="timeline-dot">
      ${briefcaseIcon}
    </div>
  </div>
`;

export const experiencesComponent = (t) => `
  <section id="experiences" tabindex="-1" aria-label="Working Experiences">
    <div class="experiences-header">
      <h2>${t("sections.experience")}</h2>
      <p class="experiences-subtitle">${t("experiences.subtitle")}</p>
    </div>

    <div class="experiences-timeline">
      <div class="timeline-line"></div>
      ${experiencesData
        .map((experience) => renderExperienceItem(experience))
        .join("")}
    </div>
  </section>
`;
