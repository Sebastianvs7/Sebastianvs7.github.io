<template>
  <div class="scoreboard">
    <span v-for="side in SCORE_SIDES" :key="side.key" class="score">
      {{ $t(side.labelKey) }}
      <span class="tally" aria-hidden="true">
        <span v-for="win in score[side.key]" :key="win" class="tally-mark" />
      </span>
      <span class="visually-hidden">{{ score[side.key] }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import type { MatchScore } from "~/composables/useGomokuMatch";

interface ScoreSide {
  key: keyof MatchScore;
  labelKey: string;
}

interface ScoreboardProps {
  score: MatchScore;
}

const SCORE_SIDES: readonly ScoreSide[] = [
  { key: "player", labelKey: "gomoku.you" },
  { key: "computer", labelKey: "gomoku.computer" },
];

defineProps<ScoreboardProps>();
</script>

<style scoped lang="scss" src="./scoreboard.scss"></style>
