<template>
  <section id="contact" tabindex="-1" aria-labelledby="contact-title">
    <h2 id="contact-title">{{ $t("navigation.contact") }}</h2>
    <div class="contact-links">
      <a
        :href="`mailto:${data?.email || ''}`"
        :aria-label="$t('intro.cta.emailLabel')"
      >
        <nuxt-icon name="mail" /> {{ data?.email || "" }}
      </a>
      <a
        :href="data?.linkedin || '#'"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="$t('intro.cta.linkedinLabel')"
      >
        <nuxt-icon name="linkedin" /> LinkedIn
      </a>
    </div>
  </section>
</template>

<script setup>
const data = useData();
</script>

<style scoped lang="scss" src="./contact.scss"></style>
