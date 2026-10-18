<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-label="$t('navigation.toggleTheme')"
    @click="handleThemeToggle"
  >
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <clipPath :id="clipId">
        <rect width="24" height="19" />
      </clipPath>
      <!-- Nested groups: each layer owns one transform (hover vs. theme switch) so they don't override each other -->
      <g :clip-path="`url(#${clipId})`">
        <g class="theme-icon-sky">
          <g class="theme-icon-sun">
            <circle cx="12" cy="11" r="3.5" fill="currentColor" />
            <g class="theme-icon-rays">
              <path
                class="theme-icon-rays-spin"
                d="M12 4.5V6M12 16v1.5M4.5 11H6M18 11h1.5M6.7 5.7l1.1 1.1M16.2 15.2l1.1 1.1M6.7 16.3l1.1-1.1M16.2 6.8l1.1-1.1"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
            </g>
          </g>
          <g class="theme-icon-moon">
            <path
              d="M18.3 11.55A6.3 6.3 0 1 1 11.45 4.7 4.9 4.9 0 0 0 18.3 11.55z"
              fill="currentColor"
            />
          </g>
          <g
            class="theme-icon-stars"
            stroke="currentColor"
            stroke-width="1.2"
            stroke-linecap="round"
          >
            <path class="theme-icon-star" d="M4.5 4v3M3 5.5h3" />
            <path class="theme-icon-star" d="M19.5 3.3v2.4M18.3 4.5h2.4" />
            <path class="theme-icon-star" d="M20.5 8v2M19.5 9h2" />
          </g>
        </g>
      </g>
      <path
        class="theme-icon-horizon"
        d="M3 20.5h18"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
      />
    </svg>
  </button>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
// Rendered twice (desktop + mobile menu), so the clipPath id must be unique
const clipId = `theme-clip-${useId()}`;

const handleThemeToggle = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};
</script>

<style scoped lang="scss" src="./theme-toggle.scss"></style>
