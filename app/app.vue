<template>
  <!-- Loading Screen -->
  <div
    v-if="showLoadingScreen"
    id="loading-screen"
    :class="{ 'fade-out': !isLoading }"
  >
    <div class="spinner">
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
    </div>
  </div>

  <NuxtPage />
</template>

<script setup>
// Global head configuration
const { locale } = useI18n();

const isLoading = ref(true);
const showLoadingScreen = ref(true);

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

// Hide loading screen after page load
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
    // Wait for fade-out animation to complete, then hide the element
    setTimeout(() => {
      showLoadingScreen.value = false;
    }, 500); // Adjust timing to match your CSS transition duration
  }, 1000);
});
</script>
