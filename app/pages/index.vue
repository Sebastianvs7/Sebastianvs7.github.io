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
const siteLinks = useSiteLinks();
const { siteUrl } = useRuntimeConfig().public;
const { t } = useI18n();
const { experiences } = await useExperiences();

// schema.org Person: links the site to the profiles in sameAs
const person = computed(() => {
  const currentCompany = experiences.value?.find(
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
    sameAs: [siteLinks.linkedin, siteLinks.github],
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
