<template>
  <section id="contact" tabindex="-1" aria-label="Contact">
    <h2>{{ $t("navigation.contact") }}</h2>
    <div class="contact-links">
      <a
        :href="`mailto:${data?.email || ''}`"
        aria-label="Send email to Sebastian Šanda"
        tabindex="0"
      >
        <nuxt-icon name="mail" /> {{ data?.email || "" }}
      </a>
      <a
        :href="data?.linkedin || '#'"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit LinkedIn profile"
        tabindex="0"
      >
        <nuxt-icon name="linkedin" /> LinkedIn
      </a>
    </div>
  </section>
</template>

<script setup>
import "./contact.scss";
const data = useData();
</script>
