<template>
  <section id="contact" tabindex="-1" aria-labelledby="contact-title">
    <h2 id="contact-title">{{ $t("navigation.contact") }}</h2>
    <div class="contact-links">
      <a
        :href="`mailto:${data.email}`"
        :aria-label="$t('intro.cta.emailLabel')"
      >
        <Icon name="local:mail" /> {{ data.email }}
      </a>
      <a
        :href="data.linkedin"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="$t('intro.cta.linkedinLabel')"
      >
        <Icon name="local:linkedin" /> LinkedIn
      </a>
      <a
        :href="data.github"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="$t('intro.cta.githubLabel')"
      >
        <Icon name="local:github" /> GitHub
      </a>
      <a :href="data.cv[locale]" :aria-label="$t('cv.downloadLabel')" download>
        <Icon name="local:download" /> {{ $t("cv.short") }}
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
const { locale } = useI18n();
const data = useData();
</script>

<style scoped lang="scss" src="./contact.scss"></style>
