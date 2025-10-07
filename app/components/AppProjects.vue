<template>
  <section id="projects" aria-label="Projects">
    <div class="projects-header">
      <h2>{{ $t("sections.projects") }}</h2>
    </div>

    <div class="projects-grid">
      <div
        v-for="project in visibleProjects"
        :key="project.id"
        class="project-card"
        :class="{ 'hidden-project': !project.visible }"
      >
        <div class="project-image">
          <img
            :src="project.image"
            :alt="project.title"
            width="300"
            height="200"
            loading="lazy"
          />
          <div class="image-gradient-overlay"></div>
        </div>
        <div class="project-content">
          <h3>{{ project.title }}</h3>
          <div class="project-description-container" :data-project="project.id">
            <p
              class="project-description"
              :class="{ truncated: !expandedDescriptions[project.id] }"
            >
              {{ getProjectDescription(project) }}
            </p>
            <button
              v-if="shouldShowMoreButton(project)"
              class="show-more-desc-btn"
              :data-project="project.id"
              @click="toggleDescription(project.id)"
            >
              <span
                class="show-more-desc-text"
                :class="{ hidden: expandedDescriptions[project.id] }"
              >
                {{ $t("projects.showMore") }}
              </span>
              <span
                class="show-less-desc-text"
                :class="{ hidden: !expandedDescriptions[project.id] }"
              >
                {{ $t("projects.showLess") }}
              </span>
            </button>
          </div>
          <div class="project-links">
            <template v-if="project.links">
              <a
                v-for="link in project.links"
                :key="link.url"
                :href="link.url"
                target="_blank"
                class="project-link"
              >
                {{ link.text }}
              </a>
            </template>
            <a
              v-else-if="project.link"
              :href="project.link"
              target="_blank"
              class="project-link"
            >
              {{ $t("projects.viewProject") }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <div v-if="hasHiddenProjects" class="show-more-container">
      <button class="show-more-btn" @click="toggleShowMore">
        <span class="show-more-text" :class="{ hidden: showAllProjects }">
          {{ $t("projects.showMoreButton") }}
        </span>
        <span class="show-less-text" :class="{ hidden: !showAllProjects }">
          {{ $t("projects.showLessButton") }}
        </span>
      </button>
    </div>
  </section>
</template>

<script setup>
const { projectsData } = useProjectsData();
const { locale } = useI18n();

const showAllProjects = ref(false);
const expandedDescriptions = ref({});

const visibleProjects = computed(() => {
  const sortedProjects = [...projectsData.value].sort(
    (a, b) => a.position - b.position
  );

  if (showAllProjects.value) {
    return sortedProjects;
  }

  return sortedProjects.filter((project) => project.visible);
});

const hasHiddenProjects = computed(() => {
  return projectsData.value.some((project) => !project.visible);
});

const getProjectDescription = (project) => {
  if (typeof project.description === "object") {
    return project.description[locale.value] || project.description.en;
  }
  return project.description;
};

const shouldShowMoreButton = (project) => {
  const description = getProjectDescription(project);
  return description && description.length > 150;
};

const toggleDescription = (projectId) => {
  expandedDescriptions.value[projectId] =
    !expandedDescriptions.value[projectId];
};

const toggleShowMore = () => {
  showAllProjects.value = !showAllProjects.value;

  if (showAllProjects.value) {
    // Add staggered animation for showing projects
    nextTick(() => {
      const hiddenProjects = document.querySelectorAll(".hidden-project");
      hiddenProjects.forEach((project, index) => {
        setTimeout(() => {
          project.classList.add("show");
        }, index * 100); // 100ms delay between each project
      });
    });
  } else {
    // Remove show class from all hidden projects
    const hiddenProjects = document.querySelectorAll(".hidden-project");
    hiddenProjects.forEach((project) => {
      project.classList.remove("show");
    });

    // Scroll to top of projects section when showing less
    nextTick(() => {
      const projectsSection = document.getElementById("projects");
      if (projectsSection) {
        projectsSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  }
};
</script>
