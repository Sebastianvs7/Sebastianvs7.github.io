<template>
  <footer>&copy; {{ currentYear }} {{ $t("footer") }}</footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<style scoped lang="scss" src="./footer.scss"></style>
