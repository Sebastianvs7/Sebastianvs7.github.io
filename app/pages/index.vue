<template>
  <div>
    <!-- Header -->
    <Header />

    <!-- Main Content -->
    <main>
      <HomeIntro />
      <HomeProjects />
      <HomeExperiences />
      <HomeSkills />
      <HomeAbout />
      <HomeContact />
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
const data = useData();
const { siteUrl } = useRuntimeConfig().public;

// schema.org Person: links the site to the profiles in sameAs
const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Sebastian Šanda",
  jobTitle: "Full-Stack Developer",
  url: siteUrl,
  worksFor: { "@type": "Organization", name: "CRUXO" },
  knowsAbout: [
    "TypeScript",
    "React",
    "Next.js",
    "React Native",
    "NestJS",
    "GraphQL",
    "PostgreSQL",
  ],
  sameAs: [data.linkedin],
};

useHead({
  script: [{ type: "application/ld+json", innerHTML: JSON.stringify(person) }],
});
</script>
