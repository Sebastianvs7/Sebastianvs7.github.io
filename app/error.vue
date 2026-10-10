<template>
  <div class="error-page">
    <h1>{{ error.statusCode }}</h1>
    <p>{{ message }}</p>
    <NuxtLink :to="localePath('index')" class="home-link">
      {{ $t("error.goHome") }}
    </NuxtLink>
  </div>
</template>

<script setup>
const props = defineProps({
  error: {
    type: Object,
    required: true,
  },
});

const { t } = useI18n();
const localePath = useLocalePath();

const message = computed(() =>
  props.error.statusCode === 404 ? t("error.notFound") : t("common.error")
);

useHead({
  title: computed(() => `${props.error.statusCode} - ${message.value}`),
});
</script>

<style scoped>
.error-page {
  font-family: "Inter", sans-serif;
  background-color: var(--color-bg);
  color: var(--color-accent);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  text-align: center;
  padding: 1rem;
}

h1 {
  font-size: 6rem;
  margin: 0;
}

p {
  font-size: 1.5rem;
  margin: 1rem 0 2rem;
}

.home-link {
  font-weight: 600;
  color: var(--color-text);
  text-decoration: none;
  border: 2px solid var(--color-accent);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.home-link:hover {
  background-color: var(--color-accent);
  color: var(--color-bg);
}
</style>
