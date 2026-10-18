<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { THEME_COLOR_DARK, THEME_COLOR_LIGHT } from "~/constants/theme";

const { locale, t } = useI18n();
const route = useRoute();
const colorMode = useColorMode();
const { siteUrl } = useRuntimeConfig().public;

// lang attribute, canonical, hreflang alternates and og:locale
const i18nHead = useLocaleHead({ seo: true });

const defaultTitle = computed(() => `Sebastian Šanda – ${t("seo.tagline")}`);

useHead({
  htmlAttrs: {
    lang: computed(() => i18nHead.value.htmlAttrs.lang),
  },
  titleTemplate: (title?: string) =>
    title ? `${title} | Sebastian Šanda` : defaultTitle.value,
  link: computed(() => i18nHead.value.link),
  meta: computed(() => [
    ...i18nHead.value.meta,
    {
      name: "theme-color",
      content:
        colorMode.value === "dark" ? THEME_COLOR_DARK : THEME_COLOR_LIGHT,
    },
  ]),
});

useSeoMeta({
  description: () => t("seo.description"),
  ogType: "website",
  ogSiteName: "Sebastian Šanda",
  ogTitle: defaultTitle,
  ogDescription: () => t("seo.description"),
  ogUrl: () => `${siteUrl}${route.path}`,
  // 1200x630 share card with name, role and photo, one per locale
  ogImage: () => `${siteUrl}/images/og-image-${locale.value}.png`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: () => t("seo.imageAlt"),
  twitterCard: "summary_large_image",
});
</script>
