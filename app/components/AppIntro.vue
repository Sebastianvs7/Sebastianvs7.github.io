<template>
  <section id="intro" tabindex="-1" aria-label="Introduction">
    <div class="intro-text">
      <h1>{{ $t("intro.name") }}</h1>
      <h2 class="intro-subtitle">
        {{ $t("intro.subtitle1") }} | <span>{{ $t("intro.subtitle2") }}</span> |
        <span>{{ $t("intro.subtitle3") }}</span>
      </h2>
      <h3>{{ $t("intro.role") }}</h3>
      <p>{{ $t("intro.description") }}</p>

      <div class="intro-bottom">
        <div class="intro-cta">
          <a
            href="mailto:info@sebastiansanda.cz"
            class="cta-button cta-email"
            :aria-label="$t('intro.cta.emailLabel')"
          >
            {{ $t("intro.cta.email") }}
          </a>
          <a
            href="https://linkedin.com/in/sebastian-sanda"
            class="cta-button cta-linkedin"
            :aria-label="$t('intro.cta.linkedinLabel')"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ $t("intro.cta.linkedin") }}
          </a>
        </div>

        <div id="fun-shapes">
          <div class="shape circle"></div>
          <div class="shape square"></div>
          <div class="shape triangle"></div>
        </div>
      </div>
    </div>
    <div class="intro-img" aria-label="Portrait of Sebastian Šanda" role="img">
      <img
        src="/images/profile.webp"
        alt="Sebastian Šanda"
        width="220"
        height="220"
        loading="eager"
      />
    </div>
  </section>
</template>
