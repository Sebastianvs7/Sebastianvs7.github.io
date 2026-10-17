<template>
  <div ref="rootRef" class="finale" aria-hidden="true" />
</template>

<script setup lang="ts">
import { gsap } from "gsap";

interface FinaleProps {
  // Viewport positions of the hero grid boxes the finale starts from
  from: readonly { x: number; y: number }[];
}

const BOX_SIZE = 26;
const SPLASH_COUNT = 24;

const props = defineProps<FinaleProps>();
const emit = defineEmits<{
  // The site is fully covered, so the page can reset unseen
  covered: [];
  done: [];
}>();

const rootRef = ref<HTMLElement | null>(null);
let timeline: gsap.core.Timeline | undefined;

onMounted(() => {
  const root = rootRef.value;
  if (!root) return;

  const { innerHeight: height, innerWidth: width } = window;
  const random = gsap.utils.random;

  const boxes = props.from.map(({ x, y }) => {
    const box = createElement(root, "finale-box");
    gsap.set(box, { x, y });
    return box;
  });
  const wipe = createElement(root, "finale-wipe");
  const splashes = Array.from({ length: SPLASH_COUNT }, (_, i) => {
    if (i % 2 === 0) return createElement(root, "finale-splash");
    const cross = createElement(root, "finale-splash", "finale-splash--cross");
    cross.textContent = "×";
    return cross;
  });

  timeline = gsap.timeline({ onComplete: () => emit("done") });

  // 1. The grid goes wild across the whole screen
  timeline.to(boxes, {
    x: () => random(0, width - BOX_SIZE),
    y: () => random(0, height - BOX_SIZE),
    rotation: () => random(-720, 720),
    scale: () => random(0.5, 2),
    duration: 1.4,
    ease: "power2.inOut",
    stagger: { amount: 0.3, from: "random" },
  });

  // 2. The background colour sweeps over the whole site
  timeline.fromTo(
    wipe,
    { scaleX: 0 },
    { scaleX: 1, duration: 0.7, ease: "power2.inOut" },
    "-=0.3"
  );
  timeline.set(boxes, { opacity: 0 });
  timeline.call(() => emit("covered"));

  // 3. Splashes of crosses and squares run along the bottom
  timeline.fromTo(
    splashes,
    {
      x: -60,
      y: () => height - random(40, 160),
      rotation: 0,
      opacity: 1,
    },
    {
      x: width + 60,
      rotation: () => random(-360, 360),
      duration: 1.6,
      ease: "none",
      stagger: { amount: 0.6, from: "random" },
    }
  );
  timeline.to(
    splashes,
    {
      y: "-=40",
      duration: 0.4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: 3,
      stagger: { amount: 0.6, from: "random" },
    },
    "<"
  );

  // 4. Everything returns: the colour pulls back to the right
  timeline.set(wipe, { transformOrigin: "right center" });
  timeline.to(wipe, { scaleX: 0, duration: 0.6, ease: "power2.inOut" });
});

onUnmounted(() => {
  timeline?.kill();
});

function createElement(root: HTMLElement, ...classNames: string[]) {
  const el = document.createElement("div");
  el.classList.add(...classNames);
  root.appendChild(el);
  return el;
}
</script>

<style scoped lang="scss">
// Above the sticky header (z-index 1100)
.finale {
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  position: fixed;
  z-index: 1200;
}

// Finale elements are created imperatively, so they carry no scope attribute

.finale :deep(.finale-box) {
  border: 1px solid rgba(var(--color-accent-rgb), 0.5);
  border-radius: 3px;
  height: 26px;
  left: 0;
  position: absolute;
  top: 0;
  width: 26px;
}

.finale :deep(.finale-wipe) {
  background: var(--color-bg);
  border-right: 4px solid var(--color-accent);
  inset: 0;
  position: absolute;
  transform: scaleX(0);
  transform-origin: left center;
}

.finale :deep(.finale-splash) {
  border: 2px solid var(--color-accent);
  border-radius: 3px;
  height: 22px;
  left: 0;
  opacity: 0;
  position: absolute;
  top: 0;
  width: 22px;
}

.finale :deep(.finale-splash--cross) {
  align-items: center;
  border: none;
  color: var(--color-accent);
  display: flex;
  font-size: 32px;
  justify-content: center;
}
</style>
