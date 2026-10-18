<template>
  <section
    id="skills"
    ref="sectionRef"
    tabindex="-1"
    aria-labelledby="skills-title"
    :class="{ 'reveal-ready': isRevealReady, 'is-revealed': isRevealed }"
  >
    <h2 id="skills-title">{{ $t("sections.skills") }}</h2>

    <div ref="groupsRef" class="skills-groups" @pointermove="handlePointerMove">
      <div
        v-for="(group, index) in skills?.groups"
        :key="group.title.en"
        class="skills-group"
        :style="{ '--reveal-index': index }"
      >
        <h3>{{ group.title[locale] }}</h3>

        <ul class="skill-list">
          <li v-for="item in group.items" :key="getSkillName(item)">
            <span class="skill-tag">
              <Icon v-if="item.icon" :name="`tech:${item.icon}`" />
              {{ getSkillName(item) }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { SkillsCollectionItem } from "@nuxt/content";

type SkillItem = SkillsCollectionItem["groups"][number]["items"][number];

const { skills } = await useSkills();
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

// Every card gets the pointer position in its own coordinates, so the glow
// near one card's edge spills over into the neighbouring card
const groupsRef = ref<HTMLElement>();
let spotlightFrame = 0;

const handlePointerMove = (event: PointerEvent) => {
  if (event.pointerType !== "mouse" || spotlightFrame) return;

  spotlightFrame = requestAnimationFrame(() => {
    spotlightFrame = 0;
    groupsRef.value
      ?.querySelectorAll<HTMLElement>(".skills-group")
      .forEach((card) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
        card.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
      });
  });
};

onBeforeUnmount(() => {
  revealObserver?.disconnect();
  cancelAnimationFrame(spotlightFrame);
});
</script>

<style scoped lang="scss" src="./skills.scss"></style>
