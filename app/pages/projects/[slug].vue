<template>
  <main>
    <div class="project-content">
      <!-- Hero Section with Animated Background -->
      <section class="project-hero">
        <AnimatedSectionBackground />
      </section>

      <!-- Decrypted Title -->
      <div class="project-title-wrapper">
        <DecryptedText :text="project.title" :duration="1500" />
      </div>
      <!-- Render markdown content using ContentRenderer -->
      <ContentRenderer :value="project" tag="section" class="project-info" />

      <!-- Back Link -->
      <NuxtLink :to="localePath('index') + '#projects'" class="back-link">
        ← {{ $t("common.backToProjects") }}
      </NuxtLink>
    </div>
  </main>
</template>

<script setup lang="ts">
const route = useRoute();
const localePath = useLocalePath();

// Each slug and locale is its own page instance, so the project never changes here
const project = await useProject(String(route.params.slug));

useSeoMeta({
  title: project.title,
  description: project.description,
  ogTitle: `${project.title} | Sebastian Šanda`,
  ogDescription: project.description,
});
</script>

<style scoped lang="scss" src="./projects.scss"></style>
