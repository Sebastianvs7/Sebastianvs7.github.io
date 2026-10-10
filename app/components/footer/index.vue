<template>
  <footer>&copy; {{ currentYear }} {{ $t("footer") }}</footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>
