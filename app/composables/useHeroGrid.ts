import { gsap } from "gsap";

import { appendDiv, getGridMetrics, HERO_BOX_SIZE } from "~/utils/heroGrid";
import type { GridMetrics, GridPoint } from "~/utils/heroGrid";

export interface GridBox extends GridPoint {
  el: HTMLDivElement;
  rotationOffset: number;
}

// A highlighted square that zig-zags horizontally across the grid
interface Highlight {
  col: number;
  direction: 1 | -1;
  el: HTMLDivElement;
  row: number;
  zig: 0 | 1 | 2;
}

export interface HeroGrid {
  boxes: ShallowRef<GridBox[]>;
  flashBox: (index: number) => void;
  gridMetrics: ShallowRef<GridMetrics | undefined>;
  hold: () => void;
  isCrossShown: (index: number) => boolean;
  pauseCrosses: () => void;
  release: () => void;
  resumeCrosses: () => void;
}

const SPACING = 40;
const HOVER_RADIUS = 100;
const IDLE_DELAY = 2500;

// Animated box grid drawn imperatively into heroRef: swirl around the cursor,
// moving highlights and decorative crosses
export const useHeroGrid = (
  containerRef: Ref<HTMLElement | null>,
  heroRef: Ref<HTMLElement | null>
): HeroGrid => {
  const colorMode = useColorMode();
  const isDark = computed(() => colorMode.value === "dark");

  const boxes = shallowRef<GridBox[]>([]);
  const gridMetrics = shallowRef<GridMetrics>();

  // Imperative animation state, never rendered
  let crossElements: HTMLDivElement[] = [];
  let highlights: Highlight[] = [];
  let timelines: gsap.core.Timeline[] = [];
  let cursor = { x: 0, y: 0 };
  let swirlAngle = 0;
  let isIdle = false;
  // Held while the finale plays, so nothing resumes the hidden grid
  let isHeld = false;
  let areCrossesPaused = false;
  let idleTimer: ReturnType<typeof setTimeout> | undefined;
  let startTimer: ReturnType<typeof setTimeout> | undefined;
  let intersectionObserver: IntersectionObserver | undefined;

  const initializeGrid = () => {
    const hero = heroRef.value;
    if (!hero) return;

    const grid = getGridMetrics(hero.offsetWidth, hero.offsetHeight, SPACING);
    gridMetrics.value = grid;

    const nextBoxes: GridBox[] = [];
    for (let y = 0; y < grid.rows; y++) {
      for (let x = 0; x < grid.cols; x++) {
        const box = appendDiv(hero, "rect");
        const leftPos = grid.offsetX + x * grid.spacingX;
        const topPos = grid.offsetY + y * grid.spacingY;
        box.style.left = `${leftPos}px`;
        box.style.top = `${topPos}px`;
        nextBoxes.push({
          el: box,
          rotationOffset: Math.random() * 360,
          x: leftPos,
          y: topPos,
        });
      }
    }
    boxes.value = nextBoxes;

    cursor = { x: hero.offsetWidth / 2, y: hero.offsetHeight / 2 };
    isIdle = false;
    swirlAngle = 0;

    resetIdleTimer();

    // First highlight starts in the top-left cell and moves right
    const firstHighlight: Highlight = {
      col: 0,
      direction: 1,
      el: appendDiv(hero, "highlight"),
      row: Math.floor(grid.rows / 2),
      zig: 0,
    };

    // Second highlight starts on the right, lower in the grid, and moves left
    const secondHighlight: Highlight = {
      col: grid.cols - 1,
      direction: -1,
      el: appendDiv(hero, "highlight", "highlight-2"),
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

    crossElements = nextBoxes.map((box) => {
      const cross = appendDiv(hero, "cross");
      cross.style.left = `${box.x + 1}px`;
      cross.style.top = `${box.y + 1}px`;
      cross.textContent = "×";
      return cross;
    });
  };

  const setupTimelines = () => {
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
  };

  const resumeTimelines = () => {
    if (isHeld) return;
    timelines.forEach((timeline) => timeline.resume());
  };

  const resumeTimelinesIfVisible = () => {
    const rect = containerRef.value?.getBoundingClientRect();
    if (rect && rect.top < window.innerHeight && rect.bottom > 0) {
      resumeTimelines();
    }
  };

  const pauseTimelines = () => {
    timelines.forEach((timeline) => timeline.pause());
  };

  const animateGridFrame = () => {
    if (isIdle) return;

    swirlAngle += 0.03;
    for (const { el, x, y, rotationOffset } of boxes.value) {
      const dx = cursor.x - (x + HERO_BOX_SIZE / 2);
      const dy = cursor.y - (y + HERO_BOX_SIZE / 2);
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
  };

  const createHighlightTimeline = (
    highlight: Highlight
  ): gsap.core.Timeline => {
    const timeline = gsap.timeline({ paused: true, repeat: -1 });

    timeline.call(() => {
      const hero = heroRef.value;
      if (!hero) return;

      const grid = getGridMetrics(hero.offsetWidth, hero.offsetHeight, SPACING);

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
  };

  const setupIntersectionObserver = () => {
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
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      pauseTimelines();
      hideActiveCrosses();
      return;
    }

    // Page is visible again - resume only when the hero is in the viewport
    resumeTimelinesIfVisible();
  };

  const hideActiveCrosses = () => {
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
  };

  const handleMouseMove = (e: MouseEvent) => {
    const rect = containerRef.value?.getBoundingClientRect();
    if (!rect) return;

    cursor.x = e.clientX - rect.left;
    cursor.y = e.clientY - rect.top;
    resetIdleTimer();
  };

  const resetIdleTimer = () => {
    isIdle = false;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      isIdle = true;
      boxes.value.forEach(({ el }) => {
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
  };

  const showRandomCrosses = () => {
    if (areCrossesPaused) return;

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
  };

  // Marks the box more strongly for a moment
  const flashBox = (index: number) => {
    const el = boxes.value[index]?.el;
    if (!el) return;

    el.classList.add("is-flashing");
    el.addEventListener(
      "animationend",
      () => el.classList.remove("is-flashing"),
      { once: true }
    );
  };

  // Whether the box's decorative cross is showing right now
  const isCrossShown = (index: number) =>
    crossElements[index]?.dataset.active === "true";

  const hold = () => {
    isHeld = true;
    pauseTimelines();
  };

  const release = () => {
    isHeld = false;
    if (!document.hidden) resumeTimelinesIfVisible();
  };

  // Decorative crosses would read as computer moves during a game
  const pauseCrosses = () => {
    areCrossesPaused = true;
    hideActiveCrosses();
  };

  const resumeCrosses = () => {
    areCrossesPaused = false;
  };

  onMounted(() => {
    // Wait a bit for the layout to settle before measuring
    startTimer = setTimeout(() => {
      initializeGrid();

      // Keep only the static grid for users preferring reduced motion
      const isReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (isReducedMotion) return;

      window.addEventListener("mousemove", handleMouseMove);
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

  return {
    boxes,
    flashBox,
    gridMetrics,
    hold,
    isCrossShown,
    pauseCrosses,
    release,
    resumeCrosses,
  };
};
