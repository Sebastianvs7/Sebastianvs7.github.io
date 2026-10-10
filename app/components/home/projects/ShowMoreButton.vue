<template>
  <div class="show-more-container">
    <button class="show-more-btn" @click="handleToggle">
      <span class="show-more-text" :class="{ hidden: showAllProjects }">
        {{ $t("projects.showMoreButton") }}
      </span>
      <span class="show-less-text" :class="{ hidden: !showAllProjects }">
        {{ $t("projects.showLessButton") }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
interface ShowMoreButtonProps {
  showAllProjects: boolean;
}

defineProps<ShowMoreButtonProps>();

const emit = defineEmits<{
  toggle: [];
}>();

const handleToggle = () => {
  emit("toggle");
};
</script>

<style scoped lang="scss" src="./show-more-button.scss"></style>
