<template>
  <NuxtPage />
</template>

<script setup>
// Global head configuration
const { locale } = useI18n();

const colorMode = useColorMode();

useHead({
  title: "Portfolio - Sebastian Šanda",
  htmlAttrs: {
    lang: computed(() => locale.value),
  },
  meta: [
    {
      name: "theme-color",
      content: computed(() =>
        colorMode.value === "dark" ? "#1e1e1e" : "#f5f0e6"
      ),
    },
  ],
});
</script>
