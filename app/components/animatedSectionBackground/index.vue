<template>
  <div
    id="showAnimation"
    ref="containerRef"
    :class="{ 'is-playing': game, 'is-finale': finaleFrom }"
    :style="revealStyle"
  >
    <div
      ref="heroRef"
      class="hero"
      :class="{ 'is-clickable': isHoverPlayable }"
    />
    <div v-if="game" class="game-layer" aria-hidden="true">
      <span
        v-if="flash"
        :key="flash.id"
        class="cell-flash"
        :style="{ left: `${flash.x}px`, top: `${flash.y}px` }"
      />
      <span
        v-for="mark in marks"
        :key="mark.index"
        class="mark"
        :class="[`mark--${mark.mark}`, { 'mark--win': mark.winOrder !== -1 }]"
        :style="{
          left: `${mark.x}px`,
          top: `${mark.y}px`,
          '--win-order': mark.winOrder,
        }"
      >
        <svg viewBox="0 0 26 26">
          <circle v-if="mark.mark === 'o'" cx="13" cy="13" r="7" pathLength="1" />
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
        @animationend="handleStrikeEnd"
      />
    </div>
    <div v-if="isScoreVisible" class="scoreboard">
      <span v-for="side in SCORE_SIDES" :key="side.key" class="score">
        {{ $t(side.labelKey) }}
        <span class="tally" aria-hidden="true">
          <span v-for="win in score[side.key]" :key="win" class="tally-mark" />
        </span>
        <span class="visually-hidden">{{ score[side.key] }}</span>
      </span>
    </div>
    <span role="status" class="visually-hidden">
      {{ resultKey ? $t(resultKey) : "" }}
    </span>
    <div class="game-controls">
      <button
        v-if="resultKey"
        type="button"
        class="game-button"
        @click="handleGameClear"
      >
        {{ $t("game.clear") }}
      </button>
      <button
        v-else-if="game"
        type="button"
        class="game-button game-button--icon"
        :aria-label="$t('game.stop')"
        @click="handleGameClear"
      >
        <svg viewBox="0 0 12 12" aria-hidden="true">
          <path d="M2 2l8 8M10 2l-8 8" />
        </svg>
      </button>
    </div>
    <Teleport to="body">
      <AnimatedSectionBackgroundFinale
        v-if="finaleFrom"
        :from="finaleFrom"
        @done="handleFinaleDone"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { gsap } from "gsap";

import { computerMove, createGame, playerMove } from "~/utils/gomoku";
import type { GomokuGame, GomokuMark, GomokuStatus } from "~/utils/gomoku";

interface GridBox {
  el: HTMLDivElement;
  rotationOffset: number;
  x: number;
  y: number;
}

interface GridMetrics {
  cols: number;
  offsetX: number;
  offsetY: number;
  rows: number;
  spacingX: number;
  spacingY: number;
}

interface CellFlash {
  id: number;
  x: number;
  y: number;
}

interface GameMarkView {
  index: number;
  mark: GomokuMark;
  // Position in the winning line, -1 for marks outside it
  winOrder: number;
  x: number;
  y: number;
}

interface Score {
  computer: number;
  player: number;
}

interface ScoreSide {
  key: keyof Score;
  labelKey: string;
}

interface StrikeLine {
  angle: number;
  length: number;
  x: number;
  y: number;
}

// A highlighted square that zig-zags horizontally across the grid
interface Highlight {
  col: number;
  direction: 1 | -1;
  el: HTMLDivElement;
  row: number;
  zig: 0 | 1 | 2;
}

const BOX_SIZE = 26;
const SPACING = 40;
const HOVER_RADIUS = 100;
const IDLE_DELAY = 2500;
const CLICK_THROTTLE_DELAY = 500;

// Click animation settings
const MOUSE_MOVE_THRESHOLD = 500; // Time in ms to consider mouse as "not moving"
const EXPLOSION_RADIUS_MOVING = 150;
const EXPLOSION_RADIUS_STATIONARY = 150;

// Pause before the computer answers, so its move reads as a reply
const COMPUTER_MOVE_DELAY = 400;
// Win reveal timing in seconds, keep in sync with styles.scss
const SWIRL_STAGGER = 0.1;
const SWIRL_DURATION = 0.6;
const STRIKE_DURATION = 0.35;
// Wins that end a match, then the score starts over
const FINALE_WINS = 5;
const SCORE_SIDES: readonly ScoreSide[] = [
  { key: "player", labelKey: "game.you" },
  { key: "computer", labelKey: "game.computer" },
];
const GAME_RESULT_KEYS: Partial<Record<GomokuStatus, string>> = {
  draw: "game.draw",
  lost: "game.lost",
  won: "game.won",
};

const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");

const containerRef = ref<HTMLElement | null>(null);
const heroRef = ref<HTMLElement | null>(null);

// null while the game is off; the board maps 1:1 onto `boxes`
const game = shallowRef<GomokuGame | null>(null);
// Set once the game has ended, so it also tells whether it has
const resultKey = computed(() =>
  game.value ? GAME_RESULT_KEYS[game.value.status] : undefined
);
const flash = shallowRef<CellFlash | null>(null);
// Viewport positions of the boxes while the five-win finale plays
const finaleFrom = shallowRef<{ x: number; y: number }[] | null>(null);
const score = ref<Score>({ computer: 0, player: 0 });
const isScoreVisible = computed(
  () => game.value !== null || score.value.computer + score.value.player > 0
);
const hoverIndex = ref(-1);
const isHoverPlayable = computed(() => {
  if (hoverIndex.value === -1) return false;
  if (!game.value) return true;
  return (
    game.value.status === "playerTurn" &&
    game.value.board[hoverIndex.value] === null
  );
});
const marks = computed<GameMarkView[]>(() => {
  const current = game.value;
  if (!current) return [];

  return current.board.flatMap((mark, index) => {
    const box = boxes[index];
    if (!mark || !box) return [];
    const winOrder = current.winningLine.indexOf(index);
    return [{ index, mark, winOrder, x: box.x, y: box.y }];
  });
});
// Runs from half a box before the first winning centre to half a box past the last
const strike = computed<StrikeLine | null>(() => {
  const line = game.value?.winningLine ?? [];
  const [firstIndex] = line;
  const lastIndex = line.at(-1);
  if (firstIndex === undefined || lastIndex === undefined) return null;
  const first = boxes[firstIndex];
  const last = boxes[lastIndex];
  if (!first || !last) return null;

  const angle = Math.atan2(last.y - first.y, last.x - first.x);
  const overshoot = BOX_SIZE / 2;
  return {
    angle,
    length: Math.hypot(last.x - first.x, last.y - first.y) + BOX_SIZE,
    x: first.x + overshoot - Math.cos(angle) * overshoot,
    y: first.y + overshoot - Math.sin(angle) * overshoot,
  };
});
// The strike waits for the last swirl, Clear waits for the strike
const revealStyle = computed(() => {
  const count = game.value?.winningLine.length ?? 0;
  if (count === 0) return {};

  const strikeDelay = (count - 1) * SWIRL_STAGGER + SWIRL_DURATION;
  return {
    "--reveal-delay": `${strikeDelay + STRIKE_DURATION}s`,
    "--strike-delay": `${strikeDelay}s`,
  };
});

// Imperative animation state, never rendered
let boxes: GridBox[] = [];
let crossElements: HTMLDivElement[] = [];
let highlights: Highlight[] = [];
let timelines: gsap.core.Timeline[] = [];
let cursor = { x: 0, y: 0 };
let swirlAngle = 0;
let isIdle = false;
let isMouseMoving = false;
let lastMouseMoveTime = 0;
let lastClickTime = 0;
let idleTimer: ReturnType<typeof setTimeout> | undefined;
let startTimer: ReturnType<typeof setTimeout> | undefined;
let intersectionObserver: IntersectionObserver | undefined;
let gridMetrics: GridMetrics | undefined;
let isReducedMotion = false;
let computerMoveTimer: ReturnType<typeof setTimeout> | undefined;
let flashId = 0;

onMounted(() => {
  // Wait a bit for the layout to settle before measuring
  startTimer = setTimeout(() => {
    initializeAnimation();
    // Registered before the reduced-motion exit, so everyone can play
    heroRef.value?.addEventListener("click", handleClick);
    heroRef.value?.addEventListener("pointermove", handleHeroPointerMove);

    // Keep only the static grid for users preferring reduced motion
    isReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (isReducedMotion) return;

    setupInteraction();
    setupTimelines();
    setupIntersectionObserver();
    document.addEventListener("visibilitychange", handleVisibilityChange);
  }, 100);
});

onUnmounted(() => {
  clearTimeout(startTimer);
  clearTimeout(idleTimer);
  clearTimeout(computerMoveTimer);
  timelines.forEach((timeline) => timeline.kill());
  intersectionObserver?.disconnect();

  window.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("visibilitychange", handleVisibilityChange);
});

// Spread whole cells evenly over the hero area
function getGridMetrics(hero: HTMLElement): GridMetrics {
  const width = hero.offsetWidth;
  const height = hero.offsetHeight;
  const cols = Math.ceil(width / SPACING);
  const rows = Math.ceil(height / SPACING);
  const spacingX = width / cols;
  const spacingY = height / rows;

  return {
    cols,
    offsetX: (width - cols * spacingX) / 2,
    offsetY: (height - rows * spacingY) / 2,
    rows,
    spacingX,
    spacingY,
  };
}

function createElement(hero: HTMLElement, ...classNames: string[]) {
  const el = document.createElement("div");
  el.classList.add(...classNames);
  hero.appendChild(el);
  return el;
}

function initializeAnimation() {
  const hero = heroRef.value;
  if (!hero) return;

  const grid = getGridMetrics(hero);
  gridMetrics = grid;

  boxes = [];
  for (let y = 0; y < grid.rows; y++) {
    for (let x = 0; x < grid.cols; x++) {
      const box = createElement(hero, "rect");
      const leftPos = grid.offsetX + x * grid.spacingX;
      const topPos = grid.offsetY + y * grid.spacingY;
      box.style.left = `${leftPos}px`;
      box.style.top = `${topPos}px`;
      boxes.push({
        el: box,
        rotationOffset: Math.random() * 360,
        x: leftPos,
        y: topPos,
      });
    }
  }

  cursor = { x: hero.offsetWidth / 2, y: hero.offsetHeight / 2 };
  isIdle = false;
  isMouseMoving = false;
  lastMouseMoveTime = 0;
  swirlAngle = 0;

  resetIdleTimer();

  // First highlight starts in the top-left cell and moves right
  const firstHighlight: Highlight = {
    col: 0,
    direction: 1,
    el: createElement(hero, "highlight"),
    row: Math.floor(grid.rows / 2),
    zig: 0,
  };

  // Second highlight starts on the right, lower in the grid, and moves left
  const secondHighlight: Highlight = {
    col: grid.cols - 1,
    direction: -1,
    el: createElement(hero, "highlight", "highlight-2"),
    row: Math.floor(grid.rows * 0.75),
    zig: 0,
  };
  secondHighlight.el.style.left = `${
    grid.offsetX + secondHighlight.col * grid.spacingX
  }px`;
  secondHighlight.el.style.top = `${
    grid.offsetY + secondHighlight.row * grid.spacingY
  }px`;

  highlights = [firstHighlight, secondHighlight];

  crossElements = boxes.map((box) => {
    const cross = createElement(hero, "cross");
    cross.style.left = `${box.x + 1}px`;
    cross.style.top = `${box.y + 1}px`;
    cross.textContent = "×";
    return cross;
  });
}

function setupInteraction() {
  window.addEventListener("mousemove", handleMouseMove);
}

function setupTimelines() {
  const gridTimeline = gsap.timeline({ paused: true, repeat: -1 });
  gridTimeline.to(
    {},
    { duration: 0.016, repeat: -1, onRepeat: animateGridFrame }
  );

  const highlightTimelines = highlights.map(createHighlightTimeline);

  const crossTimeline = gsap.timeline({ paused: true, repeat: -1 });
  crossTimeline.call(showRandomCrosses);
  crossTimeline.to({}, { duration: 3.5 }); // Wait between cross appearances

  timelines = [gridTimeline, ...highlightTimelines, crossTimeline];
  resumeTimelines();
}

function resumeTimelines() {
  timelines.forEach((timeline) => timeline.resume());
}

function pauseTimelines() {
  timelines.forEach((timeline) => timeline.pause());
}

function animateGridFrame() {
  if (isIdle) return;

  swirlAngle += 0.03;
  for (const { el, x, y, rotationOffset } of boxes) {
    const dx = cursor.x - (x + BOX_SIZE / 2);
    const dy = cursor.y - (y + BOX_SIZE / 2);
    const dist = Math.sqrt(dx * dx + dy * dy);
    const effect = Math.max(0, 1 - dist / HOVER_RADIUS);

    if (effect > 0) {
      const angle = Math.atan2(dy, dx);
      const rotation =
        (swirlAngle * 180) / Math.PI + rotationOffset + effect * 50;
      const scale = 1 + effect * 0.3;
      const shadow = isDark.value
        ? `0 4px 8px rgba(212,201,179,${0.3 * effect})`
        : `0 4px 8px rgba(122,104,83,${0.3 * effect})`;
      const offsetX = Math.cos(angle + swirlAngle) * effect;
      const offsetY = Math.sin(angle + swirlAngle) * effect;

      gsap.to(el, {
        x: offsetX,
        y: offsetY,
        scale,
        rotation,
        boxShadow: shadow,
        duration: 0.1,
        ease: "sine.out",
      });
    } else {
      gsap.to(el, {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        boxShadow: "none",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }
}

function createHighlightTimeline(highlight: Highlight): gsap.core.Timeline {
  const timeline = gsap.timeline({ paused: true, repeat: -1 });

  timeline.call(() => {
    const hero = heroRef.value;
    if (!hero) return;

    const grid = getGridMetrics(hero);

    highlight.col += highlight.direction;

    // Zig-zag: up one row, down one row, then straight
    if (highlight.zig === 1) {
      highlight.row = Math.max(0, highlight.row - 1);
      highlight.zig = 2;
    } else if (highlight.zig === 2) {
      highlight.row = Math.min(grid.rows - 1, highlight.row + 1);
      highlight.zig = 0;
    } else {
      highlight.zig = 1;
    }

    // Bounce off the grid edges
    if (highlight.col >= grid.cols - 1) highlight.direction = -1;
    if (highlight.col <= 0) highlight.direction = 1;

    gsap.to(highlight.el, {
      left: `${grid.offsetX + highlight.col * grid.spacingX}px`,
      top: `${grid.offsetY + highlight.row * grid.spacingY}px`,
      duration: 2.2,
      ease: "power1.inOut",
    });
  });

  timeline.to({}, { duration: 2.4 }); // Wait between movements

  return timeline;
}

function setupIntersectionObserver() {
  if (!containerRef.value) return;

  // Only animate while the hero is visible
  intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !document.hidden) {
          resumeTimelines();
        } else {
          pauseTimelines();
        }
      });
    },
    { threshold: 0.1 }
  );

  intersectionObserver.observe(containerRef.value);
}

function handleVisibilityChange() {
  if (document.hidden) {
    pauseTimelines();
    hideActiveCrosses();
    return;
  }

  // Page is visible again - resume only when the hero is in the viewport
  const rect = containerRef.value?.getBoundingClientRect();
  if (rect && rect.top < window.innerHeight && rect.bottom > 0) {
    resumeTimelines();
  }
}

function hideActiveCrosses() {
  crossElements.forEach((cross) => {
    if (cross.dataset.active === "true") {
      gsap.to(cross, {
        opacity: 0,
        scale: 0.5,
        duration: 0.3,
        ease: "power2.out",
        // Kill the running fade-in, or it keeps the cross visible
        overwrite: true,
        onComplete: () => {
          cross.dataset.active = "false";
        },
      });
    }
  });
}

function handleMouseMove(e: MouseEvent) {
  const rect = containerRef.value?.getBoundingClientRect();
  if (!rect) return;

  cursor.x = e.clientX - rect.left;
  cursor.y = e.clientY - rect.top;
  resetIdleTimer();
  lastMouseMoveTime = Date.now();
  isMouseMoving = true;
}

function resetIdleTimer() {
  isIdle = false;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    isIdle = true;
    isMouseMoving = false;
    boxes.forEach(({ el }) => {
      gsap.to(el, {
        scale: 1,
        rotation: 0,
        x: 0,
        y: 0,
        boxShadow: "none",
        duration: 0.6,
        ease: "power2.out",
      });
    });
  }, IDLE_DELAY);
}

function showRandomCrosses() {
  // Decorative crosses would read as computer moves during a game
  if (game.value) return;

  const numToShow = 4 + Math.floor(Math.random() * 2);
  for (let i = 0; i < numToShow; i++) {
    const cross =
      crossElements[Math.floor(Math.random() * crossElements.length)];
    if (!cross || cross.dataset.active === "true") continue;
    cross.dataset.active = "true";

    gsap.fromTo(
      cross,
      { opacity: 0, scale: 0.6 },
      {
        opacity: 1,
        scale: 1,
        duration: 2,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(cross, {
            opacity: 0,
            delay: 1.5 + Math.random() * 2,
            duration: 1.5,
            scale: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
              cross.dataset.active = "false";
            },
          });
        },
      }
    );
  }
}

function handleClick(e: MouseEvent) {
  if (finaleFrom.value) return;

  // Playable cells belong to the game; the free last row keeps the explosion
  const index = getPlayableCellIndex(e);
  if (index !== -1) return handleGameMove(index);
  if (isReducedMotion) return;

  const currentTime = Date.now();

  // Throttle clicks - only allow one click per throttle delay
  if (currentTime - lastClickTime < CLICK_THROTTLE_DELAY) return;
  lastClickTime = currentTime;

  const rect = containerRef.value?.getBoundingClientRect();
  if (!rect) return;

  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  // Stationary clicks get a slower, stronger explosion
  const wasMouseMoving =
    currentTime - lastMouseMoveTime < MOUSE_MOVE_THRESHOLD && isMouseMoving;
  const explosionRadius = wasMouseMoving
    ? EXPLOSION_RADIUS_MOVING
    : EXPLOSION_RADIUS_STATIONARY;
  const animationDuration = wasMouseMoving ? 0.4 : 1;
  const animationEase = wasMouseMoving ? "power2.out" : "power3.out";
  const returnDuration = wasMouseMoving ? 0.4 : 1.5;
  const returnEase = wasMouseMoving
    ? "elastic.out(1,0.4)"
    : "elastic.out(1,0.3)";
  const forceMultiplier = wasMouseMoving ? 2 : 3;
  const shadowIntensity = wasMouseMoving ? 0.3 : 0.5;
  const shadowBlur = wasMouseMoving ? 10 : 15;
  const fadeDelay = wasMouseMoving ? 0.3 : 0.7;

  boxes.forEach(({ el, x, y }) => {
    const dx = x + BOX_SIZE / 2 - clickX;
    const dy = y + BOX_SIZE / 2 - clickY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist >= explosionRadius) return;

    const angle = Math.atan2(dy, dx);
    const force = (explosionRadius - dist) * forceMultiplier;

    // Animate away and back, darkening the box while it moves
    gsap.fromTo(
      el,
      { x: 0, y: 0 },
      {
        x: Math.cos(angle) * force,
        y: Math.sin(angle) * force,
        duration: animationDuration,
        ease: animationEase,
        onStart: () => {
          const darkerRgb = isDark.value ? "150, 140, 120" : "80, 65, 50";
          el.style.borderColor = `rgba(${darkerRgb}, 1)`;
          el.style.boxShadow = `0 0 ${shadowBlur}px rgba(${darkerRgb}, ${shadowIntensity})`;
        },
        onComplete: () => {
          gsap.to(el, {
            x: 0,
            y: 0,
            duration: returnDuration,
            ease: returnEase,
            onComplete: () => {
              // Fade back to the default color, then let CSS take over
              const defaultColor = isDark.value
                ? "rgba(212, 201, 179, 0.3)"
                : "rgba(122, 104, 83, 0.3)";
              gsap.to(el, {
                borderColor: defaultColor,
                boxShadow: "none",
                duration: 1,
                delay: fadeDelay,
                ease: "power2.out",
                onComplete: () => {
                  el.style.borderColor = "";
                  el.style.boxShadow = "";
                },
              });
            },
          });
        },
      }
    );
  });
}

// Index of the box nearest to the pointer, -1 outside the playable rows
function getPlayableCellIndex(e: MouseEvent): number {
  const rect = heroRef.value?.getBoundingClientRect();
  if (!rect || !gridMetrics) return -1;

  const { cols, offsetX, offsetY, rows, spacingX, spacingY } = gridMetrics;
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const col = Math.round((x - offsetX - BOX_SIZE / 2) / spacingX);
  const row = Math.round((y - offsetY - BOX_SIZE / 2) / spacingY);
  const isInside = col >= 0 && col < cols && row >= 0 && row < rows - 1;
  return isInside ? row * cols + col : -1;
}

function handleHeroPointerMove(e: PointerEvent) {
  hoverIndex.value = getPlayableCellIndex(e);
}

function handleGameMove(index: number) {
  if (!gridMetrics) return;

  const current = game.value ?? createHeroGame(gridMetrics);
  const next = playerMove(current, index);
  if (next === current) return;

  if (!game.value) hideActiveCrosses();
  const box = boxes[index];
  if (box) flash.value = { id: ++flashId, x: box.x, y: box.y };
  setGame(next);

  if (next.status !== "computerTurn") return;
  computerMoveTimer = setTimeout(() => {
    if (game.value) setGame(computerMove(game.value));
  }, COMPUTER_MOVE_DELAY);
}

// Every move goes through here, so each finished game scores exactly once
function setGame(next: GomokuGame) {
  game.value = next;
  if (next.status === "won") score.value.player++;
  if (next.status === "lost") score.value.computer++;
}

// Reduced motion never animates the strike, so it never gets the finale
function handleStrikeEnd() {
  if (score.value.player < FINALE_WINS) return;

  finaleFrom.value = boxes.map(({ el }) => {
    const rect = el.getBoundingClientRect();
    return { x: rect.left, y: rect.top };
  });
}

function handleFinaleDone() {
  finaleFrom.value = null;
  handleGameClear();
}

// Quit and Clear both return to the idle animation
function handleGameClear() {
  clearTimeout(computerMoveTimer);
  game.value = null;
  flash.value = null;

  const { computer, player } = score.value;
  if (Math.max(computer, player) >= FINALE_WINS) {
    score.value = { computer: 0, player: 0 };
  }
}

// The last row stays free for the game controls, so no move hides under them
function createHeroGame(grid: GridMetrics): GomokuGame {
  return createGame(grid.cols, grid.rows - 1);
}
</script>

<style scoped lang="scss" src="./styles.scss"></style>
