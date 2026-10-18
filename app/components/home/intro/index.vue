<template>
  <section id="intro" tabindex="-1" aria-labelledby="intro-title">
    <div class="intro-text">
      <h1 id="intro-title">{{ $t("intro.name") }}</h1>
      <h2 class="intro-subtitle">
        {{ $t("intro.title") }} · <span>{{ $t("intro.stack") }}</span>
      </h2>
      <p>{{ $t("intro.description") }}</p>

      <div class="intro-bottom">
        <div class="intro-cta">
          <a
            :href="`mailto:${data.email}`"
            class="cta-button cta-primary"
            :aria-label="$t('intro.cta.emailLabel')"
          >
            {{ $t("intro.cta.email") }}
          </a>
          <div class="intro-socials">
            <a
              :href="data.github"
              class="cta-button cta-secondary cta-icon"
              :aria-label="$t('intro.cta.githubLabel')"
              title="GitHub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="local:github" />
            </a>
            <a
              :href="data.linkedin"
              class="cta-button cta-secondary cta-icon"
              :aria-label="$t('intro.cta.linkedinLabel')"
              title="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="local:linkedin" />
            </a>
          </div>
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
