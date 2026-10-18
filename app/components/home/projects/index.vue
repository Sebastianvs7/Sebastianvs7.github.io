<template>
  <section id="projects" tabindex="-1" aria-labelledby="projects-title">
    <div class="projects-header">
      <h2 id="projects-title">{{ $t("sections.projects") }}</h2>
    </div>

    <div class="projects-grid">
      <HomeProjectsProjectCard
        v-for="(project, index) in visibleProjects"
        :key="project.slug"
        :project="project"
        :is-hidden="index >= VISIBLE_PROJECT_COUNT"
        :should-show-more-button="shouldShowMoreButton(project)"
        :expanded-descriptions="expandedDescriptions"
        @toggle-description="toggleDescription"
      />
    </div>

    <div v-if="showAllProjects" class="projects-logo-loop">
      <h3>{{ $t("projects.otherProjects") }}</h3>
      <LogoLoop
        :logos="logos"
        :speed="30"
        direction="left"
        :logo-width="200"
        :logo-height="48"
        :gap="40"
        :pause-on-hover="true"
        :scale-on-hover="true"
        :fade-out="true"
        :aria-label="$t('projects.otherProjects')"
      />
    </div>

    <HomeProjectsShowMoreButton
      v-if="hasHiddenProjects"
      :show-all-projects="showAllProjects"
      @toggle="handleShowMoreToggle"
    />
  </section>
</template>

<script setup lang="ts">
import type { ProjectSummary } from "~/types/project";

const VISIBLE_PROJECT_COUNT = 6;
const DESCRIPTION_PREVIEW_LENGTH = 150;

const { projects } = await useProjects();
const { logos } = await useOtherProjects();
const showAllProjects = ref(false);
const expandedDescriptions = ref<Record<string, boolean>>({});

const visibleProjects = computed(() => {
  if (showAllProjects.value) {
    return projects.value;
  }

  return projects.value.slice(0, VISIBLE_PROJECT_COUNT);
});

const hasHiddenProjects = computed(() => {
  return projects.value.length > VISIBLE_PROJECT_COUNT;
});

const shouldShowMoreButton = (project: ProjectSummary): boolean => {
  return project.description.length > DESCRIPTION_PREVIEW_LENGTH;
};

const toggleDescription = (slug: string) => {
  expandedDescriptions.value[slug] = !expandedDescriptions.value[slug];
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

<style scoped lang="scss" src="./projects.scss"></style>
