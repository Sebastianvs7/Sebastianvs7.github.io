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

<script setup>
const props = defineProps({
  showAllProjects: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["toggle"]);

const handleToggle = () => {
  emit("toggle");
};
</script>
