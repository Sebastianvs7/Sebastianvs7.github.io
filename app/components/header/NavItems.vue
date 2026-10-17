<template>
  <NuxtLink
    v-if="isProjectsPage"
    :to="localePath('index')"
    @click="emit('navigate')"
  >
    {{ $t("navigation.home") }}
  </NuxtLink>
  <template v-else>
    <NuxtLink
      v-for="link in SECTION_LINKS"
      :key="link.hash"
      :to="link.hash"
      @click="emit('navigate')"
    >
      {{ $t(link.labelKey) }}
    </NuxtLink>
  </template>

  <button
    type="button"
    class="theme-toggle"
    :aria-label="$t('navigation.toggleTheme')"
    @click="toggleTheme"
  >
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <clipPath :id="clipId">
        <rect width="24" height="19" />
      </clipPath>
      <!-- Nested groups: each layer owns one transform (hover vs. theme switch) so they don't override each other -->
      <g :clip-path="`url(#${clipId})`">
        <g class="theme-icon-sky">
          <g class="theme-icon-sun">
            <circle cx="12" cy="11" r="3.5" fill="currentColor" />
            <g class="theme-icon-rays">
              <path
                class="theme-icon-rays-spin"
                d="M12 4.5V6M12 16v1.5M4.5 11H6M18 11h1.5M6.7 5.7l1.1 1.1M16.2 15.2l1.1 1.1M6.7 16.3l1.1-1.1M16.2 6.8l1.1-1.1"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
            </g>
          </g>
          <g class="theme-icon-moon">
            <path
              d="M18.3 11.55A6.3 6.3 0 1 1 11.45 4.7 4.9 4.9 0 0 0 18.3 11.55z"
              fill="currentColor"
            />
          </g>
          <g
            class="theme-icon-stars"
            stroke="currentColor"
            stroke-width="1.2"
            stroke-linecap="round"
          >
            <path class="theme-icon-star" d="M4.5 4v3M3 5.5h3" />
            <path class="theme-icon-star" d="M19.5 3.3v2.4M18.3 4.5h2.4" />
            <path class="theme-icon-star" d="M20.5 8v2M19.5 9h2" />
          </g>
        </g>
      </g>
      <path
        class="theme-icon-horizon"
        d="M3 20.5h18"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
      />
    </svg>
  </button>
  <button
    type="button"
    class="lang-toggle"
    :aria-label="$t('navigation.switchLanguage')"
    @click="switchLanguage"
  >
    {{ otherLocale.toUpperCase() }}
  </button>
</template>

<script setup lang="ts">
interface SectionLink {
  hash: string;
  labelKey: string;
}

const SECTION_LINKS: SectionLink[] = [
  { hash: "#intro", labelKey: "navigation.intro" },
  { hash: "#projects", labelKey: "navigation.projects" },
  { hash: "#experiences", labelKey: "navigation.experience" },
  { hash: "#skills", labelKey: "navigation.skills" },
  { hash: "#about", labelKey: "navigation.about" },
  { hash: "#contact", labelKey: "navigation.contact" },
];

const emit = defineEmits<{
  navigate: [];
}>();

const route = useRoute();
const { locale } = useI18n();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();
const getRouteBaseName = useRouteBaseName();
const colorMode = useColorMode();
// Rendered twice (desktop + mobile menu), so the clipPath id must be unique
const clipId = `theme-clip-${useId()}`;

const isProjectsPage = computed(
  () => getRouteBaseName(route) === "projects-slug"
);
const otherLocale = computed(() => (locale.value === "cs" ? "en" : "cs"));

const toggleTheme = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};

const switchLanguage = () => {
  const path = switchLocalePath(otherLocale.value);
  if (path) {
    navigateTo(path, { replace: true });
  }
};
</script>

<style scoped lang="scss" src="./nav-items.scss"></style>
