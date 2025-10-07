<template>
  <div class="error-page">
    <h1>404</h1>
    <p>{{ $t("error.notFound") }}</p>
    <NuxtLink to="/" class="home-link">{{ $t("error.goHome") }}</NuxtLink>
  </div>
</template>

<script setup>
// Set the response code
setResponseStatus(404);

// Set page title
useHead({
  title: "404 - Page Not Found",
});
</script>

<style scoped>
.error-page {
  font-family: "Inter", sans-serif;
  background-color: #f5f0e6;
  color: #7a6853;
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
  color: #000;
  text-decoration: none;
  border: 2px solid #7a6853;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.home-link:hover {
  background-color: #7a6853;
  color: #f5f0e6;
}
</style>
