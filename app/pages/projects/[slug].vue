<template>
  <div>
    <!-- Header -->
    <Header />

    <!-- Main Content -->
    <main>
      <div v-if="pending" class="loading">
        <p>{{ $t("common.loading") }}</p>
      </div>

      <div v-else-if="error" class="error">
        <h1>{{ $t("common.error") }}</h1>
        <p>{{ $t("common.projectNotFound") }}</p>
        <NuxtLink :to="localePath('index') + '#projects'" class="back-link">
          ← {{ $t("common.backToProjects") }}
        </NuxtLink>
      </div>

      <div v-else-if="project" class="project-content">
        <!-- Hero Section with Animated Background -->
        <section class="project-hero">
          <AnimatedSectionBackground />
        </section>

        <!-- Project Information -->
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
// Get route params
const route = useRoute();
const { locale } = useI18n();
const localePath = useLocalePath();

// Get project data from markdown files
const { data: project, error: projectError } = await useAsyncData(
  `projects-${route.params.slug}-${locale.value}`,
  async () => {
    const slug = route.params.slug;
    const collectionName = locale.value === "en" ? "projectsEn" : "projectsCs";
    const filePath =
      locale.value === "en"
        ? `${locale.value}/projects/${slug}.en`
        : `${locale.value}/projects/${slug}`;

    try {
      // First, let's see what's available in the collection
      const allProjects = await queryCollection(collectionName).all();

      // Query the specific project file directly
      const foundProject = await queryCollection(collectionName)
        .path(filePath)
        .first();

      if (!foundProject) {
        // Try to find by slug in all projects
        const projectBySlug = allProjects.find((p) => {
          const pathParts = p.path.split("/");
          const fileName = pathParts[pathParts.length - 1];
          // Handle both .md and .en.md files
          const fileSlug = fileName.replace(".en.md", "").replace(".md", "");
          return fileSlug === slug;
        });

        if (!projectBySlug) {
          console.error(`Project not found: ${filePath} or slug: ${slug}`);
          throw new Error(`Project not found: ${filePath}`);
        }

        return projectBySlug;
      }

      return foundProject;
    } catch (error) {
      console.error("Error fetching project:", error);
      throw error;
    }
  }
);
// Simulate loading state for better UX
const pending = ref(false);
const error = computed(() => projectError.value || !project.value);

// Meta tags for SEO
useHead(() => ({
  title: project.value
    ? `${project.value.title} - Sebastian Sanda`
    : "Project Not Found",
  meta: [
    {
      name: "description",
      content: project.value ? project.value.description : "Project not found",
    },
    {
      name: "author",
      content: "Sebastian Sanda",
    },
  ],
}));
</script>
