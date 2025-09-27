import { introData } from "../data/intro.js";

export const introComponent = (t) => `
  <section id="intro" tabindex="-1" aria-label="Introduction">
    <div class="intro-text">
      <h1>${t("intro.name")}</h1>
      <p class="intro-subtitle">${t("intro.subtitle")}</p>
      <h3>${t("intro.role")}</h3>
      <p>${t("intro.description")}</p>

      <div class="intro-bottom">
        <div class="intro-cta">
          ${introData.ctaButtons
            .map(
              (button) => `
              <a 
                href="${button.href}" 
                class="cta-button cta-${button.type}"
                aria-label="${button.ariaLabel}"
                ${
                  button.type === "linkedin"
                    ? 'target="_blank" rel="noopener noreferrer"'
                    : ""
                }
              >
                ${button.text}
              </a>
            `
            )
            .join("")}
        </div>
        
        <div id="fun-shapes">
          ${introData.shapes
            .map((shape) => `<div class="${shape.class}"></div>`)
            .join("")}
        </div>
      </div>
    </div>
    <div class="intro-img" aria-label="Portrait of Sebastian Šanda" role="img">
      <img
        src="${introData.profileImage.src}"
        alt="${introData.profileImage.alt}"
        width="${introData.profileImage.width}"
        height="${introData.profileImage.height}"
      />
    </div>
  </section>
`;
