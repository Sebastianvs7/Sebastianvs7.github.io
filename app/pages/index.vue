<template>
  <main>
    <HomeIntro />
    <HomeProjects />
    <HomeExperiences />
    <HomeSkills />
    <HomeAbout />
    <HomeContact />
  </main>
</template>

<script setup lang="ts">
const data = useData();
const { siteUrl } = useRuntimeConfig().public;
const { t } = useI18n();
const { experiencesData } = await useExperiencesData();

// schema.org Person: links the site to the profiles in sameAs
const person = computed(() => {
  const currentCompany = experiencesData.value?.find(
    (experience) => experience.current
  )?.company;

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: t("intro.name"),
    jobTitle: t("intro.title"),
    url: siteUrl,
    ...(currentCompany && {
      worksFor: { "@type": "Organization", name: currentCompany },
    }),
    // Hand-picked subset of content/skills.yml
    knowsAbout: [
      "TypeScript",
      "React",
      "Next.js",
      "React Native",
      "NestJS",
      "GraphQL",
      "PostgreSQL",
    ],
    sameAs: [data.linkedin, data.github],
  };
});

useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: () => JSON.stringify(person.value),
    },
  ],
});
</script>
