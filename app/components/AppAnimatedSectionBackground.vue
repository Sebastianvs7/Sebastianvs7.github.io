<template>
  <div id="showAnimation">
    <div class="hero" id="hero"></div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, computed } from "vue";
import { useTheme } from "~/composables/useTheme";

const { isDark } = useTheme();

useHead({
  script: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js",
      defer: true,
    },
  ],
});

// Variables
let hero, boxes, cursor, isIdle, idleTimer, isMouseMoving, lastMouseMoveTime;
let swirlAngle, highlight, highlightCol, highlightRow, direction, zig;
let highlight2, highlight2Col, highlight2Row, direction2, zig2;
let crossElements,
  crossInterval,
  animationId,
  highlightAnimationId,
  highlight2AnimationId;
let crossCounter, counterElement;

const boxSize = 26;
const spacing = 40;
const hoverRadius = 100;

// Initialize everything when component mounts
onMounted(() => {
  // Wait a bit for GSAP to load
  setTimeout(() => {
    initializeAnimation();
  }, 100);
});

// Cleanup when component unmounts
onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  if (highlightAnimationId) {
    clearTimeout(highlightAnimationId);
  }
  if (highlight2AnimationId) {
    clearTimeout(highlight2AnimationId);
  }
  if (crossInterval) {
    clearInterval(crossInterval);
  }
  if (idleTimer) {
    clearTimeout(idleTimer);
  }
  window.removeEventListener("mousemove", handleMouseMove);
});

function initializeAnimation() {
  const showAnimation = document.getElementById("showAnimation");
  hero = document.getElementById("hero");
  if (!hero) return;

  // Use the actual hero section dimensions (50vh)
  const containerWidth = hero.offsetWidth;
  const containerHeight = hero.offsetHeight;

  // Calculate grid dimensions to fill the container completely
  const cols = Math.floor(containerWidth / spacing);
  const rows = Math.floor(containerHeight / spacing);

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

  // Start animations
  animateGrid();
  animateHighlight();
  animateHighlight2();
  crossInterval = setInterval(showRandomCrosses, 3500);

  // Event listeners
  window.addEventListener("mousemove", handleMouseMove);
  hero.addEventListener("click", handleClick);
}

function handleMouseMove(e) {
  const showAnimation = document.getElementById("showAnimation");
  const rect = showAnimation.getBoundingClientRect();
  cursor.x = e.clientX - rect.left;
  cursor.y = e.clientY - rect.top;
  resetIdleTimer();
  lastMouseMoveTime = Date.now();
  if (!isMouseMoving) {
    console.log("Mouse started moving");
    isMouseMoving = true;
  }
}

function resetIdleTimer() {
  isIdle = false;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    isIdle = true;
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

function animateGrid() {
  if (!isIdle) {
    swirlAngle += 0.05;
    for (let { el, x, y, rotationOffset } of boxes) {
      const dx = cursor.x - (x + boxSize / 2);
      const dy = cursor.y - (y + boxSize / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const effect = Math.max(0, 1 - dist / hoverRadius);

      if (effect > 0) {
        const angle = Math.atan2(dy, dx);
        const rotation =
          (swirlAngle * 180) / Math.PI + rotationOffset + effect * 200;
        const scale = 1 + effect * 0.3;
        const shadow = isDark.value
          ? `0 4px 8px rgba(212,201,179,${0.3 * effect})`
          : `0 4px 8px rgba(122,104,83,${0.3 * effect})`;
        const offsetX = Math.cos(angle + swirlAngle) * effect * 10;
        const offsetY = Math.sin(angle + swirlAngle) * effect * 10;

        gsap.to(el, {
          x: offsetX,
          y: offsetY,
          scale,
          rotation,
          boxShadow: shadow,
          duration: 0.4,
          ease: "sine.out",
        });
      } else {
        gsap.to(el, {
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          boxShadow: "none",
          duration: 0.6,
          ease: "power2.out",
        });
      }
    }
  }
  animationId = requestAnimationFrame(animateGrid);
}

function animateHighlight() {
  const containerWidth = hero.offsetWidth;
  const containerHeight = hero.offsetHeight;
  const cols = Math.floor(containerWidth / spacing);
  const rows = Math.floor(containerHeight / spacing);
  const actualSpacingX = containerWidth / cols;
  const actualSpacingY = containerHeight / rows;
  const totalGridWidth = cols * actualSpacingX;
  const totalGridHeight = rows * actualSpacingY;
  const offsetX = (containerWidth - totalGridWidth) / 2;
  const offsetY = (containerHeight - totalGridHeight) / 2;

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
    onComplete: () => {
      highlightAnimationId = setTimeout(animateHighlight, 200);
    },
  });
}

function animateHighlight2() {
  const containerWidth = hero.offsetWidth;
  const containerHeight = hero.offsetHeight;
  const cols = Math.floor(containerWidth / spacing);
  const rows = Math.floor(containerHeight / spacing);
  const actualSpacingX = containerWidth / cols;
  const actualSpacingY = containerHeight / rows;
  const totalGridWidth = cols * actualSpacingX;
  const totalGridHeight = rows * actualSpacingY;
  const offsetX = (containerWidth - totalGridWidth) / 2;
  const offsetY = (containerHeight - totalGridHeight) / 2;

  // Move in opposite direction (right to left)
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
    onComplete: () => {
      highlight2AnimationId = setTimeout(animateHighlight2, 200);
    },
  });
}

function showRandomCrosses() {
  const numToShow = 5 + Math.floor(Math.random() * 2);
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
        duration: 1.5,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(cross, {
            opacity: 0,
            delay: 2 + Math.random() * 2,
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
  const showAnimation = document.getElementById("showAnimation");
  const rect = showAnimation.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  // Check if mouse moved recently (within last 5 seconds)
  const timeSinceLastMove = Date.now() - lastMouseMoveTime;
  const wasRecentlyMoving = timeSinceLastMove < 5000;

  console.log("Time since last move:", timeSinceLastMove, "ms");
  console.log("Was recently moving:", wasRecentlyMoving);

  // Different explosion radius based on recent mouse movement
  const explosionRadius = wasRecentlyMoving ? 150 : 100; // Same radius for both moving and stationary

  boxes.forEach(({ el, x, y }) => {
    const dx = x + boxSize / 2 - clickX;
    const dy = y + boxSize / 2 - clickY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < explosionRadius) {
      const angle = Math.atan2(dy, dx);
      const force = (explosionRadius - dist) * 2; // closer = stronger
      const offsetX = Math.cos(angle) * force;
      const offsetY = Math.sin(angle) * force;

      // Color elements that will be blown away (within explosion radius)
      const shouldColor = dist < explosionRadius;

      // Debug: log all elements to see what's happening
      if (dist < explosionRadius) {
        console.log(
          "Element in blast radius - distance:",
          dist,
          "explosion radius:",
          explosionRadius,
          "not moving:",
          !wasRecentlyMoving,
          "should color:",
          shouldColor
        );

        if (shouldColor) {
          console.log("ELEMENT WILL BE COLORED!");
        }
      }

      // animate away and back
      gsap.fromTo(
        el,
        { x: 0, y: 0 },
        {
          x: offsetX,
          y: offsetY,
          duration: 2,
          ease: "power2.out",
          onStart: () => {
            // Add highlight border color for elements that will be blown away
            if (shouldColor) {
              const borderColor = isDark.value
                ? "rgba(212, 201, 179, 0.8)"
                : "rgba(122, 104, 83, 0.8)";
              el.style.borderColor = borderColor;
              el.style.boxShadow = `0 0 8px ${borderColor}`;

              // // Fade out color based on mouse movement
              // if (wasRecentlyMoving) {
              //   // When moving: fade out color quickly
              //   gsap.to(el, {
              //     borderColor: isDark.value
              //       ? "rgba(212, 201, 179, 0.5)"
              //       : "rgba(122, 104, 83, 0.5)",
              //     boxShadow: "none",
              //     duration: 0.5,
              //     ease: "power2.out",
              //   });
              // } else {
              //   // When not moving: keep color until return animation completes
              //   // Color will fade out in the return animation's onComplete
              // }
            }
          },
          onComplete: () => {
            gsap.to(el, {
              x: 0,
              y: 0,
              duration: 0.75,
              ease: "elastic.out(1,0.4)",
              onComplete: () => {
                // Fade out color after elements return to initial position (only when not moving)
                // if (shouldColor && !wasRecentlyMoving) {
                gsap.to(el, {
                  borderColor: isDark.value
                    ? "rgba(212, 201, 179, 0.3)"
                    : "rgba(122, 104, 83, 0.3)",
                  boxShadow: "none",
                  duration: 0.5,
                  ease: "power2.out",
                });
                // }
              },
            });
          },
        }
      );
    }
  });

  // Check if click is directly on a visible cross
  let clickedCross = null;

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

<style>
#showAnimation {
  margin: 0;
  background: var(--color-bg-light);
  overflow: hidden;
  font-family: "Inter", sans-serif;
  transition: background-color 0.3s ease;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

body.dark-mode #showAnimation {
  background: var(--color-bg-dark);
}

.hero {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  margin-bottom: 0;
}

.rect {
  position: absolute;
  width: 26px;
  height: 26px;
  border: 1px solid rgba(122, 104, 83, 0.3);
  border-radius: 3px;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: center;
  transition: border-color 0.3s ease;
}

body.dark-mode .rect {
  border-color: rgba(212, 201, 179, 0.3);
}

.highlight {
  position: absolute;
  width: 26px;
  height: 26px;
  border-radius: 3px;
  border: 2px solid rgba(122, 104, 83, 0.5);
  background-color: transparent;
  box-shadow: 0 0 8px rgba(122, 104, 83, 0.2);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

body.dark-mode .highlight {
  border-color: rgba(212, 201, 179, 0.5);
  box-shadow: 0 0 8px rgba(212, 201, 179, 0.2);
}

.cross {
  position: absolute;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
  color: rgba(122, 104, 83, 0.7);
  opacity: 0;
  pointer-events: none;
  transition: color 0.3s ease;
}

body.dark-mode .cross {
  color: rgba(212, 201, 179, 0.7);
}

.hero-title {
  position: relative;
  z-index: 1000;
  font-size: 3rem;
  text-align: center;
  top: 40%;
  pointer-events: none;
  color: var(--color-accent);
  font-family: "Inter", sans-serif;
  transition: color 0.3s ease;
}

body.dark-mode .hero-title {
  color: var(--color-accent-dark);
}

.cross-counter {
  position: absolute;
  bottom: 20px;
  right: 20px;
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-accent);
  font-family: "Inter", sans-serif;
  z-index: 1000;
  pointer-events: none;
  transition: color 0.3s ease;
}

body.dark-mode .cross-counter {
  color: var(--color-accent-dark);
}
</style>
