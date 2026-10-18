<template>
  <section
    id="projects"
    ref="sectionRef"
    tabindex="-1"
    aria-labelledby="projects-title"
  >
    <div class="projects-header">
      <h2 id="projects-title">{{ $t("sections.projects") }}</h2>
    </div>

    <div class="projects-grid">
      <HomeProjectsProjectCard
        v-for="(project, index) in visibleProjects"
        :key="project.slug"
        :project="project"
        :reveal-order="
          index >= VISIBLE_PROJECT_COUNT
            ? index - VISIBLE_PROJECT_COUNT
            : undefined
        "
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
      :is-expanded="showAllProjects"
      @toggle="handleShowMoreToggle"
    />
  </section>
</template>

<script setup lang="ts">
const VISIBLE_PROJECT_COUNT = 6;

const { projects } = await useProjects();
const { logos } = await useOtherProjects();

const sectionRef = ref<HTMLElement | null>(null);
const showAllProjects = ref(false);

const visibleProjects = computed(() =>
  showAllProjects.value
    ? projects.value
    : projects.value.slice(0, VISIBLE_PROJECT_COUNT)
);

const hasHiddenProjects = computed(
  () => projects.value.length > VISIBLE_PROJECT_COUNT
);

const handleShowMoreToggle = async () => {
  showAllProjects.value = !showAllProjects.value;
  if (showAllProjects.value) return;

  // Showing less removes the cards below, so bring the section back into view
  // once the page has shrunk
  await nextTick();
  sectionRef.value?.scrollIntoView({ behavior: "smooth", block: "start" });
};
</script>

<style scoped lang="scss" src="./projects.scss"></style>
