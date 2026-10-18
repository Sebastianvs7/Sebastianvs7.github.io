<template>
  <div
    ref="cardRef"
    class="project-card magic-bento-card"
    :class="{ 'is-revealing': revealOrder !== undefined }"
    :style="{ '--reveal-order': revealOrder }"
  >
    <div class="project-card-inner">
      <div class="project-image">
        <img
          :src="project.image"
          :alt="project.title"
          width="300"
          height="200"
          loading="lazy"
        />
        <div class="image-gradient-overlay" />
      </div>
      <div class="project-content">
        <h3>{{ project.title }}</h3>
        <p class="project-type">{{ project.type }}</p>
        <p class="project-role">
          <strong>{{ $t("projects.role") }}:</strong> {{ project.role }}
        </p>
        <div class="project-description-container">
          <p class="project-description" :class="{ truncated: !isExpanded }">
            {{ project.description }}
          </p>
          <button
            v-if="canExpand"
            class="show-more-desc-btn"
            @click="handleDescriptionToggle"
          >
            <span class="show-more-desc-text" :class="{ hidden: isExpanded }">
              {{ $t("projects.showMore") }}
            </span>
            <span class="show-less-desc-text" :class="{ hidden: !isExpanded }">
              {{ $t("projects.showLess") }}
            </span>
          </button>
        </div>
        <ul class="tag-list">
          <li v-for="tag in project.tags" :key="tag">{{ tag }}</li>
        </ul>
        <div class="project-links">
          <NuxtLink
            :to="
              localePath({
                name: 'projects-slug',
                params: { slug: project.slug },
              })
            "
            class="project-link detail-link"
          >
            <Icon name="local:details" />
            {{ $t("projects.viewDetails") }}
          </NuxtLink>
          <a
            v-for="link in project.links"
            :key="link.url"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="project-link"
          >
            <Icon name="local:external-link" />
            {{ link.text }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProjectSummary } from "~/types/project";

interface ProjectCardProps {
  project: ProjectSummary;
  // Position among the cards revealed by "show more", unset for the rest
  revealOrder?: number;
}

const DESCRIPTION_PREVIEW_LENGTH = 150;

const props = defineProps<ProjectCardProps>();

const localePath = useLocalePath();
const { cardRef } = useMagicBento();

const isExpanded = ref(false);

const canExpand = computed(
  () => props.project.description.length > DESCRIPTION_PREVIEW_LENGTH
);

const handleDescriptionToggle = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<style scoped lang="scss" src="./project-card.scss"></style>
