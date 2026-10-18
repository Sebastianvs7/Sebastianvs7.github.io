<template>
  <div
    id="showAnimation"
    ref="containerRef"
    :class="{ 'is-playing': game, 'is-finale': isGridAway }"
    :style="revealStyle"
  >
    <div
      ref="heroRef"
      class="hero"
      :class="{ 'is-clickable': isHoverPlayable }"
      @click="handleHeroClick"
      @pointermove="handleHeroPointerMove"
    />
    <ProjectHeroGameLayer
      v-if="game"
      :marks="marks"
      :strike="strike"
      @strike-end="handleStrikeEnd"
    />
    <ProjectHeroScoreboard v-if="isScoreVisible" :score="score" />
    <span role="status" class="visually-hidden">
      {{ resultKey ? $t(resultKey) : "" }}
    </span>
    <ProjectHeroGameControls :phase="phase" @clear="handleGameClear" />
    <Teleport to="body">
      <ProjectHeroFinale
        v-if="finaleStart"
        v-bind="finaleStart"
        @covered="handleGameClear"
        @done="handleFinaleDone"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const containerRef = ref<HTMLElement | null>(null);
const heroRef = ref<HTMLElement | null>(null);

const grid = useHeroGrid(containerRef, heroRef);
const {
  finaleStart,
  game,
  isGridAway,
  isHoverPlayable,
  isScoreVisible,
  marks,
  phase,
  resultKey,
  revealStyle,
  score,
  strike,
  handleFinaleDone,
  handleGameClear,
  handleHeroClick,
  handleHeroPointerMove,
  handleStrikeEnd,
} = useGomokuMatch(heroRef, grid);
</script>

<style scoped lang="scss" src="./project-hero.scss"></style>
