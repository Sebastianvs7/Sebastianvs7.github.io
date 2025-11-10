<template>
  <div
    ref="cardRef"
    class="project-card magic-bento-card"
    :class="{ 'hidden-project': isHidden }"
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
        <div class="image-gradient-overlay"></div>
      </div>
      <div class="project-content">
        <h3>{{ project.title }}</h3>
        <div class="project-description-container" :data-project="project.id">
          <p
            class="project-description"
            :class="{ truncated: !expandedDescriptions[project.id] }"
          >
            {{ project.description }}
          </p>
          <button
            v-if="shouldShowMoreButton"
            class="show-more-desc-btn"
            :data-project="project.id"
            @click="$emit('toggleDescription', project.id)"
          >
            <span
              class="show-more-desc-text"
              :class="{ hidden: expandedDescriptions[project.id] }"
            >
              {{ $t("projects.showMore") }}
            </span>
            <span
              class="show-less-desc-text"
              :class="{ hidden: !expandedDescriptions[project.id] }"
            >
              {{ $t("projects.showLess") }}
            </span>
          </button>
        </div>
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
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M9 12l2 2 4-4" />
              <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3" />
              <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3" />
              <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3" />
              <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3" />
            </svg>
            {{ $t("projects.viewDetails") }}
          </NuxtLink>
          <template v-if="project.links">
            <a
              v-for="link in project.links"
              :key="link.url"
              :href="link.url"
              target="_blank"
              class="project-link"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                />
                <polyline points="15,3 21,3 21,9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              {{ link.text }}
            </a>
          </template>
          <a
            v-else-if="project.link"
            :href="project.link"
            target="_blank"
            class="project-link"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
              />
              <polyline points="15,3 21,3 21,9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            {{ $t("projects.viewProject") }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const localePath = useLocalePath();

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
  isHidden: {
    type: Boolean,
    default: false,
  },
  shouldShowMoreButton: {
    type: Boolean,
    default: false,
  },
  expandedDescriptions: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["toggleDescription"]);

// Magic Bento effect
const { cardRef } = useMagicBento({
  particleCount: 10,
  glowColor: "122, 104, 83", // Site accent color
  enableTilt: true,
  clickEffect: true,
  enableMagnetism: false,
  disableAnimations: false,
});
</script>
