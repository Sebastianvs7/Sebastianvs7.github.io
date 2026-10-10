<template>
  <div
    ref="containerRef"
    :class="rootClassName"
    :style="containerStyle"
    role="region"
    :aria-label="ariaLabel"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div ref="trackRef" class="logoloop__track">
      <ul
        v-for="copyIndex in copyCount"
        :key="`copy-${copyIndex}`"
        :ref="copyIndex === 1 ? setSequenceRef : undefined"
        class="logoloop__list"
        role="list"
        :aria-hidden="copyIndex > 1"
      >
        <li
          v-for="(item, itemIndex) in logos"
          :key="`${copyIndex}-${itemIndex}`"
          class="logoloop__item"
          role="listitem"
        >
          <component
            :is="item.href ? 'a' : 'span'"
            v-bind="getWrapperAttributes(item)"
          >
            <img
              :src="item.src"
              :alt="item.alt"
              :title="item.title"
              loading="lazy"
              decoding="async"
              draggable="false"
            />
          </component>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ComponentPublicInstance } from "vue";
import type { LogoLoopItem } from "~/types/logo-loop";

interface LogoLoopProps {
  ariaLabel?: string;
  className?: string;
  direction?: "left" | "right";
  fadeOut?: boolean;
  fadeOutColor?: string;
  gap?: number;
  logoHeight?: number;
  // Undefined keeps the logo aspect ratio
  logoWidth?: number | string;
  logos: LogoLoopItem[];
  pauseOnHover?: boolean;
  scaleOnHover?: boolean;
  speed?: number;
  width?: number | string;
}

const ANIMATION_CONFIG = {
  SMOOTH_TAU: 0.25,
  MIN_COPIES: 2,
  COPY_HEADROOM: 2,
};

const props = withDefaults(defineProps<LogoLoopProps>(), {
  ariaLabel: "Partner logos",
  className: "",
  direction: "left",
  fadeOut: false,
  fadeOutColor: undefined,
  gap: 32,
  logoHeight: 40,
  logoWidth: undefined,
  pauseOnHover: true,
  scaleOnHover: false,
  speed: 120,
  width: "100%",
});

const containerRef = ref<HTMLElement | null>(null);
const trackRef = ref<HTMLElement | null>(null);
const seqRef = ref<HTMLElement | null>(null);
const seqWidth = ref(0);
const copyCount = ref(ANIMATION_CONFIG.MIN_COPIES);
const isHovered = ref(false);

// Animation loop state, never rendered
let offset = 0;
let velocity = 0;
let animationFrame: number | null = null;
let lastTimestamp: number | null = null;
let cleanupResizeObserver: (() => void) | null = null;

const setSequenceRef = (el: Element | ComponentPublicInstance | null) => {
  seqRef.value = el instanceof HTMLElement ? el : null;
};

const toCssLength = (value: number | string): string => {
  return typeof value === "number" ? `${value}px` : value;
};

const getWrapperAttributes = (item: LogoLoopItem): Record<string, string> => {
  if (!item.href) {
    return {};
  }

  return {
    "aria-label": item.alt,
    class: "logoloop__link",
    href: item.href,
    rel: "noreferrer noopener",
    target: "_blank",
  };
};

const targetVelocity = computed(() => {
  const magnitude = Math.abs(props.speed);
  const directionMultiplier = props.direction === "left" ? 1 : -1;
  const speedMultiplier = props.speed < 0 ? -1 : 1;
  return magnitude * directionMultiplier * speedMultiplier;
});

const cssVariables = computed(() => {
  const vars: Record<string, string> = {
    "--logoloop-gap": `${props.gap}px`,
    "--logoloop-logoHeight": `${props.logoHeight}px`,
  };
  if (props.logoWidth !== undefined) {
    vars["--logoloop-logoWidth"] = toCssLength(props.logoWidth);
  }
  if (props.fadeOutColor) {
    vars["--logoloop-fadeColor"] = props.fadeOutColor;
  }
  return vars;
});

const rootClassName = computed(() => {
  const classes = ["logoloop"];
  if (props.fadeOut) classes.push("logoloop--fade");
  if (props.scaleOnHover) classes.push("logoloop--scale-hover");
  if (props.className) classes.push(props.className);
  return classes.join(" ");
});

const containerStyle = computed(() => {
  return {
    width: toCssLength(props.width),
    ...cssVariables.value,
  };
});

const updateDimensions = () => {
  if (!containerRef.value || !seqRef.value) return;

  const containerWidth = containerRef.value.clientWidth;
  const sequenceWidth = seqRef.value.getBoundingClientRect().width;

  if (sequenceWidth > 0) {
    seqWidth.value = Math.ceil(sequenceWidth);
    const copiesNeeded =
      Math.ceil(containerWidth / sequenceWidth) +
      ANIMATION_CONFIG.COPY_HEADROOM;
    copyCount.value = Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded);
  }
};

const setupImageLoader = () => {
  if (!seqRef.value) return;

  const images = seqRef.value.querySelectorAll("img");
  if (images.length === 0) {
    updateDimensions();
    return;
  }

  let remainingImages = images.length;
  const handleImageLoad = () => {
    remainingImages -= 1;
    if (remainingImages === 0) {
      updateDimensions();
    }
  };

  images.forEach((img) => {
    if (img.complete) {
      handleImageLoad();
    } else {
      img.addEventListener("load", handleImageLoad, { once: true });
      img.addEventListener("error", handleImageLoad, { once: true });
    }
  });
};

const setupResizeObserver = (): (() => void) => {
  const elements = [containerRef.value, seqRef.value].filter(
    (element): element is HTMLElement => element !== null
  );
  const observer = new ResizeObserver(updateDimensions);
  elements.forEach((element) => observer.observe(element));

  updateDimensions();

  return () => observer.disconnect();
};

const normalizeOffset = (value: number): number => {
  return ((value % seqWidth.value) + seqWidth.value) % seqWidth.value;
};

const animate = (timestamp: number) => {
  if (lastTimestamp === null) {
    lastTimestamp = timestamp;
  }

  const deltaTime = Math.max(0, timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;

  const target =
    props.pauseOnHover && isHovered.value ? 0 : targetVelocity.value;
  const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
  velocity += (target - velocity) * easingFactor;

  if (seqWidth.value > 0 && trackRef.value) {
    offset = normalizeOffset(offset + velocity * deltaTime);
    trackRef.value.style.transform = `translate3d(${-offset}px, 0, 0)`;
  }

  animationFrame = requestAnimationFrame(animate);
};

const startAnimation = () => {
  if (!trackRef.value) return;

  if (seqWidth.value > 0) {
    offset = normalizeOffset(offset);
    trackRef.value.style.transform = `translate3d(${-offset}px, 0, 0)`;
  }

  animationFrame = requestAnimationFrame(animate);
};

const stopAnimation = () => {
  if (animationFrame !== null) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
  lastTimestamp = null;
};

const handleMouseEnter = () => {
  if (props.pauseOnHover) {
    isHovered.value = true;
  }
};

const handleMouseLeave = () => {
  if (props.pauseOnHover) {
    isHovered.value = false;
  }
};

watch(
  [
    () => props.logos,
    () => props.gap,
    () => props.logoHeight,
    () => props.logoWidth,
  ],
  () => {
    updateDimensions();
    setupImageLoader();
  }
);

watch(seqWidth, () => {
  if (seqWidth.value > 0) {
    stopAnimation();
    startAnimation();
  }
});

onMounted(() => {
  cleanupResizeObserver = setupResizeObserver();
  setupImageLoader();
  startAnimation();
});

onBeforeUnmount(() => {
  stopAnimation();
  cleanupResizeObserver?.();
});
</script>

<style lang="scss">
.logoloop {
  position: relative;
  overflow-x: hidden;

  --logoloop-gap: 60px;
  --logoloop-logoHeight: 40px;
  --logoloop-logoWidth: auto;
  --logoloop-fadeColorAuto: var(--color-bg);
}

.logoloop--scale-hover {
  padding-top: calc(var(--logoloop-logoHeight) * 0.1);
  padding-bottom: calc(var(--logoloop-logoHeight) * 0.1);
}

.logoloop__track {
  display: flex;
  width: max-content;
  will-change: transform;
  user-select: none;
}

.logoloop__list {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
}

.logoloop__item {
  flex: 0 0 auto;
  margin-right: var(--logoloop-gap);
  font-size: var(--logoloop-logoHeight);
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--logoloop-logoHeight);
  max-width: var(--logoloop-logoWidth);
}

.logoloop__item:last-child {
  margin-right: var(--logoloop-gap);
}

.logoloop__item img {
  width: 100%;
  // max-width: 100%;
  height: var(--logoloop-logoHeight);
  display: block;
  object-fit: contain;
  object-position: center;
  image-rendering: -webkit-optimize-contrast;
  -webkit-user-drag: none;
  pointer-events: none;
  transform: translateZ(0) scale(1);
  transform-origin: center center;
  will-change: transform;
  transition:
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    filter 0.3s ease;
  // Brown accent color (#7a6853) on light theme
  // Using CSS filter to tint logos to match the accent color
  filter: brightness(0) saturate(100%) invert(34%) sepia(9%) saturate(1128%)
    hue-rotate(352deg) brightness(80%) contrast(95%);
}

.dark .logoloop__item img {
  // White on dark theme
  filter: brightness(0) invert(1);
}

.logoloop--scale-hover .logoloop__item {
  overflow: visible;
}

.logoloop--scale-hover .logoloop__item:hover img {
  transform: translateZ(0) scale(1.2);
}

.logoloop__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  text-decoration: none;
  border-radius: 4px;
  transition: opacity 0.2s ease;
}

.logoloop__link:hover {
  opacity: 0.8;
}

.logoloop__link:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

.logoloop--fade::before,
.logoloop--fade::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  width: clamp(24px, 8%, 120px);
  pointer-events: none;
  z-index: 1;
}

.logoloop--fade::before {
  left: 0;
  background: linear-gradient(
    to right,
    var(--logoloop-fadeColor, var(--logoloop-fadeColorAuto)) 0%,
    rgba(0, 0, 0, 0) 100%
  );
}

.logoloop--fade::after {
  right: 0;
  background: linear-gradient(
    to left,
    var(--logoloop-fadeColor, var(--logoloop-fadeColorAuto)) 0%,
    rgba(0, 0, 0, 0) 100%
  );
}

@media (prefers-reduced-motion: reduce) {
  .logoloop__track {
    transform: translate3d(0, 0, 0) !important;
  }

  .logoloop__item img {
    transition: none !important;
  }
}
</style>
