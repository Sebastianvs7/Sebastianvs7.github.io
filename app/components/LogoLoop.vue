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
        v-for="(_, copyIndex) in Array.from({ length: copyCount })"
        :key="`copy-${copyIndex}`"
        class="logoloop__list"
        role="list"
        :aria-hidden="copyIndex > 0"
        :ref="copyIndex === 0 ? (el) => (seqRef = el) : undefined"
      >
        <li
          v-for="(item, itemIndex) in props.logos"
          :key="`${copyIndex}-${itemIndex}`"
          class="logoloop__item"
          role="listitem"
        >
          <a
            v-if="item.href"
            :href="item.href"
            class="logoloop__link"
            :aria-label="getItemAriaLabel(item) || 'logo link'"
            target="_blank"
            rel="noreferrer noopener"
          >
            <img
              v-if="!isNodeItem(item)"
              :src="item.src"
              :srcset="item.srcSet"
              :sizes="item.sizes"
              :width="item.width"
              :height="item.height"
              :alt="item.alt ?? ''"
              :title="item.title"
              loading="lazy"
              decoding="async"
              draggable="false"
            />
            <span
              v-else
              class="logoloop__node"
              :aria-hidden="!!item.href && !item.ariaLabel"
            >
              <component :is="item.node" />
            </span>
          </a>
          <template v-else>
            <img
              v-if="!isNodeItem(item)"
              :src="item.src"
              :srcset="item.srcSet"
              :sizes="item.sizes"
              :width="item.width"
              :height="item.height"
              :alt="item.alt ?? ''"
              :title="item.title"
              loading="lazy"
              decoding="async"
              draggable="false"
            />
            <span v-else class="logoloop__node">
              <component :is="item.node" />
            </span>
          </template>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";

const ANIMATION_CONFIG = {
  SMOOTH_TAU: 0.25,
  MIN_COPIES: 2,
  COPY_HEADROOM: 2,
};

const props = defineProps({
  logos: {
    type: Array,
    required: true,
  },
  speed: {
    type: Number,
    default: 120,
  },
  direction: {
    type: String,
    default: "left",
    validator: (value) => ["left", "right"].includes(value),
  },
  width: {
    type: [String, Number],
    default: "100%",
  },
  logoHeight: {
    type: Number,
    default: 40,
  },
  logoWidth: {
    type: [Number, String],
    default: null, // null means auto (maintain aspect ratio)
  },
  gap: {
    type: Number,
    default: 32,
  },
  pauseOnHover: {
    type: Boolean,
    default: true,
  },
  fadeOut: {
    type: Boolean,
    default: false,
  },
  fadeOutColor: {
    type: String,
    default: null,
  },
  scaleOnHover: {
    type: Boolean,
    default: false,
  },
  ariaLabel: {
    type: String,
    default: "Partner logos",
  },
  className: {
    type: String,
    default: "",
  },
});

const containerRef = ref(null);
const trackRef = ref(null);
const seqRef = ref(null);
const seqWidth = ref(0);
const copyCount = ref(ANIMATION_CONFIG.MIN_COPIES);
const isHovered = ref(false);
const offsetRef = ref(0);
const velocityRef = ref(0);
const rafRef = ref(null);
const lastTimestampRef = ref(null);
const resizeObserverRef = ref(null);

const toCssLength = (value) => {
  return typeof value === "number" ? `${value}px` : (value ?? undefined);
};

const isNodeItem = (item) => {
  return "node" in item;
};

const getItemAriaLabel = (item) => {
  if (isNodeItem(item)) {
    return item.ariaLabel ?? item.title;
  }
  return item.alt ?? item.title;
};

const targetVelocity = computed(() => {
  const magnitude = Math.abs(props.speed);
  const directionMultiplier = props.direction === "left" ? 1 : -1;
  const speedMultiplier = props.speed < 0 ? -1 : 1;
  return magnitude * directionMultiplier * speedMultiplier;
});

const cssVariables = computed(() => {
  const vars = {
    "--logoloop-gap": `${props.gap}px`,
    "--logoloop-logoHeight": `${props.logoHeight}px`,
  };
  if (props.logoWidth !== null) {
    vars["--logoloop-logoWidth"] =
      typeof props.logoWidth === "number"
        ? `${props.logoWidth}px`
        : props.logoWidth;
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
    width: toCssLength(props.width) ?? "100%",
    ...cssVariables.value,
  };
});

const updateDimensions = () => {
  if (!containerRef.value || !seqRef.value) return;

  const containerWidth = containerRef.value.clientWidth ?? 0;
  const sequenceWidth = seqRef.value.getBoundingClientRect()?.width ?? 0;

  if (sequenceWidth > 0) {
    seqWidth.value = Math.ceil(sequenceWidth);
    const copiesNeeded =
      Math.ceil(containerWidth / sequenceWidth) +
      ANIMATION_CONFIG.COPY_HEADROOM;
    copyCount.value = Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded);
  }
};

const handleImageLoad = () => {
  updateDimensions();
};

const setupImageLoader = () => {
  if (!seqRef.value) return;

  const images = seqRef.value.querySelectorAll("img") ?? [];
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

const setupResizeObserver = () => {
  if (!window.ResizeObserver) {
    const handleResize = () => updateDimensions();
    window.addEventListener("resize", handleResize);
    updateDimensions();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }

  const elements = [containerRef, seqRef].filter((ref) => ref.value);

  const observers = elements.map((ref) => {
    if (!ref.value) return null;
    const observer = new ResizeObserver(updateDimensions);
    observer.observe(ref.value);
    return observer;
  });

  updateDimensions();

  return () => {
    observers.forEach((observer) => observer?.disconnect());
  };
};

const animate = (timestamp) => {
  if (lastTimestampRef.value === null) {
    lastTimestampRef.value = timestamp;
  }

  const deltaTime = Math.max(0, timestamp - lastTimestampRef.value) / 1000;
  lastTimestampRef.value = timestamp;

  const target =
    props.pauseOnHover && isHovered.value ? 0 : targetVelocity.value;
  const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
  velocityRef.value += (target - velocityRef.value) * easingFactor;

  if (seqWidth.value > 0 && trackRef.value) {
    let nextOffset = offsetRef.value + velocityRef.value * deltaTime;
    nextOffset =
      ((nextOffset % seqWidth.value) + seqWidth.value) % seqWidth.value;
    offsetRef.value = nextOffset;

    const translateX = -offsetRef.value;
    trackRef.value.style.transform = `translate3d(${translateX}px, 0, 0)`;
  }

  rafRef.value = requestAnimationFrame(animate);
};

const startAnimation = () => {
  if (!trackRef.value) return;

  if (seqWidth.value > 0) {
    offsetRef.value =
      ((offsetRef.value % seqWidth.value) + seqWidth.value) % seqWidth.value;
    trackRef.value.style.transform = `translate3d(${-offsetRef.value}px, 0, 0)`;
  }

  rafRef.value = requestAnimationFrame(animate);
};

const stopAnimation = () => {
  if (rafRef.value !== null) {
    cancelAnimationFrame(rafRef.value);
    rafRef.value = null;
  }
  lastTimestampRef.value = null;
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

let cleanupResizeObserver = null;

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

watch(
  [targetVelocity, seqWidth, isHovered, () => props.pauseOnHover],
  () => {
    if (seqWidth.value > 0) {
      stopAnimation();
      startAnimation();
    }
  },
  { immediate: true }
);

onMounted(() => {
  cleanupResizeObserver = setupResizeObserver();
  setupImageLoader();
  startAnimation();
});

onBeforeUnmount(() => {
  stopAnimation();
  if (cleanupResizeObserver) {
    cleanupResizeObserver();
  }
});
</script>

<style lang="scss">
ul {
  padding: 0;
  margin: 0;
}
.logoloop {
  position: relative;
  overflow-x: hidden;

  --logoloop-gap: 60px;
  --logoloop-logoHeight: 40px;
  --logoloop-logoWidth: none;
  --logoloop-fadeColorAuto: var(--color-bg-light, #f5f0e6);
}

.logoloop--scale-hover {
  padding-top: calc(var(--logoloop-logoHeight) * 0.1);
  padding-bottom: calc(var(--logoloop-logoHeight) * 0.1);
}

body.dark-mode .logoloop {
  --logoloop-fadeColorAuto: var(--color-bg-dark, #1e1e1e);
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
  max-width: var(--logoloop-logoWidth, var(--logoloop-logoHeight));
}

.logoloop__item:last-child {
  margin-right: var(--logoloop-gap);
}

.logoloop__node {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.logoloop__item img {
  width: 100%;
  height: var(--logoloop-logoHeight);
  display: block;
  object-fit: contain;
  object-position: center;
  image-rendering: -webkit-optimize-contrast;
  -webkit-user-drag: none;
  pointer-events: none;
  transition:
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    filter 0.3s ease;
  // Brown accent color (#7a6853) on light theme
  // Using CSS filter to tint logos to match the accent color
  filter: brightness(0) saturate(100%) invert(34%) sepia(9%) saturate(1128%)
    hue-rotate(352deg) brightness(80%) contrast(95%);
}

body.dark-mode .logoloop__item img {
  // White on dark theme
  filter: brightness(0) invert(1);
}

.logoloop--scale-hover .logoloop__item {
  overflow: visible;
}

.logoloop--scale-hover .logoloop__item:hover img,
.logoloop--scale-hover .logoloop__item:hover .logoloop__node {
  transform: scale(1.2);
  transform-origin: center center;
}

.logoloop--scale-hover .logoloop__node {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.logoloop__link {
  display: inline-flex;
  align-items: center;
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

  .logoloop__item img,
  .logoloop__node {
    transition: none !important;
  }
}
</style>
