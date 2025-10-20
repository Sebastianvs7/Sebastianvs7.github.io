<template>
  <div>
    <!-- Header -->
    <AppHeader />

    <!-- Main Content -->
    <main class="project-detail-main">
      <div v-if="pending" class="loading">
        <p>{{ $t("common.loading") }}</p>
      </div>

      <div v-else-if="error" class="error">
        <h1>{{ $t("common.error") }}</h1>
        <p>{{ $t("common.projectNotFound") }}</p>
        <NuxtLink to="/#projects" class="back-link">
          ← {{ $t("common.backToProjects") }}
        </NuxtLink>
      </div>

      <div v-else-if="project" class="project-content">
        <!-- Hero Section with Animated Background -->
        <section class="project-hero">
          <h1 class="project-title" :data-text="project.title">
            {{ project.title }}
          </h1>
          <AppAnimatedSectionBackground />
          <!--  <img
            :src="project.image"
            :alt="project.title"
            class="hero-image"
            width="200"
            height="200"
          /> -->
          <!--   <div class="hero-content">
            <img
              :src="project.image"
              :alt="project.title"
              class="hero-image"
              width="200"
              height="200"
            />
            <h1>{{ project.title }}</h1>
            <div class="subtitle">{{ getProjectType(project) }}</div>
          </div> -->
        </section>

        <!-- Project Information -->
        <section class="project-info">
          <h2 class="section-title">{{ $t("projectDetail.overview") }}</h2>
          <p>{{ getProjectDescription(project) }}</p>

          <h2 class="section-title">{{ $t("projectDetail.technologies") }}</h2>
          <ul>
            <li v-for="tech in getProjectTechnologies(project)" :key="tech">
              {{ tech }}
            </li>
          </ul>

          <h2 class="section-title">{{ $t("projectDetail.keyFeatures") }}</h2>
          <ul>
            <li v-for="feature in getProjectFeatures(project)" :key="feature">
              {{ feature }}
            </li>
          </ul>

          <!-- Project Links -->
          <div
            v-if="project.links || project.link"
            class="project-links-section"
          >
            <h2 class="section-title">{{ $t("projectDetail.links") }}</h2>
            <div class="project-links">
              <template v-if="project.links">
                <a
                  v-for="link in project.links"
                  :key="link.url"
                  :href="link.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="project-link"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                    />
                    <polyline points="15,3 21,3 21,9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  {{ link.text }}
                </a>
              </template>
              <a
                v-else-if="project.link"
                :href="project.link"
                target="_blank"
                rel="noopener noreferrer"
                class="project-link"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                  />
                  <polyline points="15,3 21,3 21,9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                {{ $t("projectDetail.viewProject") }}
              </a>
            </div>
          </div>

          <!-- Back Link -->
          <NuxtLink to="/#projects" class="back-link">
            ← {{ $t("common.backToProjects") }}
          </NuxtLink>
        </section>
      </div>
    </main>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script setup>
// Get route params
const route = useRoute();
const { locale } = useI18n();

// Get project data
const { projectsData } = useProjectsData();

// Find the project by ID
const project = computed(() => {
  return projectsData.value.find((p) => p.id === route.params.id);
});

// Simulate loading state for better UX
const pending = ref(false);
const error = computed(() => !project.value);

// Helper functions
const getProjectDescription = (project) => {
  if (!project || !project.description)
    return "Project description not available";

  if (typeof project.description === "object") {
    return (
      project.description[locale.value] ||
      project.description.en ||
      "Project description not available"
    );
  }
  return project.description;
};

// Meta tags for SEO
useHead(() => ({
  title: project.value
    ? `${project.value.title} - Sebastian Sanda`
    : "Project Not Found",
  meta: [
    {
      name: "description",
      content: project.value
        ? getProjectDescription(project.value)
        : "Project not found",
    },
    {
      name: "author",
      content: "Sebastian Sanda",
    },
  ],
}));

const getProjectType = (project) => {
  if (!project || !project.id) return "Web Application";

  // Determine project type based on ID or other criteria
  const typeMap = {
    "koh-i-noor": "E-commerce Website",
    zoeto: "Mobile Application",
    furnatura: "E-commerce Website",
    "shop8-cms": "CMS Platform",
    "mobile-phone-museum": "Museum Website",
    elements: "Resort Website",
    biocultus: "Company Website",
    joalis: "Company Website",
    yogarden: "Studio Website",
    moonwood: "Company Website",
    "magnus-art": "Gallery Website",
    mcled: "Company Website",
  };
  return typeMap[project.id] || "Web Application";
};

const getProjectTechnologies = (project) => {
  if (!project || !project.id) return ["Vue.js", "Nuxt.js", "Web Development"];

  // Map technologies based on project type
  const techMap = {
    "koh-i-noor": ["Vue.js", "Nuxt.js", "SCSS", "Responsive Design"],
    zoeto: ["React Native", "iOS", "Android", "Mobile Development"],
    furnatura: ["Vue.js", "Nuxt.js", "SCSS", "E-commerce"],
    "shop8-cms": ["Vue.js", "Node.js", "CMS", "E-commerce"],
    "mobile-phone-museum": ["Vue.js", "Nuxt.js", "Museum CMS"],
    elements: ["Vue.js", "Nuxt.js", "Resort Management"],
    biocultus: ["Vue.js", "Nuxt.js", "Company Website"],
    joalis: ["Vue.js", "Nuxt.js", "Company Website"],
    yogarden: ["Vue.js", "Nuxt.js", "Studio Website"],
    moonwood: ["Vue.js", "Nuxt.js", "Company Website"],
    "magnus-art": ["Vue.js", "Nuxt.js", "Gallery Website"],
    mcled: ["Vue.js", "Nuxt.js", "Company Website"],
  };
  return techMap[project.id] || ["Vue.js", "Nuxt.js", "Web Development"];
};

const getProjectFeatures = (project) => {
  if (!project || !project.id)
    return [
      "Responsive design",
      "Modern web technologies",
      "User-friendly interface",
      "SEO optimized",
    ];

  // Map features based on project type
  const featuresMap = {
    "koh-i-noor": [
      "Responsive design across all devices",
      "Product catalog management",
      "Multi-language support",
      "SEO optimized",
    ],
    zoeto: [
      "Cross-platform mobile app",
      "Product catalog access",
      "Order management system",
      "User account management",
    ],
    furnatura: [
      "E-commerce functionality",
      "Product showcase",
      "Responsive design",
      "Natural cosmetics focus",
    ],
    "shop8-cms": [
      "Custom CMS development",
      "E-commerce solutions",
      "Scalable architecture",
      "Business growth focused",
    ],
    "mobile-phone-museum": [
      "Digital museum experience",
      "Device catalog",
      "Historical information",
      "Non-profit organization",
    ],
    elements: [
      "Resort information system",
      "Booking functionality",
      "Element-themed design",
      "Mountain resort focus",
    ],
    biocultus: [
      "Eco-friendly product showcase",
      "Company information",
      "Product specifications",
      "Sustainability focus",
    ],
    joalis: [
      "Health supplement information",
      "Company profile",
      "Product catalog",
      "Detoxification focus",
    ],
    yogarden: [
      "Yoga studio information",
      "Class schedules",
      "Instructor profiles",
      "Wellness focus",
    ],
    moonwood: [
      "Book distribution platform",
      "Multilingual content",
      "Children's book focus",
      "European distribution",
    ],
    "magnus-art": [
      "Art gallery showcase",
      "Exhibition information",
      "Artist profiles",
      "Cultural focus",
    ],
    mcled: [
      "LED lighting solutions",
      "Product catalog",
      "Professional consultation",
      "Custom lighting design",
    ],
  };
  return (
    featuresMap[project.id] || [
      "Responsive design",
      "Modern web technologies",
      "User-friendly interface",
      "SEO optimized",
    ]
  );
};
</script>

<style scoped>
.project-detail-main {
  max-width: 900px;
  margin: 3rem auto 4rem;
  padding: 0 1.5rem;
}

.loading,
.error {
  text-align: center;
  padding: 4rem 2rem;
}

.error h1 {
  font-family: "Playfair Display", serif;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--color-accent);
}

.project-hero {
  position: relative;
  height: 25vh;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  padding: 3rem 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  max-width: 600px;
  margin: 0 auto;
}

.hero-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  object-fit: contain;
  background: white;
  padding: 1rem;
  filter: sepia(0.3) hue-rotate(30deg) saturate(0.8) brightness(1.1);
}

h1 {
  font-family: "Playfair Display", serif;
  letter-spacing: 0.05em;
  font-weight: 700;
  object-fit: contain;
  vertical-align: middle;
  font-size: 3rem;
  margin-bottom: 0;
  /* background-color: var(--color-bg-light); */
  /* width: calc(100% + 200px); */
  /* height: 200px; */
  /* padding: 0.5rem 1rem; */
  /* padding: 1rem; */
  border-radius: 0.5rem;
  /* box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); */
  color: var(--color-accent);
  text-align: center;
  /* max-width: 600px; */
  margin: 0 auto;
  position: relative;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.1), 1px 1px 0 rgba(0, 0, 0, 0.05);
  z-index: 1;
}

.subtitle {
  font-size: 1.1rem;
  color: var(--color-accent);
  margin-bottom: 2rem;
}

.section-title {
  font-family: "Playfair Display", serif;
  border-bottom: 2px solid var(--color-accent);
  display: inline-block;
  margin-top: 2.5rem;
  padding-bottom: 0.3rem;
  font-size: 1.5rem;
}

.project-info p {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

ul {
  margin-left: 1.5rem;
  margin-bottom: 1.5rem;
}

ul li {
  margin-bottom: 0.5rem;
}

.project-links-section {
  margin-top: 2rem;
}

.project-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.project-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--color-accent);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.project-link:hover {
  background-color: var(--color-accent-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.back-link {
  display: inline-block;
  margin-top: 3rem;
  font-weight: 600;
  font-size: 1.05rem;
  color: var(--color-accent);
  text-decoration: none;
  transition: color 0.3s ease;
}

.back-link:hover {
  color: var(--color-accent-dark);
}

/* Dark mode styles */
:global(body.dark-mode) .hero-content {
  background: rgba(30, 30, 30, 0.95);
  color: var(--color-text-dark);
}

:global(body.dark-mode) .hero-image {
  background: white;
  filter: sepia(0.3) hue-rotate(30deg) saturate(0.8) brightness(1.1);
}

:global(body.dark-mode) .subtitle {
  color: var(--color-accent-dark);
}

:global(body.dark-mode) .section-title {
  border-color: var(--color-accent-dark);
}

:global(body.dark-mode) .project-link {
  background-color: var(--color-accent-dark);
}

:global(body.dark-mode) .project-link:hover {
  background-color: var(--color-accent);
}

:global(body.dark-mode) .back-link {
  color: var(--color-accent-dark);
}

:global(body.dark-mode) .back-link:hover {
  color: var(--color-accent);
}

/* Responsive design */
@media (max-width: 768px) {
  .project-detail-main {
    margin: 2rem auto 3rem;
    padding: 0 1rem;
  }

  .project-hero {
    height: 80vh;
  }

  .hero-content {
    padding: 2rem 1.5rem;
    margin: 0 1rem;
  }

  .hero-image {
    width: 100px;
    height: 100px;
  }

  h1 {
    font-size: 2rem;
  }

  .project-links {
    flex-direction: column;
  }

  .project-link {
    justify-content: center;
  }
}
</style>
