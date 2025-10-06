import i18next from "i18next";
import { headerComponent } from "../components/header.js";
import { introComponent } from "../components/intro.js";
import { projectsComponent } from "../components/projects.js";
import { experiencesComponent } from "../components/experiences.js";
import { aboutComponent } from "../components/about.js";
import { contactComponent } from "../components/contact.js";

// Initialize i18next
async function initializeI18n() {
  // Get user's preferred language from browser/system
  const browserLang = navigator.language || navigator.languages[0];
  const preferredLang = browserLang.startsWith("cs") ? "cs" : "en"; // Allow both Czech and English
  const storedLang = localStorage.getItem("language") || preferredLang; // Use browser preference or Czech as fallback

  // Load translation files
  const [enTranslations, csTranslations] = await Promise.all([
    fetch("./locales/en.json").then((res) => res.json()),
    fetch("./locales/cs.json").then((res) => res.json()),
  ]);

  await i18next.init({
    lng: storedLang,
    fallbackLng: "en",
    resources: {
      en: { translation: enTranslations },
      cs: { translation: csTranslations },
    },
  });
}

// Render all components with current language
function renderComponents() {
  const t = (key) => i18next.t(key);
  const currentLang = i18next.language;

  // Find containers and inject components
  const headerContainer = document.querySelector("header") || document.body;
  const mainContainer = document.querySelector("main") || document.body;
  const footerContainer = document.querySelector("#year") || document.body;

  // Replace header with current language
  headerContainer.outerHTML = headerComponent(t, currentLang);

  // Replace main content
  mainContainer.innerHTML = `
    ${introComponent(t)}
    ${projectsComponent(t, currentLang)}
    ${experiencesComponent(t)}
    ${aboutComponent(t)}
    ${contactComponent(t)}
  `;

  // Replace footer with current language
  const year = new Date().getFullYear();
  footerContainer.textContent = year;
}

// Initialize event listeners
function initializeEventListeners() {
  // Language toggle logic
  const langButtons = document.querySelectorAll(
    "#lang-toggle, #lang-toggle-mobile"
  );
  langButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      // If button shows "CS", switch to Czech. If button shows "EN", switch to English.
      const newLang = btn.textContent.trim() === "CS" ? "cs" : "en";
      await applyLanguage(newLang);
    });
  });

  // Hamburger menu toggle
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const expanded =
        menuToggle.getAttribute("aria-expanded") === "true" || false;
      menuToggle.setAttribute("aria-expanded", !expanded);
      menuToggle.classList.toggle("open");
      mobileMenu.classList.toggle("open");
      mobileMenu.setAttribute("aria-hidden", expanded);
    });
  }

  // Scroll reveal for sections
  const sections = document.querySelectorAll("main section:not(#intro)");
  const revealOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.85;
    sections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop < triggerBottom) {
        section.classList.add("visible");
      }
    });
  };
  window.addEventListener("scroll", revealOnScroll);
  window.addEventListener("load", revealOnScroll);

  // Handle smooth scrolling for navigation links
  document.querySelectorAll('nav a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").split("?")[0];
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          const menuToggle = document.getElementById("menu-toggle");
          const mobileMenu = document.getElementById("mobile-menu");
          menuToggle.setAttribute("aria-expanded", false);
          menuToggle.classList.toggle("open");
          mobileMenu.classList.toggle("open");
          mobileMenu.setAttribute("aria-hidden", false);
          window.location.hash = this.getAttribute("href");
        }, 100);
      }
    });
  });

  // Initialize show more functionality
  initializeShowMore();

  // Initialize description show more functionality with delay
  setTimeout(() => {
    initializeDescriptionShowMore();
  }, 100);

  // Theme toggle functionality
  const themeToggles = document.querySelectorAll(
    "#theme-toggle, #theme-toggle-mobile"
  );
  if (themeToggles.length > 0 && window.themeManager) {
    themeToggles.forEach((toggle) => {
      toggle.addEventListener("click", () => {
        window.themeManager.toggleTheme();
      });
    });
  }
}

// Show more projects functionality
function initializeShowMore() {
  const showMoreBtn = document.getElementById("show-more-projects");
  const hiddenProjects = document.querySelectorAll(".hidden-project");
  const showMoreText = showMoreBtn?.querySelector(".show-more-text");
  const showLessText = showMoreBtn?.querySelector(".show-less-text");

  if (!showMoreBtn || hiddenProjects.length === 0) return;

  let isExpanded = false;

  showMoreBtn.addEventListener("click", () => {
    isExpanded = !isExpanded;

    hiddenProjects.forEach((project, index) => {
      if (isExpanded) {
        setTimeout(() => {
          project.classList.add("show");
        }, index * 100);
      } else {
        project.classList.remove("show");
      }
    });

    // Toggle button text
    if (isExpanded) {
      showMoreText.classList.add("hidden");
      showLessText.classList.remove("hidden");
    } else {
      showMoreText.classList.remove("hidden");
      showLessText.classList.add("hidden");

      // Scroll to top of projects section when showing less
      const projectsSection = document.getElementById("projects");
      if (projectsSection) {
        projectsSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  });
}

// Show more description functionality
function initializeDescriptionShowMore() {
  const showMoreBtns = document.querySelectorAll(".show-more-desc-btn");

  showMoreBtns.forEach((btn, index) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      const container = btn.closest(".project-description-container");
      const description = container?.querySelector(".project-description");
      const showMoreText = btn.querySelector(".show-more-desc-text");
      const showLessText = btn.querySelector(".show-less-desc-text");

      if (description && showMoreText && showLessText) {
        const isExpanded = description.classList.contains("expanded");

        if (isExpanded) {
          // Switch to truncated
          description.classList.remove("expanded");
          description.classList.add("truncated");
          showMoreText.classList.remove("hidden");
          showLessText.classList.add("hidden");
        } else {
          // Switch to expanded
          description.classList.remove("truncated");
          description.classList.add("expanded");
          showMoreText.classList.add("hidden");
          showLessText.classList.remove("hidden");
        }
      }
    });
  });
}

// Apply language function (global scope)
async function applyLanguage(lang) {
  await i18next.changeLanguage(lang);
  renderComponents();

  // Re-initialize event listeners after re-rendering
  initializeEventListeners();

  // Update footer
  const footer = document.querySelector("#footer-text");
  if (footer) footer.textContent = i18next.t("footer");

  // Save language preference
  localStorage.setItem("language", lang);
}

// Theme management system
class ThemeManager {
  constructor() {
    this.prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    this.body = document.body;
    this.storedTheme = localStorage.getItem("theme");
    this.isManualOverride = this.storedTheme !== null;

    // Bind methods to preserve context
    this.handleSystemThemeChange = this.handleSystemThemeChange.bind(this);
    this.toggleTheme = this.toggleTheme.bind(this);
  }

  applyTheme(theme) {
    if (theme === "dark") {
      this.body.classList.add("dark-mode");
    } else {
      this.body.classList.remove("dark-mode");
    }

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.content = theme === "dark" ? "#1e1e1e" : "#f5f0e6";
    }
  }

  getCurrentTheme() {
    return this.body.classList.contains("dark-mode") ? "dark" : "light";
  }

  getSystemTheme() {
    return this.prefersDarkScheme.matches ? "dark" : "light";
  }

  initializeTheme() {
    // If user has manually set a preference, use that
    if (this.isManualOverride) {
      this.applyTheme(this.storedTheme);
    } else {
      // Otherwise, follow system preference
      this.applyTheme(this.getSystemTheme());
    }

    // Initialize theme toggle button states
    this.updateThemeToggleButton(this.getCurrentTheme());
  }

  handleSystemThemeChange(e) {
    // Only respond to system changes if user hasn't manually overridden
    if (!this.isManualOverride) {
      this.applyTheme(e.matches ? "dark" : "light");
    }
  }

  toggleTheme() {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    this.applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    this.isManualOverride = true;

    // Update theme toggle button if it exists
    this.updateThemeToggleButton(newTheme);
  }

  updateThemeToggleButton(theme) {
    const themeToggles = document.querySelectorAll(
      "#theme-toggle, #theme-toggle-mobile"
    );
    themeToggles.forEach((toggle) => {
      toggle.textContent = theme === "dark" ? "☀️" : "🌙";
      toggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
    });
  }

  startListening() {
    // Listen for system theme changes
    this.prefersDarkScheme.addEventListener(
      "change",
      this.handleSystemThemeChange
    );
  }

  stopListening() {
    this.prefersDarkScheme.removeEventListener(
      "change",
      this.handleSystemThemeChange
    );
  }
}

// Initialize all functionality
async function initializeApp() {
  // Initialize theme manager
  window.themeManager = new ThemeManager();
  window.themeManager.initializeTheme();
  window.themeManager.startListening();

  // Initialize i18next
  await initializeI18n();

  console.log(
    "%cHey there, curious developer! 🕵️‍♂️ If you're reading this, you're officially awesome. 🚀",
    "color: #7a6853; font-size: 18px; font-weight: bold;"
  );

  // Initial render
  renderComponents();

  // Apply initial language
  await applyLanguage(i18next.language);

  // Immediately reveal sections on load
  setTimeout(() => {
    const sections = document.querySelectorAll("main section:not(#intro)");
    const triggerBottom = window.innerHeight * 0.85;
    sections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop < triggerBottom) {
        section.classList.add("visible");
      }
    });
  }, 100);
}

// Start the application
function startApp() {
  const loadingScreen = document.getElementById("loading-screen");

  // Initialize app functionality
  initializeApp();

  // Fade out loading screen
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.classList.add("fade-out");
    }, 1000);

    setTimeout(() => {
      loadingScreen.style.display = "none";

      // Ensure all sections are visible
      const sections = [
        "#intro",
        "#projects",
        "#experiences",
        "#about",
        "#contact",
      ];
      sections.forEach((selector) => {
        const section = document.querySelector(selector);
        if (section) {
          section.style.opacity = "1";
          section.style.transition = "opacity 1s ease-in-out";
        }
      });
    }, 2000);
  }
}

// Start when DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startApp);
} else {
  startApp();
}
