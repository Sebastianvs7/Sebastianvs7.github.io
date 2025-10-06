export const headerComponent = (t, currentLang = "cs") => {
  // Show the opposite language as button text (what user can switch TO)
  const buttonText = currentLang === "cs" ? "EN" : "CS";

  return `
    <header role="banner">
      <!-- <div class="logo" aria-label="Developer Portfolio Logo" tabindex="0">Sebastian Šanda</div> -->

        <nav class="desktop-menu" role="navigation" aria-label="Primary Navigation">
          <a href="#intro" tabindex="0">${t("navigation.intro")}</a>
          <a href="#projects" tabindex="0">${t("navigation.projects")}</a>
          <a href="#experiences" tabindex="0">${t("navigation.experience")}</a>
          <a href="#about" tabindex="0">${t("navigation.about")}</a>
          <a href="#contact" tabindex="0">${t("navigation.contact")}</a>
          <button id="lang-toggle" aria-label="Toggle language">${buttonText}</button>
        </nav>

      <button
        id="menu-toggle"
        aria-label="Toggle menu"
        aria-expanded="false"
        aria-controls="mobile-menu"
      >
        <div></div>
        <div></div>
        <div></div>
      </button>

      <nav
        id="mobile-menu"
        class="mobile-menu"
        role="navigation"
        aria-label="Mobile Navigation"
        aria-hidden="true"
      >
        <a href="#intro">${t("navigation.intro")}</a>
        <a href="#projects">${t("navigation.projects")}</a>
        <a href="#experiences">${t("navigation.experience")}</a>
        <a href="#about">${t("navigation.about")}</a>
        <a href="#contact">${t("navigation.contact")}</a>
        <button id="lang-toggle-mobile" aria-label="Toggle language">${buttonText}</button>
      </nav>
    </header>
  `;
};
