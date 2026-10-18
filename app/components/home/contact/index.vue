<template>
  <section id="contact" tabindex="-1" aria-labelledby="contact-title">
    <h2 id="contact-title">{{ $t("navigation.contact") }}</h2>

    <div class="contact-links">
      <a :href="`mailto:${siteLinks.email}`">
        <Icon name="local:mail" /> {{ siteLinks.email }}
      </a>

      <a :href="siteLinks.linkedin" target="_blank" rel="noopener noreferrer">
        <Icon name="local:linkedin" /> LinkedIn
      </a>

      <a :href="siteLinks.github" target="_blank" rel="noopener noreferrer">
        <Icon name="local:github" /> GitHub
      </a>

      <a :href="siteLinks.cv[locale]" download>
        <Icon name="local:download" /> {{ $t("cv.short") }}
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
const { locale } = useI18n();
const siteLinks = useSiteLinks();
</script>

<style scoped lang="scss" src="./contact.scss"></style>
