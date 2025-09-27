import i18next from "i18next";

// Initialize i18next
async function initializeI18n() {
  // Get user's preferred language from browser/system
  const browserLang = navigator.language || navigator.languages[0];
  const preferredLang = browserLang.startsWith("cs") ? "cs" : "en";
  const storedLang = localStorage.getItem("language") || preferredLang;

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

// Initialize all functionality
async function initializeApp() {
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
  const body = document.body;
  const storedTheme = localStorage.getItem("theme");

  // Initialize i18next
  await initializeI18n();

  console.log(
    "%cHey there, curious developer! 🕵️‍♂️ If you're reading this, you're officially awesome. 🚀",
    "color: #7a6853; font-size: 18px; font-weight: bold;"
  );

  function applyTheme(theme) {
    if (theme === "dark") {
      body.classList.add("dark-mode");
    } else {
      body.classList.remove("dark-mode");
    }
  }

  async function applyLanguage(lang) {
    // Change i18next language
    await i18next.changeLanguage(lang);

    // Update navigation
    const introLink = document.querySelector('a[href="#intro"]');
    const projectsLink = document.querySelector('a[href="#projects"]');
    const experiencesLink = document.querySelector('a[href="#experiences"]');
    const contactLink = document.querySelector('a[href="#contact"]');

    if (introLink) introLink.textContent = i18next.t("navigation.intro");
    if (projectsLink)
      projectsLink.textContent = i18next.t("navigation.projects");
    if (experiencesLink)
      experiencesLink.textContent = i18next.t("navigation.experience");
    if (contactLink) contactLink.textContent = i18next.t("navigation.contact");

    // Update intro section
    const introName = document.querySelector(".intro-text h1");
    const introRole = document.querySelector(".intro-text h3");
    const introDesc = document.querySelector(".intro-text p");

    if (introName) introName.textContent = i18next.t("intro.name");
    if (introRole) introRole.textContent = i18next.t("intro.role");
    if (introDesc) introDesc.textContent = i18next.t("intro.description");

    // Update section headers
    const projectsHeader = document.querySelector("#projects h2");
    const experiencesHeader = document.querySelector("#experiences h2");
    const projectsSubtitle = document.querySelector(".projects-subtitle");
    const experiencesSubtitle = document.querySelector(".experiences-subtitle");

    if (projectsHeader)
      projectsHeader.textContent = i18next.t("sections.projects");
    if (experiencesHeader)
      experiencesHeader.textContent = i18next.t("sections.experience");
    if (projectsSubtitle)
      projectsSubtitle.textContent = i18next.t("projects.subtitle");
    if (experiencesSubtitle)
      experiencesSubtitle.textContent = i18next.t("experiences.subtitle");

    // Update show more button text
    const showMoreText = document.querySelector(".show-more-text");
    const showLessText = document.querySelector(".show-less-text");
    if (showMoreText) showMoreText.textContent = i18next.t("projects.showMore");
    if (showLessText) showLessText.textContent = i18next.t("projects.showLess");

    // Update contact section
    const emailLink = document.querySelector(".contact-links a:nth-child(1)");
    const linkedinLink = document.querySelector(
      ".contact-links a:nth-child(2)"
    );

    if (emailLink) emailLink.textContent = i18next.t("contact.email");
    if (linkedinLink) linkedinLink.textContent = i18next.t("contact.linkedin");

    // Update footer
    const footer = document.querySelector("footer");
    if (footer) footer.textContent = i18next.t("footer");

    // Update language toggle buttons
    const langToggle = document.querySelector("#lang-toggle");
    const langToggleMobile = document.querySelector("#lang-toggle-mobile");

    if (langToggle) langToggle.textContent = lang === "en" ? "CS" : "EN";
    if (langToggleMobile)
      langToggleMobile.textContent = lang === "en" ? "CS" : "EN";

    // Save language preference
    localStorage.setItem("language", lang);
  }

  // Apply theme
  if (storedTheme) {
    applyTheme(storedTheme);
  } else {
    applyTheme(prefersDarkScheme.matches ? "dark" : "light");
  }

  // Apply initial language
  await applyLanguage(i18next.language);

  // Language toggle logic
  const langButtons = document.querySelectorAll(
    "#lang-toggle, #lang-toggle-mobile"
  );
  langButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const newLang = btn.textContent === "CS" ? "cs" : "en";
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
      }
    });
  }

  // Handle smooth scrolling for navigation links
  document.querySelectorAll('nav a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").split("?")[0];
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          window.location.hash = this.getAttribute("href");
        }, 100);
      }
    });
  });

  // Initialize show more functionality
  initializeShowMore();

  // Immediately reveal sections on load
  setTimeout(() => {
    revealOnScroll();
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
      const sections = ["#intro", "#projects", "#experiences", "#contact"];
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
