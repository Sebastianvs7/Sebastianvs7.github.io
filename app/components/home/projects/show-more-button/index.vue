<template>
  <div class="show-more-container">
    <button class="show-more-btn" @click="$emit('toggle')">
      <span class="show-more-text" :class="{ hidden: isExpanded }">
        {{ $t("projects.showMoreButton") }}
      </span>
      <span class="show-less-text" :class="{ hidden: !isExpanded }">
        {{ $t("projects.showLessButton") }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
interface ShowMoreButtonProps {
  isExpanded: boolean;
}

defineProps<ShowMoreButtonProps>();

defineEmits<{
  toggle: [];
}>();
</script>

<style scoped lang="scss" src="./show-more-button.scss"></style>
