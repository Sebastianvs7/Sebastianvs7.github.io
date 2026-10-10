// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  rules: {
    // Match Prettier, which always self-closes void elements
    "vue/html-self-closing": [
      "warn",
      { html: { void: "always", normal: "always", component: "always" } },
    ],
  },
});
