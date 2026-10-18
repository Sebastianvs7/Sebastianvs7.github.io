<template>
  <div class="game-controls">
    <button
      v-if="phase === 'over'"
      type="button"
      class="game-button"
      @click="$emit('clear')"
    >
      {{ $t("gomoku.clear") }}
    </button>
    <button
      v-else-if="phase === 'playing'"
      type="button"
      class="game-button game-button--icon"
      :aria-label="$t('gomoku.quit')"
      @click="$emit('clear')"
    >
      <svg viewBox="0 0 12 12" aria-hidden="true">
        <path d="M2 2l8 8M10 2l-8 8" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { GamePhase } from "~/composables/useGomokuMatch";

interface GameControlsProps {
  phase: GamePhase;
}

defineProps<GameControlsProps>();

defineEmits<{
  clear: [];
}>();
</script>

<style scoped lang="scss" src="./game-controls.scss"></style>
