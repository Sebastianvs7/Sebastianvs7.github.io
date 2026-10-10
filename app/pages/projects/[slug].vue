<template>
  <div>
    <!-- Header -->
    <Header />

    <!-- Main Content -->
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

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import "./projects.scss";

const route = useRoute();
const { locale } = useI18n();
const localePath = useLocalePath();

const slug = route.params.slug;
const collectionName = locale.value === "en" ? "projectsEn" : "projectsCs";

const { data: project } = await useAsyncData(
  `projects-${slug}-${locale.value}`,
  () =>
    queryCollection(collectionName)
      .path(`/${locale.value}/projects/${slug}`)
      .first()
);

if (!project.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Project not found",
    fatal: true,
  });
}

// Meta tags for SEO
useHead(() => ({
  title: `${project.value.title} - Sebastian Sanda`,
  meta: [
    {
      name: "description",
      content: project.value.description,
    },
    {
      name: "author",
      content: "Sebastian Sanda",
    },
  ],
}));
</script>
