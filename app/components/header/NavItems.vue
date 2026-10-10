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
    <span class="theme-icon-light" aria-hidden="true">🌙</span>
    <span class="theme-icon-dark" aria-hidden="true">☀️</span>
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
