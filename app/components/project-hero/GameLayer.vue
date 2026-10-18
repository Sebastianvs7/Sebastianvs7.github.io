<template>
  <div class="game-layer" aria-hidden="true">
    <span
      v-for="mark in marks"
      :key="mark.index"
      class="mark"
      :class="[`mark--${mark.player}`, { 'mark--win': mark.winOrder !== -1 }]"
      :style="{
        left: `${mark.x}px`,
        top: `${mark.y}px`,
        '--win-order': mark.winOrder,
      }"
    >
      <svg viewBox="0 0 26 26">
        <circle
          v-if="mark.player === 'o'"
          cx="13"
          cy="13"
          r="7"
          pathLength="1"
        />
        <template v-else>
          <line x1="7" y1="7" x2="19" y2="19" pathLength="1" />
          <line x1="19" y1="7" x2="7" y2="19" pathLength="1" />
        </template>
      </svg>
    </span>
    <span
      v-if="strike"
      class="strike-line"
      :style="{
        left: `${strike.x}px`,
        top: `${strike.y}px`,
        width: `${strike.length}px`,
        '--angle': `${strike.angle}rad`,
      }"
      @animationend.self="$emit('strikeEnd')"
    />
  </div>
</template>

<script setup lang="ts">
import type { GameMarkView } from "~/composables/useGomokuMatch";
import type { StrikeLine } from "~/utils/heroGrid";

interface GameLayerProps {
  marks: GameMarkView[];
  strike: StrikeLine | null;
}

defineProps<GameLayerProps>();

defineEmits<{
  strikeEnd: [];
}>();
</script>

<style scoped lang="scss" src="./game-layer.scss"></style>
