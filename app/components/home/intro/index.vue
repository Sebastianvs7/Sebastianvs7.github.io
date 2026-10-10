<template>
  <section id="intro" tabindex="-1" aria-labelledby="intro-title">
    <div class="intro-text">
      <h1 id="intro-title">{{ $t("intro.name") }}</h1>
      <h2 class="intro-subtitle">
        {{ $t("intro.subtitle1") }} | <span>{{ $t("intro.subtitle2") }}</span> |
        <span>{{ $t("intro.subtitle3") }}</span>
      </h2>
      <h3>{{ $t("intro.role") }}</h3>
      <p>{{ $t("intro.description") }}</p>

      <div class="intro-bottom">
        <div class="intro-cta">
          <a
            :href="`mailto:${data.email}`"
            class="cta-button cta-email"
            :aria-label="$t('intro.cta.emailLabel')"
          >
            {{ $t("intro.cta.email") }}
          </a>
          <a
            :href="data.linkedin"
            class="cta-button cta-linkedin"
            :aria-label="$t('intro.cta.linkedinLabel')"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ $t("intro.cta.linkedin") }}
          </a>
        </div>

        <div id="fun-shapes">
          <div class="shape circle" />
          <div class="shape square" />
          <div class="shape triangle" />
        </div>
      </div>
    </div>
    <div class="intro-img">
      <img
        src="/images/profile-220.webp"
        srcset="/images/profile-220.webp 1x, /images/profile-440.webp 2x"
        alt="Sebastian Šanda"
        width="220"
        height="220"
        loading="eager"
        fetchpriority="high"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
const data = useData();
</script>

<style scoped lang="scss" src="./intro.scss"></style>
