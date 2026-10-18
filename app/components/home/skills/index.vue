<template>
  <section
    id="skills"
    ref="sectionRef"
    tabindex="-1"
    aria-labelledby="skills-title"
    :class="{ 'reveal-ready': isRevealReady, 'is-revealed': isRevealed }"
  >
    <h2 id="skills-title">{{ $t("sections.skills") }}</h2>
    <p class="skills-hint">{{ $t("skills.hint") }}</p>

    <div class="skills-groups">
      <div
        v-for="(group, index) in skillsData?.groups"
        :key="group.title.en"
        class="skills-group"
        :style="{ '--reveal-index': index }"
      >
        <h3>{{ group.title[locale] }}</h3>
        <ul class="skill-list">
          <li v-for="item in group.items" :key="getSkillName(item)">
            <span class="skill-tag" :class="{ 'is-core': item.isCore }">
              <Icon v-if="item.icon" :name="`tech:${item.icon}`" />
              {{ getSkillName(item) }}
            </span>
          </li>
        </ul>
      </div>
    </div>

    <p v-if="skillsData?.courses.length" class="skills-courses">
      <strong>{{ $t("skills.courses") }}:</strong>
      <template v-for="(course, index) in skillsData.courses" :key="course.name">
        {{ index > 0 ? ", " : " " }}
        <a
          v-if="course.url"
          :href="course.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ course.name }} ({{ course.provider }}, {{ course.year }})
        </a>
        <span v-else>
          {{ course.name }} ({{ course.provider }}, {{ course.year }})
        </span>
      </template>
    </p>
  </section>
</template>

<script setup lang="ts">
import type { SkillsCollectionItem } from "@nuxt/content";

type SkillItem = SkillsCollectionItem["groups"][number]["items"][number];

const { skillsData } = await useSkillsData();
const { locale } = useI18n();

const getSkillName = (item: SkillItem): string =>
  typeof item.name === "string" ? item.name : item.name[locale.value];

// Groups fade in one by one when the section scrolls into view
const sectionRef = ref<HTMLElement>();
const isRevealReady = ref(false);
const isRevealed = ref(false);
let revealObserver: IntersectionObserver | undefined;

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!sectionRef.value) return;

  isRevealReady.value = true;
  revealObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return;

      isRevealed.value = true;
      revealObserver?.disconnect();
    },
    { threshold: 0.15 }
  );
  revealObserver.observe(sectionRef.value);
});

onBeforeUnmount(() => revealObserver?.disconnect());
</script>

<style scoped lang="scss" src="./skills.scss"></style>
