<template>
  <div id="showAnimation">
    <div class="hero" id="hero"></div>
  </div>
</template>

<script setup>
import "./styles.scss";
import { gsap } from "gsap";

const { isDark } = useTheme();

// Animation elements and state
let hero, boxes, cursor, isIdle, idleTimer, isMouseMoving, lastMouseMoveTime;
let swirlAngle, highlight, highlight2;
let highlightCol, highlightRow, direction, zig;
let highlight2Col, highlight2Row, direction2, zig2;
let crossElements, crossInterval;
let intersectionObserver;

// Click throttling
let lastClickTime = 0;
const clickThrottleDelay = 500; // 1000ms throttle

// GSAP Timelines
let gridTimeline, highlightTimeline, highlight2Timeline, crossTimeline;

const boxSize = 26;
const spacing = 40;
const hoverRadius = 100;

// Click animation settings
const mouseMoveThreshold = 500; // Time in ms to consider mouse as "not moving"
const explosionRadiusMoving = 150; // Smaller radius when mouse is moving
const explosionRadiusStationary = 150; // Much larger radius when mouse is not moving

// Initialize everything when component mounts
onMounted(() => {
  // Wait a bit for DOM to be fully ready
  setTimeout(() => {
    initializeAnimation();
    setupTimelines();
    setupIntersectionObserver();
    setupPageVisibilityListener();
  }, 100);
});

// Cleanup when component unmounts
onUnmounted(() => {
  // Kill all timelines
  if (gridTimeline) gridTimeline.kill();
  if (highlightTimeline) highlightTimeline.kill();
  if (highlight2Timeline) highlight2Timeline.kill();
  if (crossTimeline) crossTimeline.kill();

  // Cleanup intervals and observers
  if (crossInterval) clearInterval(crossInterval);
  if (idleTimer) clearTimeout(idleTimer);
  if (intersectionObserver) intersectionObserver.disconnect();

  // Remove event listeners
  window.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("visibilitychange", handleVisibilityChange);
});

function initializeAnimation() {
  const showAnimation = document.getElementById("showAnimation");
  hero = document.getElementById("hero");
  if (!hero) return;

  // Use the actual hero section dimensions (25vh)
  const containerWidth = hero.offsetWidth;
  const containerHeight = hero.offsetHeight;

  // Calculate grid dimensions to fill the container completely
  // Use Math.ceil to ensure we have enough rows/cols to fill the entire space
  const cols = Math.ceil(containerWidth / spacing);
  const rows = Math.ceil(containerHeight / spacing);

  // Calculate actual spacing to fill the container exactly
  const actualSpacingX = containerWidth / cols;
  const actualSpacingY = containerHeight / rows;

  // Calculate centering offsets (should be 0 if spacing is calculated correctly)
  const totalGridWidth = cols * actualSpacingX;
  const totalGridHeight = rows * actualSpacingY;
  const offsetX = (containerWidth - totalGridWidth) / 2;
  const offsetY = (containerHeight - totalGridHeight) / 2;

  boxes = [];

  // --- Create grid boxes ---
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const box = document.createElement("div");
      box.classList.add("rect");
      const leftPos = offsetX + x * actualSpacingX;
      const topPos = offsetY + y * actualSpacingY;
      box.style.left = `${leftPos}px`;
      box.style.top = `${topPos}px`;
      hero.appendChild(box);
      boxes.push({
        el: box,
        x: leftPos,
        y: topPos,
        rotationOffset: Math.random() * 360,
      });
    }
  }

  cursor = {
    x: containerWidth / 2,
    y: containerHeight / 2,
  };
  isIdle = false;
  isMouseMoving = false;
  lastMouseMoveTime = 0;

  resetIdleTimer();

  // --- Hover radius swirl ---
  swirlAngle = 0;

  // --- Moving Highlight Rect 1 ---
  highlight = document.createElement("div");
  highlight.classList.add("highlight");
  hero.appendChild(highlight);

  highlightCol = 0;
  highlightRow = Math.floor(rows / 2);
  direction = 1;
  zig = 0;

  // --- Moving Highlight Rect 2 (reversed, bottom) ---
  highlight2 = document.createElement("div");
  highlight2.classList.add("highlight", "highlight-2");

  // Set initial position to the right side immediately
  const initialX = offsetX + (cols - 1) * actualSpacingX;
  const initialY = offsetY + Math.floor(rows * 0.75) * actualSpacingY;
  highlight2.style.left = `${initialX}px`;
  highlight2.style.top = `${initialY}px`;

  hero.appendChild(highlight2);

  highlight2Col = cols - 1; // Start from the right
  highlight2Row = Math.floor(rows * 0.75); // Position more towards bottom
  direction2 = -1; // Move left (from right to left)
  zig2 = 0;

  // --- Random Crosses ---
  crossElements = boxes.map((box) => {
    const cross = document.createElement("div");
    cross.classList.add("cross");
    cross.style.left = `${box.x + 1}px`;
    cross.style.top = `${box.y + 1}px`;
    cross.textContent = "×";
    hero.appendChild(cross);
    return cross;
  });

  // Initialize counter
  // crossCounter = 0;
  // counterElement = document.createElement("div");
  // counterElement.classList.add("cross-counter");
  // counterElement.textContent = "00";
  // hero.appendChild(counterElement);

  // Animations will be started by timelines

  // Event listeners
  window.addEventListener("mousemove", handleMouseMove);
  hero.addEventListener("click", handleClick);
}

function setupTimelines() {
  // Create paused timelines
  gridTimeline = gsap.timeline({ paused: true, repeat: -1 });
  highlightTimeline = gsap.timeline({ paused: true, repeat: -1 });
  highlight2Timeline = gsap.timeline({ paused: true, repeat: -1 });
  crossTimeline = gsap.timeline({ paused: true, repeat: -1 });

  // Setup grid animation timeline
  setupGridTimeline();

  // Setup highlight animation timelines
  setupHighlightTimeline();
  setupHighlight2Timeline();

  // Setup cross animation timeline
  setupCrossTimeline();

  // Start all timelines
  startTimelines();
}

function startTimelines() {
  // Start all timelines
  gridTimeline.resume();
  highlightTimeline.resume();
  highlight2Timeline.resume();
  crossTimeline.resume();
}

function setupGridTimeline() {
  // Grid animation timeline - this will be controlled by requestAnimationFrame
  // but we'll use the timeline to manage the overall animation state
  gridTimeline.to(
    {},
    { duration: 0.016, repeat: -1, onRepeat: animateGridFrame }
  );
}

function animateGridFrame() {
  if (!isIdle) {
    swirlAngle += 0.03;
    for (let { el, x, y, rotationOffset } of boxes) {
      const dx = cursor.x - (x + boxSize / 2);
      const dy = cursor.y - (y + boxSize / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const effect = Math.max(0, 1 - dist / hoverRadius);

      if (effect > 0) {
        const angle = Math.atan2(dy, dx);
        const rotation =
          (swirlAngle * 180) / Math.PI + rotationOffset + effect * 50;
        const scale = 1 + effect * 0.3;
        const shadow = isDark.value
          ? `0 4px 8px rgba(212,201,179,${0.3 * effect})`
          : `0 4px 8px rgba(122,104,83,${0.3 * effect})`;
        const offsetX = Math.cos(angle + swirlAngle) * effect * 1;
        const offsetY = Math.sin(angle + swirlAngle) * effect * 1;

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
}

function setupHighlightTimeline() {
  // Highlight animation timeline
  highlightTimeline.call(() => {
    const containerWidth = hero.offsetWidth;
    const containerHeight = hero.offsetHeight;
    const cols = Math.ceil(containerWidth / spacing);
    const rows = Math.ceil(containerHeight / spacing);
    const actualSpacingX = containerWidth / cols;
    const actualSpacingY = containerHeight / rows;
    const offsetX = (containerWidth - cols * actualSpacingX) / 2;
    const offsetY = (containerHeight - rows * actualSpacingY) / 2;

    // Move highlight using the original logic
    highlightCol += direction;

    if (zig === 1) {
      highlightRow = Math.max(0, highlightRow - 1);
      zig = 2;
    } else if (zig === 2) {
      highlightRow = Math.min(rows - 1, highlightRow + 1);
      zig = 0;
    } else {
      zig = 1;
    }

    if (highlightCol >= cols - 1) direction = -1;
    if (highlightCol <= 0) direction = 1;

    gsap.to(highlight, {
      left: `${offsetX + highlightCol * actualSpacingX}px`,
      top: `${offsetY + highlightRow * actualSpacingY}px`,
      duration: 2.2,
      ease: "power1.inOut",
    });
  });

  highlightTimeline.to({}, { duration: 2.4 }); // Wait between movements
}

function setupHighlight2Timeline() {
  // Second highlight animation timeline
  highlight2Timeline.call(() => {
    const containerWidth = hero.offsetWidth;
    const containerHeight = hero.offsetHeight;
    const cols = Math.ceil(containerWidth / spacing);
    const rows = Math.ceil(containerHeight / spacing);
    const actualSpacingX = containerWidth / cols;
    const actualSpacingY = containerHeight / rows;
    const offsetX = (containerWidth - cols * actualSpacingX) / 2;
    const offsetY = (containerHeight - rows * actualSpacingY) / 2;

    // Move highlight2 using the original logic
    highlight2Col += direction2;

    if (zig2 === 1) {
      highlight2Row = Math.max(0, highlight2Row - 1);
      zig2 = 2;
    } else if (zig2 === 2) {
      highlight2Row = Math.min(rows - 1, highlight2Row + 1);
      zig2 = 0;
    } else {
      zig2 = 1;
    }

    // Reverse the boundary logic for right-to-left movement
    if (highlight2Col <= 0) direction2 = 1; // When reaching left edge, go right
    if (highlight2Col >= cols - 1) direction2 = -1; // When reaching right edge, go left

    gsap.to(highlight2, {
      left: `${offsetX + highlight2Col * actualSpacingX}px`,
      top: `${offsetY + highlight2Row * actualSpacingY}px`,
      duration: 2.2,
      ease: "power1.inOut",
    });
  });

  highlight2Timeline.to({}, { duration: 2.4 }); // Wait between movements
}

function setupCrossTimeline() {
  // Cross animation timeline
  crossTimeline.call(() => {
    showRandomCrosses();
  });

  crossTimeline.to({}, { duration: 3.5 }); // Wait between cross appearances
}

function setupIntersectionObserver() {
  const showAnimation = document.getElementById("showAnimation");
  if (!showAnimation) return;

  intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !document.hidden) {
          // Resume all timelines when in viewport and page is visible
          gridTimeline.resume();
          highlightTimeline.resume();
          highlight2Timeline.resume();
          crossTimeline.resume();
        } else {
          // Pause all timelines when out of viewport or page is hidden
          gridTimeline.pause();
          highlightTimeline.pause();
          highlight2Timeline.pause();
          crossTimeline.pause();
        }
      });
    },
    { threshold: 0.1 }
  );

  intersectionObserver.observe(showAnimation);
}

function setupPageVisibilityListener() {
  document.addEventListener("visibilitychange", handleVisibilityChange);
}

function handleVisibilityChange() {
  if (document.hidden) {
    // Page is hidden - pause all timelines
    gridTimeline.pause();
    highlightTimeline.pause();
    highlight2Timeline.pause();
    crossTimeline.pause();

    // Hide all visible crosses
    if (crossElements) {
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
    }
  } else {
    // Page is visible - check if element is in viewport and resume if so
    const showAnimation = document.getElementById("showAnimation");
    if (showAnimation) {
      const rect = showAnimation.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;

      if (isInView) {
        gridTimeline.resume();
        highlightTimeline.resume();
        highlight2Timeline.resume();
        crossTimeline.resume();
      }
    }
  }
}

function handleMouseMove(e) {
  const showAnimation = document.getElementById("showAnimation");
  const rect = showAnimation.getBoundingClientRect();
  cursor.x = e.clientX - rect.left;
  cursor.y = e.clientY - rect.top;
  resetIdleTimer();
  lastMouseMoveTime = Date.now();
  if (!isMouseMoving) {
    isMouseMoving = true;
  }
}

function resetIdleTimer() {
  isIdle = false;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    isIdle = true;
    isMouseMoving = false; // Reset mouse moving state when idle
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
  }, 2500);
}

function showRandomCrosses() {
  const numToShow = 4 + Math.floor(Math.random() * 2);
  for (let i = 0; i < numToShow; i++) {
    const cross =
      crossElements[Math.floor(Math.random() * crossElements.length)];
    if (cross.dataset.active === "true") continue;
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
            onComplete: () => (cross.dataset.active = "false"),
          });
        },
      }
    );
  }
}

function handleClick(e) {
  const currentTime = Date.now();

  // Throttle clicks - only allow one click per throttle delay
  if (currentTime - lastClickTime < clickThrottleDelay) {
    return;
  }

  lastClickTime = currentTime;

  const showAnimation = document.getElementById("showAnimation");
  const rect = showAnimation.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  // Determine if mouse was moving recently
  const timeSinceLastMove = currentTime - lastMouseMoveTime;
  const wasMouseMoving =
    timeSinceLastMove < mouseMoveThreshold && isMouseMoving;

  // Different explosion radius and animation style based on mouse movement
  const explosionRadius = wasMouseMoving
    ? explosionRadiusMoving
    : explosionRadiusStationary;

  // Different animation parameters based on movement
  const animationDuration = wasMouseMoving ? 0.4 : 1; // Slower when stationary
  const animationEase = wasMouseMoving ? "power2.out" : "power3.out"; // Different easing
  const returnDuration = wasMouseMoving ? 0.4 : 1.5; // Slower return when stationary
  const returnEase = wasMouseMoving
    ? "elastic.out(1,0.4)"
    : "elastic.out(1,0.3)"; // More elastic when stationary
  const forceMultiplier = wasMouseMoving ? 2 : 3; // Stronger force when stationary

  let affectedElements = 0;

  boxes.forEach(({ el, x, y }) => {
    const dx = x + boxSize / 2 - clickX;
    const dy = y + boxSize / 2 - clickY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < explosionRadius) {
      affectedElements++;
      const angle = Math.atan2(dy, dx);
      const force = (explosionRadius - dist) * forceMultiplier; // Force varies based on movement
      const offsetX = Math.cos(angle) * force;
      const offsetY = Math.sin(angle) * force;

      // Different shadow intensity based on movement
      const shadowIntensity = wasMouseMoving ? 0.3 : 0.5;
      const shadowBlur = wasMouseMoving ? 10 : 15;

      // animate away and back with different styles
      gsap.fromTo(
        el,
        { x: 0, y: 0 },
        {
          x: offsetX,
          y: offsetY,
          duration: animationDuration,
          ease: animationEase,
          onStart: () => {
            // Make color darker for click effect
            const darkerColor = isDark.value
              ? "rgba(150, 140, 120, 1)" // Darker version of dark theme color
              : "rgba(80, 65, 50, 1)"; // Darker version of light theme color
            el.style.borderColor = darkerColor;
            el.style.boxShadow = `0 0 ${shadowBlur}px rgba(${isDark.value ? "150, 140, 120" : "80, 65, 50"}, ${shadowIntensity})`;
          },
          onComplete: () => {
            gsap.to(el, {
              x: 0,
              y: 0,
              duration: returnDuration,
              ease: returnEase,
              onComplete: () => {
                // Fade back to default color and clear inline styles
                const defaultColor = isDark.value
                  ? "rgba(212, 201, 179, 0.3)"
                  : "rgba(122, 104, 83, 0.3)";
                const fadeDelay = wasMouseMoving ? 0.3 : 0.7; // Longer delay when stationary
                gsap.to(el, {
                  borderColor: defaultColor,
                  boxShadow: "none",
                  duration: 1,
                  delay: fadeDelay,
                  ease: "power2.out",
                  onComplete: () => {
                    // Clear inline styles to let CSS take over
                    el.style.borderColor = "";
                    el.style.boxShadow = "";
                  },
                });
              },
            });
          },
        }
      );
    }
  });

  // Check if click is directly on a visible cross
  // let clickedCross = null;

  /*  crossElements.forEach((cross) => {
    const crossRect = cross.getBoundingClientRect();

    // Check if click is within the cross bounds
    const isClickOnCross =
      e.clientX >= crossRect.left &&
      e.clientX <= crossRect.right &&
      e.clientY >= crossRect.top &&
      e.clientY <= crossRect.bottom;

    // Check if cross is currently visible (100% opacity only)
    const currentOpacity = parseFloat(cross.style.opacity) || 1;
    const isCurrentlyVisible =
      cross.dataset.active === "true" && currentOpacity >= 1.0;

    // If click is directly on a visible cross
    if (isClickOnCross && isCurrentlyVisible) {
      clickedCross = cross;
    }
  });

  // Fade out the clicked cross
  if (clickedCross) {
    gsap.to(clickedCross, {
      opacity: 0,
      scale: 0.5,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => {
        clickedCross.dataset.active = "false";
        // Only increment counter when cross is actually destroyed
        crossCounter++;
        counterElement.textContent = crossCounter.toString().padStart(2, "0");
      },
    });
  } */
}
</script>
