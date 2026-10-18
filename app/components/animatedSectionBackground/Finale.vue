<template>
  <div ref="rootRef" class="finale" aria-hidden="true" />
</template>

<script setup lang="ts">
import { gsap } from "gsap";

import { appendDiv, HERO_BOX_SIZE } from "~/utils/heroGrid";
import type { GridPoint } from "~/utils/heroGrid";

interface FinaleHole {
  delay: number;
  el: SVGGElement;
  rotation: number;
  scale: number;
  x: number;
  y: number;
}

interface FinaleProps {
  // Viewport positions of the hero grid boxes the finale starts from and returns to
  from: readonly GridPoint[];
  // Viewport centre of the winning line, where the paint starts to dissolve
  origin: GridPoint;
}

// Free space between neighbouring drips, so each reads as its own shape
// while the edge between them stays short
const DRIP_GAP = { max: 24, min: 10 };
// Drips only lean a little, or their corners run into the neighbours
const DRIP_TILT = 8;
// Deepest a drip hangs below the edge, so the paint starts fully off screen
const DRIP_EXTENT = 200;
// Plus outline on a 100 × 100 canvas, one path so a hollow cross has no inner lines
const CROSS_PATH = "M36 4h28v32h32v28H64v32H36V64H4V36h32z";
// Drip outlines on a 100 × 100 canvas
const DRIP_SHAPES = {
  cross: `<path transform="rotate(45 50 50)" d="${CROSS_PATH}" />`,
  square: '<rect x="6" y="6" width="88" height="88" rx="16" />',
};

// Holes that dissolve the paint, centred on 0,0 and 100 units across
const HOLE_SHAPES = [
  '<circle r="46" />',
  `<path transform="rotate(45) translate(-50 -50)" d="${CROSS_PATH}" />`,
  '<rect x="-44" y="-44" width="88" height="88" rx="16" />',
];
// Distance between hole centres; each grows well past it so the holes merge
const HOLE_SPACING = 110;
// Seconds for the dissolve; holes start in a wave over HOLE_DELAY and grow for the rest
const DISSOLVE_DURATION = 2;
const HOLE_DELAY = 0.9;
// Random part of each hole's start, so the wave front is not a perfect circle
const HOLE_JITTER = 0.1;
// Each grid box drops back in this long after the wave reaches it
const DROP_LAG = 0.15;
const DROP_DURATION = 0.6;

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
  const waveDelay = createWaveDelay(props.origin, width, height);

  // GSAP tweens real colours, not var(), so read the paint colour once
  const paintColor = getComputedStyle(root).getPropertyValue("--color-accent");
  const boxes = props.from.map(({ x, y }) => {
    const box = appendDiv(root, "finale-box");
    gsap.set(box, { x, y });
    return box;
  });
  const paint = appendDiv(root, "finale-paint");
  // Drips sit side by side across the whole width, never overlapping
  const drips: { drip: HTMLElement; hang: number }[] = [];
  for (let i = 0, left = random(-30, 0); left < width; i++) {
    const shape = i % 2 === 0 ? "square" : "cross";
    const drip = appendDiv(paint, "finale-drip", `finale-drip--${shape}`);
    // Every third drip is only an outline, always big so the outline reads
    const isHollow = i % 3 === 2;
    if (isHollow) drip.classList.add("finale-drip--hollow");
    drip.innerHTML = `<svg viewBox="0 0 100 100">${DRIP_SHAPES[shape]}</svg>`;
    // The rest mostly mid-sized, some of them really big too
    const isBig = isHollow || Math.random() < 0.3;
    const size = isBig ? random(130, 200) : random(60, 100);
    drip.style.left = `${left + size / 2}px`;
    drip.style.setProperty("--size", `${size}px`);
    // Starts hidden inside the paint, then sags well out of it; outlines
    // come out almost whole, or they read as brackets
    gsap.set(drip, { rotation: random(-DRIP_TILT, DRIP_TILT), y: -size });
    const hidden = isHollow ? random(0.08, 0.16) : random(0.15, 0.45);
    drips.push({ drip, hang: -size * hidden });
    left += size + random(DRIP_GAP.min, DRIP_GAP.max);
  }

  timeline = gsap.timeline({ onComplete: () => emit("done") });

  // 1. The grid goes wild across the whole screen
  timeline.to(boxes, {
    x: () => random(0, width - HERO_BOX_SIZE),
    y: () => random(0, height - HERO_BOX_SIZE),
    rotation: () => random(-720, 720),
    scale: () => random(0.5, 2),
    // Darkens from the faint grid border, so the flying boxes stand out
    borderColor: paintColor,
    duration: 1.4,
    ease: "power2.inOut",
    stagger: { amount: 0.3, from: "random" },
  });

  // ...then shoots up out of sight, turning into the paint on the way
  timeline.to(boxes, {
    y: () => -random(120, 320),
    scale: () => random(1, 2.5),
    backgroundColor: paintColor,
    borderColor: paintColor,
    duration: 0.7,
    ease: "power2.in",
    stagger: { amount: 0.3, from: "random" },
  });

  // 2. That paint runs down from the top, its drips sagging out of the edge
  timeline.fromTo(
    paint,
    { y: -(height + DRIP_EXTENT) },
    { y: 0, duration: 1.1, ease: "power1.in" },
    // Starts while the last boxes fly up, its edge arrives right after them
    "-=0.35"
  );
  timeline.to(
    drips.map(({ drip }) => drip),
    {
      y: (i: number) => drips[i]?.hang ?? 0,
      duration: 0.5,
      ease: "sine.out",
      stagger: { amount: 0.25, from: "random" },
    },
    "<"
  );
  timeline.set(boxes, { opacity: 0 });
  timeline.call(() => emit("covered"));

  // 3. Everything returns: see-through circles, crosses and squares open in
  // the paint in a wave from the winning line and grow until it is gone
  const dissolve = { progress: 0 };
  let holes: FinaleHole[] = [];
  let holeLayer: SVGSVGElement | null = null;
  timeline.addLabel("dissolve", "+=0.4");
  timeline.call(
    () => {
      const layer = appendDiv(root, "finale-holes-layer");
      holes = createHoles(layer, width, height, waveDelay);
      holeLayer = layer.querySelector("svg");
      // The masked copy lines up exactly with the solid paint it replaces
      paint.style.visibility = "hidden";
    },
    undefined,
    "dissolve"
  );
  timeline.to(
    dissolve,
    {
      progress: 1,
      duration: DISSOLVE_DURATION,
      ease: "none",
      onUpdate: () => {
        renderHoles(holes, dissolve.progress);
        // The last of the paint between the holes fades out
        if (holeLayer) {
          holeLayer.style.opacity = `${Math.min(1, (1 - dissolve.progress) * 4)}`;
        }
      },
    },
    "dissolve"
  );

  // ...and behind the wave the grid drops back onto its places, under the
  // paint, so the real grid can take over unnoticed once it is gone
  timeline.set(
    boxes,
    { clearProps: "backgroundColor,borderColor" },
    "dissolve"
  );
  timeline.fromTo(
    boxes,
    {
      x: (i: number) => props.from[i]?.x ?? 0,
      y: (i: number) => (props.from[i]?.y ?? 0) - random(80, 160),
      rotation: () => random(-90, 90),
      scale: 0.4,
      opacity: 0,
    },
    {
      // In the to-vars, or the copies turn invisible right away, not when they drop
      immediateRender: false,
      x: (i: number) => props.from[i]?.x ?? 0,
      y: (i: number) => props.from[i]?.y ?? 0,
      rotation: 0,
      scale: 1,
      opacity: 1,
      duration: DROP_DURATION,
      ease: "back.out(1.7)",
      // A function stagger gives each box its own start
      stagger: (i: number) => {
        const { x, y } = props.from[i] ?? props.origin;
        return (
          waveDelay(x + HERO_BOX_SIZE / 2, y + HERO_BOX_SIZE / 2) + DROP_LAG
        );
      },
    },
    "dissolve"
  );
});

// Seconds until the dissolve wave reaches a point, growing with its distance
// from the origin up to the farthest screen corner
function createWaveDelay(origin: GridPoint, width: number, height: number) {
  const farthest = Math.max(
    Math.hypot(origin.x, origin.y),
    Math.hypot(width - origin.x, origin.y),
    Math.hypot(origin.x, height - origin.y),
    Math.hypot(width - origin.x, height - origin.y)
  );
  return (x: number, y: number) =>
    Math.min(1, Math.hypot(x - origin.x, y - origin.y) / farthest) *
    (HOLE_DELAY - HOLE_JITTER);
}

function createHoles(
  layer: HTMLElement,
  width: number,
  height: number,
  waveDelay: (x: number, y: number) => number
): FinaleHole[] {
  const random = gsap.utils.random;
  const centres: { x: number; y: number }[] = [];
  for (let y = 0; y < height + HOLE_SPACING; y += HOLE_SPACING) {
    for (let x = 0; x < width + HOLE_SPACING; x += HOLE_SPACING) {
      centres.push({ x: x + random(-30, 30), y: y + random(-30, 30) });
    }
  }

  const maskId = `finale-holes-${Math.round(Math.random() * 1e9)}`;
  const shapes = centres
    .map((_, i) => `<g class="finale-hole">${HOLE_SHAPES[i % 3]}</g>`)
    .join("");
  layer.innerHTML = `<svg class="finale-holes" width="${width}" height="${height}">
    <mask id="${maskId}"><rect width="100%" height="100%" fill="white" />${shapes}</mask>
    <rect class="finale-holes-paint" width="100%" height="100%" mask="url(#${maskId})" />
  </svg>`;

  const elements = layer.querySelectorAll<SVGGElement>(".finale-hole");
  return centres.flatMap((centre, i) => {
    const el = elements[i];
    if (!el) return [];
    return [
      {
        ...centre,
        delay: waveDelay(centre.x, centre.y) + random(0, HOLE_JITTER),
        el,
        rotation: random(0, 360),
        scale: (random(2.6, 3.4) * HOLE_SPACING) / 100,
      },
    ];
  });
}

// Each hole grows slowly at first, so its shape reads before it merges
const growEase = gsap.parseEase("sine.inOut");

function renderHoles(holes: FinaleHole[], progress: number) {
  const growTime = DISSOLVE_DURATION - HOLE_DELAY;
  for (const hole of holes) {
    const t = (progress * DISSOLVE_DURATION - hole.delay) / growTime;
    const grown = growEase(Math.min(1, Math.max(0, t)));
    hole.el.setAttribute(
      "transform",
      `translate(${hole.x} ${hole.y}) rotate(${hole.rotation}) scale(${grown * hole.scale})`
    );
  }
}

onUnmounted(() => {
  timeline?.kill();
});
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
  // Same as the real grid boxes, which they turn back into
  border: 1px solid rgba(var(--color-accent-rgb), 0.3);
  border-radius: 3px;
  height: 26px;
  left: 0;
  position: absolute;
  top: 0;
  width: 26px;
}

// The paint and its drips share the accent colour, so drips read as runs of it
.finale :deep(.finale-paint) {
  background: var(--color-accent);
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}

.finale :deep(.finale-drip) {
  height: var(--size);
  margin-left: calc(var(--size) * -0.5);
  position: absolute;
  top: 100%;
  width: var(--size);

  svg {
    display: block;
    fill: var(--color-accent);
    height: 100%;
    overflow: visible;
    stroke: var(--color-accent);
    stroke-linejoin: round;
    stroke-width: 4;
    width: 100%;
  }
}

.finale :deep(.finale-drip--hollow svg) {
  fill: none;
  stroke-width: 11;
}

.finale :deep(.finale-holes) {
  display: block;
  left: 0;
  position: absolute;
  top: 0;
}

.finale :deep(.finale-hole) {
  fill: black;
}

.finale :deep(.finale-holes-paint) {
  fill: var(--color-accent);
}
</style>
