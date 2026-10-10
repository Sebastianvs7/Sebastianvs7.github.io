<template>
  <div id="showAnimation" ref="containerRef">
    <div ref="heroRef" class="hero" />
  </div>
</template>

<script setup lang="ts">
import { gsap } from "gsap";

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

const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");

const containerRef = ref<HTMLElement | null>(null);
const heroRef = ref<HTMLElement | null>(null);

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

onMounted(() => {
  // Wait a bit for the layout to settle before measuring
  startTimer = setTimeout(() => {
    initializeAnimation();

    // Keep only the static grid for users preferring reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setupInteraction();
    setupTimelines();
    setupIntersectionObserver();
    document.addEventListener("visibilitychange", handleVisibilityChange);
  }, 100);
});

onUnmounted(() => {
  clearTimeout(startTimer);
  clearTimeout(idleTimer);
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
  heroRef.value?.addEventListener("click", handleClick);
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

    // Hide all visible crosses
    crossElements.forEach((cross) => {
      if (cross.dataset.active === "true") {
        gsap.to(cross, {
          opacity: 0,
          scale: 0.5,
          duration: 0.3,
          ease: "power2.out",
          onComplete: () => {
            cross.dataset.active = "false";
          },
        });
      }
    });
    return;
  }

  // Page is visible again - resume only when the hero is in the viewport
  const rect = containerRef.value?.getBoundingClientRect();
  if (rect && rect.top < window.innerHeight && rect.bottom > 0) {
    resumeTimelines();
  }
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
</script>

<style scoped lang="scss" src="./styles.scss"></style>
