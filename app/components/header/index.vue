<template>
  <header role="banner">
    <nav class="desktop-menu" role="navigation" aria-label="Primary Navigation">
      <NuxtLink v-if="!isProjectsPage" to="#intro">{{
        $t("navigation.intro")
      }}</NuxtLink>
      <NuxtLink v-if="!isProjectsPage" to="#projects">{{
        $t("navigation.projects")
      }}</NuxtLink>
      <NuxtLink v-if="!isProjectsPage" to="#experiences">{{
        $t("navigation.experience")
      }}</NuxtLink>
      <NuxtLink v-if="!isProjectsPage" to="#about">{{
        $t("navigation.about")
      }}</NuxtLink>
      <NuxtLink v-if="!isProjectsPage" to="#contact">{{
        $t("navigation.contact")
      }}</NuxtLink>
      <NuxtLink v-if="isProjectsPage" to="/">
        {{ $t("navigation.home") }}</NuxtLink
      >
      <button
        @click="toggleTheme"
        :aria-label="getThemeLabel"
        id="theme-toggle"
      >
        {{ getThemeIcon }}
      </button>
      <button
        @click="toggleLanguage"
        aria-label="Toggle language"
        id="lang-toggle"
      >
        {{ currentLang === "cs" ? "EN" : "CS" }}
      </button>
    </nav>

    <button
      id="menu-toggle"
      aria-label="Toggle menu"
      aria-expanded="false"
      aria-controls="mobile-menu"
      @click="toggleMobileMenu"
    >
      <div></div>
      <div></div>
      <div></div>
    </button>

    <nav
      id="mobile-menu"
      class="mobile-menu"
      role="navigation"
      aria-label="Mobile Navigation"
      aria-hidden="true"
      :class="{ open: isMobileMenuOpen }"
    >
      <NuxtLink v-if="!isProjectsPage" to="#intro">{{
        $t("navigation.intro")
      }}</NuxtLink>
      <NuxtLink v-if="!isProjectsPage" to="#projects">{{
        $t("navigation.projects")
      }}</NuxtLink>
      <NuxtLink v-if="!isProjectsPage" to="#experiences">{{
        $t("navigation.experience")
      }}</NuxtLink>
      <NuxtLink v-if="!isProjectsPage" to="#about">{{
        $t("navigation.about")
      }}</NuxtLink>
      <NuxtLink v-if="!isProjectsPage" to="#contact">{{
        $t("navigation.contact")
      }}</NuxtLink>
      <NuxtLink v-if="isProjectsPage" to="/">Home</NuxtLink>
      <button
        @click="toggleTheme"
        :aria-label="getThemeLabel"
        id="theme-toggle-mobile"
      >
        {{ getThemeIcon }}
      </button>
      <button
        @click="toggleLanguage"
        aria-label="Toggle language"
        id="lang-toggle-mobile"
      >
        {{ currentLang === "cs" ? "EN" : "CS" }}
      </button>
    </nav>
  </header>
</template>

<script setup>
import "./header.scss";

const route = useRoute();
const { locale, setLocale } = useI18n();
const { toggleTheme, getThemeIcon, getThemeLabel, initializeTheme } =
  useTheme();

// Initialize theme on app start
onMounted(() => {
  initializeTheme();
});

const switchLocalePath = useSwitchLocalePath();
const isMobileMenuOpen = ref(false);

const currentLang = computed(() => locale.value);

const isProjectsPage = computed(
  () => route.path.includes("/projects/") || route.path.includes("/projekty/")
);

const toggleLanguage = () => {
  const newLocale = locale.value === "cs" ? "en" : "cs";
  const path = switchLocalePath(newLocale);
  if (path) {
    navigateTo(path, { replace: true });
  }
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuToggle && mobileMenu) {
    const expanded =
      menuToggle.getAttribute("aria-expanded") === "true" || false;
    menuToggle.setAttribute("aria-expanded", !expanded);
    menuToggle.classList.toggle("open");
    mobileMenu.setAttribute("aria-hidden", expanded);
  }
};
</script>
