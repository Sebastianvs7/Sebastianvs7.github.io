<template>
  <section id="projects" aria-label="Projects">
    <div class="projects-header">
      <h2>{{ $t("sections.projects") }}</h2>
    </div>

    <div class="projects-grid">
      <HomeProjectsProjectCard
        v-for="(project, index) in visibleProjects"
        :key="project.id"
        :project="project"
        :is-hidden="index >= 6"
        :should-show-more-button="shouldShowMoreButton(project)"
        :expanded-descriptions="expandedDescriptions"
        @toggle-description="toggleDescription"
      />
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
