<template>
  <div id="showAnimation" ref="containerRef">
    <div ref="heroRef" class="hero" />
    <div v-if="game" class="game-layer" aria-hidden="true">
      <span
        v-for="mark in marks"
        :key="mark.index"
        class="mark"
        :class="[`mark--${mark.mark}`, { 'mark--win': mark.isWinning }]"
        :style="{ left: `${mark.x}px`, top: `${mark.y}px` }"
      />
    </div>
    <div class="game-controls">
      <span role="status" class="game-status">
        {{ game ? $t(GAME_STATUS_KEYS[game.status]) : "" }}
      </span>
      <button
        v-if="isGameOver"
        type="button"
        class="game-button"
        @click="handleGameRestart"
      >
        {{ $t("game.restart") }}
      </button>
      <button type="button" class="game-button" @click="handleGameToggle">
        {{ $t(game ? "game.stop" : "game.start") }}
      </button>
    </div>
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

interface GameMarkView {
  index: number;
  isWinning: boolean;
  mark: GomokuMark;
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
const GAME_STATUS_KEYS: Record<GomokuStatus, string> = {
  computerTurn: "game.hint",
  draw: "game.draw",
  lost: "game.lost",
  playerTurn: "game.hint",
  won: "game.won",
};

const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");

const containerRef = ref<HTMLElement | null>(null);
const heroRef = ref<HTMLElement | null>(null);

// null while the game is off; the board maps 1:1 onto `boxes`
const game = shallowRef<GomokuGame | null>(null);
const isGameOver = computed(() => {
  const status = game.value?.status;
  return status === "won" || status === "lost" || status === "draw";
});
const marks = computed<GameMarkView[]>(() => {
  const current = game.value;
  if (!current) return [];

  return current.board.flatMap((mark, index) => {
    const box = boxes[index];
    if (!mark || !box) return [];
    const isWinning = current.winningLine.includes(index);
    return [{ index, isWinning, mark, x: box.x, y: box.y }];
  });
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

onMounted(() => {
  // Wait a bit for the layout to settle before measuring
  startTimer = setTimeout(() => {
    initializeAnimation();
    // Registered before the reduced-motion exit, so everyone can play
    heroRef.value?.addEventListener("click", handleClick);

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
  // The game has its own turn guard, so it skips the explosion throttle
  if (game.value) return handleGameClick(e);
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

// Index of the box whose centre is nearest, -1 outside the grid
function getCellIndex(x: number, y: number): number {
  if (!gridMetrics) return -1;

  const { cols, offsetX, offsetY, rows, spacingX, spacingY } = gridMetrics;
  const col = Math.round((x - offsetX - BOX_SIZE / 2) / spacingX);
  const row = Math.round((y - offsetY - BOX_SIZE / 2) / spacingY);
  const isInside = col >= 0 && col < cols && row >= 0 && row < rows;
  return isInside ? row * cols + col : -1;
}

function handleGameClick(e: MouseEvent) {
  const rect = heroRef.value?.getBoundingClientRect();
  if (!rect || !game.value) return;

  const index = getCellIndex(e.clientX - rect.left, e.clientY - rect.top);
  if (index === -1) return;

  const next = playerMove(game.value, index);
  if (next === game.value) return;
  game.value = next;

  if (next.status !== "computerTurn") return;
  computerMoveTimer = setTimeout(() => {
    if (game.value) game.value = computerMove(game.value);
  }, COMPUTER_MOVE_DELAY);
}

function handleGameToggle() {
  if (game.value) {
    clearTimeout(computerMoveTimer);
    game.value = null;
    return;
  }
  if (!gridMetrics) return;

  game.value = createHeroGame(gridMetrics);
  hideActiveCrosses();
}

function handleGameRestart() {
  if (!gridMetrics) return;

  clearTimeout(computerMoveTimer);
  game.value = createHeroGame(gridMetrics);
}

// The last row stays free for the game controls, so no move hides under them
function createHeroGame(grid: GridMetrics): GomokuGame {
  return createGame(grid.cols, grid.rows - 1);
}
</script>

<style scoped lang="scss" src="./styles.scss"></style>
