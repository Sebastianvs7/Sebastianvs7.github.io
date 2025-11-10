<template>
  <footer>&copy; {{ currentYear }} {{ $t("footer") }}</footer>
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>
