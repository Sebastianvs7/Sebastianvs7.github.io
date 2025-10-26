<template>
  <section id="projects" aria-label="Projects">
    <div class="projects-header">
      <h2>{{ $t("sections.projects") }}</h2>
    </div>

    <div class="projects-grid">
      <div
        v-for="(project, index) in visibleProjects"
        :key="project.id"
        class="project-card"
        :class="{ 'hidden-project': index >= 6 }"
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
              {{ project.description }}
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
            <NuxtLink
              :to="
                localePath({
                  name: 'projects-slug',
                  params: { slug: project.slug },
                })
              "
              class="project-link detail-link"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M9 12l2 2 4-4" />
                <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3" />
                <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3" />
                <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3" />
                <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3" />
              </svg>
              {{ $t("projects.viewDetails") }}
            </NuxtLink>
            <template v-if="project.links">
              <a
                v-for="link in project.links"
                :key="link.url"
                :href="link.url"
                target="_blank"
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
              {{ $t("projects.viewProject") }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <HomeProjectsShowMoreButton
      v-if="hasHiddenProjects"
      :show-all-projects="showAllProjects"
      @toggle="handleShowMoreToggle"
    />
  </section>
</template>

<script setup>
import "./projects.scss";

const { projectsData } = await useProjectsData();
const localePath = useLocalePath();
const showAllProjects = ref(false);
const expandedDescriptions = ref({});

const visibleProjects = computed(() => {
  if (showAllProjects.value) {
    return projectsData.value;
  }

  return [...projectsData.value].slice(0, 6);
});

const hasHiddenProjects = computed(() => {
  return projectsData.value.length > 6;
});

const shouldShowMoreButton = (project) => {
  const description = project.description;
  return description && description.length > 150;
};

const toggleDescription = (projectId) => {
  expandedDescriptions.value[projectId] =
    !expandedDescriptions.value[projectId];
};

const handleShowMoreToggle = () => {
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
