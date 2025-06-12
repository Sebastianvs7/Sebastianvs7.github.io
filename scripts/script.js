// Component loading
async function loadComponent(templateId) {
  const template = document.getElementById(templateId);
  const link = template.content.querySelector('link[rel="import"]');
  const response = await fetch(link.href);
  const html = await response.text();
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.firstElementChild;
}

// Load all components
async function loadComponents() {
  const header = await loadComponent("header-template");
  document.body.insertBefore(header, document.body.firstChild);

  const intro = await loadComponent("intro-template");
  const timeline = await loadComponent("timeline-template");
  const contact = await loadComponent("contact-template");

  const main = document.querySelector("main");
  main.appendChild(intro);
  main.appendChild(timeline);
  main.appendChild(contact);

  // Return true to indicate components are loaded
  return true;
}

// Initialize all functionality
function initializeApp() {
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
  const body = document.body;
  const storedTheme = localStorage.getItem("theme");

  // Get user's preferred language from browser/system
  const browserLang = navigator.language || navigator.languages[0];
  const preferredLang = browserLang.startsWith("cs") ? "cs" : "en";
  const storedLang = localStorage.getItem("language") || preferredLang;

  console.log(
    "%cHey there, curious developer! 🕵️‍♂️ If you're reading this, you're officially awesome. 🚀",
    "color: #7a6853; font-size: 18px; font-weight: bold;"
  );

  const translations = {
    en: {
      intro: "Intro",
      projects: "Projects",
      experience: "Experience",
      contact: "Contact",
      name: "Sebastian Šanda",
      role: "Web Developer specializing in modern scalable web apps",
      description:
        "Passionate about building performant and accessible websites that bring ideas to life. Experienced in JavaScript, React, Node.js, and CSS.",
      timeline: {
        projects: "Projects",
        experience: "Experience",
        project1: {
          title: "Project One",
          description:
            "A responsive web app that helps users track their habits and progress.",
        },
        project2: {
          title: "Project Two",
          description:
            "A full-stack app to manage tasks and collaborate with teams.",
        },
      },
      email: "📧 seba.vysin@seznam.cz",
      github: "🐙 GitHub",
      linkedin: "💼 LinkedIn",
      footer: "© 2025 Sebastian Šanda. All rights reserved.",
    },
    cs: {
      intro: "Úvod",
      projects: "Projekty",
      experience: "Zkušenosti",
      contact: "Kontakt",
      name: "Sebastian Šanda",
      role: "Webový vývojář specializující se na moderní škálovatelné webové aplikace",
      description:
        "Vášnivý vývojář zaměřený na tvorbu výkonných a přístupných webových stránek, které oživují nápady. Zkušenosti s JavaScriptem, Reactem, Node.js a CSS.",
      timeline: {
        projects: "Projekty",
        experience: "Zkušenosti",
        project1: {
          title: "Projekt První",
          description:
            "Responzivní webová aplikace pomáhající uživatelům sledovat jejich návyky a pokrok.",
        },
        project2: {
          title: "Projekt Druhý",
          description:
            "Full-stack aplikace pro správu úkolů a týmovou spolupráci.",
        },
      },
      email: "📧 seba.vysin@seznam.cz",
      github: "🐙 GitHub",
      linkedin: "💼 LinkedIn",
      footer: "© 2025 Sebastian Šanda. Všechna práva vyhrazena.",
    },
  };

  function applyTheme(theme) {
    if (theme === "dark") {
      body.classList.add("dark-mode");
    } else {
      body.classList.remove("dark-mode");
    }
  }

  function applyLanguage(lang) {
    // Update navigation
    document.querySelector('a[href="#intro"]').textContent =
      translations[lang].intro;
    document.querySelector(
      'a[href="#timeline-section?tab=projects"]'
    ).textContent = translations[lang].projects;
    document.querySelector(
      'a[href="#timeline-section?tab=experience"]'
    ).textContent = translations[lang].experience;
    document.querySelector('a[href="#contact"]').textContent =
      translations[lang].contact;

    // Update intro section
    document.querySelector(".intro-text h1").textContent =
      translations[lang].name;
    document.querySelector(".intro-text h3").textContent =
      translations[lang].role;
    document.querySelector(".intro-text p").textContent =
      translations[lang].description;

    // Update timeline section
    document.querySelector(
      '.tab-btn[data-target="projects-timeline"]'
    ).textContent = translations[lang].timeline.projects;
    document.querySelector(
      '.tab-btn[data-target="experience-timeline"]'
    ).textContent = translations[lang].timeline.experience;

    // Update projects timeline
    const projectItems = document.querySelectorAll(
      "#projects-timeline .timeline-item"
    );
    projectItems[0].querySelector("h3").textContent =
      translations[lang].timeline.project1.title;
    projectItems[0].querySelector("p").textContent =
      translations[lang].timeline.project1.description;
    projectItems[1].querySelector("h3").textContent =
      translations[lang].timeline.project2.title;
    projectItems[1].querySelector("p").textContent =
      translations[lang].timeline.project2.description;

    // Update contact section
    document.querySelector(".contact-links a:nth-child(1)").textContent =
      translations[lang].email;
    document.querySelector(".contact-links a:nth-child(2)").textContent =
      translations[lang].github;
    document.querySelector(".contact-links a:nth-child(3)").textContent =
      translations[lang].linkedin;

    // Update footer
    document.querySelector("footer").textContent = translations[lang].footer;

    // Update language toggle buttons
    const langToggle = document.querySelector("#lang-toggle");
    if (langToggle) {
      langToggle.textContent = lang === "en" ? "CS" : "EN";
    }
    const langToggleMobile = document.querySelector("#lang-toggle-mobile");
    if (langToggleMobile) {
      langToggleMobile.textContent = lang === "en" ? "CS" : "EN";
    }

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
  applyLanguage(storedLang);

  // Language toggle logic
  const langButtons = document.querySelectorAll(
    "#lang-toggle, #lang-toggle-mobile"
  );
  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const newLang = btn.textContent === "CS" ? "cs" : "en";
      applyLanguage(newLang);
    });
  });

  // Hamburger menu toggle
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  menuToggle.addEventListener("click", () => {
    const expanded =
      menuToggle.getAttribute("aria-expanded") === "true" || false;
    menuToggle.setAttribute("aria-expanded", !expanded);
    menuToggle.classList.toggle("open");
    mobileMenu.classList.toggle("open");
    mobileMenu.setAttribute("aria-hidden", expanded);
  });

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

  // Handle timeline tab switching from URL
  function handleTimelineNavigation() {
    const hash = window.location.hash;
    if (hash.startsWith("#timeline-section")) {
      const urlParams = new URLSearchParams(hash.split("?")[1]);
      const tab = urlParams.get("tab");
      if (tab) {
        const targetBtn = document.querySelector(
          `.tab-btn[data-target="${tab}-timeline"]`
        );
        if (targetBtn) {
          targetBtn.click();
        }
      }
    }
  }

  // Handle smooth scrolling for navigation links
  document.querySelectorAll('nav a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").split("?")[0];
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
        // Update URL hash after scrolling
        setTimeout(() => {
          window.location.hash = this.getAttribute("href");
        }, 100);
      }
    });
  });

  // Listen for hash changes
  window.addEventListener("hashchange", handleTimelineNavigation);

  // Handle initial load
  handleTimelineNavigation();

  const tabButtons = document.querySelectorAll(".tab-btn");
  const timelines = document.querySelectorAll(".timeline");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active from all buttons
      tabButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Get the target timeline
      const targetId = btn.getAttribute("data-target");
      const targetTimeline = document.getElementById(targetId);

      // Fade out current active timeline
      const currentActive = document.querySelector(".timeline.active");
      if (currentActive) {
        currentActive.style.opacity = "0";
        currentActive.style.transform = "translateY(20px)";

        // Wait for fade out, then switch content
        setTimeout(() => {
          currentActive.classList.remove("active");
          targetTimeline.classList.add("active");
          // Force a reflow to ensure the transition works
          targetTimeline.offsetHeight;
          targetTimeline.style.opacity = "1";
          targetTimeline.style.transform = "translateY(0)";
        }, 300);
      } else {
        targetTimeline.classList.add("active");
        // Force a reflow to ensure the transition works
        targetTimeline.offsetHeight;
        targetTimeline.style.opacity = "1";
        targetTimeline.style.transform = "translateY(0)";
      }
    });
  });
}

// Initialize loading screen
const loadingText = "Summoning code magic… 🧙‍♂️✨";
const loadingElement = document.getElementById("loading-text");
const loadingScreen = document.getElementById("loading-screen");
let index = 0;

function typeLoading() {
  if (index < loadingText.length) {
    loadingElement.textContent += loadingText.charAt(index);
    index++;
    setTimeout(typeLoading, 100); // typing speed
  } else {
    setTimeout(() => {
      loadingScreen.style.opacity = "0";
      loadingScreen.style.transition = "opacity 0.5s ease";
      setTimeout(() => {
        loadingScreen.style.display = "none";
        // Fade in intro section immediately after loading screen disappears
        const introSection = document.querySelector("#intro");
        if (introSection) {
          introSection.style.opacity = "1";
          introSection.style.transition = "opacity 0.5s ease-in-out";
        }
      }, 500);
    }, 700);
  }
}

// Start the application
async function startApp() {
  // Temporarily disable fade-in observer until loading done
  document
    .querySelectorAll("section")
    .forEach((section) => section.classList.remove("visible"));

  // Start loading animation
  typeLoading();

  // Load components
  await loadComponents();

  // Initialize app functionality
  initializeApp();
}

// Start the application
startApp();
