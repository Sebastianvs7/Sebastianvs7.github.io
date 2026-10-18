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
const { locale } = useI18n();
const localePath = useLocalePath();

const slug = String(route.params.slug);
const collectionName = locale.value === "en" ? "projectsEn" : "projectsCs";

const { data } = await useAsyncData(`projects-${slug}-${locale.value}`, () =>
  queryCollection(collectionName)
    .path(`/${locale.value}/projects/${slug}`)
    .first()
);

if (!data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Project not found",
    fatal: true,
  });
}

// Each slug and locale is its own page instance, so the project never changes here
const project = data.value;

useSeoMeta({
  title: project.title,
  description: project.description,
  ogTitle: `${project.title} | Sebastian Šanda`,
  ogDescription: project.description,
});
</script>

<style scoped lang="scss" src="./projects.scss"></style>
